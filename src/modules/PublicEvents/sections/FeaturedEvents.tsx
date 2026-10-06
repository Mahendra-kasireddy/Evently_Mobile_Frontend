import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  GradientFill,
  PressableScale,
  useReducedMotion,
} from '../../../Components';
import { spacing } from '../../../theme';
import { absoluteFileUrl } from '../../../services/urls';
import {
  FEATURED_COPY as COPY,
  PUBLIC_EVENTS_COPY,
  categoryTint,
  formatDateSpan,
  formatPrice,
} from '../constants';
import { usePublicEvents } from '../hooks';
import { PE_NAVY } from '../styles';
import type { EventCard } from '../types';
import { featuredUi as s } from '../ui.styles';

/** How many events the banner carries, and how long each stays. */
const FEATURED_LIMIT = 3;
const SLIDE_MS = 5000;
/** The deep violet the banner's words sit on. */
const SCRIM = '#120c34';

interface FeaturedEventsProps {
  onOpenEvent: (eventId: string) => void;
  /** Spacing from the section above — applied here, so it goes when the banner does. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Still on or still to come: its end is ahead, or — with no end — its start
 * is. The server already filters this; checked again here so a stale list or
 * an older server can never put an expired event in the spotlight.
 */
export function isNotEnded(event: EventCard, now: number = Date.now()): boolean {
  if (event.liveState === 'ended') return false;
  const end = event.endDateTime ? Date.parse(event.endDateTime) : NaN;
  if (Number.isFinite(end)) return end > now;
  const start = Date.parse(event.startDateTime);
  return Number.isFinite(start) && start > now;
}

/** "Concert · From ₹499" — what it is and what it costs, from real fields only. */
function tagline(event: EventCard): string {
  const price = event.soldOut
    ? PUBLIC_EVENTS_COPY.soldOut
    : event.startingPrice > 0
      ? `${PUBLIC_EVENTS_COPY.from} ${formatPrice(event.startingPrice)}`
      : 'Free entry';
  return [event.category, price].filter(Boolean).join('  ·  ');
}

/**
 * The featured banner at the top of Home's public events: the most popular
 * upcoming events, one at a time, large enough to sell a night out.
 *
 * Real events only — the same catalogue as "Events near you", most popular
 * first, those with a cover photo ahead of those without. Every line on the
 * card is a field the organizer filled in; nothing is invented to fill the
 * design. Slides on its own every few seconds, pauses while a finger is on
 * it, and stays put with Reduce Motion on. Absent entirely when there is
 * nothing to feature, rather than an empty frame.
 */
export function FeaturedEvents({ onOpenEvent, style }: FeaturedEventsProps) {
  const { width } = useWindowDimensions();
  const cardWidth = width - spacing.md * 2;
  const step = cardWidth + spacing.s12;
  const reduceMotion = useReducedMotion();

  const query = useMemo(() => ({ limit: 8, sort: 'popular' as const }), []);
  const { data } = usePublicEvents(query);
  const events = useMemo(() => {
    // On sale or sold out, and not yet over — never one that has ended or
    // been called off.
    const live = (data ?? []).filter(
      (e) => (e.status === 'published' || e.status === 'sold_out') && isNotEnded(e),
    );
    const withCover = live.filter((e) => e.coverUrl);
    const without = live.filter((e) => !e.coverUrl);
    return [...withCover, ...without].slice(0, FEATURED_LIMIT);
  }, [data]);

  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const dragging = useRef(false);
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      indexRef.current = next;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * step, animated: true });
    },
    [step],
  );

  useEffect(() => {
    if (reduceMotion || events.length < 2) return undefined;
    const timer = setInterval(() => {
      if (dragging.current) return;
      goTo((indexRef.current + 1) % events.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [reduceMotion, events.length, goTo]);

  const onSettle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    dragging.current = false;
    const settled = Math.round(e.nativeEvent.contentOffset.x / Math.max(1, step));
    indexRef.current = settled;
    setIndex(settled);
  };

  if (events.length === 0) return null;

  return (
    <ScrollView
      ref={scrollRef}
      style={style}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
      decelerationRate="fast"
      snapToInterval={step}
      snapToAlignment="start"
      onScrollBeginDrag={() => {
        dragging.current = true;
      }}
      onMomentumScrollEnd={onSettle}
    >
      {events.map((event) => {
        const dates = formatDateSpan(event.startDateTime, event.endDateTime, event.timezone);
        const place = [event.venueName, event.city].filter(Boolean).join(', ');
        const tint = categoryTint(event.category);
        return (
          <PressableScale
            key={event.id}
            style={[s.card, { width: cardWidth }]}
            onPress={() => onOpenEvent(event.id)}
            accessibilityRole="button"
            accessibilityLabel={`Featured event: ${event.title}. ${dates}. ${place}`}
            testID={`featured-event-${event.id}`}
          >
            {event.coverUrl ? (
              <Image
                source={{ uri: absoluteFileUrl(event.coverUrl) }}
                style={s.cover}
                resizeMode="cover"
              />
            ) : (
              <GradientFill colors={[tint.bg, '#1b1446']} direction="diagonal" />
            )}
            {/* Dark at the left where the words are, clear at the right where
                the picture is — so white type reads on any photo. */}
            <GradientFill
              colors={[SCRIM, SCRIM]}
              opacities={[0.88, 0.05]}
              direction="across"
            />

            <View style={s.body}>
              <View>
                <EventlyText style={s.eyebrow}>{COPY.eyebrow}</EventlyText>
                <EventlyText style={s.title} numberOfLines={1}>
                  {event.title}
                </EventlyText>
                <EventlyText style={s.tagline} numberOfLines={1}>
                  {tagline(event)}
                </EventlyText>
                {place ? (
                  <View style={s.place}>
                    <EventlyIcon name="map-marker-outline" size={14} color="#ffffff" />
                    <EventlyText style={s.placeText} numberOfLines={1}>
                      {place}
                    </EventlyText>
                  </View>
                ) : null}
              </View>

              <View style={s.explore}>
                <EventlyText style={s.exploreText}>{COPY.explore}</EventlyText>
                <EventlyIcon name="chevron-right" size={16} color="#3a2a8c" />
              </View>
            </View>

            {dates ? (
              <View style={s.datePill}>
                <EventlyIcon name="calendar-blank-outline" size={13} color={PE_NAVY} />
                <EventlyText style={s.dateText}>{dates}</EventlyText>
              </View>
            ) : null}

            {events.length > 1 ? (
              <View style={s.dots} pointerEvents="none">
                {events.map((e, i) => (
                  <View key={e.id} style={[s.dot, i === index && s.dotActive]} />
                ))}
              </View>
            ) : null}
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

export default FeaturedEvents;
