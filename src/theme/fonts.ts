import type { TextStyle } from 'react-native';

/**
 * Poppins, bundled with the app.
 *
 * Android does not synthesise weights for a custom family — `fontWeight: '700'`
 * on a `fontFamily: 'Poppins'` is silently ignored and you get Regular. The
 * only reliable way to get a bold Poppins on both platforms is to name the
 * face itself, which is why every weight is a separate file and this map
 * exists: styles keep writing `fontWeight`, and `EventlyText` turns that into
 * the face that actually carries it.
 *
 * The names are the files linked by `react-native.config.js` — on Android the
 * asset filename is the family name, and on iOS these are the faces' own
 * PostScript names, so one string works for both.
 */
export const fontFamilies = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  extrabold: 'Poppins-ExtraBold',
} as const;

/**
 * The face for a weight.
 *
 * Poppins ships nine and five are bundled. The design system uses four — 400,
 * 500, 600, 700 — and ExtraBold stays mapped for anything that still asks for
 * it, so a weight always resolves to a real face. Anything between the
 * bundled ones rounds to the nearest rather than falling back to the system
 * font: a missing face on Android renders as Roboto, which is far more visible
 * than a weight being 100 heavier than asked for.
 */
export function fontFor(weight: TextStyle['fontWeight']): string {
  switch (weight) {
    case '100':
    case '200':
    case '300':
    case '400':
    case 'normal':
    case undefined:
      return fontFamilies.regular;
    case '500':
      return fontFamilies.medium;
    case '600':
      return fontFamilies.semibold;
    case '700':
    case 'bold':
      return fontFamilies.bold;
    case '800':
    case '900':
      return fontFamilies.extrabold;
    default:
      return fontFamilies.regular;
  }
}
