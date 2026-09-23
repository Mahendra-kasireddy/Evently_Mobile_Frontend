import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { WORKSPACE_ACCENT, WORKSPACE_COPY } from './constants';
import { useWorkspaceContainer } from './container';
import { WorkspaceOverview } from './sections/WorkspaceOverview';
import { Milestones, Payment, Tasks, Timeline } from './sections/WorkspaceSections';
import { IdeasSummary, InvitationSummary } from './sections/WorkspaceLinks';
import { ReviewPrompt } from './sections/ReviewPrompt';
import { LeaveReviewSheet, useCanReview } from '../Organizer';
import { actionBarStyles as bar, styles } from './styles';
import type { WorkspaceTab } from './types';

type WorkspaceNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Workspace'>;
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
  const insets = useSafeAreaInsets();
  const { workspace, ideaCounts, invitation, isLoading, isError, errorMessage, refetch } =
    useWorkspaceContainer(params.bookingId);

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
  const headerTitle = workspace?.workspaceName ?? params.workspaceName ?? WORKSPACE_COPY.fallbackName;

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

  const openInvitation = () =>
    navigation.navigate('Invitations', {
      bookingId: workspace.id,
      organizerName: workspace.organizerName ?? undefined,
    });

  const tabs: Array<{ key: WorkspaceTab; label: string }> = [
    { key: 'details', label: WORKSPACE_COPY.tabDetails },
    { key: 'plan', label: WORKSPACE_COPY.tabPlan },
    { key: 'payment', label: WORKSPACE_COPY.tabPayment },
  ];

  return (
    /*
     * No top safe-area edge: the banner runs under the status bar, and its own
     * back button is inset instead. Insetting the screen would draw a white
     * strip above the picture.
     */
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <WorkspaceOverview
          data={workspace}
          onBack={goBack}
          tab={tab}
          tabs={tabs}
          onSelectTab={setTab}
        />

        {/*
          One tab's worth at a time.
          
          Every section used to be stacked in one column — milestones, ideas,
          the invitation, the facts, the payment, the tasks, the timeline — so
          the customer scrolled past six things to reach the one they opened
          the workspace for.
        */}
        {tab === 'details' ? (
          <>
            <Milestones data={workspace} />
            {/* Only for a delivered booking this customer has not reviewed —
                both decided by the server, so the ask never repeats. */}
            {canReview.data?.canReview ? (
              <ReviewPrompt
                organizerName={workspace.organizerName}
                onPress={() => setReviewOpen(true)}
              />
            ) : null}
            <IdeasSummary
              counts={ideaCounts}
              organizerName={workspace.organizerName}
              onPress={openIdeas}
            />
            <InvitationSummary
              invitation={invitation}
              organizerName={workspace.organizerName}
              onPress={openInvitation}
            />
            {/*
              No "Event details" card here.

              It listed the date, the venue, the organizer and the reference —
              all four of which the block at the top of this screen now says,
              above the tabs, where they are read first. Saying them again in
              a card six rows down is the same booking described twice, and
              the second telling is the one that gets doubted.
            */}
          </>
        ) : null}

        {tab === 'plan' ? (
          <>
            <Tasks data={workspace} />
            <Timeline data={workspace} />
          </>
        ) : null}

        {tab === 'payment' ? <Payment data={workspace} /> : null}
      </ScrollView>

      {/* The two things worth doing from here, and the one worth doing most —
          on a bar that does not scroll away. */}
      <View style={[bar.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={bar.ghost}
          activeOpacity={0.85}
          onPress={openInvitation}
          accessibilityRole="button"
          accessibilityLabel={WORKSPACE_COPY.inviteAction}
        >
          <EventlyIcon name="email-outline" size={17} color={WORKSPACE_ACCENT} />
          <EventlyText variant="caption" style={bar.ghostText}>
            {WORKSPACE_COPY.inviteAction}
          </EventlyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={bar.primary}
          activeOpacity={0.9}
          onPress={openIdeas}
          accessibilityRole="button"
          accessibilityLabel={WORKSPACE_COPY.ideasAction}
        >
          <EventlyIcon
            name="lightbulb-on-outline"
            size={18}
            color={colors.onPrimary}
          />
          <EventlyText variant="subtitle" style={bar.primaryText}>
            {WORKSPACE_COPY.ideasAction}
          </EventlyText>
        </TouchableOpacity>
      </View>

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
