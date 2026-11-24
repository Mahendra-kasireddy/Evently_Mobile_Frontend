/** Sub-vendors on the customer Home's palette, plus chip and gauge tones. */
export {
  HOME_ACCENT as ORG_ACCENT,
  HOME_ACTION_GRADIENT as ORG_ACTION_GRADIENT,
  HOME_INK as ORG_INK,
  HOME_ORB_COLORS as ORG_ORB_COLORS,
  HOME_PAPER as ORG_PAPER,
} from '../../modules/Home/design';
import type { ChipTone, PerformanceTone } from './types';

export const CHIP_TONE: Record<ChipTone, { ink: string; soft: string }> = {
  green: { ink: '#0f7a5c', soft: '#dff2ea' },
  amber: { ink: '#b8680f', soft: '#fdeccf' },
  grey: { ink: '#6b6275', soft: '#efedf1' },
};

/** The performance bar: jade when reliable, marigold when patchy, sindoor when low. */
export const PERFORMANCE_TONE: Record<PerformanceTone, string> = {
  good: '#1e8a6e',
  fair: '#f2a63b',
  low: '#d9462f',
};

/** Avatar tints, picked by the link id so a card keeps its colour. */
export const AVATAR_TINTS: Array<[string, string]> = [
  ['#ff8a5c', '#e8433a'],
  ['#a084ff', '#5a35e0'],
  ['#3cc9a1', '#0e8a68'],
  ['#5b9bff', '#2554b8'],
  ['#ffc65c', '#e8902a'],
  ['#f48fb1', '#d35d7e'],
];
