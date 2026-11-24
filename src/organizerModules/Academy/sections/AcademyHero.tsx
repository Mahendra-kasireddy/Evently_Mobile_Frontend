import { View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { ACADEMY_COPY as COPY } from '../constants';
import { HERO_GRADIENT } from '../design';
import { heroStyles as s } from '../styles';
import { ProgressRing } from './ProgressRing';

/** What the Academy is for, and how far through it the organizer is. */
export function AcademyHero({
  percent,
  stage,
}: {
  percent: number;
  stage: number;
}) {
  return (
    <View style={s.card}>
      <GradientFill colors={HERO_GRADIENT} direction="diagonal" />
      <View style={s.glow} pointerEvents="none" />
      <View style={s.text}>
        <View style={s.tag}>
          <EventlyIcon name="certificate-outline" size={13} color="#ffffff" />
          <AppText variant="label" style={s.tagText}>
            {COPY.heroTag}
          </AppText>
        </View>
        <AppText variant="h2" style={s.title}>
          {COPY.heroTitle}
        </AppText>
        <AppText variant="caption" style={s.body}>
          {COPY.heroBody}
        </AppText>
        <AppText variant="label" style={s.stage}>
          {COPY.heroStage(stage)}
        </AppText>
      </View>
      <ProgressRing percent={percent} label={COPY.complete} />
    </View>
  );
}

export default AcademyHero;
