import { View } from 'react-native';
import { AppText } from '../../../Components';
import { EARNINGS_COPY as COPY } from '../constants';
import { chartStyles as s, styles as base } from '../styles';
import type { MixSlice } from '../types';

/** Which occasions the bookings come from: one stacked bar and its legend. */
export function EventMix({ slices }: { slices: MixSlice[] }) {
  return (
    <View style={base.card}>
      <AppText variant="h3" style={base.sectionTitle}>
        {COPY.mix}
      </AppText>
      <View style={s.mixBar}>
        {slices.map(slice => (
          <View
            key={slice.occasion}
            style={[
              s.mixSlice,
              { flex: slice.percent, backgroundColor: slice.color },
            ]}
          />
        ))}
      </View>
      <View style={s.legend}>
        {slices.map(slice => (
          <View key={slice.occasion} style={s.legendRow}>
            <View style={[s.legendDot, { backgroundColor: slice.color }]} />
            <AppText variant="bodySmall" style={s.legendName}>
              {slice.occasion}
            </AppText>
            <AppText variant="bodySmall" style={s.legendPct}>
              {`${slice.percent}%`}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

export default EventMix;
