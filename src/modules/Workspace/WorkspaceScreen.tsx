import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { WORKSPACE_ACCENT, WORKSPACE_COPY } from './constants';
import { useWorkspaceContainer } from './container';
import { workspaceBackAction } from './utils';
import { WorkspaceHero } from './sections/WorkspaceHero';
import { EventFacts, Milestones, Payment, Tasks, Timeline } from './sections/WorkspaceSections';
import { IdeasSummary, InvitationSummary } from './sections/WorkspaceLinks';
import { styles } from './styles';

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
  const { workspace, ideaCounts, invitation, isLoading, isError, errorMessage, refetch } =
    useWorkspaceContainer(params.bookingId);

  // Back always lands on My Bookings; see workspaceBackAction for how.
  const goToBookings = () => {
    const routes = navigation.getState()?.routes ?? [];
    if (workspaceBackAction(routes.map((r) => r.name)) === 'goBack') {
      navigation.goBack();
      return;
    }
    navigation.replace('Bookings');
  };

  // Until the booking loads there is no occasion to name the workspace after,
  // so the header carries whatever name the caller already knew.
  const headerTitle = workspace?.workspaceName ?? params.workspaceName ?? WORKSPACE_COPY.fallbackName;

  const header = <AppHeader title={headerTitle} compact onBackPress={goToBookings} />;

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        <WorkspaceHero data={workspace} />
        <Milestones data={workspace} />
        <IdeasSummary
          counts={ideaCounts}
          organizerName={workspace.organizerName}
          onPress={() =>
            navigation.navigate('IdeaBoard', {
              bookingId: workspace.id,
              organizerName: workspace.organizerName ?? undefined,
              authorName: workspace.customerName ?? undefined,
            })
          }
        />
        <InvitationSummary
          invitation={invitation}
          organizerName={workspace.organizerName}
          onPress={() =>
            navigation.navigate('Invitations', {
              bookingId: workspace.id,
              organizerName: workspace.organizerName ?? undefined,
            })
          }
        />
        <EventFacts data={workspace} />
        <Payment data={workspace} />
        <Tasks data={workspace} />
        <Timeline data={workspace} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default WorkspaceScreen;
