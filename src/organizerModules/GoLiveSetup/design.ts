/** Go-live setup on the customer app's look: Home's ivory paper, ink and marigold action. */
export {
  HOME_ACCENT as ORG_ACCENT,
  HOME_ACTION_GRADIENT as ORG_ACTION_GRADIENT,
  HOME_INK as ORG_INK,
  HOME_ORB_COLORS as ORG_ORB_COLORS,
  HOME_PAPER as ORG_PAPER,
} from '../../modules/Home/design';

/** The status card's tone per lifecycle phase. */
export const PHASE_TONE = {
  submitted: { icon: 'clock-outline', gradient: ['#a084ff', '#5a35e0'] },
  approved: { icon: 'check-decagram', gradient: ['#3cc9a1', '#0e8a68'] },
  rejected: { icon: 'close-circle-outline', gradient: ['#ff8a8a', '#d9462f'] },
  pending: { icon: 'account-clock-outline', gradient: ['#ffc65c', '#e8902a'] },
} as const satisfies Record<
  string,
  { icon: string; gradient: readonly [string, string] }
>;

/** The changes-requested banner. */
export const CHANGES_TONE = {
  ink: '#8a4b06',
  soft: '#fff3dc',
  border: '#f6d59a',
} as const;

/** Errors and the rejected banner. */
export const DANGER = {
  ink: '#a3301c',
  soft: '#fde4df',
  border: '#d9462f',
} as const;
