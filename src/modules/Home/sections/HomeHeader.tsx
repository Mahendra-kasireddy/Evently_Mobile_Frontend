import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { homeHeaderStyles } from '../styles';

interface HomeHeaderProps {
  locationLabel: string;
  unreadCount: number;
  onPressLocation: () => void;
  onPressNotifications: () => void;
}

export function HomeHeader({ locationLabel, unreadCount, onPressLocation, onPressNotifications }: HomeHeaderProps) {
  return (
    <View style={homeHeaderStyles.container}>
      <TouchableOpacity
        style={homeHeaderStyles.locationButton}
        onPress={onPressLocation}
        accessibilityRole="button"
        accessibilityLabel={`Location: ${locationLabel}`}
      >
        <EventlyIcon name="crosshairs-gps" size={20} color={colors.primary} />
        <EventlyText variant="body" style={homeHeaderStyles.locationLabel} numberOfLines={1}>
          {locationLabel}
        </EventlyText>
      </TouchableOpacity>

      <TouchableOpacity
        style={homeHeaderStyles.bellButton}
        onPress={onPressNotifications}
        accessibilityRole="button"
        accessibilityLabel={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      >
        <EventlyIcon name="bell-outline" size={22} color={colors.text} />
        {unreadCount > 0 && (
          <View style={homeHeaderStyles.badge}>
            <EventlyText variant="caption" style={homeHeaderStyles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </EventlyText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default HomeHeader;
