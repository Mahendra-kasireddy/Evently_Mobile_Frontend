import { Fragment } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { stepperStyles } from '../styles';
import { PLAN_ACCENT } from '../constants';
import type { PlanStepDTO } from '../types';

interface StepperProps {
  steps: PlanStepDTO[];
  current: number;
  onSelect: (index: number) => void;
}

export function Stepper({ steps, current, onSelect }: StepperProps) {
  return (
    <View style={stepperStyles.row}>
      {steps.map((step, index) => {
        const isDone = index < current;
        const isCurrent = index === current;
        return (
          <Fragment key={step.id}>
            <TouchableOpacity style={stepperStyles.item} onPress={() => onSelect(index)} accessibilityLabel={step.label}>
              <View style={[stepperStyles.dot, isCurrent && stepperStyles.dotCurrent, isDone && stepperStyles.dotDone]}>
                {isDone ? (
                  <EventlyIcon name="check" size={13} color={PLAN_ACCENT} />
                ) : (
                  <EventlyText
                    variant="caption"
                    style={[stepperStyles.dotNumber, isCurrent && stepperStyles.dotNumberCurrent, isDone && stepperStyles.dotNumberDone]}
                  >
                    {index + 1}
                  </EventlyText>
                )}
              </View>
              <EventlyText variant="caption" style={[stepperStyles.label, isCurrent && stepperStyles.labelCurrent]} numberOfLines={1}>
                {step.label}
              </EventlyText>
            </TouchableOpacity>
            {index < steps.length - 1 ? <View style={[stepperStyles.line, isDone && stepperStyles.lineDone]} /> : null}
          </Fragment>
        );
      })}
    </View>
  );
}

export default Stepper;
