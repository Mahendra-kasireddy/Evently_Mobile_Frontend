import { View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { HOME_COPY as COPY } from '../constants';
import { ORG_INK, TIER_LOOK } from '../design';
import { tierStyles as s } from '../styles';
import type { TierModel } from '../types';
import { SectionTitle } from './SectionTitle';

/** The organizer's tier and how close the next one is; opens Badges & tiers. */
export function TierCard({
  tier,
  onPress,
}: {
  tier: TierModel;
  onPress: () => void;
}) {
  const look = TIER_LOOK[tier.tier] ?? TIER_LOOK.Silver;
  return (
    <View>
      <SectionTitle title={COPY.tierTitle} />
      <PressableScale
        style={s.card}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${tier.tier}. ${tier.line}`}
      >
        <View style={s.medal}>
          <GradientFill colors={look.gradient} direction="diagonal" />
          <EventlyIcon name="medal-outline" size={24} color="#ffffff" />
        </View>
        <View style={s.body}>
          <AppText variant="h3" style={s.tier}>
            {tier.tier}
          </AppText>
          <View style={s.track}>
            <View
              style={[
                s.fill,
                {
                  width: `${Math.round(tier.progress * 100)}%`,
                  backgroundColor: look.ink,
                },
              ]}
            />
          </View>
          <AppText variant="caption" style={s.line}>
            {tier.line}
          </AppText>
        </View>
        <EventlyIcon name="chevron-right" size={22} color={ORG_INK.inkFaint} />
      </PressableScale>
    </View>
  );
}

export default TierCard;
