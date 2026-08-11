import { ScrollView, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { PLAN_ACCENT_WARM, TRUST_ICON_NAME } from '../constants';
import { heroStyles } from '../styles';
import type { PlanTrustDTO } from '../types';

interface PlanHeroProps {
  occasionLabel: string;
  isDetailsStep: boolean;
  heading: string;
  subtitle: string;
  trust: PlanTrustDTO[];
}

/** Only the Details step gets the illustrated navy/orange hero treatment — every
 * other step gets a plain page heading, matching web's Component.tsx exactly. */
export function PlanHero({ occasionLabel, isDetailsStep, heading, subtitle, trust }: PlanHeroProps) {
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
      <EventlyText variant="h2" style={heroStyles.heading}>
        Let&rsquo;s bring your <EventlyText variant="h2" style={heroStyles.headingAccent}>{occasionLabel}</EventlyText> to
        life
      </EventlyText>

      {subtitle ? (
        <EventlyText variant="caption" style={heroStyles.subtitle} numberOfLines={2}>
          {subtitle}
        </EventlyText>
      ) : null}

      {trust.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={heroStyles.trustRow}>
          {trust.map((item) => (
            <View key={item.label} style={heroStyles.trustChip}>
              <EventlyIcon name={TRUST_ICON_NAME[item.icon] ?? 'check-circle-outline'} size={13} color={PLAN_ACCENT_WARM} />
              <EventlyText variant="caption" style={heroStyles.trustLabel}>
                {item.label}
              </EventlyText>
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

export default PlanHero;
