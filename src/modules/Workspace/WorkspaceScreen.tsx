import { useRef, useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Animated,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  EventlyIcon,
  EventlyText,
  FadeInUp,
} from '../../Components';
import { useOpenWithOrganizer } from '../Chat';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { WORKSPACE_ACCENT, WORKSPACE_COPY, WORKSPACE_TABS } from './constants';
import { useWorkspaceContainer } from './container';
import { WorkspaceOverview } from './sections/WorkspaceOverview';
import { WorkspaceTabs } from './sections/WorkspaceTabs';
import { PinnedHeader } from './sections/PinnedHeader';
import {
  Milestones,
  Payment,
  Tasks,
  Timeline,
} from './sections/WorkspaceSections';
import { IdeasSummary } from './sections/WorkspaceLinks';
import { InvitationTab } from './sections/InvitationTab';
import { ReviewPrompt } from './sections/ReviewPrompt';
import { LeaveReviewSheet, useCanReview } from '../Organizer';
import { styles } from './styles';
import { screenUi, tabsWrap } from './premium.styles';
import type { WorkspaceTab } from './types';

type WorkspaceNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Workspace'
>;
type WorkspaceRouteProp = RouteProp<RootStackParamList, 'Workspace'>;

/**
 * One booking's workspace.
 *
 * Reached from two places — the Home "BOOKED" card and a row in My Bookings —
 * so back always goes to My Bookings rather than popping to whichever screen
 * happened to open it. From Home that is a deliberate step sideways into the
 * bookings list, which is where the customer's other events are.
 */
