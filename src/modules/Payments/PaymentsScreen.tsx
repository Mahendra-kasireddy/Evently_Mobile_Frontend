import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { PAYMENTS_ACCENT, PAYMENTS_COPY as COPY, PAYMENTS_GREEN } from './constants';
import { usePaymentsContainer } from './container';
import { PaymentRow } from './sections/PaymentRow';
import { styles } from './styles';
import type { PaymentItem } from './types';

type PaymentsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * What every event has cost, and what is still owed on it.
 *
 * Read entirely from the bookings the app already fetches — there is no
 * payments endpoint, and inventing a ledger the backend does not keep would
 * mean showing figures nothing could reconcile. Paying still happens inside
 * each event's workspace, which is where every row leads.
 */
export function PaymentsScreen() {
  const navigation = useNavigation<PaymentsNavigationProp>();
  const { items, summary, isLoading, isError, errorMessage, refetch } = usePaymentsContainer();

  const openWorkspace = (item: PaymentItem) =>
    navigation.navigate('Workspace', { bookingId: item.bookingId, workspaceName: item.title });

  const header = <AppHeader title={COPY.title} compact />;

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PAYMENTS_ACCENT} />
          <EventlyText variant="body" style={styles.loadingText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <EventlyText variant="h2" style={styles.emptyTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={PAYMENTS_ACCENT} />
            <EventlyText variant="caption" style={styles.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <View style={styles.centeredIcon}>
            <EventlyIcon name="wallet-outline" size={28} color={PAYMENTS_ACCENT} />
          </View>
          <EventlyText variant="h2" style={styles.emptyTitle}>
            {COPY.emptyTitle}
          </EventlyText>
          <EventlyText variant="body" style={styles.emptyBody}>
            {COPY.emptyBody}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  const settled = summary.eventsWithBalance === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}
      <FlatList
        data={items}
        keyExtractor={(item) => item.bookingId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListHeaderComponent={
          <View style={styles.summary}>
            {settled ? (
              <>
                <View style={styles.summarySettled}>
                  <EventlyIcon name="check-circle" size={18} color={PAYMENTS_GREEN} />
                  <EventlyText variant="subtitle" style={styles.summarySettledText}>
                    {COPY.allSettled}
                  </EventlyText>
                </View>
                <EventlyText variant="caption" style={styles.summaryNote}>
                  {COPY.allSettledNote}
                </EventlyText>
              </>
            ) : (
              <>
                <EventlyText variant="caption" style={styles.summaryLabel}>
                  {COPY.outstanding}
                </EventlyText>
                <EventlyText variant="h1" style={styles.summaryValue}>
                  {summary.outstandingLabel}
                </EventlyText>
                {/* Said plainly: this is a sum, not a bill that can be paid here. */}
                <EventlyText variant="caption" style={styles.summaryNote}>
                  {COPY.outstandingNote}
                </EventlyText>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => <PaymentRow item={item} onPress={() => openWorkspace(item)} />}
      />
    </SafeAreaView>
  );
}

export default PaymentsScreen;
