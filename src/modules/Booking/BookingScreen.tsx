import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { BOOKING_ACCENT, BOOKING_COPY as COPY } from './constants';
import { useBookingContainer } from './container';
import { EventCard } from './sections/EventCard';
import { EventTicketsSection } from './sections/EventTicketsSection';
import { useMyTickets } from '../PublicEvents/hooks';
import { EventTabs } from './sections/EventTabs';
import { JumpToGrid } from './sections/JumpToGrid';
import { bookingStateStyles as st, styles } from './styles';
import type { BookingItem, JumpKey } from './types';

type EventsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * The customer's bookings — their own events, and the public-event tickets
 * they hold.
 *
 * Reached from the menu as the `Bookings` route, and registered nowhere else
 * (the Events tab is the public events catalogue), so there is one copy of it
 * and it has a back arrow like any pushed screen.
 *
 * Active and Past are split because the two are read for different reasons —
 * one is a to-do list, the other a record — and both pills are always shown so
 * that a customer whose only event has finished can find out where it went.
 */
export function BookingScreen() {
  const navigation = useNavigation<EventsNavigationProp>();

  const {
    active,
    past,
    tab,
    setTab,
    visible,
    focus,
    tiles,
    items,
    isLoading,
    isError,
    errorMessage,
    refetch,
  } = useBookingContainer();

  const openWorkspace = (item: BookingItem) =>
    navigation.navigate('Workspace', {
      bookingId: item.id,
      workspaceName: item.title,
    });

  /** Each tile goes to the screen that owns the thing it counts. */
  const jump = (key: JumpKey) => {
    if (!focus) return;
    const organizerName = focus.organizerName ?? undefined;
    if (key === 'payments') {
      navigation.navigate('Workspace', {
        bookingId: focus.id,
        workspaceName: focus.title,
      });
    } else if (key === 'invitation') {
      navigation.navigate('Invitations', {
        bookingId: focus.id,
        organizerName,
      });
    } else if (key === 'ideas') {
      navigation.navigate('IdeaBoard', { bookingId: focus.id, organizerName });
    } else {
      // The plan wizard's budget step — the only budget guidance that exists.
      navigation.navigate('Main', { screen: 'Plan' });
    }
  };

  const header = <AppHeader title="Bookings" onBackPress={navigation.goBack} />;

  /* Tickets bought for public events, still ahead — they are bookings too. */
  const myTickets = useMyTickets('all');
  const tickets = (myTickets.data ?? []).filter(
    t => t.state === 'upcoming' || t.state === 'checked_in',
  );
  const ticketStrip = (
    <EventTicketsSection
      tickets={tickets}
      onOpen={t =>
        navigation.navigate('DigitalTicket', { ticketId: t.ticketId })
      }
      onSeeAll={() => navigation.navigate('MyTickets')}
    />
  );
  const refreshAll = () => {
    refetch();
    myTickets.refetch();
  };

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={BOOKING_ACCENT} />
          <EventlyText variant="body" style={styles.loadingText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <EventlyText variant="h2" style={styles.emptyTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={BOOKING_ACCENT} />
            <EventlyText variant="caption" style={styles.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const planEvent = () => navigation.navigate('Main', { screen: 'Plan' });
  const exploreEvents = () => navigation.navigate('Main', { screen: 'Events' });

  // No planned events of their own.
  if (items.length === 0) {
    /*
     * Nothing booked at all: one screen-sized message, and both ways forward —
     * a ticket to somebody's event, or a celebration of their own.
     */
    if (tickets.length === 0 && !myTickets.loading) {
      return (
        <SafeAreaView style={styles.container} edges={['top']}>
          {header}
          <View style={st.empty}>
            <View style={styles.centeredIcon}>
              <EventlyIcon
                name="calendar-heart"
                size={28}
                color={BOOKING_ACCENT}
              />
            </View>
            <EventlyText variant="h2" style={styles.emptyTitle}>
              No bookings yet
            </EventlyText>
            <EventlyText variant="body" style={styles.emptySubtitle}>
              Book tickets to an event, or plan your own celebration with an
              organizer. Everything you book shows up here.
            </EventlyText>
            <View style={st.emptyActions}>
              <TouchableOpacity
                style={st.primary}
                activeOpacity={0.85}
                onPress={exploreEvents}
                accessibilityRole="button"
              >
                <EventlyIcon
                  name="ticket-confirmation-outline"
                  size={18}
                  color={colors.onPrimary}
                />
                <EventlyText variant="body" style={st.primaryText}>
                  Explore events
                </EventlyText>
              </TouchableOpacity>
              <TouchableOpacity
                style={st.secondary}
                activeOpacity={0.85}
                onPress={planEvent}
                accessibilityRole="button"
                accessibilityLabel={COPY.emptyCta}
              >
                <EventlyIcon
                  name="calendar-plus"
                  size={18}
                  color={BOOKING_ACCENT}
                />
                <EventlyText variant="body" style={st.secondaryText}>
                  {COPY.emptyCta}
                </EventlyText>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    /* Tickets, but nothing planned: the tickets lead, and planned events get a
       small prompt — not a full-screen "No events yet" under a booking. */
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <ScrollView
          contentContainerStyle={st.scroll}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refreshAll} />
          }
        >
          {ticketStrip}
          <EventlyText variant="subtitle" style={st.sectionTitle}>
            Planned Events
          </EventlyText>
          <View style={st.inline}>
            <View style={st.inlineIcon}>
              <EventlyIcon
                name="calendar-heart"
                size={22}
                color={BOOKING_ACCENT}
              />
            </View>
            <View style={st.inlineText}>
              <EventlyText variant="body" style={st.inlineTitle}>
                No planned events yet
              </EventlyText>
              <EventlyText variant="caption" style={st.inlineBody}>
                Plan a celebration and book an organizer.
              </EventlyText>
            </View>
            <TouchableOpacity
              style={st.inlineCta}
              onPress={planEvent}
              accessibilityRole="button"
              accessibilityLabel={COPY.emptyCta}
            >
              <EventlyText variant="caption" style={st.inlineCtaText}>
                Plan
              </EventlyText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const emptyForTab = tab === 'active' ? 'emptyActive' : 'emptyPast';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}
      <FlatList
        ListHeaderComponent={
          /* Out to the screen edges, as they sat before they moved into the
             list: the list's own side padding is for the cards below. */
          <View style={styles.listBleed}>
            {ticketStrip}
            {tickets.length > 0 ? (
              <EventlyText variant="subtitle" style={st.sectionTitle}>
                Planned Events
              </EventlyText>
            ) : null}
            <EventTabs
              value={tab}
              onChange={setTab}
              counts={{ active: active.length, past: past.length }}
            />
          </View>
        }
        data={visible}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshAll} />
        }
        renderItem={({ item }) => (
          <EventCard
            item={item}
            focused={focus?.id === item.id}
            onPress={() => openWorkspace(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyPanel}>
            <EventlyText variant="h2" style={styles.emptyTitle}>
              {emptyForTab === 'emptyActive'
                ? COPY.emptyActiveTitle
                : COPY.emptyPastTitle}
            </EventlyText>
            <EventlyText variant="body" style={styles.emptySubtitle}>
              {emptyForTab === 'emptyActive'
                ? COPY.emptyActiveBody
                : COPY.emptyPastBody}
            </EventlyText>
          </View>
        }
        /* The tiles act on one event — the soonest active one — so they belong
           with the list that contains it, not over a page of finished events. */
        ListFooterComponent={
          tab === 'active' && focus ? (
            <JumpToGrid tiles={tiles} onPress={jump} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

export default BookingScreen;
