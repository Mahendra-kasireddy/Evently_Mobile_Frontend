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
import { SETUP_COPY as COPY, STEP_META } from './constants';
import { useSetupContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { ActionButton } from './sections/ActionButton';
import { HeroProgress } from './sections/HeroProgress';
import { PhaseCard, ReviewBanner } from './sections/PhaseCard';
import { StepCard } from './sections/StepCard';
import { StepView } from './sections/StepView';
import { SuccessView } from './sections/SuccessView';
import { styles as s } from './styles';
import { isStepId } from './utils';

type Route = RouteProp<RootStackParamList, 'OrganizerSetup'>;

/**
 * Go-live setup: a checklist hub — progress, the steps with what each still
 * needs, and Submit for verification — and each step as its own short form on
 * the same route. Opened with `{ step }`, it starts at that step and its back
 * leaves the screen; opened from the hub, a step's back returns to the hub.
 * Unsaved edits ask before they are thrown away, whichever way the organizer
 * leaves.
 */
export function SetupScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<Route>();
  const entry = isStepId(params?.step) ? params.step : null;
  const c = useSetupContainer(entry);

  const leave = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  // In-screen back from a step: to the hub, asking first if there are edits.
  const guard = useRef({ dirty: c.dirty, saving: c.saving });
  guard.current = { dirty: c.dirty, saving: c.saving };
  const closeStep = c.closeStep;
  const backToHub = useCallback(() => {
    if (!guard.current.dirty || guard.current.saving) {
      closeStep();
      return;
    }
    Alert.alert(COPY.discardTitle, COPY.discardBody, [
      { text: COPY.keepEditing, style: 'cancel' },
      { text: COPY.discard, style: 'destructive', onPress: closeStep },
    ]);
  }, [closeStep]);

  const inStep = c.step !== null && !c.justSubmitted;
  const stepBackGoesToHub = inStep && !c.backLeavesScreen;

  const onBack = stepBackGoesToHub ? backToHub : leave;

  // Android's back button follows the header's arrow.
  useFocusEffect(
    useCallback(() => {
      if (!stepBackGoesToHub) return undefined;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        backToHub();
        return true;
      });
      return () => sub.remove();
    }, [stepBackGoesToHub, backToHub]),
  );

  // iOS's edge swipe would skip the hub, so it is off while a step is open from it.
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !stepBackGoesToHub });
  }, [navigation, stepBackGoesToHub]);

  // Leaving the screen with unsaved edits — arrow, swipe or Android back — asks first.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        if (!guard.current.dirty || guard.current.saving) return;
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

  const title = inStep && c.step ? STEP_META[c.step].title : COPY.title;

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={title} onBackPress={onBack} />
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

  if (c.errorMessage || !c.hub) {
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

  if (c.justSubmitted) {
    return frame(<SuccessView onDone={leave} />);
  }

  if (inStep) {
    return frame(<StepView c={c} />);
  }

  const hub = c.hub;
  const required = hub.steps.filter(step => !step.optional);
  const optional = hub.steps.filter(step => step.optional);
  const inSetup = hub.phase === 'setup' || hub.phase === 'changes';

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
          <View style={s.notice} accessibilityLiveRegion="polite">
            <EventlyIcon
              name="check-circle"
              size={18}
              color={ORG_ACCENT.jade}
            />
            <AppText variant="bodySmall" style={s.noticeText}>
              {c.notice}
            </AppText>
          </View>
        ) : null}

        <FadeInUp>
          {inSetup ? <HeroProgress hub={hub} /> : <PhaseCard hub={hub} />}
        </FadeInUp>

        {hub.phase === 'changes' ? (
          <FadeInUp delay={40}>
            <ReviewBanner note={hub.reviewNote} />
          </FadeInUp>
        ) : null}

        <AppText variant="overline" style={s.sectionLabel}>
          {COPY.stepsLabel}
        </AppText>
        <View style={s.list}>
          {required.map((step, index) => (
            <FadeInUp key={step.id} delay={60 * (index + 1)}>
              <StepCard step={step} onPress={() => c.openStep(step.id)} />
            </FadeInUp>
          ))}
        </View>

        {optional.length ? (
          <>
            <AppText variant="overline" style={s.sectionLabel}>
              {COPY.payoutLabel}
            </AppText>
            <View style={s.list}>
              {optional.map(step => (
                <FadeInUp key={step.id} delay={300}>
                  <StepCard step={step} onPress={() => c.openStep(step.id)} />
                </FadeInUp>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>

      {hub.showSubmit ? (
        <SafeAreaView edges={['bottom']} style={s.footer}>
          {c.submitError ? (
            <AppText variant="caption" style={s.footerError}>
              {c.submitError}
            </AppText>
          ) : !hub.canSubmit ? (
            <AppText variant="caption" style={s.footerHint}>
              {COPY.submitHint}
            </AppText>
          ) : null}
          <ActionButton
            title={c.submitting ? COPY.submitting : COPY.submit}
            onPress={c.submit}
            loading={c.submitting}
            disabled={!hub.canSubmit}
          />
        </SafeAreaView>
      ) : null}
    </>,
  );
}

export default SetupScreen;
