import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { BOOKING_ACCENT, BOOKING_COPY as COPY } from './constants';
import { useBookingContainer } from './container';
import { EventCard } from './sections/EventCard';
import { EventsHeader } from './sections/EventsHeader';
import { EventTabs } from './sections/EventTabs';
import { JumpToGrid } from './sections/JumpToGrid';
import { styles } from './styles';
import type { BookingItem, JumpKey } from './types';

type EventsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * The customer's events.
 *
 * The Events tab, and only that. It was once registered a second time as a
 * pushed `Bookings` route as well, which gave the app two identical events
 * lists: backing out of one landed on the other, and the customer could not
 * tell they had moved. There is one list now, it is a tab, and a tab is a
 * destination — so it carries no back arrow.
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
    navigation.navigate('Workspace', { bookingId: item.id, workspaceName: item.title });

  /** Each tile goes to the screen that owns the thing it counts. */
  const jump = (key: JumpKey) => {
    if (!focus) return;
    const organizerName = focus.organizerName ?? undefined;
    if (key === 'payments') {
      navigation.navigate('Workspace', { bookingId: focus.id, workspaceName: focus.title });
    } else if (key === 'invitation') {
      navigation.navigate('Invitations', { bookingId: focus.id, organizerName });
    } else if (key === 'ideas') {
      navigation.navigate('IdeaBoard', { bookingId: focus.id, organizerName });
    } else {
      // The plan wizard's budget step — the only budget guidance that exists.
      navigation.navigate('Main', { screen: 'Plan' });
    }
  };

  const header = <EventsHeader />;

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

  // No events at all: one thing to say, and one thing to do about it.
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <View style={styles.centeredIcon}>
            <EventlyIcon name="calendar-heart" size={28} color={BOOKING_ACCENT} />
          </View>
          <EventlyText variant="h2" style={styles.emptyTitle}>
            {COPY.emptyTitle}
          </EventlyText>
          <EventlyText variant="body" style={styles.emptySubtitle}>
            {COPY.emptyBody}
          </EventlyText>
          <TouchableOpacity
            style={styles.emptyCta}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Main', { screen: 'Plan' })}
            accessibilityRole="button"
            accessibilityLabel={COPY.emptyCta}
          >
            <EventlyText variant="subtitle" style={styles.emptyCtaText}>
              {COPY.emptyCta}
            </EventlyText>
            <EventlyIcon name="chevron-right" size={18} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const emptyForTab = tab === 'active' ? 'emptyActive' : 'emptyPast';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}
      <EventTabs value={tab} onChange={setTab} counts={{ active: active.length, past: past.length }} />

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        renderItem={({ item }) => (
          <EventCard item={item} focused={focus?.id === item.id} onPress={() => openWorkspace(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyPanel}>
            <EventlyText variant="h2" style={styles.emptyTitle}>
              {emptyForTab === 'emptyActive' ? COPY.emptyActiveTitle : COPY.emptyPastTitle}
            </EventlyText>
            <EventlyText variant="body" style={styles.emptySubtitle}>
              {emptyForTab === 'emptyActive' ? COPY.emptyActiveBody : COPY.emptyPastBody}
            </EventlyText>
          </View>
        }
        /* The tiles act on one event — the soonest active one — so they belong
           with the list that contains it, not over a page of finished events. */
        ListFooterComponent={
          tab === 'active' && focus ? <JumpToGrid tiles={tiles} onPress={jump} /> : null
        }
      />
    </SafeAreaView>
  );
}

export default BookingScreen;
