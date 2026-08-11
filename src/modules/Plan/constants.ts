import { colors } from '../../theme';
import type { CategoryIcon, NextIcon, OrgTier, RecommendationSort, TrustIcon } from './types';
import type { OccasionArtKey } from '../../Components';

export const PLAN_SCREEN_ENDPOINT = '/plan/getPlanScreen';
export const PLAN_ORGANIZERS_ENDPOINT = '/plan/getOrganizers';
export const MY_DRAFT_ENDPOINT = '/plan/getMyDraft';
export const SAVE_DRAFT_ENDPOINT = '/plan/saveDraft';
export const CREATE_PLAN_ENDPOINT = '/plan/createPlan';
export const REQUEST_QUOTE_FROM_ORGANIZER_ENDPOINT = '/quote/requestQuoteFromOrganizer';

/** Matches web's usePlan.ts debounce window exactly. */
export const AUTOSAVE_DEBOUNCE_MS = 800;

// Web's actual brand palette (evently-FrontEnd/src/index.css :root) — the
// whole web app's identity (navy/orange/cream), not the mobile app's generic
// indigo theme. Home's Hero/Categories/HowItWorks already port these same
// values for literal web-design ports; Plan Event is one too, so it follows
// suit. Scoped to this module only — the rest of the app keeps its indigo
// theme untouched.
export const PLAN_BG = '#f8f8f6'; // --color-bg
export const PLAN_NAVY = '#1a2e5a'; // --color-navy / --color-text
export const PLAN_NAVY_DEEP = '#0e1a33'; // --color-navy-deep
export const PLAN_ACCENT = '#e8633a'; // --color-primary
export const PLAN_ACCENT_SOFT = '#fdeee7'; // --color-primary-soft
export const PLAN_ACCENT_WARM = '#ff8b5e'; // --color-accent-warm
export const PLAN_GREEN = '#1d9e75'; // --color-green
export const PLAN_GREEN_SOFT = '#e7f4ee'; // --color-green-soft
export const PLAN_BORDER = '#ebebeb'; // --color-border
export const PLAN_TEXT_MUTED = '#5b6675'; // --color-text-muted

// Web's SummarySidebar.module.css .quoteBox background — a neutral navy-tinted
// chip, distinct from the green budget banner. Scoped to this module only.
export const PLAN_QUOTE_BG = '#eef1f7';

// MaterialCommunityIcons glyph names, keyed by occasion id — same mapping
// Home/constants.ts already ported from the web's OccasionPicker icon set.
export const OCCASION_ICON_NAME: Record<string, string> = {
  wedding: 'heart',
  birthday: 'gift',
  housewarming: 'home',
  naming: 'creation',
  anniversary: 'star',
  corporate: 'briefcase',
};
export const DEFAULT_OCCASION_ICON = 'heart';

// Ported verbatim from web's plan/constants.ts ART_GRADIENT (165deg linear
// gradients) — scoped to this module only, matches Home's CATEGORY_GRADIENT.
export const OCCASION_GRADIENT: Record<OccasionArtKey, [string, string]> = {
  wedding: ['#243a6b', '#0e1a33'],
  birthday: ['#5a2a30', '#2a1216'],
  housewarming: ['#16403a', '#08201c'],
  naming: ['#3a2a5e', '#181233'],
  anniversary: ['#5a3c1c', '#2e2010'],
  corporate: ['#243a6b', '#0e1a33'],
};

export const CATEGORY_ICON_NAME: Record<CategoryIcon, string> = {
  food: 'food',
  water: 'water',
  decor: 'flower',
  photo: 'camera',
  music: 'music-note',
  priest: 'fire',
  mehendi: 'hand-front-right',
  transport: 'truck',
};

// A distinct icon color per category — reuses existing theme/brand tokens (no
// new hex values) so the checklist reads as a set of varied services instead
// of one color repeated 8 times, which flattens the screen once several rows
// are selected.
export const CATEGORY_ICON_COLOR: Record<CategoryIcon, string> = {
  food: PLAN_ACCENT,
  water: colors.tierPlatinum,
  decor: PLAN_GREEN,
  photo: PLAN_NAVY,
  music: PLAN_ACCENT_WARM,
  priest: colors.tierGold,
  mehendi: colors.tierSilver,
  transport: PLAN_ACCENT,
};

export const TRUST_ICON_NAME: Record<TrustIcon, string> = {
  zap: 'lightning-bolt-outline',
  shield: 'shield-check-outline',
  calendar: 'calendar-check-outline',
};

export const NEXT_ICON_NAME: Record<NextIcon, string> = {
  file: 'file-document-outline',
  chart: 'chart-bar',
  heart: 'heart-outline',
};

// No bronze token exists in the app theme (only tierGold/tierSilver/tierPlatinum) —
// chosen to read as a copper/bronze badge alongside the existing three.
const TIER_BRONZE_COLOR = '#B08D57';

export const TIER_COLOR: Record<OrgTier, string> = {
  Bronze: TIER_BRONZE_COLOR,
  Silver: colors.tierSilver,
  Gold: colors.tierGold,
  Platinum: colors.tierPlatinum,
};

// These map 1:1 to the backend's RECOMMENDATION_SORTS enum (getOrganizers'
// `sort` query param) — a fixed part of the API contract, not tenant-editable
// business data. The CMS's `filters.sorts` field is NOT a usable dynamic
// source for this: per the real seed data it holds mismatched display
// strings — `['Sort: Rating', 'Price', 'Most events', '4.5+ ★']` — that don't
// map to the enum and even mix in a rating-filter value. Web's
// FindOrganizers.tsx hardcodes this identical list for the same reason.
export const SORT_OPTIONS: Array<{ label: string; value: RecommendationSort }> = [
  { label: 'Best match', value: 'best' },
  { label: 'Highest rating', value: 'rating' },
  { label: 'Lowest price', value: 'price' },
  { label: 'Most events', value: 'events' },
  { label: 'Fastest response', value: 'response' },
  { label: 'Nearest', value: 'nearest' },
];
