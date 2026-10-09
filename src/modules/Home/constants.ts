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
export const HERO_FIELD_ORDER: Array<keyof HeroDraft> = [
  'occasion',
  'when',
  'where',
  'guests',
];

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
/** The one line in the header's search field — what can actually be searched. */

/** The rule above the card, which separates the pitch from the form. */

/**
 * Shortcuts under the four rows.
 *
 * Words rather than dates because the customer thinks in these terms before
 * they think in a date — and each one still sets a real day, so the When row
 * updates to show exactly what was chosen.
 */
export const QUICK_DATES: Array<{
  label: string;
  kind: 'weekend' | 'months';
  months?: number;
}> = [
  { label: 'This weekend', kind: 'weekend' },
  { label: 'Next month', kind: 'months', months: 1 },
  { label: '2 months', kind: 'months', months: 2 },
  { label: '3 months', kind: 'months', months: 3 },
];

export const QUICK_DATES_LABEL = 'Quick dates';

export const BUDGET_TOGGLE_COPY = {
  title: 'Share my budget range',
  link: 'Know more',
  /* Shown once the toggle is on and nothing is picked, so the row is never a
     blank that looks broken. */
  placeholder: 'Pick a range',
  explainer:
    'Organizers quote to the range you give them, so the replies come back comparable. Leave it off and you will still get quotes — they just start from scratch.',
} as const;

export const GET_QUOTES_CTA = 'Get quotes';

/** Which Home section the See-all screen is showing. */
export type SeeAllKind = 'events' | 'offers';

export const SEE_ALL_COPY: Record<
  SeeAllKind,
  {
    title: string;
    countOne: string;
    countMany: string;
    emptyTitle: string;
    emptyBody: string;
  }
> = {
  events: {
    title: 'Your events',
    countOne: '1 event',
    countMany: 'events',
    emptyTitle: 'Nothing live right now',
    emptyBody:
      'Plans you start and requests you send will appear here until they are booked or closed.',
  },
  offers: {
    title: 'Coupons for you',
    countOne: '1 offer',
    countMany: 'offers',
    emptyTitle: 'No offers right now',
    emptyBody:
      'Coupons appear here while they are live and you have uses left. There are none at the moment.',
  },
};

export const HERO_BACKGROUND_COLOR = '#0e1a33'; // --color-navy-deep

// The screen's own tokens, matching the other ported surfaces.
/**
 * How many of the customer's other live events Home lists before linking to
 * the Events tab. Three fits above the fold beside the leading card, and keeps
 * Home the same length for a customer with four events and one with forty.
 */
export const OTHER_EVENTS_ON_HOME = 3;

/*
 * The package card's action and the line above its price.
 *
 * "Get quotes", not "Book" or "Get ticket": tapping it opens the planner with
 * this package's occasion filled in, and what comes back is organizers' prices
 * for the customer's own event. Nothing on this card is bookable as it stands
 * — the figure beside it is where that organizer's pricing starts, which is
 * exactly what "Start from" says.
 */
export const PACKAGE_CTA = 'Get quotes';
export const PACKAGE_PRICE_CAPTION = 'Start from';

export const HOME_NAVY = '#1a2e5a';
export const HOME_NAVY_DEEP = '#0e1a33';
/** One step lighter than the hero, for a panel sitting on it. */
export const HOME_NAVY_PANEL = '#1b2a49';
export const HOME_ACCENT_SOFT = '#fdeee7';
export const HOME_GREEN = '#1d9e75';
/** The wash behind a green pill — web's --color-green-soft. */
export const HOME_GREEN_SOFT = '#e8f6ef';
export const HOME_CANVAS = '#faf8f7';
/** Down the Home page: warm peach at the top, soft lavender by the bottom. */
export const HOME_PAGE_GRADIENT: [string, string] = ['#fff1e8', '#f3eefe'];
export const HOME_HAIRLINE = '#efe9e5';
export const HOME_TRACK = '#f0ecea';
export const HERO_ACCENT_COLOR = '#e8633a'; // --color-primary
/*
 * The warm sweep on "Get quotes", left to right.
 *
 * It starts on the brand coral and runs into amber. The reference it comes
 * from ends much paler than this — a near-cream — and white type on that is
 * not readable, so the run stops where the label still holds. Same colour
 * family, same movement, a button you can still read at the right-hand end.
 */
export const CTA_GRADIENT: [string, string] = ['#e8633a', '#f0913f'];
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

