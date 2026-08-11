import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { bookingRowStyles } from '../styles';
import type { BookingItem } from '../types';

interface BookingRowProps {
  item: BookingItem;
}

const STATUS_BADGE_STYLE = {
  primary: bookingRowStyles.statusPrimary,
  success: bookingRowStyles.statusSuccess,
  muted: bookingRowStyles.statusMuted,
  danger: bookingRowStyles.statusDanger,
};

export function BookingRow({ item }: BookingRowProps) {
  const statusTextStyle = item.statusColor === 'muted' ? bookingRowStyles.statusTextMuted : bookingRowStyles.statusTextOnColor;

  return (
    <View style={bookingRowStyles.card}>
      <View style={bookingRowStyles.headerRow}>
        <EventlyText variant="subtitle" style={bookingRowStyles.title} numberOfLines={1}>
          {item.title}
        </EventlyText>
        <View style={[bookingRowStyles.statusBadge, STATUS_BADGE_STYLE[item.statusColor]]}>
          <EventlyText variant="caption" style={statusTextStyle}>
            {item.statusLabel}
          </EventlyText>
        </View>
      </View>
      <EventlyText variant="caption" style={bookingRowStyles.ref}>
        {item.ref}
      </EventlyText>

      <View style={bookingRowStyles.progressTrack}>
        <View style={[bookingRowStyles.progressFill, { width: `${item.progress}%` }]} />
      </View>

      <View style={bookingRowStyles.metaRow}>
        <EventlyText variant="caption" style={bookingRowStyles.metaText}>
          {item.organizerName ?? 'Organizer TBD'}
        </EventlyText>
        <EventlyText variant="caption" style={bookingRowStyles.metaText}>
          {item.eventDateLabel}
          {item.daysToGo > 0 ? ` · ${item.daysToGo} days to go` : ''}
        </EventlyText>
      </View>
    </View>
  );
}

export default BookingRow;
