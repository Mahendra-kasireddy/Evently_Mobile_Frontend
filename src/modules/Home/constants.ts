import { colors } from '../../theme';
import type {
  CurrentEventStage,
  HeroDraft,
  HowStepIcon,
  OccasionArtKey,
  OccasionIcon,
  OrganizerTier,
  ToolIcon,
  TrustIcon,
} from './types';

export const HOME_FEED_ENDPOINT = '/home/getHomeFeed';
export const REQUEST_QUOTES_ENDPOINT = '/quote/requestQuotes';

// Field order/icons for the hero "your event so far" draft bar — mirrors
// web's FIELD_DEFS (occasion/when/where/guests, in that order).
export const HERO_FIELD_ORDER: Array<keyof HeroDraft> = ['occasion', 'when', 'where', 'guests'];

export const HERO_FIELD_ICON_NAME: Record<keyof HeroDraft, string> = {
  occasion: 'heart-outline',
  when: 'calendar-blank-outline',
  where: 'map-marker-outline',
  guests: 'account-group-outline',
};

export const HERO_FIELD_LABEL: Record<keyof HeroDraft, string> = {
  occasion: 'Occasion',
  when: 'When',
  where: 'Where',
  guests: 'Guests',
};

// MaterialCommunityIcons equivalents of web's lucide-react trust icons.
export const TRUST_ICON_NAME: Record<TrustIcon, string> = {
  zap: 'lightning-bolt-outline',
  shield: 'shield-check-outline',
  star: 'star-outline',
};

// Web's actual Hero.module.css tokens — a deep navy hero with warm-orange
// accents, not the app's bright indigo primary. Scoped to this section only.
export const HERO_BACKGROUND_COLOR = '#0e1a33'; // --color-navy-deep
export const HERO_ACCENT_COLOR = '#e8633a'; // --color-primary
export const HERO_ACCENT_WARM_COLOR = '#ff8b5e'; // --color-accent-warm
export const HERO_FIELD_ICON_BG = '#fdeee7'; // --color-primary-soft
export const HERO_DECOR_CIRCLE_COLOR = 'rgba(232, 99, 58, 0.45)';

// MaterialCommunityIcons glyph names — 'creation' is MDI's sparkle/magic mark,
// the closest match since MDI has no icon literally named "sparkles".
export const CATEGORY_ICON_NAME: Record<OccasionIcon, string> = {
  heart: 'heart',
  gift: 'gift',
  home: 'home',
  sparkles: 'creation',
  star: 'star',
  briefcase: 'briefcase',
};

// Ported verbatim from the web app's PlanGrid.tsx GRADIENTS map (165deg linear
// gradients) — scoped to this card only, not the app-wide theme.
export const CATEGORY_GRADIENT: Record<OccasionArtKey, [string, string]> = {
  wedding: ['#243a6b', '#0e1a33'],
  birthday: ['#5a2a30', '#2a1216'],
  housewarming: ['#16403a', '#08201c'],
  naming: ['#3a2a5e', '#181233'],
  anniversary: ['#5a3c1c', '#2e2010'],
  corporate: ['#243a6b', '#0e1a33'],
};

// Web's --color-navy, used for the icon badge glyph — scoped to this card only.
export const CATEGORY_ICON_BADGE_COLOR = '#1a2e5a';

// MaterialCommunityIcons equivalents of web's lucide-react icons for the
// "How Evently works" steps.
export const HOW_STEP_ICON_NAME: Record<HowStepIcon, string> = {
  edit: 'square-edit-outline',
  file: 'file-document-outline',
  chart: 'chart-bar',
  shield: 'shield-check-outline',
};

// Web's icon-chip tint for HowItWorks cards: bg #fbede7 (primary tint), icon
// color var(--color-primary) #e8633a — scoped to this section only.
export const HOW_STEP_ICON_BG = '#fbede7';
export const HOW_STEP_ICON_COLOR = '#e8633a';
export const HOW_STEP_NUMBER_COLOR = '#eef1f7';

// MaterialCommunityIcons equivalents of web's lucide-react icons for the
// "Plan smarter" tools.
export const TOOL_ICON_NAME: Record<ToolIcon, string> = {
  wallet: 'wallet-outline',
  users: 'account-group-outline',
  list: 'format-list-checks',
  bell: 'bell-outline',
};

// Distinct accent color per tool tile — reuses existing app theme tokens
// (no new hex values) so the grid reads as a set of colorful feature tiles
// instead of one flat neutral badge repeated four times.
export const TOOL_ICON_COLOR: Record<ToolIcon, string> = {
  wallet: colors.primary,
  users: colors.accent,
  list: colors.success,
  bell: colors.tierPlatinum,
};

// Existing app theme tier colors (already defined, previously unused).
export const ORGANIZER_TIER_COLOR: Record<OrganizerTier, string> = {
  Gold: colors.tierGold,
  Silver: colors.tierSilver,
  Platinum: colors.tierPlatinum,
};

// Human-facing label + color per backend CurrentEventStage (home/current-event.service.ts's
// 8-stage journey) — so the "current event" card tells the customer exactly where things
// stand (e.g. "Awaiting organizer response") instead of just a title + progress bar.
export const CURRENT_EVENT_STAGE_LABEL: Record<CurrentEventStage, string> = {
  draft: 'Plan in progress',
  submitted: 'Awaiting organizer response',
  quotes_received: 'Quotes received',
  quote_accepted: 'Quote accepted',
  booking_created: 'Booking placed',
  booking_confirmed: 'Booking confirmed',
  in_progress: 'Event in progress',
  completed: 'Event completed',
};

export const CURRENT_EVENT_STAGE_COLOR: Record<CurrentEventStage, string> = {
  draft: colors.textMuted,
  submitted: colors.textMuted,
  quotes_received: colors.primary,
  quote_accepted: colors.primary,
  booking_created: colors.primary,
  booking_confirmed: colors.success,
  in_progress: colors.success,
  completed: colors.success,
};
