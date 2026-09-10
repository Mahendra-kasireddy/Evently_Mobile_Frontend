import { TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { PAYMENTS_COPY as COPY } from '../constants';
import { paymentRowStyles as s } from '../styles';
import type { PaymentItem } from '../types';

interface PaymentRowProps {
  item: PaymentItem;
  /** Opens this event's workspace, where the payment actually happens. */
  onPress: () => void;
}

/** One figure, when the booking carries it. */
function Figure({ label, value, due }: { label: string; value: string; due?: boolean }) {
  if (!value) return null;
  return (
    <View style={s.figure}>
      <EventlyText variant="caption" style={s.figureLabel}>
        {label}
      </EventlyText>
      <EventlyText variant="body" style={[s.figureValue, due && s.figureValueDue]}>
        {value}
      </EventlyText>
    </View>
  );
}

/**
 * One event's money.
 *
 * Agreed, paid and still due sit side by side because the third only means
 * anything against the first two — a balance shown alone tells the customer
 * what they owe but not whether that is most of the bill or the last of it.
 * A settled event keeps its row as a record, in green rather than accent, and
 * drops the "still due" column entirely.
 */
export function PaymentRow({ item, onPress }: PaymentRowProps) {
  const meta = [item.ref, item.organizerName ?? COPY.organizerTbd, item.eventDateLabel]
    .filter(Boolean)
    .join(' · ');

  return (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        item.settled
          ? `${item.title}. ${COPY.settled}, ${item.agreedLabel}.`
          : `${item.title}. ${item.dueLabel} ${COPY.due.toLowerCase()} of ${item.agreedLabel}.`
      }
    >
      <View style={s.head}>
        <View style={s.headText}>
          <EventlyText variant="subtitle" style={s.title} numberOfLines={2}>
            {item.title}
          </EventlyText>
          <EventlyText variant="caption" style={s.meta} numberOfLines={2}>
            {meta}
          </EventlyText>
        </View>
        <View style={[s.chip, item.settled ? s.chipSettled : s.chipDue]}>
          <EventlyText
            variant="caption"
            style={[s.chipText, item.settled ? s.chipTextSettled : s.chipTextDue]}
            numberOfLines={1}
          >
            {(item.settled ? COPY.settled : item.statusLabel).toUpperCase()}
          </EventlyText>
        </View>
      </View>

      <View style={s.track}>
        <View
          style={[s.fill, item.settled && s.fillSettled, { width: `${item.paidPercent}%` }]}
        />
      </View>

      <View style={s.figures}>
        <Figure label={COPY.agreed} value={item.agreedLabel} />
        <Figure label={COPY.paid} value={item.paidLabel} />
        {/* No "still due" column on an event that owes nothing. */}
        {item.settled ? null : <Figure label={COPY.due} value={item.dueLabel} due />}
      </View>
    </TouchableOpacity>
  );
}

export default PaymentRow;
