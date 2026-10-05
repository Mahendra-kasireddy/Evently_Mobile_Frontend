import { useMemo, useState, type ReactNode } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, GradientFill } from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import {
  DISTANCE_OPTIONS,
  PUBLIC_EVENTS_COPY,
  SORT_OPTIONS,
  WHEN_OPTIONS,
  categoryTint,
  formatEventWhen,
  formatPrice,
  type SortKey,
  type WhenKey,
} from '../constants';
import { usePublicEvents } from '../hooks';
import {
  HOME_EVENT_CARD_WIDTH,
  HOME_EVENT_GAP,
  homeUi as s,
  PE_MUTED,
  ui,
} from '../ui.styles';
import { PE_ACCENT, PE_NAVY } from '../styles';
import type { EventCard } from '../types';

interface EventsNearYouProps {
  /**
   * The section's own heading, supplied by Home.
   *
   * Passed in rather than drawn here so it keeps Home's one `SectionHead` —
   * six near-copies drifting a point apart is exactly what that component
   * exists to prevent — while this component still decides whether the
   * section appears at all. Rendering the heading in Home and the body here
   * is what left a title with nothing under it.
   */
  header: ReactNode;
  /** The customer's coordinates, when the app has them. */
  coordinates: { latitude: number; longitude: number } | null;
  onOpenEvent: (eventId: string) => void;
}

/**
 * The colours a card can wear, in order along the row: a gradient for its
 * button, and tints for its price and the date and venue icons.
 */
const CARD_ACCENTS: Array<{
  gradient: [string, string];
  ink: string;
  soft: string;
  altInk: string;
  altSoft: string;
}> = [
  { gradient: ['#ff8a5c', '#e8433a'], ink: '#e2552f', soft: '#fff0e8', altInk: '#7c5cdb', altSoft: '#f1ecff' },
  { gradient: ['#9b7dff', '#5a35e0'], ink: '#6d4df2', soft: '#f1ecff', altInk: '#e2552f', altSoft: '#fff0e8' },
  { gradient: ['#3cc9a1', '#0e8a68'], ink: '#0f8a68', soft: '#e6f7f1', altInk: '#3b6fd8', altSoft: '#e9f0fd' },
  { gradient: ['#ffb547', '#e8791a'], ink: '#d36b0c', soft: '#fff4e2', altInk: '#c2416b', altSoft: '#fdeef3' },
  { gradient: ['#ff6f9f', '#c2416b'], ink: '#c2416b', soft: '#fdeef3', altInk: '#0f8a68', altSoft: '#e6f7f1' },
  { gradient: ['#5b9bff', '#2554b8'], ink: '#2b5aa8', soft: '#e9f0fd', altInk: '#d36b0c', altSoft: '#fff4e2' },
];

/** "Oct 18" — the short date on the picture. */
function shortDate(iso: string | null, timezone: string): string {
  if (!iso) return '';
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      timeZone: timezone || undefined,
    }).format(at);
  } catch {
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(at);
  }
}

/** One chip: a label that cycles through its own options when tapped. */
function FilterChip({
  icon,
  label,
  on,
  onPress,
}: {
  icon: string;
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.chip, on && s.chipOn]}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Changes the filter"
    >
      <EventlyIcon name={icon} size={13} color={on ? PE_ACCENT : PE_MUTED} />
      <EventlyText
        variant="caption"
        style={[s.chipText, on && s.chipTextOn]}
        numberOfLines={1}
      >
        {label}
      </EventlyText>
      <EventlyIcon name="chevron-down" size={13} color={on ? PE_ACCENT : PE_MUTED} />
    </TouchableOpacity>
  );
}

/**
 * Events near you, on Home.
 *
 * A teaser rather than a second catalogue: a swipeable row of up to eight
 * events, under the occasions,
 * for the customer who opened the app with nothing of their own to plan.
 * "See all" and the Discover tab are where the full list lives, and this does
 * not try to be it.
 *
 * The three chips are real filters, every one of them. A chip that looks like
 * a control and changes nothing is worse than no chip, so each cycles through
 * its own options and the catalogue is asked again — distance from the
 * coordinates the app already holds, the date window, and the order. Without
 * coordinates the distance chip says so rather than pretending to measure.
 */
