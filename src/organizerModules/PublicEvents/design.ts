/** Public events on the customer Home's palette: ivory paper, white cards, marigold for "do this". */
export {
  HOME_ACCENT as ORG_ACCENT,
  HOME_ACTION_GRADIENT as ORG_ACTION_GRADIENT,
  HOME_INK as ORG_INK,
  HOME_ORB_COLORS as ORG_ORB_COLORS,
  HOME_PAPER as ORG_PAPER,
} from '../../modules/Home/design';
import type { Tone } from './types';

export const STATUS_TONE: Record<Tone, { ink: string; soft: string }> = {
  amber: { ink: '#b8680f', soft: '#fdeccf' },
  green: { ink: '#0f7a5c', soft: '#dff2ea' },
  blue: { ink: '#2b5aa8', soft: '#e5ebf8' },
  grey: { ink: '#6b6275', soft: '#efedf1' },
  red: { ink: '#c2361f', soft: '#fde4df' },
};

export const DANGER = '#c2361f';
export const DANGER_SOFT = '#fde4df';
export const WARN_INK = '#8a5410';
export const OVERLAY = 'rgba(28,19,38,0.45)';
export const WHITE = '#ffffff';
