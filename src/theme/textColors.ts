import { colors } from './colors';

/**
 * Text colours, per appearance. Text never picks its own hex — it names one
 * of these and AppText resolves it for the current scheme.
 */
export const textColors = {
  light: {
    textPrimary: '#1A1A1A',
    textSecondary: '#6B6B6B',
    textDisabled: '#A3A3A3',
    textOnPrimary: '#FFFFFF',
    textLink: colors.primary,
    textError: colors.danger,
  },
  dark: {
    textPrimary: '#E6E6E6',
    textSecondary: '#A0A0A0',
    textDisabled: '#5C5C5C',
    textOnPrimary: '#FFFFFF',
    textLink: '#818CF8',
    textError: '#F87171',
  },
} as const;

export type TextColorToken = keyof (typeof textColors)['light'];
export type TextScheme = keyof typeof textColors;

/**
 * The light palette, for StyleSheets. A StyleSheet is static, so it holds the
 * light value; AppText recognises it and swaps in the dark counterpart when
 * the app is drawn dark.
 */
export const textColor = textColors.light;

/**
 * Which appearance text follows.
 *
 * 'light' until the screens' surfaces (backgrounds, cards, sheets) are themed
 * too: following the system today would put #E6E6E6 text on white cards.
 * Flip to 'system' and AppText follows the device setting with no other change.
 */
export const TEXT_APPEARANCE: 'light' | 'system' = 'light';
