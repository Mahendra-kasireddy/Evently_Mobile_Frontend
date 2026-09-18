import type { TextStyle } from 'react-native';

/**
 * The type scale — the production values of the Evently design system.
 *
 * Every level states its own `lineHeight`, because Poppins' default leading is
 * tight for its x-height and headings set without it collide on the second
 * line — which is exactly where a two-line event title lands.
 *
 * `fontWeight` stays declared here (and in the screens) because it is the
 * honest way to say how heavy the text should be. `EventlyText` translates it
 * into the Poppins face that carries that weight — see theme/fonts.ts for why
 * naming the face is not optional on Android.
 */

/** The names the design system uses. Reach for these first. */
export type TypographyToken =
  | 'display'
  | 'screenTitle'
  | 'sectionTitle'
  | 'cardTitle'
  | 'body'
  | 'bodyMedium'
  | 'label'
  | 'small'
  | 'caption'
  | 'button'
  | 'input'
  | 'placeholder';

export const typographyTokens: Record<TypographyToken, TextStyle> = {
  /** The one oversized line on a screen — a hero heading, nothing else. */
  display: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  /** The header's own title, and anything that names the whole screen. */
  screenTitle: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  sectionTitle: { fontSize: 18, fontWeight: '700', lineHeight: 24 },
  cardTitle: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 21 },
  /** Body weight for a line that has to carry more than the one beside it. */
  bodyMedium: { fontSize: 15, fontWeight: '500', lineHeight: 21 },
  /** The small line above a value in a form row. */
  label: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: '400', lineHeight: 14 },
  button: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  input: { fontSize: 15, fontWeight: '400', lineHeight: 20 },
  placeholder: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
};

/**
 * The names the app already writes, mapped onto the tokens above.
 *
 * `EventlyText` is used in some seven hundred places with `variant="h2"` and
 * the like, and renaming all of them in one change would be a diff nobody
 * could review against a design system nobody could check. They are aliases,
 * not a second scale: each one *is* a token, so a screen written either way
 * renders identically and new work can use the semantic name.
 */
const legacyAliases = {
  h1: typographyTokens.screenTitle,
  h2: typographyTokens.sectionTitle,
  subtitle: typographyTokens.bodyMedium,
} as const;

export type EventlyTextVariant = TypographyToken | keyof typeof legacyAliases;

export const typography: Record<EventlyTextVariant, TextStyle> = {
  ...typographyTokens,
  ...legacyAliases,
};
