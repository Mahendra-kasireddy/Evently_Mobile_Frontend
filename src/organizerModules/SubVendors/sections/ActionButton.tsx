import {
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { ORG_ACTION_GRADIENT } from '../design';
import { actionStyles as s } from '../styles';

/** The screen's one "do this" button: marigold into sindoor. */
export function ActionButton({
  title,
  icon = 'account-plus-outline',
  onPress,
  loading = false,
  disabled = false,
  containerStyle,
}: {
  title: string;
  icon?: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  const off = disabled || loading;
  return (
    <PressableScale
      style={[s.button, off && s.buttonDisabled]}
      containerStyle={containerStyle}
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: off, busy: loading }}
    >
      <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <EventlyIcon name={icon} size={20} color="#ffffff" />
      )}
      <AppText variant="button" style={s.text}>
        {title}
      </AppText>
    </PressableScale>
  );
}

export default ActionButton;
