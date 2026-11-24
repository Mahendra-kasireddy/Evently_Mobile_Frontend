/** Academy on the customer Home's palette; its hero is jade, the colour of "trusted". */
export {
  HOME_ACCENT as ORG_ACCENT,
  HOME_ACTION_GRADIENT as ORG_ACTION_GRADIENT,
  HOME_INK as ORG_INK,
  HOME_ORB_COLORS as ORG_ORB_COLORS,
  HOME_PAPER as ORG_PAPER,
} from '../../modules/Home/design';

export const HERO_GRADIENT: [string, string] = ['#1e8a6e', '#0d4f3f'];
export const RING_TRACK = 'rgba(255,255,255,0.18)';
export const RING_FILL = '#8fe0bd';

/** Each stage's colour. */
export const STAGE_TINT: Record<
  1 | 2 | 3,
  { gradient: [string, string]; soft: string; ink: string }
> = {
  1: { gradient: ['#ff8a5c', '#e8433a'], soft: '#fde7dc', ink: '#d9462f' },
  2: { gradient: ['#a084ff', '#5a35e0'], soft: '#efeaff', ink: '#5a35e0' },
  3: { gradient: ['#ffc65c', '#e8902a'], soft: '#fdeccf', ink: '#b8680f' },
};
