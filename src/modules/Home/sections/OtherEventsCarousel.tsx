import { useState } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon, EventlyText, OccasionArt } from '../../../Components';
import { CATEGORY_GRADIENT, HERO_ACCENT_COLOR } from '../constants';
import {
  OTHER_EVENT_CARD_BG,
  OTHER_EVENT_GUTTER,
  otherEventCardStyles as s,
} from '../styles';
import { eventArtFor } from '../utils';
import type { CurrentEventViewModel, OccasionTile } from '../types';

const FLORAL_PHOTO = require('../../../assets/images/flowers_workspace.png');

/** Occasions the bundled floral photo suits when no photo was uploaded. */
const FLORAL_OCCASIONS = new Set(['wedding', 'anniversary', 'engagement']);

interface OtherEventsCarouselProps {
  events: CurrentEventViewModel[];
  /** Home's occasion tiles, for any photo an admin uploaded per occasion. */
  occasionTiles: OccasionTile[];
  onOpen: (event: CurrentEventViewModel) => void;
  /** Present only for a brief nobody has been hired off yet. */
  editFor: (event: CurrentEventViewModel) => (() => void) | undefined;
}

/** "29 September 2026" -> "29 Sep 2026"; anything else is shown as it came. */
function shortDate(when: string): string {
  const m = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(when.trim());
  return m ? `${m[1]} ${m[2].slice(0, 3)} ${m[3]}` : when;
}

/** "100" -> "100 guests"; "100 guests" / "50–100 guests" left alone. */
function guestsLabel(guests: string): string {
  const g = guests.trim();
  if (!g) return '';
  return /guest/i.test(g) ? g : `${g} guests`;
}

function Separator() {
  return <View style={s.separator} />;
}

function Meta({ icon, label }: { icon: string; label: string }) {
  if (!label) return null;
  return (
    <View style={s.metaItem}>
      <EventlyIcon name={icon} size={14} color={HERO_ACCENT_COLOR} />
      <EventlyText variant="caption" style={s.metaText} numberOfLines={1}>
        {label}
      </EventlyText>
    </View>
  );
}

function EventCard({
  event,
  width,
  photoUrl,
  onPress,
  onEdit,
}: {
  event: CurrentEventViewModel;
  width: number;
  photoUrl: string;
  onPress: () => void;
  onEdit?: () => void;
}) {
  const art = eventArtFor(event.occasion);
  const [start, end] = CATEGORY_GRADIENT[art];
  const useFloral = !photoUrl && FLORAL_OCCASIONS.has(art);
  /* SVG ids resolve per document, so each card needs its own. */
  const fadeId = `otherEventFade-${event.source}-${event.refId}`;
  const artId = `otherEventArt-${event.source}-${event.refId}`;

  return (
    <TouchableOpacity
      style={[s.card, { width }]}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[event.title, event.stageLabel, event.factsLine]
        .filter(Boolean)
        .join('. ')}
      testID={`other-event-${event.source}-${event.refId}`}
    >
      {/* The picture fills the right side and dissolves into the card on the
          left, so the text always sits on a flat, readable ground. */}
      <View style={s.photo} pointerEvents="none">
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={s.photoImage}
            resizeMode="cover"
          />
        ) : useFloral ? (
          <Image
            source={FLORAL_PHOTO}
            style={s.photoImageFloral}
            resizeMode="cover"
          />
        ) : (
          <View style={s.photoImage}>
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <Defs>
                <LinearGradient id={artId} x1="20%" y1="0%" x2="80%" y2="100%">
                  <Stop offset="0" stopColor={start} />
                  <Stop offset="1" stopColor={end} />
                </LinearGradient>
              </Defs>
              <Rect
                x={0}
                y={0}
                width={100}
                height={100}
                fill={`url(#${artId})`}
              />
            </Svg>
            <View style={s.artLayer}>
              <OccasionArt art={art} />
            </View>
          </View>
        )}
        <Svg style={s.photoFade} width="100%" height="100%">
          <Defs>
            <LinearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
              <Stop
                offset="0"
                stopColor={OTHER_EVENT_CARD_BG}
                stopOpacity={1}
              />
              <Stop
                offset="0.55"
                stopColor={OTHER_EVENT_CARD_BG}
                stopOpacity={0}
              />
            </LinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            fill={`url(#${fadeId})`}
          />
        </Svg>
      </View>

      <View style={s.content}>
        <View style={s.pill}>
          <EventlyIcon
            name="calendar-heart"
            size={13}
            color={HERO_ACCENT_COLOR}
          />
          <EventlyText variant="caption" style={s.pillText}>
            Upcoming Event
          </EventlyText>
        </View>

        <EventlyText variant="h2" style={s.title} numberOfLines={1}>
          {event.title}
        </EventlyText>

        <View style={s.metaRow}>
          <Meta icon="calendar-month-outline" label={shortDate(event.when)} />
          <Meta icon="map-marker-outline" label={event.where} />
          <Meta
            icon="account-group-outline"
            label={guestsLabel(event.guests)}
          />
        </View>

        {/* Drawn as a button, pressed as part of the card: it opens what the
            card opens. */}
        <View style={s.cta}>
          <EventlyText variant="caption" style={s.ctaText}>
            View plan
          </EventlyText>
          <EventlyIcon name="arrow-right" size={14} color={s.ctaText.color} />
        </View>
      </View>

      {/* Its own target: the card opens the event, the pencil the brief. */}
      {onEdit ? (
        <TouchableOpacity
          style={s.edit}
          activeOpacity={0.7}
          onPress={onEdit}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Edit the brief for ${event.title}`}
          testID={`edit-brief-${event.refId}`}
        >
          <EventlyIcon
            name="pencil-outline"
            size={15}
            color={HERO_ACCENT_COLOR}
          />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

/**
 * The customer's other live events, one banner card at a time.
 *
 * A paged row rather than a stack: however many events there are, the section
 * stays one card tall, and the dots say how many more are a swipe away.
 */
export function OtherEventsCarousel({
  events,
  occasionTiles,
  onOpen,
  editFor,
}: OtherEventsCarouselProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - OTHER_EVENT_GUTTER * 2;
  const [page, setPage] = useState(0);

  const photoFor = (event: CurrentEventViewModel) => {
    const key = event.occasion.trim().toLowerCase();
    const tile = occasionTiles.find(
      t => t.id.toLowerCase() === key || t.label.toLowerCase() === key,
    );
    return tile?.photoUrl ?? '';
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(
      e.nativeEvent.contentOffset.x / (cardWidth + OTHER_EVENT_GUTTER / 2),
    );
    if (next !== page) setPage(next);
  };

  return (
    <View>
      <FlatList
        data={events}
        horizontal
        keyExtractor={event => `${event.source}:${event.refId}`}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + OTHER_EVENT_GUTTER / 2}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={s.listContent}
        ItemSeparatorComponent={Separator}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            width={cardWidth}
            photoUrl={photoFor(item)}
            onPress={() => onOpen(item)}
            onEdit={editFor(item)}
          />
        )}
      />

      {events.length > 1 ? (
        <View style={s.dots} accessibilityElementsHidden>
          {events.map((event, index) => (
            <View
              key={`${event.source}:${event.refId}`}
              style={[s.dot, index === page && s.dotActive]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default OtherEventsCarousel;
