import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { stepperStyles } from '../styles';
import type { PlanStepDTO } from '../types';

interface StepperProps {
  steps: PlanStepDTO[];
  current: number;
  onSelect: (index: number) => void;
}

/**
 * Where you are in the plan, and what comes next.
 *
 * The steps are no longer individually tappable. They never were a way to
 * navigate — a step you have not reached cannot be filled in, and the one
 * behind you is reached by the Back affordance in the flow — but four dots
 * that respond to touch implied otherwise. What is left states position
 * plainly and reads at a glance, which is what a stepper is for.
 *
 * `onSelect` is kept in the props so the call site does not change and so
 * restoring tappable steps is a local edit; it is deliberately unused here.
 */
export function Stepper({ steps, current }: StepperProps) {
  const total = steps.length;
  const currentLabel = steps[current]?.label ?? '';
  const nextLabel = steps[current + 1]?.label;

  return (
    <View style={stepperStyles.wrap}>
      <View
        style={stepperStyles.track}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: total, now: current + 1 }}
        accessibilityLabel={`Step ${current + 1} of ${total}, ${currentLabel}`}
      >
        {steps.map((step, index) => (
          <View
            key={step.id}
            style={[
              stepperStyles.segment,
              index <= current && stepperStyles.segmentDone,
            ]}
          />
        ))}
      </View>

      <View style={stepperStyles.caption}>
        <EventlyText variant="caption" style={stepperStyles.captionCount}>
          {`Step ${current + 1} of ${total}`}
        </EventlyText>
        <EventlyText variant="caption" style={stepperStyles.captionDivider}>
          ·
        </EventlyText>
        <EventlyText
          variant="caption"
          style={stepperStyles.captionLabel}
          numberOfLines={1}
        >
          {currentLabel}
        </EventlyText>

        <View style={stepperStyles.captionSpacer} />

        {/* Named rather than numbered: "Next: Categories" tells somebody
            deciding whether to finish this step what finishing it buys. */}
        {nextLabel ? (
          <EventlyText
            variant="caption"
            style={stepperStyles.captionNext}
            numberOfLines={1}
          >
            {`Next: ${nextLabel}`}
          </EventlyText>
        ) : null}
      </View>
    </View>
  );
}

export default Stepper;
