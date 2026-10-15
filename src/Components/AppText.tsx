import {
  StyleSheet,
  Text,
  useColorScheme,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';
import {
  MAX_FONT_SIZE_MULTIPLIER,
  MIN_FONT_SIZE,
  TEXT_APPEARANCE,
  fontFor,
  fontWeights,
  textColors,
  typography,
  type FontWeightName,
  type TextColorToken,
  type TextScheme,
  type TypographyVariant,
} from '../theme';

export interface AppTextProps extends TextProps {
  /** The type-scale step. Defaults to `body`. */
  variant?: TypographyVariant;
  /**
   * A text colour token (`textSecondary`, `textOnPrimary`…) or, for the few
   * brand-coloured lines, a colour value. Defaults to `textPrimary`.
   */
  color?: TextColorToken | (string & {});
  align?: TextStyle['textAlign'];
  /** A heavier/lighter face inside the same variant — use sparingly. */
  weight?: FontWeightName;
  style?: StyleProp<TextStyle>;
}

const LIGHT = textColors.light as Record<string, string>;
const DARK = textColors.dark as Record<string, string>;
/** light hex → dark hex, so static StyleSheet colours follow the scheme. */
const LIGHT_TO_DARK: Record<string, string> = Object.fromEntries(
  Object.keys(LIGHT).map(k => [String(LIGHT[k]).toLowerCase(), DARK[k]]),
);

/** The scheme text is drawn in — see TEXT_APPEARANCE in theme/textColors. */
export function useTextScheme(): TextScheme {
  const system = useColorScheme();
  if (TEXT_APPEARANCE === 'light') return 'light';
  return system === 'dark' ? 'dark' : 'light';
}

function resolveColor(
  color: string | undefined,
  scheme: TextScheme,
): string | undefined {
  if (color == null) return undefined;
  const palette = scheme === 'dark' ? DARK : LIGHT;
  return palette[color] ?? color;
}

/**
 * The one Text component in the app.
 *
 * Every line of copy goes through here so the type scale, the Inter faces,
 * the text colours and the font-scaling cap are applied the same way on every
 * screen. Screens pick a `variant` and a `color` token; `style` is for layout
 * (margins, flex) and the occasional deliberate override.
 */
export function AppText({
  variant = 'body',
  color = 'textPrimary',
  align,
  weight,
  style,
  allowFontScaling = true,
  maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER,
  ...rest
}: AppTextProps) {
  const scheme = useTextScheme();
  const override = StyleSheet.flatten<TextStyle>(style) ?? {};

  // Order: variant → weight → colour → alignment → style. `style` is the
  // explicit override and always wins.
  const resolved: TextStyle = {
    ...typography[variant],
    ...(weight ? fontWeights[weight] : null),
    color: resolveColor(color, scheme),
    ...(align ? { textAlign: align } : null),
    ...override,
  };

  // Weight is a face, never a `fontWeight` (Android ignores it on Inter).
  if (override.fontWeight != null && override.fontFamily == null) {
    resolved.fontFamily = fontFor(override.fontWeight);
  }
  delete resolved.fontWeight;

  if (
    typeof resolved.fontSize === 'number' &&
    resolved.fontSize < MIN_FONT_SIZE
  ) {
    resolved.fontSize = MIN_FONT_SIZE;
  }

  // A light-palette colour from a static StyleSheet follows the scheme.
  if (scheme === 'dark' && typeof resolved.color === 'string') {
    resolved.color =
      LIGHT_TO_DARK[resolved.color.toLowerCase()] ?? resolved.color;
  }

  return (
    <Text
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={resolved}
      {...rest}
    />
  );
}

export default AppText;
