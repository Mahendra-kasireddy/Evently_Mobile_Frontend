import { View } from 'react-native';
import { EventlyIcon, AppText } from '../../../Components';
import {
  HOW_STEP_ICON_BG,
  HOW_STEP_ICON_COLOR,
  HOW_STEP_ICON_NAME,
} from '../constants';
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
        <View
          style={[
            howItWorksStyles.iconCircle,
            { backgroundColor: HOW_STEP_ICON_COLOR },
          ]}
        >
          <EventlyIcon
            name={HOW_STEP_ICON_NAME[item.icon]}
            size={20}
            color={colors.onPrimary}
          />
          <View
            style={[
              howItWorksStyles.numberBadge,
              { borderColor: HOW_STEP_ICON_COLOR },
            ]}
          >
            <AppText
              variant="label"
              style={[
                howItWorksStyles.numberBadgeText,
                { color: HOW_STEP_ICON_COLOR },
              ]}
            >
              {item.num}
            </AppText>
          </View>
        </View>
        {isLast ? null : (
          <View
            style={[
              howItWorksStyles.connector,
              { backgroundColor: HOW_STEP_ICON_BG },
            ]}
          />
        )}
      </View>
      <View style={howItWorksStyles.stepContent}>
        <AppText
          variant="body"
          weight="medium"
          style={howItWorksStyles.cardTitle}
        >
          {item.title}
        </AppText>
        <AppText variant="body" style={howItWorksStyles.cardDesc}>
          {item.description}
        </AppText>
      </View>
    </View>
  );
}

export function HowItWorks({ data }: HowItWorksProps) {
  return (
    <View style={howItWorksStyles.section}>
      <AppText variant="h2" style={howItWorksStyles.title}>
        {data.title}
      </AppText>
      <AppText variant="caption" style={howItWorksStyles.subtitle}>
        {data.subtitle}
      </AppText>
      <View style={howItWorksStyles.list}>
        {data.steps.map((step, index) => (
          <StepRow
            key={step.num}
            item={step}
            isLast={index === data.steps.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

export default HowItWorks;
