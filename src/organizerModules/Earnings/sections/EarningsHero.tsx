import { View } from 'react-native';
import { AppText, GradientFill } from '../../../Components';
import { EARNINGS_COPY as COPY } from '../constants';
import { HERO_GRADIENT } from '../design';
import { heroStyles as s } from '../styles';
import type { EarningsSummary } from '../types';

/** What the organizer takes home for the period, and how much is still to come. */
export function EarningsHero({ summary }: { summary: EarningsSummary }) {
  return (
    <View
      style={s.card}
      accessible
      accessibilityLabel={`${COPY.net} ${summary.net}`}
    >
      <GradientFill colors={HERO_GRADIENT} direction="diagonal" />
      <View style={s.glow} pointerEvents="none" />
      <AppText variant="bodySmall" style={s.label}>
        {COPY.net}
      </AppText>
      <AppText variant="display" style={s.amount}>
        {summary.net}
      </AppText>
      <View style={s.hintRow}>
        <AppText variant="caption" style={s.hint}>
          {COPY.netHint}
        </AppText>
        {summary.change ? (
          <View style={[s.change, !summary.changeUp && s.changeDown]}>
            <AppText
              variant="label"
              style={[s.changeText, !summary.changeUp && s.changeTextDown]}
            >
              {summary.change}
            </AppText>
          </View>
        ) : null}
      </View>
      <View style={s.split}>
        <View style={s.pill}>
          <View style={s.pillLabelRow}>
            <View style={[s.dot, s.dotPaid]} />
            <AppText variant="caption" style={s.pillLabel}>
              {COPY.paidOut}
            </AppText>
          </View>
          <AppText variant="h3" style={s.pillValue}>
            {summary.paid}
          </AppText>
        </View>
        <View style={s.pill}>
          <View style={s.pillLabelRow}>
            <View style={[s.dot, s.dotPending]} />
            <AppText variant="caption" style={s.pillLabel}>
              {COPY.pending}
            </AppText>
          </View>
          <AppText variant="h3" style={s.pillValue}>
            {summary.pending}
          </AppText>
        </View>
      </View>
    </View>
  );
}

export default EarningsHero;
