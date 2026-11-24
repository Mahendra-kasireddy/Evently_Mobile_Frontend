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
import { DANGER, ORG_ACTION_GRADIENT, ORG_INK, WHITE } from '../design';
import { buttonStyles as s } from '../styles';

export type ActionKind = 'primary' | 'ghost' | 'danger' | 'dangerGhost';

/**
 * A big full-width button. `primary` is the screen's one "do this" in the
 * marigold gradient; `ghost` is the quiet alternative; the danger kinds are
 * for moves that can't be undone.
 */
export function ActionButton({
  title,
  icon,
  onPress,
  kind = 'primary',
  small = false,
  loading = false,
  disabled = false,
  containerStyle,
}: {
  title: string;
  icon?: string;
  onPress: () => void;
  kind?: ActionKind;
  small?: boolean;
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  const off = disabled || loading;
  const ink =
    kind === 'ghost' ? ORG_INK.ink : kind === 'dangerGhost' ? DANGER : WHITE;
  return (
    <PressableScale
      style={[
        s.action,
        small && s.small,
        kind === 'ghost' && s.ghost,
        kind === 'danger' && s.danger,
        kind === 'dangerGhost' && s.dangerGhost,
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
        <EventlyIcon name={icon} size={small ? 18 : 20} color={ink} />
      ) : null}
      <AppText
        variant={small ? 'buttonSmall' : 'button'}
        style={[
          s.text,
          small && s.textSmall,
          kind === 'ghost' && s.ghostText,
          kind === 'dangerGhost' && s.dangerGhostText,
        ]}
      >
        {title}
      </AppText>
    </PressableScale>
  );
}

export default ActionButton;
