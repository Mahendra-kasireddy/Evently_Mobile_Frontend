import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, EventlyIcon } from '../../../Components';
import { HOME_INK } from '../../../modules/Home/design';
import type { RootStackParamList } from '../../../navigation/types';
import { ORGANIZER_SHELL_COPY as COPY } from '../constants';
import { useUnreadCount } from '../hooks';
import { topBarStyles as s } from '../styles';

/** The bell with its unread count; opens Notifications. */
export function NotificationBell() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const unread = useUnreadCount();

  return (
    <Pressable
      style={s.iconButton}
      onPress={() => navigation.navigate('Notification')}
      accessibilityRole="button"
      accessibilityLabel={
        unread > 0
          ? `${COPY.notifications}, ${unread} unread`
          : COPY.notifications
      }
      hitSlop={6}
    >
      <EventlyIcon name="bell-outline" size={21} color={HOME_INK.ink} />
      {unread > 0 ? (
        <View style={s.badge}>
          <AppText variant="label" style={s.badgeText}>
            {unread > 9 ? '9+' : unread}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

export default NotificationBell;
