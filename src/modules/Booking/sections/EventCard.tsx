import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import {
  BOOKING_ACCENT,
  BOOKING_COPY as COPY,
  OCCASION_ICON,
  OCCASION_ICON_FALLBACK,
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
  const icon = OCCASION_ICON[item.occasion] ?? OCCASION_ICON_FALLBACK;
  const who = item.organizerName ?? COPY.organizerTbd;
  const countdown =
    item.daysToGo == null
      ? ''
      : item.daysToGo === 0
        ? COPY.today
        : COPY.daysToGo(item.daysToGo);

  const spoken = [item.title, item.statusLabel, countdown, item.nextStep ? COPY.next + item.nextStep : '']
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
      <View style={s.head}>
        <View style={s.iconChip}>
          <EventlyIcon name={icon} size={20} color={BOOKING_ACCENT} />
        </View>

        <View style={s.headText}>
          <View style={s.titleRow}>
            <EventlyText variant="subtitle" style={s.title} numberOfLines={2}>
              {item.title}
            </EventlyText>
            <View style={[s.statusChip, { backgroundColor: toneSoft }]}>
              <EventlyText
                variant="caption"
                style={[s.statusText, { color: toneColor }]}
                numberOfLines={1}
              >
                {item.statusPill}
              </EventlyText>
            </View>
          </View>
          <EventlyText variant="caption" style={s.subtitle} numberOfLines={2}>
            {`${item.ref} · ${who}`}
          </EventlyText>
        </View>
      </View>

      <View style={s.progressRow}>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${item.progress}%` }]} />
        </View>
        {/* No countdown on an event that is over, or one with no date. */}
        {item.daysLabel ? (
          <EventlyText variant="caption" style={s.daysLabel}>
            {item.daysLabel}
          </EventlyText>
        ) : null}
      </View>

      {item.nextStep ? (
        <>
          <View style={s.divider} />
          <EventlyText variant="caption" style={s.nextText} numberOfLines={2}>
            {COPY.next + item.nextStep}
          </EventlyText>
        </>
      ) : null}
    </TouchableOpacity>
  );
}

export default EventCard;
