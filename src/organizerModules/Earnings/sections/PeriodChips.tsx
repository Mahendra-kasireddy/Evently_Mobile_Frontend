import { Pressable, View } from 'react-native';
import { AppText } from '../../../Components';
import { EARNINGS_COPY as COPY, PERIODS } from '../constants';
import { periodStyles as s } from '../styles';
import type { EarningsPeriod } from '../types';

/** This month · 3 months · All time. */
export function PeriodChips({
  period,
  onChange,
}: {
  period: EarningsPeriod;
  onChange: (period: EarningsPeriod) => void;
}) {
  return (
    <View style={s.row} accessibilityRole="tablist">
      {PERIODS.map(p => {
        const on = p === period;
        return (
          <Pressable
            key={p}
            style={[s.chip, on && s.chipOn]}
            onPress={() => onChange(p)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
          >
            <AppText variant="bodySmall" style={[s.text, on && s.textOn]}>
              {COPY.periods[p]}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default PeriodChips;
