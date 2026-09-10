import type { TextStyle } from 'react-native';

/**
 * The type scale, tuned for Poppins.
 *
 * Poppins has a tall x-height and wide, geometric letterforms, so it reads a
 * size larger than the platform faces this scale was first set for. Two things
 * follow, and both are here rather than sprinkled through the screens:
 *
 *  - every level states its own `lineHeight`. Poppins' default leading is
 *    tight for its x-height, and headings set without it collide on the second
 *    line — which is exactly where a two-line event title lands.
 *  - the display sizes carry negative tracking. Poppins is wide by default;
 *    without it, a heading at 24pt or more looks spaced out rather than set.
 *
 * `fontWeight` stays declared here (and in the screens) because it is the
 * honest way to say how heavy the text should be. `EventlyText` translates it
 * into the Poppins face that carries that weight — see theme/fonts.ts for why
 * naming the face is not optional on Android.
 */
export const typography: Record<'h1' | 'h2' | 'subtitle' | 'body' | 'caption', TextStyle> = {
  h1: { fontSize: 24, fontWeight: '700', lineHeight: 32, letterSpacing: -0.4 },
  h2: { fontSize: 18, fontWeight: '700', lineHeight: 25, letterSpacing: -0.2 },
  subtitle: { fontSize: 15, fontWeight: '600', lineHeight: 21 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 17 },
};
