import { Platform, type TextStyle } from 'react-native';

/**
 * Inter, bundled with the app — the only typeface Evently's UI uses.
 *
 * Four faces, one per weight the design system allows (400 / 500 / 600 / 700).
 * Android ignores `fontWeight` on a custom family and quietly renders Regular,
 * so every weight is its own face and is always selected by name.
 *
 * The name differs per platform: Android resolves a family by the asset's file
 * name (`Inter_600SemiBold`), iOS by the face's PostScript name
 * (`Inter-SemiBold`).
 */
const face = (ios: string, android: string): string =>
  Platform.select({ ios, android, default: android }) as string;

export const fontFamilies = {
  regular: face('Inter-Regular', 'Inter_400Regular'),
  medium: face('Inter-Medium', 'Inter_500Medium'),
  semibold: face('Inter-SemiBold', 'Inter_600SemiBold'),
  bold: face('Inter-Bold', 'Inter_700Bold'),
} as const;

export type FontWeightName = keyof typeof fontFamilies;

/**
 * Weight-only overrides, for the rare line that must be heavier than its
 * variant (a name inside a sentence, a notification title set in `body`).
 * Spread one after a variant: `{ ...typography.body, ...fontWeights.semibold }`.
 */
export const fontWeights: Record<FontWeightName, TextStyle> = {
  regular: { fontFamily: fontFamilies.regular },
  medium: { fontFamily: fontFamilies.medium },
  semibold: { fontFamily: fontFamilies.semibold },
  bold: { fontFamily: fontFamilies.bold },
};

/**
 * The Inter face for a numeric weight. Only four are bundled, so anything
 * else rounds to the nearest: lighter than 400 → Regular, heavier than 700 →
 * Bold. A missing face on Android falls back to Roboto, which is far more
 * visible than a weight being a step off.
 */
export function fontFor(weight: TextStyle['fontWeight']): string {
  switch (weight) {
    case '500':
    case 500:
      return fontFamilies.medium;
    case '600':
    case 600:
      return fontFamilies.semibold;
    case '700':
    case 700:
    case '800':
    case 800:
    case '900':
    case 900:
    case 'bold':
      return fontFamilies.bold;
    default:
      return fontFamilies.regular;
  }
}
