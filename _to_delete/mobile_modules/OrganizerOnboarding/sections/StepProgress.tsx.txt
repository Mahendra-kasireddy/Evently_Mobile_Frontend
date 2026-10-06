import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { stepProgressStyles } from '../styles';
import type { OnboardingStep, StepId } from '../types';

interface StepProgressProps {
  steps: OnboardingStep[];
  onSelect: (id: StepId) => void;
}

/** Compact horizontal step indicator — the mobile-native equivalent of the design's
 * vertical numbered sidebar card, adapted so it fits above the form on a phone screen. */
export function StepProgress({ steps, onSelect }: StepProgressProps) {
  return (
    <View style={stepProgressStyles.row}>
      {steps.map((step, index) => {
        const isDone = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const canJump = isDone || isCurrent;
        return (
          <View key={step.id} style={stepProgressStyles.item}>
            <View style={stepProgressStyles.lineWrap}>
              <View style={[stepProgressStyles.line, index === 0 && stepProgressStyles.lineHidden, isDone && stepProgressStyles.lineDone]} />
              <TouchableOpacity
                disabled={!canJump}
                onPress={() => onSelect(step.id)}
                style={[stepProgressStyles.circle, isCurrent && stepProgressStyles.circleCurrent, isDone && stepProgressStyles.circleDone]}
                accessibilityLabel={`${step.title}: ${step.status}`}
              >
                {isDone ? (
                  <EventlyIcon name="check" size={14} color="#fff" />
                ) : (
                  <EventlyText style={[stepProgressStyles.circleText, isCurrent && stepProgressStyles.circleTextCurrent]}>{step.order}</EventlyText>
                )}
              </TouchableOpacity>
              <View
                style={[
                  stepProgressStyles.line,
                  index === steps.length - 1 && stepProgressStyles.lineHidden,
                  (isDone || (isCurrent && index === steps.length - 1)) && stepProgressStyles.lineDone,
                ]}
              />
            </View>
            <EventlyText
              style={[stepProgressStyles.label, isCurrent && stepProgressStyles.labelCurrent, isDone && stepProgressStyles.labelDone]}
              numberOfLines={2}
            >
              {step.title}
            </EventlyText>
          </View>
        );
      })}
    </View>
  );
}

export default StepProgress;
