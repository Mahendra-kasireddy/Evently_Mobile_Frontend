import { View } from 'react-native';
import { AppText, EventlyIcon, PressableScale } from '../../../Components';
import { HOME_COPY as COPY } from '../constants';
import { STAT_LOOK } from '../design';
import { statStyles as s } from '../styles';
import type { HomeStats } from '../types';
import { SectionTitle } from './SectionTitle';

type StatKey = keyof typeof STAT_LOOK;

/** Four numbers, two by two; each opens the screen it counts. */
export function StatsGrid({
  stats,
  onOpen,
}: {
  stats: HomeStats;
  onOpen: (key: StatKey) => void;
}) {
  const tiles: Array<{
    key: StatKey;
    value: string;
    label: string;
    hint?: string;
  }> = [
    {
      key: 'enquiries',
      value: String(stats.newEnquiries),
      label: COPY.statEnquiries,
    },
    {
      key: 'bookings',
      value: String(stats.activeBookings),
      label: COPY.statBookings,
    },
    {
      key: 'earnings',
      value: stats.monthEarnings,
      label: COPY.statEarnings,
      hint: stats.earningsChange,
    },
    {
      key: 'rating',
      value: stats.rating,
      label: stats.rating === '—' ? COPY.noRating : COPY.statRating,
    },
  ];

  return (
    <View>
      <SectionTitle title={COPY.statsTitle} />
      <View style={s.grid}>
        {tiles.map(tile => {
          const look = STAT_LOOK[tile.key];
          return (
            <PressableScale
              key={tile.key}
              style={s.tile}
              containerStyle={s.tileWrap}
              onPress={() => onOpen(tile.key)}
              accessibilityRole="button"
              accessibilityLabel={`${tile.label}: ${tile.value}`}
            >
              <View style={[s.icon, { backgroundColor: look.soft }]}>
                <EventlyIcon name={look.icon} size={18} color={look.ink} />
              </View>
              <AppText variant="h1" style={s.value} numberOfLines={1}>
                {tile.value}
              </AppText>
              <AppText variant="caption" style={s.label} numberOfLines={1}>
                {tile.label}
              </AppText>
              {tile.hint ? (
                <AppText
                  variant="caption"
                  style={[
                    s.hint,
                    tile.hint.startsWith('-') ? s.hintDown : s.hintUp,
                  ]}
                  numberOfLines={1}
                >
                  {tile.hint}
                </AppText>
              ) : null}
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

export default StatsGrid;
