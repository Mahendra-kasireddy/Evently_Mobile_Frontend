import { useEffect, useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, AppText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import {
  PUBLIC_EVENTS_COPY,
  formatPrice,
  ticketAvailability,
} from './constants';
import { useEventDetail } from './hooks';
import { EventMini } from './sections/ui';
import { PE_ACCENT, PE_NAVY } from './styles';
import { selectUi as s, ui } from './ui.styles';

type Nav = NativeStackNavigationProp<
  RootStackParamList,
  'EventTicketSelection'
>;
type Route = RouteProp<RootStackParamList, 'EventTicketSelection'>;

/**
 * 4 — Choosing tickets.
 *
 * One ticket type per booking, because that is what the server books: picking
 * a quantity on a second type moves the choice there rather than building a
 * basket the checkout could not honour. Every limit shown is the server's —
 * what is left, and the most this customer may take.
 */
export function EventTicketSelectionScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { data, loading, error, refetch } = useEventDetail(params.eventId);

  const [typeId, setTypeId] = useState<string | null>(
    params.ticketTypeId ?? null,
  );
  const [quantity, setQuantity] = useState(params.ticketTypeId ? 1 : 0);

  /* With a single ticket type there is no choice to make: it starts selected,
     one seat, so the customer only adjusts the count. */
  const buyableTypes = (data?.ticketTypes ?? []).filter(
    t => t.onSale && t.maxForYou > 0 && data?.canBook,
  );
  const onlyTypeId = buyableTypes.length === 1 ? buyableTypes[0].id : null;
  useEffect(() => {
    if (onlyTypeId && typeId === null) {
      setTypeId(onlyTypeId);
      setQuantity(1);
    }
    // Only when the data first lands, not every time the count goes to zero.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyTypeId]);

  if (loading && !data) {
    return (
      <SafeAreaView style={[ui.screen, ui.centre]} edges={['top']}>
        <ActivityIndicator size="large" color={PE_ACCENT} />
      </SafeAreaView>
    );
  }
  if (error || !data) {
    return (
      <SafeAreaView style={ui.screen} edges={['top']}>
        <AppHeader title="Select Tickets" onBackPress={navigation.goBack} />
        <View style={ui.centre}>
          <AppText variant="body" style={ui.muted}>
            {error?.message ?? 'We could not load the tickets.'}
          </AppText>
          <TouchableOpacity style={[ui.outline, ui.retry]} onPress={refetch}>
            <AppText variant="body" style={ui.outlineText}>
              {PUBLIC_EVENTS_COPY.retry}
            </AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const chosen = data.ticketTypes.find(t => t.id === typeId) ?? null;
  const count = chosen ? quantity : 0;
  const total = chosen ? chosen.price * count : 0;
  const venue = [data.venue?.name, data.venue?.city].filter(Boolean).join(', ');

  const change = (id: string, max: number, delta: number) => {
    if (id !== typeId) {
      // A different type: the choice moves there, starting from one.
      if (delta > 0) {
        setTypeId(id);
        setQuantity(1);
      }
      return;
    }
    const next = Math.max(0, Math.min(max, quantity + delta));
    setQuantity(next);
    if (next === 0) setTypeId(null);
  };

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <AppHeader title="Select Tickets" onBackPress={navigation.goBack} />
      <ScrollView
        contentContainerStyle={ui.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={ui.card}>
          <EventMini
            coverUrl={data.coverUrl}
            title={data.title}
            startDateTime={data.startDateTime}
            timezone={data.timezone}
            venue={venue}
          />
        </View>

        <AppText variant="body" style={[ui.cardTitle, ui.gapTop]}>
          Available Tickets
        </AppText>

        {data.ticketTypes.length === 0 ? (
          <AppText variant="body" style={ui.muted}>
            No tickets are listed for this event yet.
          </AppText>
        ) : null}

        {data.ticketTypes.map(option => {
          const buyable = option.onSale && option.maxForYou > 0 && data.canBook;
          const on = option.id === typeId && count > 0;
          const n = on ? count : 0;
          return (
            <View
              key={option.id}
              style={[s.option, on && s.optionOn, !buyable && s.optionOff]}
              testID={`ticket-type-${option.id}`}
            >
              <View style={s.head}>
                <AppText variant="h3" style={s.name} numberOfLines={2}>
                  {option.name}
                </AppText>
                <AppText variant="h3" style={s.price}>
                  {formatPrice(option.price)}
                </AppText>
              </View>
              {option.description ? (
                <AppText variant="caption" style={s.note}>
                  {option.description}
                </AppText>
              ) : null}

              <View style={s.foot}>
                <AppText variant="caption" style={buyable ? s.left : s.note}>
                  {ticketAvailability(option, data.timezone)}
                </AppText>
                {buyable ? (
                  <View style={s.stepper}>
                    <TouchableOpacity
                      style={s.stepBtn}
                      disabled={n === 0}
                      onPress={() => change(option.id, option.maxForYou, -1)}
                      accessibilityRole="button"
                      accessibilityLabel={`One fewer ${option.name} ticket`}
                    >
                      <EventlyIcon name="minus" size={16} color={PE_NAVY} />
                    </TouchableOpacity>
                    <AppText variant="h3" style={s.count}>
                      {n}
                    </AppText>
                    <TouchableOpacity
                      style={[s.stepBtn, s.stepBtnOn]}
                      disabled={n >= option.maxForYou}
                      onPress={() => change(option.id, option.maxForYou, 1)}
                      accessibilityRole="button"
                      accessibilityLabel={`One more ${option.name} ticket`}
                    >
                      <EventlyIcon name="plus" size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={s.stateTag}>
                    <AppText variant="label" style={s.stateTagText}>
                      {option.available <= 0
                        ? 'Sold Out'
                        : option.onSale && option.maxForYou <= 0
                        ? 'Limit Reached'
                        : 'Unavailable'}
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[ui.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {chosen && count > 0 ? (
          <View style={s.sumRow}>
            <AppText variant="label" style={s.sumLabel}>
              {`${count} × ${chosen.name}`}
            </AppText>
            <AppText variant="bodySmall" style={s.sumValue}>
              {formatPrice(total)}
            </AppText>
          </View>
        ) : null}
        <View style={s.sumRow}>
          <AppText variant="h3" style={s.totalLabel}>
            Total Amount
          </AppText>
          <AppText variant="h3" style={s.totalValue}>
            {chosen && count > 0 ? formatPrice(total) : '—'}
          </AppText>
        </View>
        <TouchableOpacity
          style={[ui.primary, !(chosen && count > 0) && ui.primaryOff]}
          disabled={!(chosen && count > 0)}
          onPress={() =>
            chosen &&
            navigation.navigate('EventCheckout', {
              eventId: data.id,
              ticketTypeId: chosen.id,
              quantity: count,
            })
          }
          accessibilityRole="button"
          testID="continue-to-payment"
        >
          <AppText variant="h3" style={ui.primaryText}>
            Continue to Payment
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default EventTicketSelectionScreen;
