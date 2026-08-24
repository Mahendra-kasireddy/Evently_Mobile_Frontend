import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { HOME_COPY, TIER_COLOR } from '../constants';
import { badgeStyles, cardStyles } from '../styles';
import type { BadgeStatus } from '../types';

interface BadgeProgressCardProps {
  badges: BadgeStatus;
}

function TierChip({ tier }: { tier: string }) {
  const key = (tier || 'bronze').toLowerCase();
  const label = key.charAt(0).toUpperCase() + key.slice(1);
  return (
    <View style={[badgeStyles.tierChip, { backgroundColor: TIER_COLOR[key] ?? TIER_COLOR.bronze }]}>
      <EventlyIcon name="trophy-award" size={12} color="#fff" />
      <EventlyText style={badgeStyles.tierText}>{label}</EventlyText>
    </View>
  );
}

export function BadgeProgressCard({ badges }: BadgeProgressCardProps) {
  const { currentTier, nextTier, nextRequirements, events } = badges;

  if (!nextTier || !nextRequirements) {
    return (
      <View style={cardStyles.card}>
        <EventlyText variant="h2" style={cardStyles.cardTitle}>
          {HOME_COPY.badgeTitle}
        </EventlyText>
        <View style={badgeStyles.tierRow}>
          <TierChip tier={currentTier} />
        </View>
        <EventlyText variant="body" style={badgeStyles.note}>
          {HOME_COPY.topTierNote}
        </EventlyText>
      </View>
    );
  }

  const remaining = Math.max(0, nextRequirements.events - events);
  const percent = Math.min(100, Math.round((events / Math.max(1, nextRequirements.events)) * 100));

  return (
    <View style={cardStyles.card}>
      <EventlyText variant="h2" style={cardStyles.cardTitle}>
        {HOME_COPY.badgeTitle}
      </EventlyText>
      <View style={badgeStyles.tierRow}>
        <TierChip tier={currentTier} />
        <EventlyIcon name="chevron-right" size={16} color="#5b6675" />
        <TierChip tier={nextTier} />
      </View>
      <View style={badgeStyles.track}>
        <View style={[badgeStyles.fill, { width: `${percent}%` }]} />
      </View>
      <EventlyText variant="body" style={badgeStyles.note}>
        {remaining > 0 ? (
          <>
            {remaining} more events to reach <EventlyText style={badgeStyles.noteBold}>{nextTier} tier</EventlyText>
          </>
        ) : (
          <>
            Ready for <EventlyText style={badgeStyles.noteBold}>{nextTier} tier</EventlyText>
          </>
        )}
      </EventlyText>
    </View>
  );
}

export default BadgeProgressCard;
