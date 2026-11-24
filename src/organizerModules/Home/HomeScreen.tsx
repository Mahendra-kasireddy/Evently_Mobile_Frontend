import { RefreshControl, ScrollView, StatusBar, View } from 'react-native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppText,
  EventlyButton,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import type {
  OrganizerTabParamList,
  RootStackParamList,
} from '../../navigation/types';
import { HOME_COPY as COPY } from './constants';
import { useOrganizerHomeContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { GoLiveCard } from './sections/GoLiveCard';
import { HomeHeader } from './sections/HomeHeader';
import { NeedsYouCard } from './sections/NeedsYouCard';
import { NextSevenDays } from './sections/NextSevenDays';
import { StatsGrid } from './sections/StatsGrid';
import { TierCard } from './sections/TierCard';
import { TodayTasks } from './sections/TodayTasks';
import { styles as s } from './styles';
import type { UpcomingEvent } from './types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<OrganizerTabParamList, 'OrgHome'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * The organizer's Home: what needs doing, at a glance.
 *
 * Top to bottom — where they are and the bell; the go-live card while there is setup left;
 * what customers are waiting on; four numbers; today's tasks; the week ahead;
 * the tier. Sections with nothing to show are left out rather than drawn
 * empty, so a quiet day is a short screen.
 */
export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const home = useOrganizerHomeContainer();

  const openGoLive = () => {
    const step =
      home.goLive?.kind === 'payout'
        ? 'bank'
        : home.goLive && 'nextStepId' in home.goLive
        ? home.goLive.nextStepId
        : null;
    navigation.navigate('OrganizerSetup', step ? { step } : undefined);
  };

  const openStat = (key: 'enquiries' | 'bookings' | 'earnings' | 'rating') => {
    if (key === 'enquiries') navigation.navigate('OrgEnquiries');
    else if (key === 'bookings') navigation.navigate('OrgEvents');
    else if (key === 'earnings') navigation.navigate('OrgEarnings');
    else navigation.navigate('OrganizerBadges');
  };

  const openEvent = (event: UpcomingEvent) =>
    navigation.navigate('OrganizerEvent', {
      bookingId: event.id,
      title: event.title,
    });

  // Where the organizer is, and the bell — Home is the one tab with it.
  const header = <HomeHeader />;

  if (home.isLoading) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
        {header}
        <View style={s.centered}>
          <ThinkingOrbs
            size={64}
            colors={ORG_ORB_COLORS}
            label={COPY.loading}
          />
          <AppText variant="h3" style={s.loadingTitle}>
            {COPY.loadingTitle}
          </AppText>
          <AppText variant="body" style={s.muted}>
            {COPY.loading}
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (home.errorMessage) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
        {header}
        <View style={s.centered}>
          <AppText variant="h3" style={s.loadingTitle}>
            {COPY.error}
          </AppText>
          <AppText variant="body" style={s.muted}>
            {home.errorMessage}
          </AppText>
          <EventlyButton
            title={COPY.retry}
            onPress={home.refresh}
            accentColor={ORG_ACCENT.saffron}
          />
        </View>
      </SafeAreaView>
    );
  }

  const showNeeds = home.toQuote > 0 || home.toConfirm > 0;
  let delay = 0;
  const next = () => (delay += 60);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      {header}
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={home.isRefreshing}
            onRefresh={home.refresh}
            tintColor={ORG_ACCENT.saffron}
            colors={[ORG_ACCENT.saffron]}
          />
        }
      >
        {home.goLive ? (
          <FadeInUp delay={next()} style={s.section}>
            <GoLiveCard model={home.goLive} onPress={openGoLive} />
          </FadeInUp>
        ) : null}

        {showNeeds ? (
          <FadeInUp delay={next()} style={s.section}>
            <NeedsYouCard
              toQuote={home.toQuote}
              toConfirm={home.toConfirm}
              onQuote={() => navigation.navigate('OrgEnquiries')}
              onConfirm={() => navigation.navigate('OrgEvents')}
            />
          </FadeInUp>
        ) : null}

        {home.stats ? (
          <FadeInUp delay={next()} style={s.section}>
            <StatsGrid stats={home.stats} onOpen={openStat} />
          </FadeInUp>
        ) : null}

        {home.tasks.length > 0 ? (
          <FadeInUp delay={next()} style={s.section}>
            <TodayTasks tasks={home.tasks} onToggle={home.toggleTask} />
          </FadeInUp>
        ) : null}

        <FadeInUp delay={next()} style={s.sectionWide}>
          <NextSevenDays
            events={home.week}
            onOpenEvent={openEvent}
            onOpenCalendar={() => navigation.navigate('OrganizerCalendar')}
          />
        </FadeInUp>

        {home.tier ? (
          <FadeInUp delay={next()} style={s.section}>
            <TierCard
              tier={home.tier}
              onPress={() => navigation.navigate('OrganizerBadges')}
            />
          </FadeInUp>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;
