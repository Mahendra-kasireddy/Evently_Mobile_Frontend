import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { fontFor, typography } from '../theme';

export type EventlyTextVariant = 'h1' | 'h2' | 'subtitle' | 'body' | 'caption';

interface EventlyTextProps extends TextProps {
  variant?: EventlyTextVariant;
}

/**
 * The one Text component every screen should use, so typography stays
 * consistent app-wide.
 *
 * It is also where Poppins is applied. Styles across the app say how heavy
 * text should be with `fontWeight`, which is the readable way to say it — but
 * Android ignores `fontWeight` on a custom family and quietly renders Regular,
 * so the weight has to be resolved to a named face before it reaches Text.
 * That means flattening the whole style chain first: the weight can come from
 * the variant, from a screen's StyleSheet, or from an inline override, and
 * only the winner should decide the face.
 *
 * `fontWeight` is then dropped rather than passed along. iOS would otherwise
 * take both the face and the weight into account and can pick a different one
 * of Poppins' nine — a Bold face asked to be bold again comes back heavier
 * than the design, and differently heavy from Android.
 */
export function EventlyText({ variant = 'body', style, ...rest }: EventlyTextProps) {
  const flat = StyleSheet.flatten<TextStyle>([typography[variant], style]) ?? {};
  const resolved: TextStyle = { ...flat, fontFamily: flat.fontFamily ?? fontFor(flat.fontWeight) };
  delete resolved.fontWeight;

  return <Text style={resolved} {...rest} />;
}

export default EventlyText;