/**
 * The light companion to CATEGORY_GRADIENT — one colour per occasion.
 *
 * The gradients above are deep, for white type on a dark card. These are the
 * same six occasions in their daylight form: a wash to sit a tile on, and an
 * ink dark enough to read on it.
 *
 * Colour here is doing a job rather than decorating. An occasion grid where
 * every tile is the same cream asks the customer to read six labels to find
 * one; give each its own hue and the grid is scanned instead of read, and the
 * same hue then follows that occasion onto every card about it.
 *
 * The hues are the ones the rest of the app already uses — the brand coral,
 * the violet the public-events module draws with, the green the workspace
 * marks progress in — so this is six familiar colours arranged, not a new
 * palette invented for one screen.
 */
export const OCCASION_TINT: Record<
  OccasionArtKey,
  { bg: string; ink: string; edge: string }
> = {
  /* Blush and rose. */
  wedding: { bg: '#fdeef3', ink: '#c2416b', edge: '#f7d8e3' },
  /* The brand's own coral — a birthday is the warmest thing on the grid. */
  birthday: { bg: '#fff0e7', ink: '#e8633a', edge: '#fadbc9' },
  /* Green, for a new house. */
  housewarming: { bg: '#e7f6f1', ink: '#12866e', edge: '#cfeae1' },
  /* The violet public events are drawn in. */
  naming: { bg: '#f0ecfe', ink: '#6d4df2', edge: '#ddd4fb' },
  /* Gold. */
  anniversary: { bg: '#fdf4e3', ink: '#a8780f', edge: '#f4e3c0' },
  /* Blue, which is the one occasion on this grid nobody is celebrating. */
  corporate: { bg: '#e9f0fd', ink: '#2b5aa8', edge: '#d4e2f8' },
};

/**
 * The occasion tiles' backgrounds: each occasion's tint deepening to its
 * edge colour, so the grid reads as six bright squares rather than six flat
 * washes.
 */
export const OCCASION_TILE_GRADIENT: Record<OccasionArtKey, [string, string]> =
  {
    wedding: ['#ffeaf1', '#fbc6d8'],
    birthday: ['#fff0e6', '#ffc6a3'],
    housewarming: ['#e6f7f0', '#b3e6d3'],
    naming: ['#f1ecff', '#d1c4fd'],
    anniversary: ['#fff5df', '#f6d894'],
    corporate: ['#e9f1ff', '#c2d7fb'],
  };

/**
 * A colour per section heading, so Home scans as a page rather than as one
 * long column of identical navy titles.
 *
 * Keyed by the section, not by position: moving a section up the page should
 * not change its colour, because the colour is part of how it is recognised.
 */
export const SECTION_TONE = {
  occasions: '#e8633a',
  events: '#6d4df2',
  packages: '#12866e',
  offers: '#a8780f',
  organizers: '#2b5aa8',
} as const;

export type SectionTone = keyof typeof SECTION_TONE;

/**
 * A gradient per heading, so the mark before a section title is a sweep rather
 * than a flat stripe. Same hue as SECTION_TONE above, lifted at one end.
 */
/** Each section's icon, drawn white on its gradient badge. */
export const SECTION_TONE_ICON: Record<SectionTone, string> = {
  occasions: 'party-popper',
  events: 'calendar-star',
  packages: 'gift-outline',
  offers: 'tag-heart-outline',
  organizers: 'account-star-outline',
};

export const SECTION_TONE_GRADIENT: Record<SectionTone, [string, string]> = {
  occasions: ['#f0913f', '#e8633a'],
  events: ['#8d72f6', '#5a35e0'],
  packages: ['#2fb894', '#0e7358'],
  offers: ['#d9a62a', '#92650b'],
  organizers: ['#4d86e0', '#1f4a94'],
};

/**
 * The four questions on the brief, each with its own gradient tile.
 *
 * A row of four identical navy glyphs is a list to read; four colours is a
 * form you can find your place in. Occasion deliberately leads with the brand
 * coral — it is the first question and the one the whole brief hangs off.
 */
export const HERO_FIELD_GRADIENT: Record<keyof HeroDraft, [string, string]> = {
  occasion: ['#f0913f', '#e8633a'],
  when: ['#8d72f6', '#5a35e0'],
  where: ['#2fb894', '#0e7358'],
  guests: ['#4d86e0', '#1f4a94'],
};

/**
 * The warm sweep behind a chosen quick date.
 *
 * Selected used to be an outline and a pale wash, which at a glance was hard
 * to tell from unselected. A filled sweep with white type is unmistakable,
 * and it is the same coral the button below it is.
 */
