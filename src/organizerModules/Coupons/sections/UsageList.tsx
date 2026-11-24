import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { COUPONS_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { styles as base, usageStyles as s } from '../styles';
import type { UsageRowModel } from '../types';

/** Who used a coupon, on which booking, and what it took off. Hidden while empty. */
export function UsageList({ rows }: { rows: UsageRowModel[] }) {
  if (rows.length === 0) return null;
  return (
    <View style={base.section}>
      <AppText variant="h3" style={base.sectionTitle}>
        {COPY.usageTitle}
      </AppText>
      <View style={s.card}>
        {rows.map((r, i) => (
          <View
            key={r.id}
            style={[s.row, i > 0 && s.divider]}
            accessible
            accessibilityLabel={[
              r.customer,
              r.code,
              r.discount,
              r.date,
              r.reversed ? COPY.reversed : '',
            ]
              .filter(Boolean)
              .join(', ')}
          >
            <View style={[s.icon, r.reversed && s.iconReversed]}>
              <EventlyIcon
                name={r.reversed ? 'undo-variant' : 'ticket-percent-outline'}
                size={18}
                color={r.reversed ? ORG_INK.inkFaint : ORG_ACCENT.saffron}
              />
            </View>
            <View style={s.body}>
              <AppText variant="body" style={s.name} numberOfLines={1}>
                {r.customer}
              </AppText>
              <AppText variant="caption" style={s.meta} numberOfLines={1}>
                {[r.code, r.booking, r.reversed ? COPY.reversed : '']
                  .filter(Boolean)
                  .join(' · ')}
              </AppText>
            </View>
            <View style={s.side}>
              <AppText
                variant="body"
                style={[s.amount, r.reversed && s.amountReversed]}
              >
                {r.discount}
              </AppText>
              <AppText variant="label" style={s.date}>
                {r.date}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default UsageList;
