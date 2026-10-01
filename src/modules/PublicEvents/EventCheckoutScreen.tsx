import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
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
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { PUBLIC_EVENTS_COPY, formatPrice, initialsOf } from './constants';
import { useCustomerContact, useEventDetail } from './hooks';
import { useTicketPurchase } from './booking';
import { EventMini } from './sections/ui';
import { PE_ACCENT } from './styles';
import { checkoutUi as s, selectUi as sum, ui } from './ui.styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EventCheckout'>;
type Route = RouteProp<RootStackParamList, 'EventCheckout'>;

function KeyValue({ k, v }: { k: string; v: string }) {
  return (
    <View style={s.kv}>
      <EventlyText variant="caption" style={s.key}>
        {k}
      </EventlyText>
      <EventlyText variant="caption" style={s.value}>
        {v}
      </EventlyText>
    </View>
  );
}

/**
 * 5 — Checkout.
 *
 * A summary, and one button. The figures here are this screen's arithmetic on
 * the server's prices; what is actually charged is priced again by the server
 * when the seats are held, and the payment sheet shows that amount.
 */
export function EventCheckoutScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { data, loading, error, refetch } = useEventDetail(params.eventId);
  const contact = useCustomerContact();
  const purchase = useTicketPurchase();

  if (loading && !data) {
    return (
      <SafeAreaView style={[ui.screen, ui.centre]} edges={['top']}>
        <ActivityIndicator size="large" color={PE_ACCENT} />
      </SafeAreaView>
    );
  }

  const ticket =
    data?.ticketTypes.find(t => t.id === params.ticketTypeId) ?? null;

  if (error || !data || !ticket) {
    return (
      <SafeAreaView style={ui.screen} edges={['top']}>
        <AppHeader title="Checkout" onBackPress={navigation.goBack} />
        <View style={ui.centre}>
          <EventlyText variant="body" style={ui.muted}>
            {error?.message ?? 'That ticket is no longer available.'}
          </EventlyText>
          <TouchableOpacity style={[ui.outline, ui.retry]} onPress={refetch}>
            <EventlyText variant="body" style={ui.outlineText}>
              {PUBLIC_EVENTS_COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const quantity = params.quantity;
  const total = ticket.price * quantity;
  const free = total <= 0;
  const venue = [data.venue?.name, data.venue?.city].filter(Boolean).join(', ');
  const person = contact.data ?? {};

  const pay = async () => {
    const booked = await purchase.buy(data.id, ticket.id, quantity, data.title);
    if (booked && booked.ticketIds.length > 0) {
      const success = {
        name: 'EventBookingSuccess' as const,
        params: {
          eventId: data.id,
          reference: booked.reference,
          ticketIds: booked.ticketIds,
          quantity: booked.quantity || quantity,
          amount: booked.amount,
          ticketTypeName: ticket.name,
        },
      };
      /*
       * The purchase is over, so its screens leave the stack: ticket
       * selection and this checkout are both taken out, and success sits
       * straight on top of the event. Otherwise Back from the ticket — or
       * from My Tickets — lands on "Select Tickets" for seats already bought.
       */
      navigation.dispatch(state => {
        const kept = state.routes.filter(
          r => r.name !== 'EventTicketSelection' && r.name !== 'EventCheckout',
        );
        const routes = [...kept, success];
        return CommonActions.reset({ ...state, routes, index: routes.length - 1 });
      });
    }
  };

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <AppHeader title="Checkout" onBackPress={navigation.goBack} />
      <ScrollView
        contentContainerStyle={ui.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={ui.card}>
          <EventlyText variant="subtitle" style={ui.cardTitle}>
            Event Details
          </EventlyText>
          <EventMini
            coverUrl={data.coverUrl}
            title={data.title}
            startDateTime={data.startDateTime}
            timezone={data.timezone}
            venue={venue}
          />
        </View>

        <View style={ui.card}>
          <EventlyText variant="subtitle" style={ui.cardTitle}>
            Ticket Details
          </EventlyText>
          <KeyValue k={ticket.name} v={formatPrice(ticket.price)} />
          <KeyValue k="Quantity" v={String(quantity)} />
        </View>

        <View style={ui.card}>
          <EventlyText variant="subtitle" style={ui.cardTitle}>
            Customer Details
          </EventlyText>
          <View style={s.customer}>
            <View style={s.avatar}>
              <EventlyText variant="caption" style={s.avatarText}>
                {initialsOf(person.name ?? '')}
              </EventlyText>
            </View>
            <View style={ui.flex}>
              <EventlyText
                variant="body"
                style={s.customerName}
                numberOfLines={1}
              >
                {person.name || 'You'}
              </EventlyText>
              {person.email || person.phone ? (
                <EventlyText
                  variant="caption"
                  style={ui.muted}
                  numberOfLines={1}
                >
                  {person.email || person.phone}
                </EventlyText>
              ) : null}
            </View>
          </View>
        </View>

        <View style={ui.card}>
          <EventlyText variant="subtitle" style={ui.cardTitle}>
            Price Summary
          </EventlyText>
          <KeyValue
            k={`Subtotal (${quantity} × ${formatPrice(ticket.price)})`}
            v={formatPrice(total)}
          />
          <View style={ui.divider} />
          <View style={sum.sumRow}>
            <EventlyText variant="body" style={sum.totalLabel}>
              Total Amount
            </EventlyText>
            <EventlyText variant="body" style={sum.totalValue}>
              {formatPrice(total)}
            </EventlyText>
          </View>
        </View>

        {free ? null : (
          <View style={ui.card}>
            <EventlyText variant="subtitle" style={ui.cardTitle}>
              Payment Method
            </EventlyText>
            <View style={s.method}>
              <View style={s.methodIcon}>
                <EventlyIcon
                  name="credit-card-outline"
                  size={18}
                  color="#3b6fd8"
                />
              </View>
              <View style={s.methodText}>
                <EventlyText variant="body" style={s.methodTitle}>
                  UPI / Cards / Netbanking
                </EventlyText>
                <EventlyText variant="caption" style={ui.muted}>
                  Secure payment via Razorpay
                </EventlyText>
              </View>
              <EventlyIcon
                name="shield-check-outline"
                size={18}
                color="#1d9e75"
              />
            </View>
          </View>
        )}

        {purchase.error ? (
          <EventlyText variant="caption" style={ui.error}>
            {purchase.error}
          </EventlyText>
        ) : null}
      </ScrollView>

      <View style={[ui.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={[ui.primary, purchase.busy && ui.primaryOff]}
          disabled={purchase.busy}
          onPress={() => {
            pay().catch(() => undefined);
          }}
          accessibilityRole="button"
          testID="pay-now"
        >
          {purchase.busy ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <EventlyText variant="body" style={ui.primaryText}>
              {free ? 'Confirm Booking' : `Pay ${formatPrice(total)}`}
            </EventlyText>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default EventCheckoutScreen;
