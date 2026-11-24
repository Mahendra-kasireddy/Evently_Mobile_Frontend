import type { StyleProp, ViewStyle } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { COUPONS_COPY as COPY } from '../constants';
import { ORG_ACTION_GRADIENT } from '../design';
import { createStyles as s } from '../styles';

/** The screen's one action, in the app's marigold "do this" gradient. */
export function CreateButton({
  onPress,
  title = COPY.create,
  icon = 'plus',
  disabled = false,
  style,
}: {
  onPress: () => void;
  title?: string;
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <PressableScale
      style={[s.button, disabled && s.buttonDisabled]}
      containerStyle={style}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
    >
      <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
      {icon ? <EventlyIcon name={icon} size={20} color="#ffffff" /> : null}
      <AppText variant="button" style={s.text}>
        {title}
      </AppText>
    </PressableScale>
  );
}

export default CreateButton;
