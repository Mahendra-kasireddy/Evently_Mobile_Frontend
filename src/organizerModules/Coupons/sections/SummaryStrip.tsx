import { View } from 'react-native';
import { AppText } from '../../../Components';
import { COUPONS_COPY as COPY } from '../constants';
import { summaryStyles as s } from '../styles';
import type { CouponsSummary } from '../types';

/** Three numbers at a glance: what is live, how often it was used, what it cost. */
export function SummaryStrip({ summary }: { summary: CouponsSummary }) {
  const tiles = [
    { key: 'active', value: String(summary.active), label: COPY.summaryActive },
    { key: 'used', value: String(summary.timesUsed), label: COPY.summaryUsed },
    { key: 'given', value: summary.discountGiven, label: COPY.summaryGiven },
  ];
  return (
    <View style={s.row}>
      {tiles.map(t => (
        <View
          key={t.key}
          style={s.tile}
          accessible
          accessibilityLabel={`${t.label}: ${t.value}`}
        >
          <AppText
            variant="h2"
            style={s.value}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {t.value}
          </AppText>
          <AppText variant="caption" style={s.label} numberOfLines={1}>
            {t.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export default SummaryStrip;
