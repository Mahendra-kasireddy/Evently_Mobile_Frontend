import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { stepPillStyles } from '../styles';

interface StepPillsProps {
  /** 1-based position of the current step. */
  stepNumber: number;
  stepCount: number;
  stepLabel: string;
}

/** "Step 2 of 4" in accent, then the step's name — where you are, at a glance. */
export function StepPills({ stepNumber, stepCount, stepLabel }: StepPillsProps) {
  return (
    <View
      style={stepPillStyles.row}
      accessibilityLabel={`Step ${stepNumber} of ${stepCount}, ${stepLabel}`}
    >
      <View style={stepPillStyles.stepPill}>
        <EventlyText variant="caption" style={stepPillStyles.stepPillText}>
          {`Step ${stepNumber} of ${stepCount}`}
        </EventlyText>
      </View>
      {stepLabel ? (
        <View style={stepPillStyles.labelPill}>
          <EventlyText variant="caption" style={stepPillStyles.labelPillText}>
            {stepLabel}
          </EventlyText>
        </View>
      ) : null}
    </View>
  );
}

export default StepPills;
