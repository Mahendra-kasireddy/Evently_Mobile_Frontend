import { View } from 'react-native';
import { AppText, EventlyIcon, GradientFill, PopIn } from '../../../Components';
import { SETUP_COPY as COPY } from '../constants';
import { PHASE_TONE } from '../design';
import { successStyles as s } from '../styles';
import { ActionButton } from './ActionButton';

/** After submitting: what happens next, and the way back. */
export function SuccessView({ onDone }: { onDone: () => void }) {
  return (
    <View style={s.wrap}>
      <PopIn>
        <View style={s.badge}>
          <GradientFill
            colors={PHASE_TONE.approved.gradient}
            direction="diagonal"
          />
          <EventlyIcon name="check-bold" size={44} color="#ffffff" />
        </View>
      </PopIn>
      <AppText variant="h1" style={s.title}>
        {COPY.successTitle}
      </AppText>
      <AppText variant="body" style={s.body}>
        {COPY.successBody}
      </AppText>
      <View style={s.action}>
        <ActionButton title={COPY.successDone} onPress={onDone} />
      </View>
    </View>
  );
}

export default SuccessView;
