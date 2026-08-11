import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { JOIN_NAVY } from '../constants';
import { roleCardStyles } from '../styles';
import type { RoleCardData } from '../types';

interface RoleCardProps {
  data: RoleCardData;
  onPress: (key: RoleCardData['key']) => void;
}

export function RoleCard({ data, onPress }: RoleCardProps) {
  return (
    <TouchableOpacity
      style={roleCardStyles.card}
      onPress={() => onPress(data.key)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={data.title}
    >
      <View style={[roleCardStyles.decorBlob, { backgroundColor: data.accentSoft }]} pointerEvents="none" />

      <View style={roleCardStyles.headerRow}>
        <View style={[roleCardStyles.iconCircle, { backgroundColor: data.accent }]}>
          <EventlyIcon name={data.icon} size={26} color={colors.onPrimary} />
        </View>
        <View style={[roleCardStyles.badge, { backgroundColor: data.badgeSoft }]}>
          <EventlyIcon name={data.badgeIcon} size={13} color={JOIN_NAVY} />
          <EventlyText variant="caption" style={roleCardStyles.badgeText}>
            {data.badge}
          </EventlyText>
        </View>
      </View>

      <EventlyText variant="h2" style={roleCardStyles.title}>
        {data.title}
      </EventlyText>
      <EventlyText variant="body" style={roleCardStyles.description}>
        {data.description}
      </EventlyText>

      <View style={[roleCardStyles.ctaPill, { backgroundColor: data.accent }]}>
        <EventlyText variant="subtitle" style={roleCardStyles.ctaText}>
          {data.cta}
        </EventlyText>
        <EventlyIcon name="arrow-right" size={16} color={colors.onPrimary} />
      </View>
    </TouchableOpacity>
  );
}

export default RoleCard;
