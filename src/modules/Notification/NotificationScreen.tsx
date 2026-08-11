import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import { useNotificationContainer } from './container';
import { NotificationRow } from './sections/NotificationRow';
import { styles } from './styles';

export function NotificationScreen() {
  const { items, isLoading, isError, errorMessage, isMarkingAllRead, markRead, markAllRead, refetch } =
    useNotificationContainer();

  const hasUnread = items.some((item) => !item.read);

  const markAllReadButton = hasUnread ? (
    <TouchableOpacity onPress={markAllRead} disabled={isMarkingAllRead}>
      <EventlyText variant="body" style={[styles.markAllRead, isMarkingAllRead && styles.markAllReadDisabled]}>
        Mark all read
      </EventlyText>
    </TouchableOpacity>
  ) : undefined;

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader title="Notifications" />
        <View style={styles.centered}>
          <EventlyText variant="body" style={styles.loadingText}>
            Loading notifications…
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader title="Notifications" />
        <View style={styles.centered}>
          <EventlyText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
          <TouchableOpacity onPress={refetch}>
            <EventlyText variant="body" style={styles.markAllRead}>
              Retry
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Notifications" rightElement={markAllReadButton} />

      {items.length === 0 ? (
        <View style={styles.centered}>
          <EventlyText variant="h2" style={styles.emptyTitle}>
            No notifications yet
          </EventlyText>
          <EventlyText variant="body" style={styles.emptySubtitle}>
            We'll let you know when something needs your attention.
          </EventlyText>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          renderItem={({ item }) => <NotificationRow item={item} onPress={markRead} />}
        />
      )}
    </SafeAreaView>
  );
}

export default NotificationScreen;
