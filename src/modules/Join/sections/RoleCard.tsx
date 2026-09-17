import { Pressable, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { brand } from '../../../theme';
import { roleCardStyles } from '../styles';
import type { RoleCardData } from '../types';

interface RoleCardProps {
  data: RoleCardData;
  onPress: (key: RoleCardData['key']) => void;
}

export function RoleCard({ data, onPress }: RoleCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        roleCardStyles.card,
        pressed && roleCardStyles.cardPressed,
      ]}
      onPress={() => onPress(data.key)}
      accessibilityRole="button"
      accessibilityLabel={`${data.title}. ${data.description} ${data.requirement}.`}
      testID={`role-card-${data.key}`}
    >
      <View
        style={[
          roleCardStyles.iconTile,
          { backgroundColor: data.iconBackground },
        ]}
      >
        <EventlyIcon name={data.icon} size={20} color={data.iconColor} />
      </View>

      <View style={roleCardStyles.body}>
        <View style={roleCardStyles.titleRow}>
          <EventlyText variant="subtitle" style={roleCardStyles.title}>
            {data.title}
          </EventlyText>
          <EventlyIcon name="chevron-right" size={20} color={brand.accent} />
        </View>

        <EventlyText variant="caption" style={roleCardStyles.description}>
          {data.description}
        </EventlyText>

        <EventlyText variant="caption" style={roleCardStyles.requirement}>
          {data.requirement}
        </EventlyText>
      </View>
    </Pressable>
  );
}

export default RoleCard;
