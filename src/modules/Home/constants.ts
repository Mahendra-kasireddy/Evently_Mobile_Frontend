import { colors } from '../../theme';
import type {
  BookedEventStatus,
  CurrentEventStage,
  EventSource,
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
export const ORGANIZER_BY_ID_ENDPOINT = '/organizer/getOrganizerById';

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

// ---------------------------------------------------------------------------
// Home hero — the "your event" card that floats at the foot of the banner.
//
// Every value in that card comes from the signed-in customer: either their own
// record via GET /home/getHomeFeed's `currentEvent`, or the planner draft they
// are assembling right now. Nothing below is a sample value — these constants
// are labels, empty-state copy and per-field "not set yet" text, so a fact the
// customer's record genuinely does not carry reads as blank instead of showing
// a plausible-looking date, city or headcount.
// ---------------------------------------------------------------------------

/**
 * Header above the card once there is a real event. In draft mode the card
 * uses the backend's own `hero.draftLabel` instead, so that copy stays
 * editable without a release.
 */
export const EVENT_SUMMARY_LABEL = 'Your event · tap to open';

/** Draft mode's action — the existing "request quotes" flow, unchanged. */
export const EVENT_SUMMARY_DRAFT_CTA = 'Get quotes';

/**
 * Shown in place of a value the customer's record does not hold. Worded per
 * field so the row still reads as a sentence, and never as a real answer.
 */
export const EVENT_SUMMARY_FIELD_EMPTY: Record<keyof HeroDraft, string> = {
  occasion: 'Not chosen yet',
  when: 'Date not set',
  where: 'Place not set',
  guests: 'Guest count not set',
};

/**
 * The footer action names the destination it actually opens, which differs by
 * which record the event resolved from. A quote request has no screen of its
 * own in the app yet, so it opens the plan it came from and says so, rather
 * than promising a request view that does not exist.
 */
export const EVENT_SUMMARY_OPEN_CTA: Record<EventSource, string> = {
  plan: 'Continue planning',
  quote: 'Review your plan',
  booking: 'View booking',
};

/** Neither a real event nor a draft — only reachable if hero content is empty. */
export const EVENT_SUMMARY_EMPTY = {
  title: 'No event yet',
  body: 'Tell us the occasion, the date, where it is and how many are coming — organizers take it from there.',
};

export const EVENT_SUMMARY_ERROR = {
  title: "Couldn't load your event",
  cta: 'Try again',
};

// ---------------------------------------------------------------------------
// Home's "BOOKED" card — the ongoing booking, shown in place of the compact
// current-event widget once the customer actually has one.
// ---------------------------------------------------------------------------

/**
 * A booking awaiting the organizer's acceptance still reads "BOOKED": the
 * customer has chosen an organizer and paid, so from their side the event is
 * booked. What is outstanding is the organizer's confirmation, which the
 * card's sub-line (composed by the backend) states outright rather than hiding
 * behind a vaguer badge.
 */
export const BOOKED_STATUS_LABEL: Record<BookedEventStatus, string> = {
  pending: 'BOOKED',
  awaiting_organizer: 'BOOKED',
  confirmed: 'BOOKED',
  in_progress: 'IN PROGRESS',
};

export const BOOKED_CTA = 'Open workspace';

// Web's --color-green, used for a completed milestone's tick. Scoped to this
// card, like the other ported hero tokens above.
export const BOOKED_STEP_DONE_COLOR = '#1d9e75';
export const BOOKED_STEP_PENDING_COLOR = '#e6e9f0';
export const BOOKED_RING_TRACK_COLOR = '#eef0f4';

/**
 * Ring geometry, matching the reference design's phone breakpoint: a 76px ring
 * inside an 84px wash disc.
 */
export const BOOKED_RING_SIZE = 76;
export const BOOKED_RING_STROKE = 9;
export const BOOKED_RING_RADIUS = (BOOKED_RING_SIZE - BOOKED_RING_STROKE - 2) / 2;
export const BOOKED_RING_CIRCUMFERENCE = 2 * Math.PI * BOOKED_RING_RADIUS;
export const BOOKED_RING_DISC = 84;

// ---------------------------------------------------------------------------
// "Top organizers near you".
// ---------------------------------------------------------------------------

/**
 * Stars are drawn from the organizer's actual rating: `rating` filled, the
 * rest outlined. The web card draws five filled stars unconditionally, which
 * shows a brand-new organizer with no reviews as a five-star business — see
 * TopOrganizers.tsx.
 */
export const ORGANIZER_STAR_COUNT = 5;

export const ORGANIZER_TIER_ICON = 'medal-outline';

export const ORGANIZER_COPY = {
  viewProfile: 'View Profile',
  getQuote: 'Get quote',
  requestSent: 'Request sent',
  noRating: 'No reviews yet',
  scopeWithCity: (city: string) =>
    `No organizers in ${city} yet — showing highly-rated organizers from other areas.`,
  scopeNoCity: 'Set your location to see organizers near you. Showing highly-rated organizers for now.',
  emptyTitle: 'Looking for organizers in your area?',
  emptyWithCity: (city: string) =>
    `We couldn't find organizers in ${city} yet. You can change your city any time.`,
  emptyNoCity: "We couldn't find organizers nearby yet. Setting your city helps us match you.",
  emptyCta: 'Change city',
};

// ---------------------------------------------------------------------------
// "Curated packages by budget".
// ---------------------------------------------------------------------------

/**
 * The card's action. It opens the planner pre-set to this package's occasion —
 * the app has no package detail screen, and a button reading "Explore package"
 * has to land somewhere that is actually about that package.
 */
export const PACKAGE_EXPLORE_CTA = 'Explore package';
