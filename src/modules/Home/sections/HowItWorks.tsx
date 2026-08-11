import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { HOW_STEP_ICON_BG, HOW_STEP_ICON_COLOR, HOW_STEP_ICON_NAME } from '../constants';
import { howItWorksStyles } from '../styles';
import { colors } from '../../../theme';
import type { HowItWorksViewModel, HowStepItem } from '../types';

interface HowItWorksProps {
  data: HowItWorksViewModel;
}

interface StepRowProps {
  item: HowStepItem;
  isLast: boolean;
}

function StepRow({ item, isLast }: StepRowProps) {
  return (
    <View style={howItWorksStyles.stepRow}>
      <View style={howItWorksStyles.timelineCol}>
        <View style={[howItWorksStyles.iconCircle, { backgroundColor: HOW_STEP_ICON_COLOR }]}>
          <EventlyIcon name={HOW_STEP_ICON_NAME[item.icon]} size={20} color={colors.onPrimary} />
          <View style={[howItWorksStyles.numberBadge, { borderColor: HOW_STEP_ICON_COLOR }]}>
            <EventlyText variant="caption" style={[howItWorksStyles.numberBadgeText, { color: HOW_STEP_ICON_COLOR }]}>
              {item.num}
            </EventlyText>
          </View>
        </View>
        {isLast ? null : <View style={[howItWorksStyles.connector, { backgroundColor: HOW_STEP_ICON_BG }]} />}
      </View>
      <View style={howItWorksStyles.stepContent}>
        <EventlyText variant="subtitle" style={howItWorksStyles.cardTitle}>
          {item.title}
        </EventlyText>
        <EventlyText variant="body" style={howItWorksStyles.cardDesc}>
          {item.description}
        </EventlyText>
      </View>
    </View>
  );
}

export function HowItWorks({ data }: HowItWorksProps) {
  return (
    <View style={howItWorksStyles.section}>
      <EventlyText variant="h2" style={howItWorksStyles.title}>
        {data.title}
      </EventlyText>
      <EventlyText variant="body" style={howItWorksStyles.subtitle}>
        {data.subtitle}
      </EventlyText>
      <View style={howItWorksStyles.list}>
        {data.steps.map((step, index) => (
          <StepRow key={step.num} item={step} isLast={index === data.steps.length - 1} />
        ))}
      </View>
    </View>
  );
}

export default HowItWorks;
