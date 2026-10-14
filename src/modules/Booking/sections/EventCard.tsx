import { Image, TouchableOpacity, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { EventlyIcon, EventlyText, GradientFill } from '../../../Components';
import {
  BOOKING_COPY as COPY,
  STATUS_TONE_COLOR,
  STATUS_TONE_SOFT,
} from '../constants';
import { eventCardStyles as s } from '../styles';
import type { BookingItem } from '../types';

interface EventCardProps {
  item: BookingItem;
  /** True for the event happening soonest — the one wearing the accent edge. */
  focused: boolean;
  /** Opens this event's workspace. */
  onPress: () => void;
}

/* A photo per occasion for the card's thumbnail; anything else gets the
   general celebration photo. */
const OCCASION_PHOTO: Record<string, ImageSourcePropType> = {
  wedding: require('../../../assets/images/MrandMrs.jpg'),
  anniversary: require('../../../assets/images/MrandMrs.jpg'),
  birthday: require('../../../assets/images/login_hero_birthday.jpg'),
  naming: require('../../../assets/images/login_hero_naming.jpg'),
  corporate: require('../../../assets/images/Corporate.jpeg'),
};
const PHOTO_FALLBACK: ImageSourcePropType = require('../../../assets/images/login_hero.jpg');

const PROGRESS_GRADIENT: [string, string] = ['#ff8a5c', '#e8436f'];
const FOCUS_RING: [string, string] = ['#ffb3c7', '#c9b6ff'];

/**
 * One event in the customer's list.
 *
 * The whole card is a single control, so there is one tap target and one
 * accessible name. What it announces is the long form of everything the card
 * shows short: "3 days" beside a bar is clear to look at and meaningless read
 * aloud, so the label says "3 days to go".
 *
 * Every line is dropped when the booking does not carry it — no organizer yet,
 * no date, no outstanding milestone — rather than showing a dash the customer
 * would read as an answer.
 */
export function EventCard({ item, focused, onPress }: EventCardProps) {
  const toneColor = STATUS_TONE_COLOR[item.statusTone];
  const toneSoft = STATUS_TONE_SOFT[item.statusTone];
  const photo = OCCASION_PHOTO[item.occasion] ?? PHOTO_FALLBACK;
  const who = item.organizerName ?? COPY.organizerTbd;
  const countdown =
    item.daysToGo == null
      ? ''
      : item.daysToGo === 0
      ? COPY.today
      : COPY.daysToGo(item.daysToGo);

  const spoken = [
    item.title,
    item.statusLabel,
    countdown,
    item.nextStep ? COPY.next + item.nextStep : '',
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <TouchableOpacity
      style={[s.card, focused && s.cardFocus]}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${spoken}. ${COPY.open}.`}
    >
      {/* The soonest event wears a soft pink-to-lilac ring. */}
      {focused ? (
        <GradientFill colors={FOCUS_RING} direction="diagonal" />
      ) : null}
      <View style={s.surface}>
        <View style={s.inner}>
          <View style={s.photoWrap}>
            <Image source={photo} style={s.photo} resizeMode="cover" />
            {item.eventDay ? (
              <View style={s.dateBadge}>
                <EventlyText style={s.dateDay}>{item.eventDay}</EventlyText>
                <EventlyText style={s.dateMonth}>{item.eventMonth}</EventlyText>
              </View>
            ) : null}
          </View>

          <View style={s.body}>
            <View style={s.chipRow}>
              <View style={s.kindChip}>
                <EventlyIcon name="calendar-heart" size={11} color="#6d4df2" />
                <EventlyText variant="caption" style={s.kindText}>
                  Planned Event
                </EventlyText>
              </View>
              <View style={[s.statusChip, { backgroundColor: toneSoft }]}>
                <EventlyIcon name="check-circle" size={11} color={toneColor} />
                <EventlyText
                  variant="caption"
                  style={[s.statusText, { color: toneColor }]}
                  numberOfLines={1}
                >
                  {item.statusPill}
                </EventlyText>
              </View>
            </View>

            <EventlyText variant="subtitle" style={s.title} numberOfLines={1}>
              {item.title}
            </EventlyText>

            <View style={s.metaRow}>
              <EventlyIcon name="clock-outline" size={13} color="#e2552f" />
              <EventlyText
                variant="caption"
                style={s.subtitle}
                numberOfLines={1}
              >
                {`${item.ref} · ${who}`}
              </EventlyText>
            </View>

            <View style={s.progressRow}>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: `${item.progress}%` }]}>
                  <GradientFill colors={PROGRESS_GRADIENT} direction="across" />
                </View>
              </View>
              {/* No countdown on an event that is over, or one with no date. */}
              {item.daysLabel ? (
                <EventlyText variant="caption" style={s.daysLabel}>
                  {item.daysLabel}
                </EventlyText>
              ) : null}
            </View>
          </View>
        </View>

        {item.nextStep ? (
          <View style={s.next}>
            <View style={s.nextIcon}>
              <EventlyIcon name="wallet-outline" size={14} color="#6d4df2" />
            </View>
            <EventlyText variant="caption" style={s.nextText} numberOfLines={1}>
              {COPY.next + item.nextStep}
            </EventlyText>
            <EventlyIcon name="chevron-right" size={18} color="#1b1438" />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default EventCard;
