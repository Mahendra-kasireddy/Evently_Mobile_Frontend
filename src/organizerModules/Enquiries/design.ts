/** Enquiries on the customer Home's palette, plus one tone per chip. */
export {
  HOME_ACCENT as ORG_ACCENT,
  HOME_ACTION_GRADIENT as ORG_ACTION_GRADIENT,
  HOME_INK as ORG_INK,
  HOME_ORB_COLORS as ORG_ORB_COLORS,
  HOME_PAPER as ORG_PAPER,
} from '../../modules/Home/design';
import type { ChipTone } from './types';

export const CHIP_TONE: Record<ChipTone, { ink: string; soft: string }> = {
  violet: { ink: '#5a35e0', soft: '#efeaff' },
  amber: { ink: '#b8680f', soft: '#fdeccf' },
  red: { ink: '#c2361f', soft: '#fde4df' },
  green: { ink: '#0f7a5c', soft: '#dff2ea' },
  grey: { ink: '#6b6275', soft: '#efedf1' },
  blue: { ink: '#2b5aa8', soft: '#e5ebf8' },
};

/** Avatar tints, picked by the enquiry's id so a card keeps its colour. */
export const AVATAR_TINTS: Array<[string, string]> = [
  ['#ff8a5c', '#e8433a'],
  ['#a084ff', '#5a35e0'],
  ['#3cc9a1', '#0e8a68'],
  ['#5b9bff', '#2554b8'],
  ['#ffc65c', '#e8902a'],
  ['#f48fb1', '#d35d7e'],
];
