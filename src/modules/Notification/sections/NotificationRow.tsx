import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { NOTIFICATION_LOOK } from '../constants';
import { notificationRowStyles as s } from '../styles';
import type { NotificationItem } from '../types';

interface NotificationRowProps {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
}

/**
 * One notification.
 *
 * Read and unread are told apart three ways — the card's fill, the title's
 * weight, and the dot — because any one of them alone is missed: the dot is
 * small, the weight is subtle, and the fill is invisible to anyone who cannot
 * distinguish white from off-white.
 *
 * Colour carries the category so the list can be scanned without reading it:
 * money green, a conversation violet, a quote or booking in the app's accent.
 */
export function NotificationRow({ item, onPress }: NotificationRowProps) {
  const look = NOTIFICATION_LOOK[item.type];
  const spoken = [item.read ? '' : 'Unread', item.title, item.body, item.relativeTime]
    .filter(Boolean)
    .join('. ');

  return (
    <TouchableOpacity
      style={[s.row, item.read && s.rowRead]}
      activeOpacity={0.85}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={spoken}
    >
      <View style={[s.iconBadge, { backgroundColor: look.bg }]}>
        <EventlyIcon name={look.icon} size={21} color={look.fg} />
      </View>

      <View style={s.content}>
        <EventlyText
          variant="subtitle"
          style={[s.title, item.read && s.titleRead]}
          numberOfLines={2}
        >
          {item.title}
        </EventlyText>
        {/* Dropped rather than left as an empty line — some notices are a
            headline and nothing more. */}
        {item.body ? (
          <EventlyText variant="body" style={s.body} numberOfLines={3}>
            {item.body}
          </EventlyText>
        ) : null}
        {item.relativeTime ? (
          <EventlyText variant="caption" style={s.time}>
            {item.relativeTime}
          </EventlyText>
        ) : null}
      </View>

      {item.read ? null : <View style={s.unreadDot} />}
    </TouchableOpacity>
  );
}

export default NotificationRow;
