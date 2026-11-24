import { View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { SETUP_COPY as COPY, STEP_META } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { stepCardStyles as s } from '../styles';
import type { StepCardModel } from '../types';

/** One checklist step: its icon, title, and either ✓ Done or what is missing. */
export function StepCard({
  step,
  onPress,
}: {
  step: StepCardModel;
  onPress: () => void;
}) {
  return (
    <PressableScale
      style={s.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${step.title}${
        step.optional ? `, ${COPY.optional}` : ''
      }. ${step.line}`}
    >
      <View style={[s.iconTile, step.done && s.doneTile]}>
        {step.done ? (
          <EventlyIcon name="check" size={22} color={ORG_ACCENT.jade} />
        ) : (
          <>
            <GradientFill
              colors={STEP_META[step.id].gradient}
              direction="diagonal"
            />
            <EventlyIcon name={step.icon} size={21} color="#ffffff" />
          </>
        )}
      </View>
      <View style={s.text}>
        <View style={s.titleRow}>
          <AppText variant="body" style={s.title} numberOfLines={1}>
            {step.title}
          </AppText>
          {step.optional ? (
            <View style={s.tag}>
              <AppText variant="label" style={s.tagText}>
                {COPY.optional}
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText
          variant="caption"
          style={[
            s.line,
            step.done && s.lineDone,
            !step.done && step.optional && s.lineMuted,
          ]}
          numberOfLines={2}
        >
          {step.done ? `✓ ${step.line}` : step.line}
        </AppText>
      </View>
      <EventlyIcon
        name={step.editable ? 'chevron-right' : 'eye-outline'}
        size={20}
        color={ORG_INK.inkFaint}
      />
    </PressableScale>
  );
}

export default StepCard;
