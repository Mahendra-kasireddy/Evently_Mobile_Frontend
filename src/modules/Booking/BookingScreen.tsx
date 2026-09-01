import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { BOOKING_ACCENT, BOOKING_COPY as COPY, BOOKING_TAB_LABEL } from './constants';
import { useBookingContainer } from './container';
import { BookingRow } from './sections/BookingRow';
import { styles } from './styles';
import type { BookingTab } from './types';

type BookingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bookings'>;

/**
 * The customer's bookings.
 *
 * Split into what is still happening and what is already history, because the
 * two are read for different reasons — one is a to-do list, the other a
 * record. The tabs appear only when there is something in both; a customer
 * with a single booking should not have to choose a tab to see it.
 */
export function BookingScreen() {
  const navigation = useNavigation<BookingNavigationProp>();
  const { items, isLoading, isError, errorMessage, refetch } = useBookingContainer();
  const [tab, setTab] = useState<BookingTab>('active');

  const active = useMemo(() => items.filter((i) => i.tab === 'active'), [items]);
  const past = useMemo(() => items.filter((i) => i.tab === 'past'), [items]);
  const showTabs = active.length > 0 && past.length > 0;
  const visible = showTabs ? (tab === 'active' ? active : past) : items;

  const openWorkspace = (id: string, title: string) =>
    navigation.navigate('Workspace', { bookingId: id, workspaceName: title });

  const header = <AppHeader title={COPY.title} compact />;

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
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
          <TouchableOpacity style={styles.retryButton} activeOpacity={0.8} onPress={refetch} accessibilityRole="button">
            <EventlyIcon name="refresh" size={16} color={BOOKING_ACCENT} />
            <EventlyText variant="caption" style={styles.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            onPress={() => navigation.navigate('Main')}
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}

      {showTabs ? (
        <View style={styles.tabs} accessibilityRole="tablist">
          {(['active', 'past'] as BookingTab[]).map((value) => {
            const on = tab === value;
            const count = value === 'active' ? active.length : past.length;
            return (
              <TouchableOpacity
                key={value}
                style={[styles.tab, on && styles.tabOn]}
                activeOpacity={0.8}
                onPress={() => setTab(value)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${BOOKING_TAB_LABEL[value]}, ${count}`}
              >
                <EventlyText variant="caption" style={[styles.tabText, on && styles.tabTextOn]}>
                  {BOOKING_TAB_LABEL[value]} · {count}
                </EventlyText>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        renderItem={({ item }) => (
          <BookingRow item={item} onPress={() => openWorkspace(item.id, item.title)} />
        )}
      />
    </SafeAreaView>
  );
}

export default BookingScreen;
