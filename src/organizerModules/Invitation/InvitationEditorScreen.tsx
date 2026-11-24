import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import {
  Alert,
  BackHandler,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  EventlyIcon,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { INVITATION_COPY as COPY, SECTION_META } from './constants';
import { useInvitationEditor } from './container';
import { ORG_ACCENT, ORG_INK, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { ActionButton } from './sections/Buttons';
import { GuestPreview } from './sections/GuestPreview';
import {
  NoticeBar,
  PreviewRow,
  RequestsCard,
  SectionCard,
  StatusCard,
} from './sections/Hub';
import { StepView } from './sections/StepView';
import { styles as s } from './styles';

type Route = RouteProp<RootStackParamList, 'OrganizerInvitation'>;

/**
 * The guest invitation, built from the phone: a hub — where it stands, the
 * customer's asks, each section with what it still needs, and Send to
 * customer — and each section as its own focused editor on the same route.
 * A section's back returns to the hub; unsaved edits ask before they go.
 */
export function InvitationEditorScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<Route>();
  const c = useInvitationEditor(params.bookingId);

  const leave = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const guard = useRef({ dirty: c.dirty, busy: c.busy });
  guard.current = { dirty: c.dirty, busy: c.busy };
  const closeSection = c.closeSection;
  const backToHub = useCallback(() => {
    if (!guard.current.dirty || guard.current.busy) {
      closeSection();
      return;
    }
    Alert.alert(COPY.discardTitle, COPY.discardBody, [
      { text: COPY.keepEditing, style: 'cancel' },
      { text: COPY.discard, style: 'destructive', onPress: closeSection },
    ]);
  }, [closeSection]);

  const inSection = c.section !== null && !!c.invitation;
  const onBack = inSection ? backToHub : leave;

  // Android's back button follows the header's arrow.
  useFocusEffect(
    useCallback(() => {
      if (!inSection) return undefined;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        backToHub();
        return true;
      });
      return () => sub.remove();
    }, [inSection, backToHub]),
  );

  // The edge swipe would skip the hub, so it is off while a section is open.
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !inSection });
  }, [navigation, inSection]);

  // Leaving the screen with unsaved edits asks first.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        if (!guard.current.dirty || guard.current.busy) return;
        event.preventDefault();
        Alert.alert(COPY.discardTitle, COPY.discardBody, [
          { text: COPY.keepEditing, style: 'cancel' },
          {
            text: COPY.discard,
            style: 'destructive',
            onPress: () => navigation.dispatch(event.data.action),
          },
        ]);
      }),
    [navigation],
  );

  const title =
    inSection && c.section ? SECTION_META[c.section].title : COPY.title;
  const subtitle = inSection
    ? COPY.title
    : params.title || c.invitation?.bookingTitle || undefined;

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={title} subtitle={subtitle} onBackPress={onBack} />
      {body}
    </SafeAreaView>
  );

  if (c.isLoading) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
        <AppText variant="body" style={s.muted}>
          {COPY.loading}
        </AppText>
      </View>,
    );
  }

  if (c.notFound) {
    return frame(
      <View style={s.centered}>
        <EventlyIcon
          name="email-remove-outline"
          size={44}
          color={ORG_INK.inkFaint}
        />
        <AppText variant="h3" style={s.title}>
          {COPY.notFoundTitle}
        </AppText>
        <AppText variant="body" style={s.muted}>
          {COPY.notFoundBody}
        </AppText>
        <EventlyButton
          title={COPY.back}
          onPress={leave}
          variant="outline"
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  if (!c.invitation || !c.hub) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        {c.errorMessage && c.errorMessage !== COPY.error ? (
          <AppText variant="body" style={s.muted}>
            {c.errorMessage}
          </AppText>
        ) : null}
        <EventlyButton
          title={COPY.retry}
          onPress={c.refresh}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  if (inSection && c.section) {
    return frame(<StepView c={c} id={c.section} invitation={c.invitation} />);
  }

  const hub = c.hub;
  const invitation = c.invitation;
  const confirmSend = () =>
    Alert.alert(COPY.confirmSendTitle, hub.send.confirmBody, [
      { text: COPY.cancel, style: 'cancel' },
      { text: COPY.confirmSend, onPress: c.send },
    ]);

  return frame(
    <>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={c.refreshing}
            onRefresh={c.refresh}
            tintColor={ORG_ACCENT.saffron}
            colors={[ORG_ACCENT.saffron]}
          />
        }
      >
        {c.notice ? (
          <NoticeBar notice={c.notice} onDismiss={c.clearNotice} />
        ) : null}

        <FadeInUp>
          <StatusCard hub={hub} title={invitation.bookingTitle} />
        </FadeInUp>

        {hub.requests.length ? (
          <FadeInUp delay={40}>
            <RequestsCard
              requests={hub.requests}
              resolvingId={c.resolvingId}
              onResolve={c.resolve}
            />
          </FadeInUp>
        ) : null}

        <FadeInUp delay={60}>
          <PreviewRow onPress={() => c.setPreviewOpen(true)} />
        </FadeInUp>

        <AppText variant="overline" style={s.sectionLabel}>
          {COPY.sectionsLabel}
        </AppText>
        <View style={s.list}>
          {hub.sections.map((card, index) => (
            <FadeInUp key={card.id} delay={60 * (index + 1)}>
              <SectionCard card={card} onPress={() => c.openSection(card.id)} />
            </FadeInUp>
          ))}
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        {hub.send.hint ? (
          <AppText variant="caption" style={s.footerHint}>
            {hub.send.hint}
          </AppText>
        ) : null}
        <ActionButton
          title={c.sending ? COPY.sending : hub.send.label}
          onPress={confirmSend}
          loading={c.sending}
          disabled={!hub.send.canSend}
        />
      </SafeAreaView>

      <GuestPreview
        visible={c.previewOpen}
        invitation={invitation}
        onClose={() => c.setPreviewOpen(false)}
      />
    </>,
  );
}

export default InvitationEditorScreen;
