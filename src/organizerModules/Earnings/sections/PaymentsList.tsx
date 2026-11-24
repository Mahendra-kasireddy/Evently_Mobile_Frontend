import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { EARNINGS_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { paymentStyles as s, styles as base } from '../styles';
import type { PaymentItem } from '../types';

/** Every booking in the period: what it was worth, what the organizer gets, and whether it is paid out. */
export function PaymentsList({
  payments,
  hasAny,
}: {
  payments: PaymentItem[];
  hasAny: boolean;
}) {
  return (
    <View style={base.section}>
      <AppText variant="h3" style={base.sectionTitle}>
        {COPY.payments}
      </AppText>
      {payments.length === 0 ? (
        <View style={s.empty}>
          <EventlyIcon
            name="wallet-outline"
            size={26}
            color={ORG_INK.inkFaint}
          />
          <AppText variant="body" style={s.emptyTitle}>
            {hasAny ? COPY.paymentsEmpty : COPY.noneTitle}
          </AppText>
          <AppText variant="caption" style={base.muted}>
            {hasAny ? COPY.paymentsEmptyHint : COPY.noneBody}
          </AppText>
        </View>
      ) : (
        <View style={s.card}>
          {payments.map((p, i) => (
            <View
              key={p.id}
              style={[s.row, i > 0 && s.divider]}
              accessible
              accessibilityLabel={`${p.customerName}, ${p.amount}, ${
                p.paid ? COPY.paid : COPY.pendingChip
              }`}
            >
              <View style={[s.icon, p.paid ? s.iconPaid : s.iconPending]}>
                <EventlyIcon
                  name={p.paid ? 'check' : 'clock-outline'}
                  size={18}
                  color={p.paid ? ORG_ACCENT.jade : ORG_ACCENT.saffron}
                />
              </View>
              <View style={s.body}>
                <AppText variant="body" style={s.name} numberOfLines={1}>
                  {p.customerName}
                </AppText>
                <AppText variant="caption" style={s.meta} numberOfLines={1}>
                  {[p.ref, p.date].filter(Boolean).join(' · ')}
                </AppText>
              </View>
              <View style={s.side}>
                <AppText variant="body" style={s.amount}>
                  {p.amount}
                </AppText>
                <AppText variant="label" style={s.net}>
                  {p.net}
                </AppText>
                <View style={[s.chip, p.paid ? s.chipPaid : s.chipPending]}>
                  <AppText
                    variant="label"
                    style={[
                      s.chipText,
                      p.paid ? s.chipTextPaid : s.chipTextPending,
                    ]}
                  >
                    {p.paid ? COPY.paid : COPY.pendingChip}
                  </AppText>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default PaymentsList;
