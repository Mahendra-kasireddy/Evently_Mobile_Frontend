import { View } from 'react-native';
import {
  EventlyIcon,
  AppText,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { roleCardStyles as s } from '../styles';
import type { RoleCardData } from '../types';

interface RoleCardProps {
  data: RoleCardData;
  onPress: (key: RoleCardData['key']) => void;
}

/**
 * One way to work with Evently, as one tap: who it is for in a line, and how
 * long it takes to start. The detail of what each role gets belongs on the
 * next screens, not stacked in a list here.
 */
export function RoleCard({ data, onPress }: RoleCardProps) {
  return (
    <PressableScale
      style={s.card}
      onPress={() => onPress(data.key)}
      accessibilityRole="button"
      accessibilityLabel={`${data.title}. ${
        data.description
      }. ${data.perks.join('. ')}. ${data.requirement}.`}
      testID={`role-card-${data.key}`}
    >
      <View style={s.iconTile}>
        <GradientFill colors={data.gradient} direction="diagonal" />
        <EventlyIcon name={data.icon} size={26} color={data.iconColor} />
      </View>

      <View style={s.body}>
        <AppText variant="h3" style={s.title} numberOfLines={1}>
          {data.title}
        </AppText>
        <AppText variant="bodySmall" style={s.description} numberOfLines={2}>
          {data.description}
        </AppText>
        <View style={[s.tag, { backgroundColor: `${data.gradient[1]}14` }]}>
          <EventlyIcon name="clock-fast" size={13} color={data.gradient[1]} />
          <AppText
            variant="label"
            style={[s.tagText, { color: data.gradient[1] }]}
          >
            {data.requirement}
          </AppText>
        </View>
      </View>

      <View style={s.go}>
        <EventlyIcon name="chevron-right" size={22} color={data.gradient[1]} />
      </View>
    </PressableScale>
  );
}

export default RoleCard;
