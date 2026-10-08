import { useCallback } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackHandler, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Confetti,
  EventlyIcon,
  EventlyText,
  FadeInUp,
  GradientFill,
  PopIn,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { SUCCESS_COPY as COPY } from './constants';
import {
  SUCCESS_CASH_GRADIENT,
  SUCCESS_CTA_GRADIENT,
  SUCCESS_PAID_GRADIENT,
  successStyles as s,
} from './styles';

type SuccessRouteProp = RouteProp<RootStackParamList, 'PaymentSuccess'>;
type SuccessNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** "₹94,061", or '' when the amount is unknown (an older server sent none). */
function inr(amount: number | undefined): string {
  if (amount == null || !Number.isFinite(amount) || amount <= 0) return '';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/** "Sat, 12 Dec 2026" — or '' for a missing or broken date. */
function dateLabel(iso: string | null | undefined, withTime = false): string {
  if (!iso) return '';
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : { year: 'numeric' }),
  }).format(at);
}

/** One line of the receipt. */
function ReceiptRow({
  icon,
  label,
  value,
  badge,
}: {
  icon: string;
  label: string;
  value: string;
  badge?: { text: string; tone: 'paid' | 'cash' };
}) {
  return (
    <View style={s.row}>
      <View style={s.rowIcon}>
        <EventlyIcon name={icon} size={16} color="#7c5cdb" />
      </View>
      <EventlyText variant="body" style={s.rowLabel}>
        {label}
      </EventlyText>
      <View style={s.rowRight}>
        <EventlyText variant="subtitle" style={s.rowValue} numberOfLines={1}>
          {value}
        </EventlyText>
        {badge ? (
          <View style={[s.badge, badge.tone === 'paid' ? s.badgePaid : s.badgeCash]}>
            <EventlyText variant="caption" style={[s.badgeText, badge.tone === 'paid' ? s.badgeTextPaid : s.badgeTextCash]}>
              {badge.text}
            </EventlyText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/**
 * The receipt.
 *
 * There is no way back from here, by design. Behind this screen is a payment
 * form for a quotation that has now been booked, and "back" onto it would
 * offer to charge the customer a second time — so the hardware back button is
 * sent Home, and there is no back control in the header.
 *
 * It celebrates, then gets practical: what was booked (from the booking the
 * server just wrote — nothing re-priced here), whether the advance is paid or
 * still owed in cash, and the three things that happen next. The main action
 * leads into the workspace, which is where the event is run from now on.
 */
export function PaymentSuccessScreen() {
  const navigation = useNavigation<SuccessNavigationProp>();
  const { params } = useRoute<SuccessRouteProp>();

  /**
   * Home is the whole history from here.
   *
   * `reset` rather than `navigate`, so whatever the customer does next — back
   * out of the workspace, press the hardware back — lands on Home rather than
   * on the payment form behind this screen.
   */
  const goHome = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        goHome();
        return true;
      });
      return () => subscription.remove();
    }, [goHome]),
  );

  const openWorkspace = () => {
    /* Home first, then the workspace on top of it: backing out of the
       workspace should land on Home, not on a paid-for payment form. */
    navigation.reset({
      index: 1,
      routes: [{ name: 'Main' }, { name: 'Workspace', params: { bookingId: params.bookingId } }],
    });
  };

  const organizer = params.organizerName?.trim() || 'Your organizer';
  const inCash = params.inCash === true;
  const advance = inr(params.advanceAmount);
  const balance = inr(params.balanceAmount);
  const eventDate = dateLabel(params.eventDate);
  const respondBy = dateLabel(params.respondBy, true);
  const steps = inCash
    ? COPY.next.cash(organizer, advance, respondBy)
    : COPY.next.online(organizer, balance, respondBy);
  const hasReceipt = Boolean(params.title || eventDate || params.location || advance || balance);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {/* A soft wash of colour behind the celebration. */}
      <View style={s.wash} pointerEvents="none">
        <GradientFill
          colors={inCash ? SUCCESS_CASH_GRADIENT : SUCCESS_PAID_GRADIENT}
          opacities={[0.22, 0]}
          direction="down"
        />
      </View>
      <View style={s.confetti} pointerEvents="none">
        <Confetti />
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <PopIn>
          <View style={s.badgeRing}>
            <View style={s.tick}>
              <GradientFill colors={inCash ? SUCCESS_CASH_GRADIENT : SUCCESS_PAID_GRADIENT} direction="diagonal" />
              <EventlyIcon name={inCash ? 'cash-check' : 'check-bold'} size={44} color="#ffffff" />
            </View>
          </View>
        </PopIn>

        <FadeInUp delay={120}>
          <EventlyText variant="h1" style={s.heading} accessibilityRole="header">
            {inCash ? COPY.cashHeading : COPY.heading}
          </EventlyText>
          <EventlyText variant="body" style={s.text}>
            {inCash ? COPY.cashBody(organizer) : COPY.body(organizer)}
          </EventlyText>
          {params.ref ? (
            <View style={s.refChip}>
              <EventlyIcon name="ticket-confirmation-outline" size={14} color="#7c5cdb" />
              <EventlyText variant="caption" style={s.refText}>
                {params.ref}
              </EventlyText>
            </View>
          ) : null}
        </FadeInUp>

        {hasReceipt ? (
          <FadeInUp delay={220} style={s.receipt}>
            {params.title ? (
              <EventlyText variant="subtitle" style={s.receiptTitle} numberOfLines={2}>
                {params.title}
              </EventlyText>
            ) : null}
            {eventDate ? <ReceiptRow icon="calendar-blank-outline" label={COPY.date} value={eventDate} /> : null}
            {params.location ? (
              <ReceiptRow icon="map-marker-outline" label={COPY.venue} value={params.location} />
            ) : null}
            {advance ? (
              <ReceiptRow
                icon={inCash ? 'cash' : 'credit-card-check-outline'}
                label={COPY.advance}
                value={advance}
                badge={inCash ? { text: COPY.payInCash, tone: 'cash' } : { text: COPY.paid, tone: 'paid' }}
              />
            ) : null}
            {balance ? <ReceiptRow icon="wallet-outline" label={COPY.balance} value={balance} /> : null}
          </FadeInUp>
        ) : null}

        <FadeInUp delay={320} style={s.next}>
          <EventlyText variant="subtitle" style={s.nextTitle}>
            {COPY.nextTitle}
          </EventlyText>
          {steps.map((step, i) => (
            <View key={step.title} style={s.step}>
              <View style={s.stepRail}>
                <View style={s.stepDot}>
                  <GradientFill colors={SUCCESS_CTA_GRADIENT} direction="diagonal" />
                  <EventlyIcon name={step.icon} size={14} color="#ffffff" />
                </View>
                {i < steps.length - 1 ? <View style={s.stepLine} /> : null}
              </View>
              <View style={s.stepText}>
                <EventlyText variant="subtitle" style={s.stepTitle}>
                  {step.title}
                </EventlyText>
                <EventlyText variant="caption" style={s.stepBody}>
                  {step.body}
                </EventlyText>
              </View>
            </View>
          ))}
        </FadeInUp>
      </ScrollView>

      <View style={s.foot}>
        <TouchableOpacity
          style={s.cta}
          activeOpacity={0.85}
          onPress={openWorkspace}
          accessibilityRole="button"
          accessibilityLabel={COPY.cta}
        >
          <GradientFill colors={SUCCESS_CTA_GRADIENT} direction="across" />
          <EventlyText variant="subtitle" style={s.ctaText}>
            {COPY.cta}
          </EventlyText>
          <View style={s.ctaArrow}>
            <EventlyIcon name="arrow-right" size={18} color="#ffffff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondary} onPress={goHome} accessibilityRole="button">
          <EventlyText variant="body" style={s.secondaryText}>
            {COPY.home}
          </EventlyText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default PaymentSuccessScreen;
