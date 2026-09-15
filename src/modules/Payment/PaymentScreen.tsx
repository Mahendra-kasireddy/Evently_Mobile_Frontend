import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import { useOpenWithOrganizer } from '../Chat';
import type { RootStackParamList } from '../../navigation/types';
import { PAYMENT_COPY as COPY, PAY_ACCENT, PAY_GREEN, PAY_NAVY_DEEP, PAY_OPTIONS } from './constants';
import { usePaymentContainer } from './container';
import { styles as s } from './styles';
import type { PaidBookingDTO, PayOption } from './types';

type PaymentRouteProp = RouteProp<RootStackParamList, 'Payment'>;
type PaymentNavigationProp = NativeStackNavigationProp<RootStackParamList>;

function MethodRow({
  option,
  selected,
  onPress,
}: {
  option: PayOption;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.option, selected && s.optionOn]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${option.label}. ${option.hint}`}
    >
      <View style={s.optionIcon}>
        <EventlyIcon name={option.icon} size={20} color={PAY_NAVY_DEEP} />
      </View>
      <View style={s.optionText}>
        <EventlyText variant="subtitle" style={s.optionLabel}>
          {option.label}
        </EventlyText>
        <EventlyText variant="caption" style={s.optionHint}>
          {option.hint}
        </EventlyText>
      </View>
      <View style={[s.radio, selected && s.radioOn]}>{selected ? <View style={s.radioDot} /> : null}</View>
    </TouchableOpacity>
  );
}

/**
 * Paying the advance.
 *
 * The amount is not this screen's to decide: it arrives priced from the server,
 * which reads the quotation, re-checks the coupon and works out the advance. A
 * screen that multiplied a percentage itself could show a number the booking
 * would not honour.
 *
 * The method picked here is passed to Razorpay as the method its sheet opens
 * on, so choosing UPI means landing on UPI rather than on a menu.
 *
 * There is also a way not to pay yet. A customer who wants to settle details
 * before committing money can open the thread with the organizer; the quote
 * stays accepted and payable, and they come back when they are ready.
 */
export function PaymentScreen() {
  const navigation = useNavigation<PaymentNavigationProp>();
  const { params } = useRoute<PaymentRouteProp>();
  const openThread = useOpenWithOrganizer();

  const onPaid = useCallback(
    (booking: PaidBookingDTO) =>
      /*
       * `replace`, not `navigate`: once the advance is paid there is nothing to
       * go back to. The payment screen would re-price a quotation that has
       * already been booked.
       */
      navigation.replace('PaymentSuccess', {
        bookingId: booking.id,
        organizerName: booking.organizer?.name ?? '',
      }),
    [navigation],
  );

  const c = usePaymentContainer(params.quotationId, params.couponCode, onPaid);

  const messageOrganizer = () => {
    if (!params.organizerId || openThread.loading) return;
    openThread
      .execute(params.organizerId)
      .then((conversation) =>
        navigation.navigate('Conversation', {
          conversationId: conversation.id,
          withName: c.organizerName,
        }),
      )
      .catch(() => {
        // Captured in openThread.error; tapping again is the better recovery.
      });
  };

  const header = (
    <View style={s.header}>
      <TouchableOpacity
        style={s.back}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <EventlyIcon name="chevron-left" size={24} color={PAY_NAVY_DEEP} />
      </TouchableOpacity>
      <EventlyText variant="h1" style={s.title}>
        {COPY.title}
      </EventlyText>
    </View>
  );

  if (c.isLoading && !c.model) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <ActivityIndicator size="large" color={PAY_ACCENT} />
          <EventlyText variant="body" style={s.centeredText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (!c.model) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <EventlyText variant="h2" style={s.errorTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.centeredText}>
            {c.errorMessage ?? COPY.unavailable}
          </EventlyText>
          <TouchableOpacity
            style={s.retry}
            activeOpacity={0.8}
            onPress={c.refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={PAY_ACCENT} />
            <EventlyText variant="caption" style={s.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {header}

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.amountCard}>
          <EventlyText variant="caption" style={s.eyebrow}>
            {c.model.eyebrow}
          </EventlyText>
          <EventlyText variant="h1" style={s.amount}>
            {c.model.advanceLabel}
          </EventlyText>
          <EventlyText variant="body" style={s.totalLine}>
            {c.model.totalLine}
          </EventlyText>
          {/* Only when a coupon actually moved the total — a discounted price
              that does not say why looks like a mistake. */}
          {c.model.couponLine ? (
            <EventlyText variant="caption" style={s.couponLine}>
              {c.model.couponLine}
            </EventlyText>
          ) : null}
        </View>

        <EventlyText variant="h2" style={s.sectionTitle}>
          {COPY.payWith}
        </EventlyText>
        {PAY_OPTIONS.map((option) => (
          <MethodRow
            key={option.id}
            option={option}
            selected={c.method === option.id}
            onPress={() => c.setMethod(option.id)}
          />
        ))}

        <View style={s.assurance}>
          <EventlyIcon name="shield-check-outline" size={18} color={PAY_GREEN} />
          <EventlyText variant="caption" style={s.assuranceText}>
            {COPY.assurance}
          </EventlyText>
        </View>

        {/* Dropped when the quote carries no organizer to message. */}
        {params.organizerId ? (
          <>
            <TouchableOpacity
              style={s.talk}
              activeOpacity={0.7}
              onPress={messageOrganizer}
              accessibilityRole="button"
              accessibilityLabel={COPY.talkFirst}
            >
              <EventlyIcon name="chat-outline" size={18} color={PAY_ACCENT} />
              <EventlyText variant="subtitle" style={s.talkText}>
                {COPY.talkFirst}
              </EventlyText>
            </TouchableOpacity>
            <EventlyText variant="caption" style={s.talkHint}>
              {COPY.talkFirstHint}
            </EventlyText>
          </>
        ) : null}
      </ScrollView>

      <View style={s.foot}>
        {c.payError ? (
          <EventlyText variant="caption" style={s.payError}>
            {c.payError}
          </EventlyText>
        ) : null}
        <TouchableOpacity
          style={[s.pay, c.isPaying && s.payDisabled]}
          activeOpacity={0.85}
          disabled={c.isPaying}
          onPress={c.pay}
          accessibilityRole="button"
          accessibilityLabel={c.model.ctaLabel}
        >
          <EventlyText variant="subtitle" style={s.payText}>
            {c.isPaying ? 'Working…' : c.model.ctaLabel}
          </EventlyText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default PaymentScreen;
