/** Calendar on the customer Home's palette, plus one tone per booking status. */
export {
  HOME_ACCENT as ORG_ACCENT,
  HOME_ACTION_GRADIENT as ORG_ACTION_GRADIENT,
  HOME_INK as ORG_INK,
  HOME_ORB_COLORS as ORG_ORB_COLORS,
  HOME_PAPER as ORG_PAPER,
} from '../../modules/Home/design';
import type { StatusTone } from './types';

export const STATUS_TONE: Record<StatusTone, { ink: string; soft: string }> = {
  amber: { ink: '#b8680f', soft: '#fdeccf' },
  green: { ink: '#0f7a5c', soft: '#dff2ea' },
  blue: { ink: '#2b5aa8', soft: '#e5ebf8' },
  grey: { ink: '#6b6275', soft: '#efedf1' },
  red: { ink: '#c2361f', soft: '#fde4df' },
};

/** Day-cell colours. */
export const DAY_LOOK = {
  booked: '#e9782b',
  bookedText: '#ffffff',
  blocked: '#ece7ef',
  blockedInk: '#8a8191',
  picked: '#fde4df',
  pickedInk: '#c2361f',
  todayRing: '#e9782b',
  selected: '#241b2f',
} as const;
