import { useEffect, useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { absoluteFileUrl } from '../../services/urls';
import { useAppSelector } from '../../store/hooks';
import { selectLocationPlace } from '../../store/locationSlice';
import type { RootStackParamList } from '../../navigation/types';
import {
  EVENT_CATEGORIES,
  PUBLIC_EVENTS_COPY,
  SORT_OPTIONS,
  formatEventWhen,
  formatPrice,
} from './constants';
import { usePublicEvents } from './hooks';
import { CategoryPill, InfoLine, LivePill } from './sections/ui';
import {
  FilterSheet,
  NO_EVENT_FILTERS,
  activeFilterCount,
  type EventFilters,
} from './sections/FilterSheet';
import { useAsync } from '../../hooks/useAsync';
import { fetchCities } from '../Search/services';
import { PE_ACCENT, PE_NAVY } from './styles';
import { PE_MUTED, listUi as s, ui } from './ui.styles';
import type { EventCard } from './types';

/* Typed against the root list without naming a route of its own: this screen
   is a tab, and the places it leads to are pushed on the stack above. */
type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Long enough to skip the keystrokes of a word being typed. */
const SEARCH_DEBOUNCE_MS = 300;

function EventListCard({
  event,
  onPress,
}: {
  event: EventCard;
  onPress: () => void;
}) {
  const live = event.liveEnabled && event.liveState === 'live';
  const where = [event.venueName, event.city].filter(Boolean).join(', ');
  return (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${formatEventWhen(
        event.startDateTime,
        event.timezone,
      )}`}
      testID={`public-event-${event.id}`}
    >
      <View style={s.cover}>
        {/* A local storage driver answers with a root-relative path. */}
        <Image
          source={{ uri: absoluteFileUrl(event.coverUrl) }}
          style={s.coverImage}
          resizeMode="cover"
        />
        <View style={s.coverPill}>
          <CategoryPill category={event.category} />
        </View>
        {live ? (
          <View style={s.coverRight}>
            <LivePill />
          </View>
        ) : null}
      </View>
      <View style={s.body}>
        <EventlyText variant="body" style={s.title} numberOfLines={2}>
          {event.title}
        </EventlyText>
        <InfoLine
          icon="calendar-month-outline"
          text={formatEventWhen(event.startDateTime, event.timezone)}
        />
        <InfoLine icon="map-marker-outline" text={where} />
        {event.soldOut ? (
          <EventlyText variant="caption" style={s.soldOut}>
            {PUBLIC_EVENTS_COPY.soldOut}
          </EventlyText>
        ) : (
          <EventlyText variant="caption" style={s.price}>
            {event.startingPrice > 0
              ? `From ${formatPrice(event.startingPrice)}`
              : 'Free'}
          </EventlyText>
        )}
      </View>
    </TouchableOpacity>
  );
}

/**
 * 1 — Public events.
 *
 * Open to anybody — a public event is public, and somebody should be able to
 * see what is on before they are asked to sign in. The filter the server
 * applies is not negotiable from here: there is no parameter this screen could
 * send that would show a draft.
 */
export function PublicEventsScreen() {
  const navigation = useNavigation<Nav>();
  const place = useAppSelector(selectLocationPlace);
  const city = place?.locality ?? '';

  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [filters, setFilters] = useState<EventFilters>(NO_EVENT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const cityList = useAsync(fetchCities, []);
  const filterCount = activeFilterCount(filters);
  const sortLabel = SORT_OPTIONS.find(o => o.key === filters.sort)?.label ?? '';

  // Search as the customer types, a beat after they stop.
  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [search]);

  const { data, loading, error, refetch } = usePublicEvents({
    ...(query ? { q: query } : {}),
    ...(category ? { category } : {}),
    ...(filters.city ? { city: filters.city } : {}),
    sort: filters.sort,
  });
  const events = data ?? [];
  const filtered = Boolean(query || category || filters.city);

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <AppHeader
        title="Public Events"
        /* A tab with nothing under it: Back returns to Home rather than
           doing nothing. */
        onBackPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate('Main', { screen: 'Home' })
        }
        /* What you have already bought, beside the catalogue it was bought
           from — rather than a sixth tab for a list most people open twice a
           year. */
        rightElement={
          <TouchableOpacity
            onPress={() => navigation.navigate('MyTickets')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={PUBLIC_EVENTS_COPY.ticketsTitle}
            testID="open-my-tickets"
            style={s.ticketsButton}
          >
            <EventlyIcon
              name="ticket-confirmation-outline"
              size={16}
              color={PE_ACCENT}
            />
            <EventlyText variant="caption" style={s.ticketsButtonText}>
              My Tickets
            </EventlyText>
          </TouchableOpacity>
        }
      />

      <View style={s.searchRow}>
        <View style={s.searchField}>
          <EventlyIcon name="magnify" size={18} color={PE_MUTED} />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search events, categories or cities"
            placeholderTextColor={PE_MUTED}
            returnKeyType="search"
            accessibilityLabel="Search public events"
          />
          {search ? (
            <TouchableOpacity
              onPress={() => setSearch('')}
              hitSlop={8}
              accessibilityLabel="Clear search"
            >
              <EventlyIcon name="close-circle" size={16} color={PE_MUTED} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[s.filterButton, filterCount > 0 && s.filterButtonOn]}
          onPress={() => setFiltersOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={
            filterCount > 0 ? `Filters, ${filterCount} applied` : 'Filters'
          }
          testID="open-filters"
        >
          <EventlyIcon
            name="tune-variant"
            size={20}
            color={filterCount > 0 ? '#ffffff' : PE_NAVY}
          />
          {filterCount > 0 ? (
            <View style={s.filterBadge}>
              <EventlyText variant="caption" style={s.filterBadgeText}>
                {filterCount}
              </EventlyText>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* What is applied, each removable on its own. */}
      {filterCount > 0 ? (
        <View style={s.applied}>
          {filters.city ? (
            <TouchableOpacity
              style={s.appliedChip}
              onPress={() => setFilters(f => ({ ...f, city: '' }))}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${filters.city}`}
            >
              <EventlyIcon name="map-marker" size={13} color={PE_ACCENT} />
              <EventlyText variant="caption" style={s.appliedText}>
                {filters.city}
              </EventlyText>
              <EventlyIcon name="close" size={13} color={PE_ACCENT} />
            </TouchableOpacity>
          ) : null}
          {filters.sort !== NO_EVENT_FILTERS.sort ? (
            <TouchableOpacity
              style={s.appliedChip}
              onPress={() =>
                setFilters(f => ({ ...f, sort: NO_EVENT_FILTERS.sort }))
              }
              accessibilityRole="button"
              accessibilityLabel={`Remove sort ${sortLabel}`}
            >
              <EventlyIcon name="sort" size={13} color={PE_ACCENT} />
              <EventlyText variant="caption" style={s.appliedText}>
                {sortLabel}
              </EventlyText>
              <EventlyIcon name="close" size={13} color={PE_ACCENT} />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chips}
        >
          {EVENT_CATEGORIES.map(c => {
            const on = c.value === category;
            return (
              <TouchableOpacity
                key={c.label}
                style={[s.chip, on && s.chipOn]}
                onPress={() => setCategory(c.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
              >
                <EventlyText
                  variant="caption"
                  style={[s.chipText, on && s.chipTextOn]}
                >
                  {c.label}
                </EventlyText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EventListCard
            event={item}
            onPress={() =>
              navigation.navigate('PublicEventDetail', { eventId: item.id })
            }
          />
        )}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={loading && events.length > 0}
            onRefresh={refetch}
          />
        }
        ListEmptyComponent={
          <View style={s.empty}>
            {loading ? (
              <>
                <ActivityIndicator color={PE_ACCENT} />
                <EventlyText variant="body" style={ui.muted}>
                  {PUBLIC_EVENTS_COPY.loading}
                </EventlyText>
              </>
            ) : (
              <EventlyText variant="body" style={ui.muted}>
                {error
                  ? error.message
                  : filtered
                  ? PUBLIC_EVENTS_COPY.emptySearch
                  : PUBLIC_EVENTS_COPY.empty}
              </EventlyText>
            )}
          </View>
        }
      />

      <FilterSheet
        visible={filtersOpen}
        value={filters}
        currentCity={city}
        cities={cityList.data ?? []}
        onApply={setFilters}
        onClose={() => setFiltersOpen(false)}
      />
    </SafeAreaView>
  );
}

export default PublicEventsScreen;
