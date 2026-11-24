import { View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { BADGES_COPY as COPY } from '../constants';
import { tierLook } from '../design';
import { heroStyles as s } from '../styles';
import type { HeroModel } from '../types';

/** The current tier, in its own metal. */
export function TierHero({ hero }: { hero: HeroModel }) {
  const look = tierLook(hero.tier);
  return (
    <View
      style={s.card}
      accessible
      accessibilityLabel={`${hero.title}. ${hero.subtitle}. ${hero.rate}`}
    >
      <GradientFill colors={look.gradient} direction="diagonal" />
      <View style={s.shine} pointerEvents="none" />
      <View style={s.medal}>
        <EventlyIcon name="medal" size={40} color="#ffffff" />
      </View>
      <View style={s.text}>
        <AppText variant="overline" style={s.label}>
          {COPY.currentTier}
        </AppText>
        <AppText variant="h1" style={s.tier}>
          {hero.title}
        </AppText>
        <AppText variant="caption" style={s.sub}>
          {hero.subtitle}
        </AppText>
        <View style={s.rate}>
          <AppText variant="label" style={s.rateText}>
            {hero.rate}
          </AppText>
        </View>
      </View>
    </View>
  );
}

export default TierHero;
