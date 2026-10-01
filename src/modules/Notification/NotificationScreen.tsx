import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { NOTIFICATION_COPY as COPY, NOTIF_ACCENT } from './constants';
import { useNotificationContainer } from './container';
import { NotificationRow } from './sections/NotificationRow';
import { styles as s } from './styles';
import { routeFor } from './utils';
import type { NotificationItem } from './types';

type NotificationNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Everything the app has told this customer.
 *
 * Grouped into what arrived today and everything before it, because the first
 * of those is what somebody opening this screen came for.
 *
 * Tapping marks it read and then follows the link — but only where the app has
 * somewhere to go. The server's links are web paths ("/organizer/quotes" is
 * a console page), and sending a customer to a screen that is not what the
 * notification was about would be worse than sending them nowhere.
 */
export function NotificationScreen() {
  const navigation = useNavigation<NotificationNavigationProp>();
  const {
    items,
    hasUnread,
    isLoading,
    isError,
    errorMessage,
    isMarkingAllRead,
    markRead,
    markAllRead,
    refetch,
  } = useNotificationContainer();

  const open = (item: NotificationItem) => {
    if (!item.read) markRead(item.id);
    const route = routeFor(item.link);
    if (route?.screen === 'Conversation') {
      navigation.navigate('Conversation', {
        conversationId: route.conversationId,
      });
    }
  };

  /* The app's standard header, so this screen matches every other one; the
     one action rides in its trailing slot, offered only when there is
     something to clear. */
  const header = (
    <AppHeader
      title={COPY.title}
      rightElement={
        hasUnread ? (
          <TouchableOpacity
            onPress={markAllRead}
            disabled={isMarkingAllRead}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={COPY.markAllRead}
          >
            <EventlyText
              variant="caption"
              style={[s.markAllRead, isMarkingAllRead && s.markAllReadDisabled]}
            >
              {COPY.markAllRead}
            </EventlyText>
          </TouchableOpacity>
        ) : undefined
      }
    />
  );

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <ActivityIndicator size="large" color={NOTIF_ACCENT} />
          <EventlyText variant="body" style={s.loadingText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && items.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <EventlyText variant="h2" style={s.emptyTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
          <TouchableOpacity
            style={s.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={NOTIF_ACCENT} />
            <EventlyText variant="caption" style={s.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <View style={s.centeredIcon}>
            <EventlyIcon name="bell-outline" size={28} color={NOTIF_ACCENT} />
          </View>
          <EventlyText variant="h2" style={s.emptyTitle}>
            {COPY.emptyTitle}
          </EventlyText>
          {/* Says where to change it, since the customer chose what arrives. */}
          <EventlyText variant="body" style={s.emptyBody}>
            {COPY.emptyBody}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {header}
      <ScrollView
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* One continuous list, newest first — no day headings. */}
        {items.map(item => (
          <NotificationRow key={item.id} item={item} onPress={open} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default NotificationScreen;
