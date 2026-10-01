import { Image, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyText } from '../../../Components';
import { PLAN_BG } from '../constants';
import { heroStyles } from '../styles';
import type { PlanTrustDTO } from '../types';
import { StepPills } from './StepPills';

const HERO_FLOWERS = require('../../../assets/images/flowers_workspace.png');

interface PlanHeroProps {
  occasionLabel: string;
  isDetailsStep: boolean;
  heading: string;
  subtitle: string;
  trust: PlanTrustDTO[];
  /** 1-based position of the current step, for the "Step 1 of 4" pill. */
  stepNumber: number;
  stepCount: number;
  stepLabel: string;
}

/** Only the Details step gets the illustrated floral hero — every other step
 * gets a plain page heading, matching web's Component.tsx exactly. */
export function PlanHero({
  occasionLabel,
  isDetailsStep,
  heading,
  subtitle,
  stepNumber,
  stepCount,
  stepLabel,
}: PlanHeroProps) {
  if (!isDetailsStep) {
    return (
      <View style={heroStyles.plainSection}>
        {heading ? (
          <EventlyText variant="h2" style={heroStyles.plainHeading}>
            {heading}
          </EventlyText>
        ) : null}
        {subtitle ? (
          <EventlyText variant="body" style={heroStyles.plainSubtitle}>
            {subtitle}
          </EventlyText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={heroStyles.section}>
      {/* Flowers in the top-right corner, dissolving into the page on the
          left and bottom so the heading reads over a flat background. */}
      <View style={heroStyles.art} pointerEvents="none">
        <Image
          source={HERO_FLOWERS}
          style={heroStyles.artImage}
          resizeMode="cover"
        />
        <Svg style={heroStyles.artFade} width="100%" height="100%">
          <Defs>
            <LinearGradient id="planHeroFadeX" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={PLAN_BG} stopOpacity={1} />
              <Stop offset="0.45" stopColor={PLAN_BG} stopOpacity={0} />
            </LinearGradient>
            <LinearGradient id="planHeroFadeY" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.6" stopColor={PLAN_BG} stopOpacity={0} />
              <Stop offset="1" stopColor={PLAN_BG} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            fill="url(#planHeroFadeX)"
          />
          <Rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            fill="url(#planHeroFadeY)"
          />
        </Svg>
      </View>

      <StepPills
        stepNumber={stepNumber}
        stepCount={stepCount}
        stepLabel={stepLabel}
      />

      <EventlyText variant="h1" style={heroStyles.heading}>
        {/* Names the chosen occasion, so picking Birthday below retitles
            the step instead of leaving a generic "event". */}
        {'Let\u2019s start with\nyour '}
        <EventlyText variant="h1" style={heroStyles.headingAccent}>
          {occasionLabel.toLowerCase()}
        </EventlyText>
        {' details'}
      </EventlyText>

      <EventlyText variant="body" style={heroStyles.subtitle}>
        Tell us a little about your event so we can create the perfect plan for
        you.
      </EventlyText>
    </View>
  );
}

export default PlanHero;
