import type { OrganizerTier } from '../Home/types';

export interface FileDTO {
  url: string;
  key: string;
  originalName: string;
}

/** GET /organizer/getOrganizerById/:id — the sanitized public profile. */
export interface OrganizerDetailDTO {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: OrganizerTier;
  rating: number;
  reviews: number;
  events: number;
  tags: string[];
  location: string;
  city: string;
  serviceAreas: string[];
  occasions: string[];
  capacityMin: number;
  capacityMax: number;
  basePrice: number;
  estRange: string;
  responseRate: number;
  responseHours: number;
  categoryRates: Array<{ key: string; price: number; perGuest: boolean }>;
  businessName: string;
  displayName: string;
  tagline: string;
  profilePhoto: FileDTO | null;
  /** The organizer's own portfolio uploads — "Recent work". */
  gallery: FileDTO[];
}

// ---------------------------------------------------------------------------
// GET /review/organizer/:id and /summary
// ---------------------------------------------------------------------------

export interface ReviewDTO {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  comment: string;
  tags: string[];
  contextLabel: string;
  createdAt: string;
}

export interface ReviewSummaryDTO {
  average: number;
  total: number;
  histogram: Array<{ stars: number; count: number }>;
  tags: Array<{ key: string; label: string; count: number }>;
}

export interface ReviewPageDTO {
  items: ReviewDTO[];
  total: number;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// View models
// ---------------------------------------------------------------------------

/** One of the three figures in the header strip. */
export interface OrganizerStat {
  key: string;
  value: string;
  label: string;
}

export interface OrganizerViewModel {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: OrganizerTier;
  /** "Kukatpally, Hyderabad" — only the parts that exist. */
  placeLabel: string;
  /** "From ₹6,50,000 · 12 booked this month" — '' when neither is known. */
  headlineLabel: string;
  /** Only the stats the organizer actually carries; never a row of zeros. */
  stats: OrganizerStat[];
  /** Their portfolio photos. Empty hides the section. */
  gallery: string[];
  /** The services they price, as chips. */
  handles: string[];
  rating: number;
  reviews: number;
  events: number;
  /** "₹6.5L – 8L" — '' when they publish no estimate. */
  typicalLabel: string;
}

/** One bar in the histogram, already sized. */
export interface RatingBar {
  stars: number;
  count: number;
  /** Share of the total, 0–100, for the bar's width. */
  percent: number;
}
