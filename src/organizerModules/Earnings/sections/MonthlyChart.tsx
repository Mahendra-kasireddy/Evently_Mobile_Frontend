import { View } from 'react-native';
import { AppText, GradientFill } from '../../../Components';
import { EARNINGS_COPY as COPY } from '../constants';
import { ORG_ACTION_GRADIENT } from '../design';
import { CHART_HEIGHT, chartStyles as s, styles as base } from '../styles';
import type { MonthBar } from '../types';

/** Six months of bookings as bars; this month in the action colour, with its total. */
export function MonthlyChart({ bars }: { bars: MonthBar[] }) {
  const empty = bars.every(b => b.amount <= 0);
  return (
    <View style={base.card}>
      <AppText variant="h3" style={base.sectionTitle}>
        {COPY.monthly}
      </AppText>
      {empty ? (
        <AppText variant="bodySmall" style={s.empty}>
          {COPY.monthlyEmpty}
        </AppText>
      ) : (
        <View style={s.bars}>
          {bars.map(bar => (
            <View
              key={bar.label}
              style={s.col}
              accessible
              accessibilityLabel={`${bar.label}: ${bar.short || '₹0'}`}
            >
              {bar.current && bar.short ? (
                <AppText variant="label" style={s.top}>
                  {bar.short}
                </AppText>
              ) : null}
              <View
                style={[
                  s.bar,
                  {
                    height: Math.max(6, Math.round(bar.height * CHART_HEIGHT)),
                  },
                ]}
              >
                {bar.current ? (
                  <GradientFill colors={ORG_ACTION_GRADIENT} direction="down" />
                ) : null}
              </View>
              <AppText
                variant="label"
                style={[s.label, bar.current && s.labelOn]}
              >
                {bar.label}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default MonthlyChart;
