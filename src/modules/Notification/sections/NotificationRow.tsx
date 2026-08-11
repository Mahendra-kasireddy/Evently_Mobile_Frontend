import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { NOTIFICATION_ICON_NAME } from '../constants';
import { notificationRowStyles } from '../styles';
import type { NotificationItem } from '../types';

interface NotificationRowProps {
  item: NotificationItem;
  onPress: (id: string) => void;
}

export function NotificationRow({ item, onPress }: NotificationRowProps) {
  return (
    <TouchableOpacity
      style={[notificationRowStyles.row, !item.read && notificationRowStyles.unreadRow]}
      onPress={() => onPress(item.id)}
    >
      <View style={notificationRowStyles.iconBadge}>
        <EventlyIcon name={NOTIFICATION_ICON_NAME[item.type]} size={22} color={colors.primary} />
      </View>
      <View style={notificationRowStyles.content}>
        <View style={notificationRowStyles.titleRow}>
          <EventlyText variant="subtitle" style={notificationRowStyles.title} numberOfLines={1}>
            {item.title}
          </EventlyText>
          <EventlyText variant="caption" style={notificationRowStyles.time}>
            {item.relativeTime}
          </EventlyText>
        </View>
        {item.body ? (
          <EventlyText variant="body" style={notificationRowStyles.body} numberOfLines={2}>
            {item.body}
          </EventlyText>
        ) : null}
      </View>
      {!item.read && <View style={notificationRowStyles.unreadDot} />}
    </TouchableOpacity>
  );
}

export default NotificationRow;