export function EventsNearYou({ header, coordinates, onOpenEvent }: EventsNearYouProps) {
  const [distance, setDistance] = useState(0);
  const [when, setWhen] = useState<WhenKey>('any');
  const [sort, setSort] = useState<SortKey>('popular');

  const query = useMemo(
    () => ({
      limit: 8,
      sort,
      ...(when !== 'any' ? { when } : {}),
      ...(coordinates && distance > 0
        ? {
            lat: coordinates.latitude,
            lng: coordinates.longitude,
            radiusKm: distance,
          }
        : {}),
    }),
    [coordinates, distance, sort, when],
  );

  const { data, loading, error } = usePublicEvents(query);
  const events = data ?? [];

  /* Cycling rather than a sheet: this is a teaser, and a modal over Home to
     change one of three chips is more ceremony than the section is worth. The
     Discover tab has the full filter sheet. */
  const cycle = <T,>(options: readonly T[], current: T): T =>
    options[(options.indexOf(current) + 1) % options.length];

  const distanceLabel =
    DISTANCE_OPTIONS.find((d) => d.km === distance)?.label ?? 'Distance';

  const filtered = when !== 'any' || distance > 0;

  /*
   * Nothing on sale anywhere, and nothing filtered out: the section has no
   * reason to exist on this customer's Home, so it goes — heading and all.
   *
   * Heading and all is the point. This used to hide only the body, which left
   * "Events near you · See all" sitting over an empty gap, looking like a
   * section that had failed to load. A section with nothing in it should not
   * announce itself.
   */
  if (!loading && !error && events.length === 0 && !filtered) return null;

  return (
    <View>
      {header}

      <View style={s.chipRow}>
        <FilterChip
          icon="map-marker-outline"
          label={coordinates ? distanceLabel : 'Distance'}
          on={distance > 0}
          onPress={() => {
            if (!coordinates) return;
            setDistance(cycle(DISTANCE_OPTIONS, DISTANCE_OPTIONS.find((d) => d.km === distance)!).km);
          }}
        />
        <FilterChip
          icon="calendar-blank-outline"
          label={WHEN_OPTIONS.find((w) => w.key === when)?.label ?? 'Date'}
          on={when !== 'any'}
          onPress={() => setWhen(cycle(WHEN_OPTIONS, WHEN_OPTIONS.find((w) => w.key === when)!).key)}
        />
        <FilterChip
          icon="sort-variant"
          label={SORT_OPTIONS.find((o) => o.key === sort)?.label ?? 'Popular'}
          on={sort !== 'popular'}
          onPress={() => setSort(cycle(SORT_OPTIONS, SORT_OPTIONS.find((o) => o.key === sort)!).key)}
        />
      </View>

      {events.length === 0 ? (
        /*
         * Which of the three it is, rather than one blank. "Nothing matched
         * your filters" sent to somebody whose connection dropped is a wrong
         * answer, and so is silence.
         */
        <EventlyText variant="caption" style={s.note}>
          {loading
            ? 'Looking for events…'
            : error
              ? "We couldn't load events just now. Pull down to try again."
              : filtered
                ? 'Nothing matches those filters. Try a wider distance or date.'
                : 'No public events are on sale near you yet.'}
        </EventlyText>
      ) : (
        /* One row that swipes, with wide cards: a 2-up grid made each card
           half a phone and its words too small to read at a glance. */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.row}
          decelerationRate="fast"
          snapToInterval={HOME_EVENT_CARD_WIDTH + HOME_EVENT_GAP}
          snapToAlignment="start"
        >
          {events.map((event: EventCard, index: number) => {
            const tint = categoryTint(event.category);
            /* Each card its own colour, so the row reads as a set of
               different nights out rather than one card repeated. */
            const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
            return (
              <TouchableOpacity
                key={event.id}
                style={s.card}
                activeOpacity={0.85}
                onPress={() => onOpenEvent(event.id)}
                accessibilityRole="button"
                accessibilityLabel={`${event.title}, ${formatEventWhen(
                  event.startDateTime,
                  event.timezone,
                )}`}
                testID={`home-event-${event.id}`}
              >
                <View>
                  <Image
                    source={{ uri: absoluteFileUrl(event.coverUrl) }}
                    style={s.cover}
                    resizeMode="cover"
                  />
                  <View style={s.coverTop} pointerEvents="none">
                    {event.category ? (
                      <View style={[ui.pill, { backgroundColor: tint.bg }]}>
                        <EventlyText
                          variant="caption"
                          style={[ui.pillText, { color: tint.fg }]}
                          numberOfLines={1}
                        >
                          {event.category}
                        </EventlyText>
                      </View>
                    ) : (
                      <View />
                    )}
                    <View style={s.dateChip}>
                      <EventlyIcon name="calendar-blank-outline" size={11} color={PE_NAVY} />
                      <EventlyText variant="caption" style={s.dateChipText}>
                        {shortDate(event.startDateTime, event.timezone)}
                      </EventlyText>
                    </View>
                  </View>
                </View>

                <View style={s.body}>
                  <EventlyText variant="body" style={s.title} numberOfLines={2}>
                    {event.title}
                  </EventlyText>
                  {/* The organizer's own category and city. Nothing invented:
                      the catalogue has no sub-genre to print under the name. */}
                  <EventlyText variant="caption" style={s.kind} numberOfLines={1}>
                    {[event.category, event.city].filter(Boolean).join(' · ')}
                  </EventlyText>

                  <View style={s.metaLine}>
                    <View style={[s.metaIcon, { backgroundColor: accent.soft }]}>
                      <EventlyIcon name="calendar-month-outline" size={12} color={accent.ink} />
                    </View>
                    <EventlyText variant="caption" style={s.kind} numberOfLines={1}>
                      {formatEventWhen(event.startDateTime, event.timezone)}
                    </EventlyText>
                  </View>
                  {event.venueName ? (
                    <View style={s.metaLine}>
                      <View style={[s.metaIcon, { backgroundColor: accent.altSoft }]}>
                        <EventlyIcon name="map-marker" size={12} color={accent.altInk} />
                      </View>
                      <EventlyText variant="caption" style={s.kind} numberOfLines={1}>
                        {event.venueName}
                      </EventlyText>
                    </View>
                  ) : null}

                  <View style={s.foot}>
                    {/* The price on its own tinted pill, in the card's colour. */}
                    <View style={[s.pricePill, { backgroundColor: accent.soft }]}>
                      {event.soldOut || event.startingPrice <= 0 ? (
                        <EventlyText
                          variant="caption"
                          style={[s.priceAmount, { color: accent.ink }]}
                          numberOfLines={1}
                        >
                          {event.soldOut ? PUBLIC_EVENTS_COPY.soldOut : 'Free'}
                        </EventlyText>
                      ) : (
                        <EventlyText variant="caption" style={s.priceFrom} numberOfLines={1}>
                          {`${PUBLIC_EVENTS_COPY.from} `}
                          <EventlyText
                            variant="caption"
                            style={[s.priceAmount, { color: accent.ink }]}
                          >
                            {formatPrice(event.startingPrice)}
                          </EventlyText>
                        </EventlyText>
                      )}
                    </View>
                    {/* Drawn as a button, pressed as part of the card. */}
                    <View style={s.view}>
                      <GradientFill colors={accent.gradient} direction="across" />
                      <EventlyText variant="caption" style={s.viewText} numberOfLines={1}>
                        {PUBLIC_EVENTS_COPY.viewEvent}
                      </EventlyText>
                      <EventlyIcon name="chevron-right" size={12} color="#ffffff" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

export default EventsNearYou;
