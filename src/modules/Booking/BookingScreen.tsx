import { FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import { useBookingContainer } from './container';
import { BookingRow } from './sections/BookingRow';
import { styles } from './styles';

export function BookingScreen() {
  const { items, isLoading, isError, errorMessage, refetch } = useBookingContainer();

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader title="My Bookings" />
        <View style={styles.centered}>
          <EventlyText variant="body" style={styles.loadingText}>
            Loading your bookings…
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader title="My Bookings" />
        <View style={styles.centered}>
          <EventlyText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="My Bookings" />

      {items.length === 0 ? (
        <View style={styles.centered}>
          <EventlyText variant="h2" style={styles.emptyTitle}>
            No bookings yet
          </EventlyText>
          <EventlyText variant="body" style={styles.emptySubtitle}>
            Once you book an organizer, it'll show up here.
          </EventlyText>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          renderItem={({ item }) => <BookingRow item={item} />}
        />
      )}
    </SafeAreaView>
  );
}

export default BookingScreen;
