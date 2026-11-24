/**
 * The organizer Home's look: the customer Home's "Marigold Hour" palette, so
 * the two sides read as one app, plus a colour per stat tile.
 */
export {
  HOME_ACCENT as ORG_ACCENT,
  HOME_ACTION_GRADIENT as ORG_ACTION_GRADIENT,
  HOME_INK as ORG_INK,
  HOME_ORB_COLORS as ORG_ORB_COLORS,
  HOME_PAPER as ORG_PAPER,
} from '../../modules/Home/design';

/** Each stat tile's icon and its tint. */
export const STAT_LOOK = {
  enquiries: { icon: 'message-text-outline', ink: '#6d4df2', soft: '#efeaff' },
  bookings: { icon: 'calendar-check-outline', ink: '#0f8a68', soft: '#dff2ea' },
  earnings: { icon: 'wallet-outline', ink: '#c7741a', soft: '#fdeccf' },
  rating: { icon: 'star-outline', ink: '#d35d7e', soft: '#fbe4ea' },
} as const;

/** The tier medal's colours. */
export const TIER_LOOK: Record<
  string,
  { ink: string; soft: string; gradient: [string, string] }
> = {
  Silver: { ink: '#5d6674', soft: '#eef0f3', gradient: ['#c9ced6', '#8a93a1'] },
  Gold: { ink: '#a8730f', soft: '#fdf0cf', gradient: ['#ffd877', '#d99a1e'] },
  Platinum: {
    ink: '#3557a8',
    soft: '#e5ebf8',
    gradient: ['#b8c8ef', '#5a76c4'],
  },
};