export function WorkspaceScreen() {
  const navigation = useNavigation<WorkspaceNavigationProp>();
  const { params } = useRoute<WorkspaceRouteProp>();
  const canReview = useCanReview(params.bookingId);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [tab, setTab] = useState<WorkspaceTab>('details');
  /*
   * The pinned header: how far the page has scrolled, where the in-page tabs
   * sit, and whether the pinned copy is showing (it only takes touches then).
   */
  const scrollY = useRef(new Animated.Value(0)).current;
  const [tabsY, setTabsY] = useState(0);
  const [pinned, setPinned] = useState(false);
  const pinAt = Math.max(1, tabsY - 70);
  const openThread = useOpenWithOrganizer();
  const {
    workspace,
    ideaCounts,
    latestFromOrganizer,
    invitation,
    guestSummary,
    isLoading,
    isError,
    errorMessage,
    refetch,
  } = useWorkspaceContainer(params.bookingId);

  /*
   * Back returns where the customer came from, and nothing else.
   *
   * This used to force every exit onto the events list: opened from Home, the
   * back arrow REPLACED the workspace with a pushed copy of that list, so
   * "back" landed somewhere the customer had never been, and its own back
   * arrow then led to a third screen that looked identical to the second.
   */
  const goBack = () => navigation.goBack();

  // Until the booking loads there is no occasion to name the workspace after,
  // so the header carries whatever name the caller already knew.
  const headerTitle =
    workspace?.workspaceName ??
    params.workspaceName ??
    WORKSPACE_COPY.fallbackName;

  const header = <AppHeader title={headerTitle} compact onBackPress={goBack} />;

  if (isLoading && !workspace) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <EventlyText variant="body" style={styles.loadingText}>
            {WORKSPACE_COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && !workspace) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <EventlyText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={WORKSPACE_ACCENT} />
            <EventlyText variant="caption" style={styles.retryText}>
              {WORKSPACE_COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!workspace) return null;

  const openIdeas = () =>
    navigation.navigate('IdeaBoard', {
      bookingId: workspace.id,
      organizerName: workspace.organizerName ?? undefined,
      authorName: workspace.customerName ?? undefined,
    });

  const messageOrganizer = () => {
    if (!workspace.organizerId || openThread.loading) return;
    openThread
      .execute(workspace.organizerId)
      .then(conversation =>
        navigation.navigate('Conversation', {
          conversationId: conversation.id,
          withName: workspace.organizerName ?? undefined,
        }),
      )
      .catch(() => undefined);
  };

  const openGuests = () =>
    navigation.navigate('GuestList', { bookingId: workspace.id, title: workspace.title });

  const openInvitation = () =>
    navigation.navigate('Invitations', {
      bookingId: workspace.id,
      organizerName: workspace.organizerName ?? undefined,
    });

  return (
    /*
     * No top safe-area edge: the banner runs under the status bar, and its own
     * back button is inset instead. Insetting the screen would draw a white
     * strip above the picture.
     */
    <View style={[styles.container, screenUi.page]}>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
          listener: (e: { nativeEvent: { contentOffset: { y: number } } }) => {
            const next = e.nativeEvent.contentOffset.y >= pinAt;
            if (next !== pinned) setPinned(next);
          },
        })}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <WorkspaceOverview
          data={workspace}
          onBack={goBack}
          onMessage={workspace.organizerId ? messageOrganizer : undefined}
          isOpeningMessage={openThread.loading}
        />
        <View style={tabsWrap.wrap} onLayout={e => setTabsY(e.nativeEvent.layout.y)}>
          <WorkspaceTabs tabs={WORKSPACE_TABS} tab={tab} onSelectTab={setTab} />
        </View>

        {/*
          One tab's worth at a time.
          
          Every section used to be stacked in one column — milestones, ideas,
          the invitation, the facts, the payment, the tasks, the timeline — so
          the customer scrolled past six things to reach the one they opened
          the workspace for.
        */}
        {tab === 'details' ? (
          <FadeInUp key="details">
            <Milestones data={workspace} />
            {/* Only for a delivered booking this customer has not reviewed —
                both decided by the server, so the ask never repeats. */}
            {canReview.data?.canReview ? (
              <ReviewPrompt
                organizerName={workspace.organizerName}
                onPress={() => setReviewOpen(true)}
              />
            ) : null}
            {/*
              No "Event details" card here.

              It listed the date, the venue, the organizer and the reference —
              all four of which the block at the top of this screen now says,
              above the tabs, where they are read first. Saying them again in
              a card six rows down is the same booking described twice, and
              the second telling is the one that gets doubted.
            */}
            {/*
              What is owed, then who is doing what, then what has happened.
              These were two further tabs; they are one scroll now, in the
              order the questions get asked — money before work, and the log
              last, because a log is what you consult rather than read.
            */}
            <Payment data={workspace} />
            <Tasks data={workspace} />
            <Timeline data={workspace} />
          </FadeInUp>
        ) : null}

        {/*
          Each on its own tab rather than stacked under Details. The board and
          the invitation are the two places the customer goes to do something
          rather than to read something, and they were the two hardest to
          reach: below the milestones, below the review ask, behind a bar that
          covered them.
        */}
        {tab === 'ideas' ? (
          <FadeInUp key="ideas">
            <IdeasSummary
              counts={ideaCounts}
              organizerName={workspace.organizerName}
              latest={latestFromOrganizer}
              onPress={openIdeas}
            />
          </FadeInUp>
        ) : null}

        {tab === 'invitation' ? (
          <FadeInUp key="invitation">
            <InvitationTab
              workspace={workspace}
              invitation={invitation}
              guests={guestSummary}
              onOpenInvitation={openInvitation}
              onOpenGuests={openGuests}
            />
          </FadeInUp>
        ) : null}
      </Animated.ScrollView>

      <PinnedHeader
        opacity={scrollY.interpolate({
          inputRange: [pinAt - 40, pinAt],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })}
        active={pinned}
        title={workspace.title}
        onBack={goBack}
        tabs={WORKSPACE_TABS}
        tab={tab}
        onSelectTab={setTab}
      />

      <LeaveReviewSheet
        visible={reviewOpen}
        bookingId={workspace.id}
        onClose={() => setReviewOpen(false)}
        onPosted={() => {
          setReviewOpen(false);
          // Re-asks the server rather than assuming: the prompt disappears
          // because the review is stored, not because the sheet closed.
          canReview.refetch();
        }}
      />
    </View>
  );
}

export default WorkspaceScreen;
