import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StatusBar, View } from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  EventlyIcon,
  FadeInUp,
  KeyboardAvoider,
  ThinkingOrbs,
} from '../../Components';
import { boardStyles as b } from '../../modules/Workspace/styles';
import type { RootStackParamList } from '../../navigation/types';
import { IDEAS_COPY as COPY } from './constants';
import {
  useComposer,
  useIdeasContainer,
  usePhotoViewer,
  useReplySheet,
  useVisionSheet,
} from './container';
import { ORG_ACCENT, ORG_INK, ORG_ORB_COLORS, WHITE } from './design';
import { ProgressCard, VisionCard } from './sections/BoardTop';
import { Composer } from './sections/Composer';
import { EmptyFeed, Filters, IdeaCard } from './sections/Feed';
import { NoticeBar } from './sections/NoticeBar';
import { PhotoViewer } from './sections/PhotoViewer';
import { ReplySheet } from './sections/ReplySheet';
import { VisionSheet } from './sections/VisionSheet';
import { styles as s } from './styles';

/**
 * The ideas & planning board for one booking, from the organizer's side.
 *
 * The same thread the customer reads, in the same look: where the board
 * stands and the event vision on top, then the one main action — post an
 * update or ask a question — then the feed, where every post carries a reply
 * box (plan status, reply, optional approval ask).
 */
export function IdeasScreen() {
  const navigation = useNavigation();
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'OrganizerIdeas'>>();
  const bookingId = params.bookingId;
  const c = useIdeasContainer(bookingId);
  const composer = useComposer(bookingId, c);
  const reply = useReplySheet(c);
  const vision = useVisionSheet(bookingId, c);
  const viewer = usePhotoViewer();

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <AppHeader
        title={COPY.title}
        {...(params.title ? { subtitle: params.title } : {})}
      />
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
          name="lightbulb-off-outline"
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
          onPress={() => navigation.goBack()}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  if (c.errorMessage || !c.board || !c.progress || !c.vision) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        {c.errorMessage ? (
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

  return frame(
    <>
      <KeyboardAvoider style={s.flex} keyboardVerticalOffset={90}>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={c.isRefreshing}
              onRefresh={c.refresh}
              tintColor={ORG_ACCENT.saffron}
              colors={[ORG_ACCENT.saffron]}
            />
          }
        >
          {c.notice ? (
            <NoticeBar notice={c.notice} onDismiss={c.dismissNotice} />
          ) : null}

          <FadeInUp>
            <VisionCard
              rows={c.visionRows}
              captured={c.vision.captured}
              onEdit={vision.open}
            />
          </FadeInUp>

          <FadeInUp delay={60}>
            <ProgressCard progress={c.progress} />
          </FadeInUp>

          <FadeInUp delay={120}>
            <Composer c={composer} />
          </FadeInUp>

          <Filters chips={c.chips} value={c.filter} onChange={c.setFilter} />

          {c.cards.length === 0 ? (
            <EmptyFeed hasAnyPosts={c.hasAnyPosts} />
          ) : (
            <View style={b.feed}>
              {c.cards.map((card, i) => (
                <FadeInUp key={card.id} delay={Math.min(i, 6) * 40}>
                  <IdeaCard
                    card={card}
                    onOpenPhoto={viewer.open}
                    onReply={() => reply.open(card.id)}
                  />
                </FadeInUp>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoider>

      <ReplySheet r={reply} />
      <VisionSheet v={vision} />
      <PhotoViewer p={viewer} />
    </>,
  );
}

export default IdeasScreen;
