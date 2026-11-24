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
import { ORG_ACTION_GRADIENT, ORG_INK, WHITE } from '../design';
import { buttonStyles as s } from '../styles';

export type ActionKind = 'primary' | 'ghost' | 'danger';

/**
 * A big full-width button. `primary` is the screen's one "do this" in the
 * marigold gradient; `ghost` is the quiet alternative; `danger` is final.
 */
export function ActionButton({
  title,
  icon,
  onPress,
  kind = 'primary',
  loading = false,
  disabled = false,
  containerStyle,
}: {
  title: string;
  icon?: string;
  onPress: () => void;
  kind?: ActionKind;
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  const off = disabled || loading;
  const ink = kind === 'ghost' ? ORG_INK.ink : WHITE;
  return (
    <PressableScale
      style={[
        s.action,
        kind === 'ghost' && s.ghost,
        kind === 'danger' && s.danger,
        off && s.off,
      ]}
      containerStyle={containerStyle}
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: off, busy: loading }}
    >
      {kind === 'primary' ? (
        <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
      ) : null}
      {loading ? (
        <ActivityIndicator color={ink} />
      ) : icon ? (
        <EventlyIcon name={icon} size={20} color={ink} />
      ) : null}
      <AppText
        variant="button"
        style={[s.text, kind === 'ghost' && s.ghostText]}
      >
        {title}
      </AppText>
    </PressableScale>
  );
}

export default ActionButton;
