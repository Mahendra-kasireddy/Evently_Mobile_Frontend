import { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { HERO_ACCENT_COLOR, SEE_ALL_COPY } from './constants';
import { useHomeFeed } from './hooks';
import { EventRow } from './sections/EventRow';
import { OfferCard } from './sections/Offers';
import { CouponSheet } from './sections/CouponSheet';
import { seeAllStyles as s, styles } from './styles';
import { useOpenEvent } from './useOpenEvent';
import { mapAllEvents, mapCoupons } from './utils';
import type { CouponOffer } from './types';

type SeeAllRouteProp = RouteProp<RootStackParamList, 'SeeAll'>;

/**
 * One Home section, in full.
 *
 * Every section on Home is a preview — the events stop at three, the offers
 * are a carousel most of which is off screen — and each "See all" used to need
 * a destination of its own or, worse, opened one that could not show what it
 * promised. One screen, told which section it is showing.
 *
 * It reads the same feed Home does rather than taking a list through
 * navigation params: a list handed over at tap time is a snapshot, and coming
 * back to it after acting on something would show the state it was in when the
 * customer left.
 */
export function SeeAllScreen() {
  const { params } = useRoute<SeeAllRouteProp>();
  const kind = params.kind;
  const { data, loading, error, refetch } = useHomeFeed();
  const openEvent = useOpenEvent();
  const [openCoupon, setOpenCoupon] = useState<CouponOffer | null>(null);

  const copy = SEE_ALL_COPY[kind];
  const events = kind === 'events' && data ? mapAllEvents(data) : [];
  const offers = kind === 'offers' && data ? mapCoupons(data)?.items ?? [] : [];
  const count = kind === 'events' ? events.length : offers.length;

  const header = <AppHeader title={copy.title} compact />;

  if (loading && count === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={HERO_ACCENT_COLOR} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && count === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <EventlyText variant="body" style={styles.errorText}>
            {error.message}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  const listHeader = count ? (
    <EventlyText variant="caption" style={s.count}>
      {count === 1 ? copy.countOne : `${count} ${copy.countMany}`}
    </EventlyText>
  ) : null;

  const empty = (
    <View style={styles.centered}>
      <EventlyText variant="h2" style={s.emptyTitle}>
        {copy.emptyTitle}
      </EventlyText>
      <EventlyText variant="body" style={s.emptyBody}>
        {copy.emptyBody}
      </EventlyText>
    </View>
  );

  const refresh = <RefreshControl refreshing={loading} onRefresh={refetch} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}

      {kind === 'events' ? (
        <FlatList
          data={events}
          keyExtractor={event => `${event.source}:${event.refId}`}
          renderItem={({ item }) => (
            <EventRow event={item} onPress={() => openEvent(item)} />
          )}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          refreshControl={refresh}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={empty}
        />
      ) : (
        <FlatList
          data={offers}
          keyExtractor={offer => offer.id}
          /* The same card the carousel draws, one per row — a coupon found
             here is the same coupon, and a leaner card would be a second place
             for its code and terms to drift. */
          renderItem={({ item }) => (
            <View style={s.offerRow}>
              <OfferCard coupon={item} onPress={() => setOpenCoupon(item)} />
            </View>
          )}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          refreshControl={refresh}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={empty}
        />
      )}

      <CouponSheet coupon={openCoupon} onClose={() => setOpenCoupon(null)} />
    </SafeAreaView>
  );
}

export default SeeAllScreen;
