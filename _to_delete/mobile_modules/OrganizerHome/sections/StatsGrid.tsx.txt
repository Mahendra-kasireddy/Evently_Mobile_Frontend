import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { HOME_COPY, OH_AMBER, OH_AMBER_SOFT, OH_CORAL_SOFT, OH_NAVY, OH_TEAL, OH_TEAL_SOFT } from '../constants';
import { statStyles } from '../styles';
import { formatInr } from '../utils';
import type { OrganizerDashboard } from '../types';

interface StatsGridProps {
  summary: OrganizerDashboard;
}

const NAVY_SOFT = '#e9edf5';

export function StatsGrid({ summary }: StatsGridProps) {
  const tiles = [
    { label: HOME_COPY.statsEnquiries, value: String(summary.newEnquiries), icon: 'message-text-outline', soft: OH_CORAL_SOFT, tone: '#e8633a' },
    { label: HOME_COPY.statsActive, value: String(summary.activeBookings), icon: 'calendar-month-outline', soft: NAVY_SOFT, tone: OH_NAVY },
    {
      label: HOME_COPY.statsMonth,
      value: formatInr(summary.monthEarnings),
      icon: 'wallet-outline',
      soft: OH_TEAL_SOFT,
      tone: OH_TEAL,
      delta: summary.monthEarningsChangePercent,
    },
    { label: HOME_COPY.statsRating, value: summary.avgRating ? `${summary.avgRating.toFixed(1)}★` : '—', icon: 'star-outline', soft: OH_AMBER_SOFT, tone: OH_AMBER },
  ];

  return (
    <View style={statStyles.grid}>
      {tiles.map((tile) => (
        <View key={tile.label} style={statStyles.tile}>
          <View style={[statStyles.iconBadge, { backgroundColor: tile.soft }]}>
            <EventlyIcon name={tile.icon} size={16} color={tile.tone} />
          </View>
          <EventlyText style={statStyles.value}>{tile.value}</EventlyText>
          <EventlyText variant="caption" style={statStyles.label}>
            {tile.label}
          </EventlyText>
          {typeof tile.delta === 'number' ? (
            <EventlyText variant="caption" style={tile.delta < 0 ? statStyles.deltaDown : statStyles.delta}>
              {tile.delta > 0 ? '+' : ''}
              {tile.delta}% vs last month
            </EventlyText>
          ) : null}
        </View>
      ))}
    </View>
  );
}

export default StatsGrid;
