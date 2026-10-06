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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  AppHeader,
  EventlyIcon,
  EventlyText,
  FadeInUp,
  GradientFill,
  PressableScale,
} from '../../Components';
import { absoluteFileUrl } from '../../services/urls';
import { useAppSelector } from '../../store/hooks';
import { selectLocationPlace } from '../../store/locationSlice';
import type { RootStackParamList } from '../../navigation/types';
import {
  EVENT_CATEGORIES,
  PUBLIC_EVENTS_COPY,
  SORT_OPTIONS,
  formatEventWhen,
  CATEGORY_LOOK,
  categoryGradient,
  dateBlock,
  formatPrice,
  saleNote,
  weekdayTime,
} from './constants';
import { usePublicEvents } from './hooks';
import { LivePill } from './sections/ui';
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

/** The hero band: violet warming into coral. */
const HERO_GRADIENT: [string, string] = ['#6d4df2', '#ef6a45'];

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
  const gradient = categoryGradient(event.category);
  const date = dateBlock(event.startDateTime, event.timezone);
  const shadeId = `eventPoster-${event.id}`;
  /* Sold out, sales not open yet, sales closed — or '' when it is on sale
     and the price is the thing to show. */
  const note = saleNote(
    event.saleState,
    event.soldOut,
    event.salesOpenAt,
    event.timezone,
  );
  return (
    <PressableScale
      style={s.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${formatEventWhen(
        event.startDateTime,
        event.timezone,
      )}`}
      testID={`public-event-${event.id}`}
    >
      <View style={s.poster}>
        {/* A local storage driver answers with a root-relative path. */}
        <Image
          source={{ uri: absoluteFileUrl(event.coverUrl) }}
          style={s.posterImage}
          resizeMode="cover"
        />
        {/* Dark at the foot, so the white title reads on any poster. */}
        <View style={s.posterShade} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0b0f24" stopOpacity={0.15} />
                <Stop offset="0.45" stopColor="#0b0f24" stopOpacity={0.05} />
                <Stop offset="1" stopColor="#0b0f24" stopOpacity={0.85} />
              </LinearGradient>
            </Defs>
            <Rect
              x={0}
              y={0}
              width="100%"
              height="100%"
              fill={`url(#${shadeId})`}
            />
          </Svg>
        </View>

        {event.category ? (
          <View style={s.categoryPill}>
            <GradientFill colors={gradient} direction="across" />
            <EventlyText
              variant="caption"
              style={s.categoryPillText}
              numberOfLines={1}
            >
              {event.category}
            </EventlyText>
          </View>
        ) : null}

        {/* The day, big, on frosted glass — the first thing a poster says. */}
        {date ? (
          <View style={s.dateBlock}>
            <EventlyText variant="h2" style={s.dateDay}>
              {date.day}
            </EventlyText>
            <EventlyText variant="caption" style={s.dateMonth}>
              {date.month}
            </EventlyText>
          </View>
        ) : null}

        {live ? (
          <View style={s.livePill}>
            <LivePill />
          </View>
        ) : null}

        <View style={s.posterText}>
          <EventlyText variant="h2" style={s.title} numberOfLines={2}>
            {event.title}
          </EventlyText>
          <View style={s.posterLine}>
            <EventlyIcon
              name="clock-outline"
              size={13}
              color="rgba(255,255,255,0.85)"
            />
            <EventlyText
              variant="caption"
              style={s.posterLineText}
              numberOfLines={1}
            >
              {weekdayTime(event.startDateTime, event.timezone)}
            </EventlyText>
          </View>
          {where ? (
            <View style={s.posterLine}>
              <EventlyIcon
                name="map-marker"
                size={13}
                color="rgba(255,255,255,0.85)"
              />
              <EventlyText
                variant="caption"
                style={s.posterLineText}
                numberOfLines={1}
              >
                {where}
              </EventlyText>
            </View>
          ) : null}
        </View>
      </View>

      <View style={s.strip}>
        {note ? (
          <View style={[s.notePill, event.soldOut && s.notePillSold]}>
            <EventlyIcon
              name={event.soldOut ? 'ticket-outline' : 'clock-alert-outline'}
              size={13}
              color={event.soldOut ? '#d93b3b' : PE_NAVY}
            />
            <EventlyText
              variant="caption"
              style={[s.noteText, event.soldOut && s.noteTextSold]}
              numberOfLines={1}
            >
              {note}
            </EventlyText>
          </View>
        ) : (
          <View style={s.priceBlock}>
            <EventlyText variant="caption" style={s.priceFrom}>
              {event.startingPrice > 0 ? 'Tickets from' : 'Entry'}
            </EventlyText>
            <EventlyText variant="h2" style={s.price}>
              {event.startingPrice > 0
                ? formatPrice(event.startingPrice)
                : 'Free'}
            </EventlyText>
          </View>
        )}
        {/* Drawn as a button, pressed as part of the card. */}
        <View style={s.book}>
          <GradientFill
            colors={note ? ['#8a93a3', '#5b6475'] : gradient}
            direction="across"
          />
          <EventlyText variant="caption" style={s.bookText}>
            {note ? 'View details' : 'Book now'}
          </EventlyText>
          <EventlyIcon name="arrow-right" size={14} color="#ffffff" />
        </View>
      </View>
    </PressableScale>
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
  const insets = useSafeAreaInsets();
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
    <View style={ui.screen}>
      {/* The app's one header — the same title, size and back arrow as
          every other screen. */}
      <View style={[s.header, { paddingTop: insets.top }]}>
        <AppHeader
          title="Events near you"
          onBackPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate('Main', { screen: 'Home' })
          }
          rightElement={
            /* What you have already bought, beside the catalogue it was
               bought from. */
            <TouchableOpacity
              onPress={() => navigation.navigate('MyTickets')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={PUBLIC_EVENTS_COPY.ticketsTitle}
              testID="open-my-tickets"
              style={s.ticketsButton}
            >
              <EventlyIcon name="ticket-confirmation-outline" size={15} color={PE_ACCENT} />
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
              placeholder="Search events, artists or cities"
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
            {filterCount > 0 ? (
              <GradientFill colors={HERO_GRADIENT} direction="diagonal" />
            ) : null}
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
            const look = CATEGORY_LOOK[c.label] ?? CATEGORY_LOOK.All;
            return (
              <TouchableOpacity
                key={c.label}
                style={[s.chip, on && s.chipOn]}
                onPress={() => setCategory(c.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
              >
                {on ? (
                  <GradientFill colors={look.gradient} direction="across" />
                ) : null}
                <EventlyIcon
                  name={look.icon}
                  size={15}
                  color={on ? '#ffffff' : look.gradient[1]}
                />
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
        renderItem={({ item, index }) => (
          /* Each card rises in a beat after the one above it. */
          <FadeInUp delay={index * 70}>
            <EventListCard
              event={item}
              onPress={() =>
                navigation.navigate('PublicEventDetail', { eventId: item.id })
              }
            />
          </FadeInUp>
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
    </View>
  );
}

export default PublicEventsScreen;
