/** The invitation editor on the customer app's look: ivory paper, ink, marigold action. */
export {
  HOME_ACCENT as ORG_ACCENT,
  HOME_ACTION_GRADIENT as ORG_ACTION_GRADIENT,
  HOME_INK as ORG_INK,
  HOME_ORB_COLORS as ORG_ORB_COLORS,
  HOME_PAPER as ORG_PAPER,
} from '../../modules/Home/design';

export const WHITE = '#ffffff';
export const OVERLAY = 'rgba(28,19,38,0.45)';

/** Status chip tones per phase. */
export const PHASE_TONE = {
  draft: { ink: '#6b6275', soft: '#efedf1', icon: 'pencil-outline' },
  sent: { ink: '#2b5aa8', soft: '#e5ebf8', icon: 'clock-outline' },
  changes: { ink: '#8a4b06', soft: '#fff3dc', icon: 'message-alert-outline' },
  approved: { ink: '#0f7a5c', soft: '#dff2ea', icon: 'check-decagram' },
} as const;

/** Change requests banner. */
export const CHANGES_TONE = {
  ink: '#8a4b06',
  soft: '#fff3dc',
  border: '#f6d59a',
} as const;

export const DANGER = {
  ink: '#c2361f',
  soft: '#fde4df',
  border: '#d9462f',
} as const;
