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
  coverPhoto: FileDTO | null;

  /** What Evently vouches for. Booleans only — the documents stay private. */
  verified: boolean;
  kycOnFile: boolean;
  gstOnFile: boolean;

  /** yyyy-mm-dd, or null when they are booked out past the server's horizon. */
  nextFreeDate: string | null;
  slotsLeftThatWeek: number;
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

/** The verification pill on the cover. Absent when there is nothing to claim. */
export interface VerificationBadge {
  /** "Evently verified" — the headline half. */
  title: string;
  /** "KYC & GST on file", or just one of them, or '' when neither is. */
  detail: string;
}

/** The availability card. Absent when the organizer publishes no free date. */
export interface AvailabilityViewModel {
  /** "5 Sep 2026". */
  dateLabel: string;
  /** The same date as yyyy-mm-dd, for prefilling the plan wizard. */
  dateIso: string;
  /** "Handles events up to 400 guests · 2 slots left that week". */
  detail: string;
}

/** One row in the assurance card. */
export interface Assurance {
  key: string;
  icon: string;
  text: string;
}

/** One portfolio tile. A real upload, or an abstract placeholder. */
export interface WorkTile {
  key: string;
  /**
   * A ready-to-render absolute URI for the organizer's own photo — already
   * through `absoluteFileUrl`, not the stored file's root-relative `url`.
   * Null means draw the gradient instead.
   */
  photo: string | null;
  /** The two gradient stops used when there is no photo. */
  gradient: [string, string];
}

export interface OrganizerViewModel {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: OrganizerTier;
  /** "Kukatpally, Hyderabad" — only the parts that exist. */
  placeLabel: string;
  /** Their own cover photo, or null for the drawn gradient. */
  coverUrl: string | null;
  /** Null when the organizer is neither verified nor has papers on file. */
  verification: VerificationBadge | null;
  /** Only the stats the organizer actually carries; never a row of zeros. */
  stats: OrganizerStat[];
  availability: AvailabilityViewModel | null;
  /** Only the promises this organizer's own record supports. */
  assurances: Assurance[];
  /** Their portfolio. Empty only when we deliberately show nothing. */
  work: WorkTile[];
  /** True when `work` is gradients rather than their uploads. */
  workIsPlaceholder: boolean;
  /** The services they price, as chips. */
  handles: string[];
  rating: number;
  reviews: number;
  events: number;
  responseHours: number;
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
