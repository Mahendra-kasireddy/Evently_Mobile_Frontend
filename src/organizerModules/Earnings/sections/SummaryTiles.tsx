import { View } from 'react-native';
import { AppText } from '../../../Components';
import { EARNINGS_COPY as COPY } from '../constants';
import { tileStyles as s } from '../styles';
import type { EarningsSummary } from '../types';

/** Total booked, and Evently's commission on it. */
export function SummaryTiles({ summary }: { summary: EarningsSummary }) {
  return (
    <View style={s.row}>
      <View style={s.tile}>
        <AppText variant="caption" style={s.label}>
          {COPY.gross}
        </AppText>
        <AppText
          variant="h2"
          style={s.value}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {summary.gross}
        </AppText>
      </View>
      <View style={s.tile}>
        <AppText variant="caption" style={s.label}>
          {COPY.commission(summary.rate)}
        </AppText>
        <AppText
          variant="h2"
          style={s.value}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {summary.commission}
        </AppText>
      </View>
    </View>
  );
}

export default SummaryTiles;
