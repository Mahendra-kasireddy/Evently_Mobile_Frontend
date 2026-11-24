import type { ReactNode } from 'react';
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
import { OrganizerTopBar } from '../Navigation/sections/OrganizerTopBar';
import { EVENTS_COPY as COPY } from './constants';
import { useEventsContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { EmptyState } from './sections/EmptyState';
import { EventCard } from './sections/EventCard';
import { Shortcuts, type ShortcutKey } from './sections/Shortcuts';
import { ViewSwitch } from './sections/ViewSwitch';
import { styles as s } from './styles';
import type { EventItem } from './types';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<OrganizerTabParamList, 'OrgEvents'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * The organizer's events.
 *
 * Shortcuts to the calendar, sub-vendors and ticketed events; then Upcoming |
 * Past. Upcoming leads with the paid bookings still waiting for a yes or no —
 * each with its deadline — before everything already under way.
 */
export function EventsScreen() {
  const navigation = useNavigation<Nav>();
  const e = useEventsContainer();

  const openEvent = (item: EventItem) =>
    navigation.navigate('OrganizerEvent', {
      bookingId: item.id,
      title: item.title,
    });
  const openShortcut = (key: ShortcutKey) => {
    if (key === 'calendar') return navigation.navigate('OrganizerCalendar');
    if (key === 'subvendors') return navigation.navigate('OrganizerSubVendors');
    return navigation.navigate('OrganizerPublicEvents');
  };

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <OrganizerTopBar title={COPY.title} />
      {body}
    </SafeAreaView>
  );

  if (e.isLoading) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
        <AppText variant="body" style={s.muted}>
          {COPY.loading}
        </AppText>
      </View>,
    );
  }

  if (e.errorMessage) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        <AppText variant="body" style={s.muted}>
          {e.errorMessage}
        </AppText>
        <EventlyButton
          title={COPY.retry}
          onPress={e.refresh}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  const upcomingCount = e.awaiting.length + e.upcoming.length;
  const list = (items: EventItem[]) =>
    items.map((item, i) => (
      <FadeInUp key={item.id} delay={Math.min(i, 6) * 50}>
        <EventCard item={item} onOpen={() => openEvent(item)} />
      </FadeInUp>
    ));

  return frame(
    <ScrollView
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={e.isRefreshing}
          onRefresh={e.refresh}
          tintColor={ORG_ACCENT.saffron}
          colors={[ORG_ACCENT.saffron]}
        />
      }
    >
      <Shortcuts onOpen={openShortcut} />
      <ViewSwitch
        view={e.view}
        onChange={e.setView}
        counts={{ upcoming: upcomingCount, past: e.past.length }}
      />

      {e.view === 'upcoming' ? (
        upcomingCount === 0 ? (
          <EmptyState
            view="upcoming"
            onSeeEnquiries={() => navigation.navigate('OrgEnquiries')}
          />
        ) : (
          <>
            {e.awaiting.length > 0 ? (
              <View style={s.section}>
                <View style={s.sectionHead}>
                  <View style={s.sectionTitleRow}>
                    <AppText
                      variant="h3"
                      style={[s.sectionTitle, s.urgentTitle]}
                    >
                      {COPY.awaitingTitle}
                    </AppText>
                    <View style={s.countBubble}>
                      <AppText variant="label" style={s.countText}>
                        {e.awaiting.length}
                      </AppText>
                    </View>
                  </View>
                  <AppText variant="caption" style={s.sectionHint}>
                    {COPY.awaitingHint(e.awaiting.length)}
                  </AppText>
                </View>
                {list(e.awaiting)}
              </View>
            ) : null}
            {e.upcoming.length > 0 ? (
              <View style={s.section}>
                {e.awaiting.length > 0 ? (
                  <AppText variant="h3" style={s.sectionTitle}>
                    {COPY.upcomingTitle}
                  </AppText>
                ) : null}
                {list(e.upcoming)}
              </View>
            ) : null}
          </>
        )
      ) : e.past.length === 0 ? (
        <EmptyState
          view="past"
          onSeeEnquiries={() => navigation.navigate('OrgEnquiries')}
        />
      ) : (
        <View style={s.section}>{list(e.past)}</View>
      )}
    </ScrollView>,
  );
}

export default EventsScreen;
