import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  BOOKING_ACCENT,
  BOOKING_COPY as COPY,
  OCCASION_ICON,
  OCCASION_ICON_FALLBACK,
  STATUS_TONE_COLOR,
} from '../constants';
import { bookingRowStyles as s } from '../styles';
import type { BookingItem } from '../types';

interface BookingRowProps {
  item: BookingItem;
  /** Opens this booking's workspace. */
  onPress: () => void;
}

/**
 * One booking in the customer's list.
 *
 * The whole card is a single control, so there is one tap target and one
 * accessible name — "Open workspace" is presentational, saying where the card
 * goes rather than being a second thing to hit.
 *
 * Every line is dropped when the booking does not carry it: a booking with no
 * venue, no agreed amount or no organizer yet renders shorter rather than
 * showing a dash the customer would read as an answer.
 */
export function BookingRow({ item, onPress }: BookingRowProps) {
  const toneColor = STATUS_TONE_COLOR[item.statusTone];
  const icon = OCCASION_ICON[item.occasion] ?? OCCASION_ICON_FALLBACK;

  return (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.statusLabel}. ${COPY.open}.`}
    >
      <View style={[s.accent, { backgroundColor: toneColor }]} pointerEvents="none" />

      <View style={s.body}>
        <View style={s.head}>
          <View style={s.iconChip}>
            <EventlyIcon name={icon} size={19} color={BOOKING_ACCENT} />
          </View>
          <View style={s.headText}>
            <EventlyText variant="subtitle" style={s.title} numberOfLines={2}>
              {item.title}
            </EventlyText>
            <EventlyText variant="caption" style={s.ref}>
              {item.ref}
            </EventlyText>
          </View>
          <View style={[s.statusChip, { backgroundColor: `${toneColor}1f` }]}>
            <EventlyText variant="caption" style={[s.statusText, { color: toneColor }]} numberOfLines={1}>
              {item.statusLabel}
            </EventlyText>
          </View>
        </View>

        <View style={s.metaRow}>
          {item.eventDateLabel ? (
            <View style={s.meta}>
              <EventlyIcon name="calendar-blank-outline" size={14} color={colors.textMuted} />
              <EventlyText variant="caption" style={s.metaText}>
                {item.eventDateLabel}
              </EventlyText>
            </View>
          ) : null}
          {item.location ? (
            <View style={s.meta}>
              <EventlyIcon name="map-marker-outline" size={14} color={colors.textMuted} />
              <EventlyText variant="caption" style={s.metaText} numberOfLines={1}>
                {item.location}
              </EventlyText>
            </View>
          ) : null}
          {item.paidLabel ? (
            <View style={s.meta}>
              <EventlyIcon name="wallet-outline" size={14} color={colors.textMuted} />
              <EventlyText variant="caption" style={s.metaText}>
                {item.paidLabel}
              </EventlyText>
            </View>
          ) : null}
        </View>

        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${item.progress}%`, backgroundColor: toneColor }]} />
        </View>
        <View style={s.progressRow}>
          <EventlyText variant="caption" style={s.progressLabel}>
            {item.progress}% complete
          </EventlyText>
          {/* No countdown on a booking that is over, or one with no date. */}
          {item.daysToGo != null ? (
            <EventlyText variant="caption" style={s.daysToGo}>
              {item.daysToGo === 0 ? COPY.today : COPY.daysToGo(item.daysToGo)}
            </EventlyText>
          ) : null}
        </View>

        <View style={s.organizerRow}>
          <View style={[s.avatar, { backgroundColor: item.organizerColor }]}>
            <EventlyText variant="caption" style={s.avatarText}>
              {item.organizerName ? item.organizerInitials : '?'}
            </EventlyText>
          </View>
          <EventlyText variant="caption" style={s.organizerName} numberOfLines={1}>
            {item.organizerName ?? COPY.organizerTbd}
          </EventlyText>
          <View style={s.open}>
            <EventlyText variant="caption" style={s.openText}>
              {COPY.open}
            </EventlyText>
            <EventlyIcon name="chevron-right" size={15} color={BOOKING_ACCENT} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default BookingRow;
