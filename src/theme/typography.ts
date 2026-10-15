import type { TextStyle } from 'react-native';
import { fontFamilies } from './fonts';

/**
 * Evently's type scale. Every piece of text in the app is one of these twelve.
 *
 * | variant     | size | line | weight | tracking |
 * |-------------|------|------|--------|----------|
 * | display     | 32   | 40   | 700    | -0.5     |
 * | h1          | 28   | 34   | 700    | -0.5     |
 * | h2          | 20   | 26   | 600    | -0.25    |
 * | h3          | 17   | 22   | 600    | 0        |
 * | bodyLarge   | 16   | 24   | 400    | 0        |
 * | body        | 14   | 20   | 400    | 0        |
 * | bodySmall   | 13   | 18   | 400    | 0        |
 * | button      | 16   | 20   | 500    | 0.2      |
 * | buttonSmall | 14   | 18   | 500    | 0.2      |
 * | label       | 12   | 16   | 500    | 0.5      |
 * | caption     | 12   | 16   | 400    | 0        |
 * | overline    | 11   | 14   | 600    | 1.0 (UPPERCASE) |
 *
 * Weight is carried by `fontFamily` (one Inter face per weight), never by
 * `fontWeight` — see theme/fonts.ts.
 *
 * Where each one goes:
 *  - display: hero text, event banner title, amounts on checkout/success,
 *    dashboard numbers
 *  - h1: screen titles, Home greeting
 *  - h2: section headings, empty-state titles, profile name, totals
 *  - h3: card titles, navigation header titles, card prices, list names
 *  - bodyLarge: long descriptions, profile menu items
 *  - body: general text; bodySmall: secondary info inside cards
 *  - button / buttonSmall: primary buttons / small buttons and links
 *  - label: chips, tabs, badges, form labels; caption: dates, times, helpers,
 *    errors; overline: the small uppercase kicker above a heading
 */
export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'button'
  | 'buttonSmall'
  | 'label'
  | 'caption'
  | 'overline';

const style = (
  fontSize: number,
  lineHeight: number,
  fontFamily: string,
  letterSpacing: number,
): TextStyle => ({ fontSize, lineHeight, fontFamily, letterSpacing });

export const typography: Record<TypographyVariant, TextStyle> = {
  display: style(32, 40, fontFamilies.bold, -0.5),
  h1: style(28, 34, fontFamilies.bold, -0.5),
  h2: style(20, 26, fontFamilies.semibold, -0.25),
  h3: style(17, 22, fontFamilies.semibold, 0),
  bodyLarge: style(16, 24, fontFamilies.regular, 0),
  body: style(14, 20, fontFamilies.regular, 0),
  bodySmall: style(13, 18, fontFamilies.regular, 0),
  button: style(16, 20, fontFamilies.medium, 0.2),
  buttonSmall: style(14, 18, fontFamilies.medium, 0.2),
  label: style(12, 16, fontFamilies.medium, 0.5),
  caption: style(12, 16, fontFamilies.regular, 0),
  overline: {
    ...style(11, 14, fontFamilies.semibold, 1),
    textTransform: 'uppercase',
  },
};

/** The numeric weight each variant is drawn at — for tests and docs. */
export const typographyWeights: Record<
  TypographyVariant,
  TextStyle['fontWeight']
> = {
  display: '700',
  h1: '700',
  h2: '600',
  h3: '600',
  bodyLarge: '400',
  body: '400',
  bodySmall: '400',
  button: '500',
  buttonSmall: '500',
  label: '500',
  caption: '400',
  overline: '600',
};

/**
 * The same steps for a TextInput. A `lineHeight` on a single-line input
 * shifts the caret and the text off centre on Android, so inputs take the
 * size, face and tracking of a variant and let the field set its own leading.
 */
const withoutLeading = ({ lineHeight: _lh, ...rest }: TextStyle): TextStyle =>
  rest;
export const inputTypography = {
  body: withoutLeading(typography.body),
  bodyLarge: withoutLeading(typography.bodyLarge),
} as const;

/**
 * Bottom tab bar labels: 11 / 500. The navigator draws these itself (no
 * AppText), so it gets its own token rather than a thirteenth variant.
 */
export const tabBarLabel: TextStyle = {
  fontSize: 11,
  lineHeight: 14,
  fontFamily: fontFamilies.medium,
  letterSpacing: 0,
};

/** No text in the app is set smaller than this. */
export const MIN_FONT_SIZE = 11;

/** Text grows with the system font size, but never past 1.5×. */
export const MAX_FONT_SIZE_MULTIPLIER = 1.5;
