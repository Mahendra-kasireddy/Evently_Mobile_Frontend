import { ActivityIndicator, View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { DANGER, ORG_ACCENT, ORG_ACTION_GRADIENT } from '../design';
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

/** A quieter action: outlined, with an icon — Upload, Add, Mark resolved. */
export function SecondaryButton({
  title,
  icon,
  onPress,
  disabled = false,
  loading = false,
  danger = false,
  small = false,
}: {
  title: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
  small?: boolean;
}) {
  const off = disabled || loading;
  const tint = danger ? DANGER.ink : ORG_ACCENT.saffron;
  return (
    <PressableScale
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: off, busy: loading }}
    >
      <View
        style={[
          s.secondary,
          small && s.secondarySmall,
          danger && s.secondaryDanger,
          off && s.secondaryOff,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={tint} />
        ) : icon ? (
          <EventlyIcon name={icon} size={small ? 16 : 18} color={tint} />
        ) : null}
        <AppText
          variant="bodySmall"
          style={[s.secondaryText, danger && s.secondaryTextDanger]}
          numberOfLines={1}
        >
          {title}
        </AppText>
      </View>
    </PressableScale>
  );
}
