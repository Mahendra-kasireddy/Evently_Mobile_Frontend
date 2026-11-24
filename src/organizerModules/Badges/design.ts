/** Badges on the customer Home's palette, plus each tier's metal. */
export {
  HOME_ACCENT as ORG_ACCENT,
  HOME_INK as ORG_INK,
  HOME_ORB_COLORS as ORG_ORB_COLORS,
  HOME_PAPER as ORG_PAPER,
} from '../../modules/Home/design';

export interface TierLook {
  gradient: [string, string];
  ink: string;
  soft: string;
}

export const TIER_LOOK: Record<string, TierLook> = {
  Bronze: { gradient: ['#e0a46e', '#9c5a2b'], ink: '#8a4f24', soft: '#f7e6d8' },
  Silver: { gradient: ['#c9ced6', '#7d8796'], ink: '#5d6674', soft: '#eef0f3' },
  Gold: { gradient: ['#ffd877', '#d99a1e'], ink: '#a8730f', soft: '#fdf0cf' },
  Platinum: {
    gradient: ['#b8c8ef', '#4f6bbd'],
    ink: '#3557a8',
    soft: '#e5ebf8',
  },
};

export const tierLook = (tier: string): TierLook =>
  TIER_LOOK[tier] ?? TIER_LOOK.Silver;