export const CHIP_SELECTED_GRADIENT: [string, string] = ['#f0913f', '#e8633a'];

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
export const TIER_COLOR: Record<OrganizerTier, string> = {
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

/**
 * The glyph on an occasion tile.
 *
 * Keyed on the occasion's own art key, which is what the backend sends, and
 * falling back to the neutral sparkle so a new occasion added in the admin
 * appears with a sensible icon rather than crashing the grid.
 */
export const OCCASION_TILE_ICON: Record<string, OccasionIcon> = {
  wedding: 'heart',
  birthday: 'gift',
  housewarming: 'home',
  naming: 'sparkles',
  anniversary: 'star',
  corporate: 'briefcase',
};

/**
 * What the hero's button offers, by stage.
 *
 * Each one leads somewhere that exists: comparing quotes needs quotes to have
 * arrived, opening a workspace needs a booking. A stage with nothing to do
 * yet says so plainly rather than offering an action that lands nowhere.
 */
export const CURRENT_EVENT_CTA: Record<CurrentEventStage, string> = {
  draft: 'Finish your plan',
  submitted: 'See your request',
  quotes_received: 'Compare quotes',
  /*
   * Not "See your booking" — there is no booking yet. Accepting picks the
   * organizer; the advance is what books it, and a button promising a booking
   * that does not exist sent customers looking for one.
   */
  quote_accepted: 'Pay the advance',
  booking_created: 'Open workspace',
  booking_confirmed: 'Open workspace',
  in_progress: 'Open workspace',
  completed: 'See what happened',
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
/** The warm cream the booked card's photo fades into on the left. */
export const BOOKED_CARD_PHOTO_BG = '#fbf3ee';

/**
 * Ring geometry, matching the reference design's phone breakpoint: a 76px ring
 * inside an 84px wash disc.
 */
export const BOOKED_RING_SIZE = 76;
export const BOOKED_RING_STROKE = 9;
export const BOOKED_RING_RADIUS =
  (BOOKED_RING_SIZE - BOOKED_RING_STROKE - 2) / 2;
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
  scopeNoCity:
    'Set your location to see organizers near you. Showing highly-rated organizers for now.',
  emptyTitle: 'Looking for organizers in your area?',
  emptyWithCity: (city: string) =>
    `We couldn't find organizers in ${city} yet. You can change your city any time.`,
  emptyNoCity:
    "We couldn't find organizers nearby yet. Setting your city helps us match you.",
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

/**
 * The current-event card's status pill, per stage, as a gradient: amber while
 * waiting on someone, green once there is something to act on, blue while a
 * booking settles, coral on the day, violet when it is done.
 */
export const CURRENT_EVENT_STAGE_GRADIENT: Record<
  CurrentEventStage,
  [string, string]
> = {
  draft: ['#9aa7c7', '#6b7a9e'],
  submitted: ['#ffb547', '#f0791a'],
  quotes_received: ['#3cc9a1', '#0e8a68'],
  quote_accepted: ['#3cc9a1', '#0e8a68'],
  booking_created: ['#5b9bff', '#2554b8'],
  booking_confirmed: ['#3cc9a1', '#0e8a68'],
  in_progress: ['#ff8a5c', '#e8433a'],
  completed: ['#a084ff', '#5a35e0'],
};

/** The card's ground: a warm blush into a soft lavender. */
export const EVENT_HERO_GRADIENT: [string, string] = ['#fff3ea', '#efe9ff'];
/** The event's name: coral through rose into violet. */
export const EVENT_HERO_TITLE_GRADIENT = [
  '#e8633a',
  '#e2477a',
  '#7c5cdb',
] as const;
/** Each fact's icon disc. */
export const EVENT_FACT_GRADIENT = {
  when: ['#ff8a5c', '#e8433a'] as [string, string],
  where: ['#a084ff', '#5a35e0'] as [string, string],
  guests: ['#3cc9a1', '#0e8a68'] as [string, string],
};
/** "23 days to go". */
export const EVENT_DAYS_GRADIENT: [string, string] = ['#ff6f9f', '#c2416b'];
/** Its main button. */
export const EVENT_HERO_CTA_GRADIENT: [string, string] = ['#f47b4d', '#e2477a'];

/** The three steps a sent brief walks through before the quotes are in. */
export const BRIEF_JOURNEY_STEPS = [
  'Brief sent',
  'Organizers reviewing',
  'Quotes arrive',
] as const;
