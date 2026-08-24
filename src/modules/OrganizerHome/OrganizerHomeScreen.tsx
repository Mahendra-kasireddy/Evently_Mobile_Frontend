import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyButton, EventlyText } from '../../Components';
import { HOME_COPY, OH_ACCENT } from './constants';
import { useOrganizerHome } from './container';
import { BadgeProgressCard } from './sections/BadgeProgressCard';
import { EnquiriesCard } from './sections/EnquiriesCard';
import { ScheduleCard } from './sections/ScheduleCard';
import { StatsGrid } from './sections/StatsGrid';
import { TasksCard } from './sections/TasksCard';
import { screenStyles } from './styles';

export function OrganizerHomeScreen() {
  const { data, isLoading, isError, refetch, badges, toggleTask } = useOrganizerHome();

  if (isLoading && !data) {
    return (
      <SafeAreaView style={screenStyles.container} edges={['top']}>
        <ActivityIndicator style={screenStyles.centerFill} color={OH_ACCENT} />
      </SafeAreaView>
    );
  }

  if (isError && !data) {
    return (
      <SafeAreaView style={[screenStyles.container, screenStyles.centerFill]} edges={['top']}>
        <EventlyText variant="body" style={screenStyles.emptyText}>
          Could not load your dashboard.
        </EventlyText>
        <EventlyButton title="Try again" onPress={refetch} accentColor={OH_ACCENT} />
      </SafeAreaView>
    );
  }

  if (!data) return null;

  return (
    <SafeAreaView style={screenStyles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={screenStyles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={OH_ACCENT} />}
      >
        <EventlyText variant="h1" style={screenStyles.title}>
          {HOME_COPY.title}
        </EventlyText>
        <StatsGrid summary={data} />
        <TasksCard tasks={data.todaysTasks} onToggle={toggleTask} />
        {badges ? <BadgeProgressCard badges={badges} /> : null}
        <ScheduleCard items={data.next7Days} />
        <EnquiriesCard enquiries={data.pendingEnquiries} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default OrganizerHomeScreen;
