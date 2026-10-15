import { View } from 'react-native';
import { AppText, GradientFill } from '../../../Components';
import { GUEST_COPY as COPY } from '../constants';
import { statsStyles as s } from '../styles';
import type { GuestStats as Stats } from '../types';

const CARD_GRADIENT: [string, string] = ['#1f2e57', '#5a35e0'];

/**
 * The list at a glance: how many guests, how many have the invitation, how
 * many opened it — one bar, so "who still needs sending to" reads without
 * counting rows.
 */
export function GuestStats({ stats }: { stats: Stats }) {
  const pct = (n: number) =>
    stats.total > 0 ? `${(n / stats.total) * 100}%` : '0%';
  return (
    <View style={s.card}>
      <GradientFill colors={CARD_GRADIENT} direction="diagonal" />
      <View style={s.topRow}>
        <AppText variant="display" style={s.total}>
          {stats.total}
        </AppText>
        <AppText variant="bodyLarge" style={s.totalLabel}>
          {COPY.statTotal.toLowerCase()}
        </AppText>
      </View>

      <View style={s.bar}>
        <View
          style={[s.barOpened, { width: pct(stats.opened) as `${number}%` }]}
        />
        <View
          style={[
            s.barInvited,
            { width: pct(stats.invited - stats.opened) as `${number}%` },
          ]}
        />
      </View>

      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.legendDot, s.dotOpened]} />
          <AppText variant="bodySmall" style={s.legendText}>
            {stats.opened} {COPY.statOpened.toLowerCase()}
          </AppText>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, s.dotInvited]} />
          <AppText variant="bodySmall" style={s.legendText}>
            {stats.invited} {COPY.statInvited.toLowerCase()}
          </AppText>
        </View>
        <View style={s.legendItem}>
          <View style={[s.legendDot, s.dotNotSent]} />
          <AppText variant="bodySmall" style={s.legendText}>
            {stats.notSent} {COPY.statNotSent.toLowerCase()}
          </AppText>
        </View>
      </View>
      <AppText variant="caption" style={s.note}>
        {COPY.statsNote(stats.notSent)}
      </AppText>
    </View>
  );
}

export default GuestStats;
