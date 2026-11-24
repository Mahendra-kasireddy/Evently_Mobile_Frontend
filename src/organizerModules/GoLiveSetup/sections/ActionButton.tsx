import { ActivityIndicator, View } from 'react-native';
import { AppText, GradientFill, PressableScale } from '../../../Components';
import { ORG_ACTION_GRADIENT } from '../design';
import { buttonStyles as s } from '../styles';

/** The one main action on a screen: marigold into sindoor, greyed when it can't be done yet. */
export function ActionButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const off = disabled || loading;
  return (
    <PressableScale
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: off, busy: loading }}
    >
      <View style={[s.button, disabled && s.disabled]}>
        {disabled ? null : (
          <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
        )}
        {loading ? <ActivityIndicator color="#ffffff" /> : null}
        <AppText variant="button" style={[s.text, disabled && s.textDisabled]}>
          {title}
        </AppText>
      </View>
    </PressableScale>
  );
}

export default ActionButton;
