import { ActivityIndicator, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme';
import { EventlyText } from './EventlyText';
import { eventlyButtonStyles } from './styles';

export type EventlyButtonVariant = 'primary' | 'outline' | 'danger';

interface EventlyButtonProps {
  title: string;
  onPress: () => void;
  variant?: EventlyButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Overrides the app's default indigo accent for this instance only — e.g. a
   * screen that ports a specific web design with its own brand color. */
  accentColor?: string;
}

const TEXT_STYLE_BY_VARIANT = {
  primary: eventlyButtonStyles.primaryText,
  outline: eventlyButtonStyles.outlineText,
  danger: eventlyButtonStyles.dangerText,
};

/** The one button component every screen should use, so buttons stay consistent app-wide. */
export function EventlyButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accentColor,
}: EventlyButtonProps) {
  const isDisabled = disabled || loading;
  const accentStyle = accentColor
    ? variant === 'primary'
      ? { backgroundColor: accentColor }
      : variant === 'outline'
        ? { borderColor: accentColor }
        : null
    : null;
  const accentTextStyle = accentColor && variant === 'outline' ? { color: accentColor } : null;

  return (
    <TouchableOpacity
      style={[eventlyButtonStyles.base, eventlyButtonStyles[variant], accentStyle, isDisabled && eventlyButtonStyles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.onPrimary : (accentColor ?? colors.primary)} />
      ) : (
        <EventlyText variant="subtitle" style={[TEXT_STYLE_BY_VARIANT[variant], accentTextStyle]}>
          {title}
        </EventlyText>
      )}
    </TouchableOpacity>
  );
}

export default EventlyButton;
