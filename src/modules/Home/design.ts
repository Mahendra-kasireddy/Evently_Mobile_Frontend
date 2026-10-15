import type { TextStyle } from 'react-native';

import { typography } from '../../theme';
/**
 * "Marigold Hour" — Home's visual identity.
 *
 * The light of an Indian celebration at dusk: deep aubergine night above,
 * warm ivory paper below, and marigold, sindoor and rose carrying the colour.
 * It replaces the rainbow of per-section gradients with one curated palette,
 * so colour reads as intent — marigold means "act", jade means "trusted",
 * rose means "loved" — rather than as decoration.
 *
 * Scoped to Home for now. Once the Home screen is signed off, these are the
 * tokens the remaining screens move onto.
 */
export const HOME_INK = {
  /** The night: hero scrims, the tab bar's active pill, primary type. */
  night: '#1c1326',
  /** Primary text on paper. A plum-black, warmer than navy. */
  ink: '#241b2f',
  /** Secondary text. */
  inkSoft: '#6b6275',
  /** Placeholder / unanswered. */
  inkFaint: '#a39aa9',
} as const;

export const HOME_PAPER = {
  /** The page. Warm ivory, not grey-white. */
  canvas: '#faf6f0',
  /** Cards. */
  card: '#ffffff',
  /** A recessed well inside a card (selector tiles). */
  well: '#f7f1e8',
  /** Hairlines between and around things. */
  hairline: '#eee5d8',
} as const;

export const HOME_ACCENT = {
  marigold: '#f2a63b',
  saffron: '#e9782b',
  sindoor: '#d9462f',
  rose: '#d35d7e',
  jade: '#1e8a6e',
  lapis: '#3557a8',
  /** The tinted wash behind a marigold mark. */
  marigoldSoft: '#fdeccf',
  roseSoft: '#fbe4ea',
  jadeSoft: '#dff2ea',
} as const;

/** The one action gradient: marigold into sindoor. Used for "do this". */
export const HOME_ACTION_GRADIENT: [string, string] = ['#f29a3b', '#d9462f'];

/** The Border Beam's light: marigold, rose, a breath of lilac. */
export const HOME_BEAM_COLORS = ['#ffd27a', '#f28b54', '#e0638d', '#b48cff'];

/** Thinking orbs: the three celebration colours. */
export const HOME_ORB_COLORS: [string, string, string] = [
  '#f2a63b',
  '#e0638d',
  '#8d6bf0',
];

/**
 * Display headings on Home. Inter only — the serif face is retired so Home
 * reads as the same app as every other screen. Sizes snap to the type scale.
 */
export const displayType = (size: number): TextStyle =>
  size >= 30
    ? typography.display
    : size >= 24
    ? typography.h1
    : size >= 19
    ? typography.h2
    : typography.h3;

/** The small uppercase line above a heading. */
export const EYEBROW: TextStyle = {
  ...typography.overline,
};

/** A greeting for the hour, so the hero speaks to now. */
export function greetingFor(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return 'Good evening';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
