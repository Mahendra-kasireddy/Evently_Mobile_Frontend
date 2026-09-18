import { brand } from '../../theme';

export const ORGANIZER_BY_ID_ENDPOINT = '/organizer/getOrganizerById';
export const SERVICE_CATEGORIES_ENDPOINT = '/plan/service-categories';
export const REVIEWS_ENDPOINT = '/review/organizer';
export const REVIEW_TAGS_ENDPOINT = '/review/tags';
export const MY_REVIEW_ENDPOINT = '/review/mine';

/*
 * Sampled from the signed-off profile design. Most are already in `brand`;
 * the few that are not (the cover's gradient stops, the histogram amber, the
 * check-chip green) live here because nothing outside this screen uses them.
 */
export const ORG_ACCENT = brand.accent;
export const ORG_NAVY = brand.navy;
export const ORG_NAVY_DEEP = '#0e1a33';
/** One step lighter than the header, for a tile sitting on it. */
export const ORG_NAVY_PANEL = '#1b2a49';
export const ORG_GREEN = brand.green;
export const ORG_STAR = '#e8a33a';
export const ORG_CANVAS = brand.bg;
export const ORG_HAIRLINE = brand.border;
export const ORG_TRACK = '#f1f0eb';

/** The cover: navy on the left bleeding into a warm plum on the right. */
export const COVER_NAVY = '#1f2d54';
export const COVER_NAVY_DEEP = '#16213e';
export const COVER_PLUM = '#402d36';
export const COVER_PLUM_SOFT = '#4b3a4e';

/** The tick on a "what they handle" chip. */
export const ORG_CHECK = '#4b9c78';
/** Histogram bars. Warmer than the stars, so the two rows don't merge. */
export const ORG_BAR = '#dfac51';

/**
 * Portfolio tiles fall back to these when an organizer has uploaded no
 * photos. Deliberately abstract: a stock photo of somebody else's wedding on
 * a profile would be a claim about work this organizer did not do.
 */
export const WORK_PLACEHOLDER_GRADIENTS: Array<[string, string]> = [
  ['#202e54', '#16213e'],
  ['#2c224c', '#1d1739'],
  ['#4a272b', '#2b1719'],
];

export const ORGANIZER_COPY = {
  allReviews: 'All reviews',
  recentWork: 'Recent work',
  eventsRun: (n: number) => `${n} events run`,
  workPlaceholderNote:
    'Placeholders — real portfolio photos come from the organizer’s uploads.',
  handles: 'What they handle',
  rating: 'Rating',
  reviewsSuffix: (n: number) => (n === 1 ? '1 review' : `${n} reviews`),
  noReviews: 'No reviews yet',
  noReviewsBody:
    'This organizer has not been reviewed yet. Ratings appear once their customers leave one.',
  typical: 'Typical',
  requestQuote: 'Request a quote',
  requestQuoteNote: 'Free · no card needed',
  message: 'Message this organizer',
  share: 'Share this organizer',
  requesting: 'Sending…',
  requested: 'Request sent',

  /** Reads "Evently verified · KYC & GST on file" — each half only when true. */
  verified: 'Evently verified',
  kycOnFile: 'KYC on file',
  gstOnFile: 'GST on file',
  kycAndGstOnFile: 'KYC & GST on file',

  /** Availability. "Free on 5 Sep 2026". */
  freeOn: (date: string) => `Free on ${date}`,
  capacity: (guests: number) => `Handles events up to ${guests} guests`,
  slotsLeft: (n: number) => (n === 1 ? '1 slot left that week' : `${n} slots left that week`),
  holdDate: 'Hold date',

  /**
   * The three assurances. Each one is a fact this codebase can point at —
   * response rate and time come from the organizer's own record, the advance
   * is refunded by PaymentService.refundForBooking when a booking falls
   * through, and quotes are itemised line by line (see CompareQuotes).
   */
  repliesWithin: (rate: number, hours: number) =>
    `Replies to ${rate}% of requests within ${hours} ${hours === 1 ? 'hour' : 'hours'}`,
  advanceHeld: 'Advance refunded by Evently if the booking falls through',
  itemisedQuotes: 'Itemised quotes — every line priced, nothing bundled',
  usuallyReplies: (hours: number) => `Usually replies in ${hours}h`,

  loading: 'Loading this organizer…',
  errorTitle: "We couldn't load this organizer",
  retry: 'Try again',
};

export const REVIEWS_COPY = {
  title: 'Reviews',
  loading: 'Loading reviews…',
  errorTitle: "We couldn't load the reviews",
  retry: 'Try again',
  emptyTitle: 'No reviews yet',
  emptyBody:
    'Reviews appear here once this organizer has delivered an event and their customer has written one.',
  loadMore: 'Show more reviews',
};

export const LEAVE_REVIEW_COPY = {
  title: 'How did it go?',
  subtitle: 'Your review is public, shown with your first name and last initial.',
  ratingLabel: 'Your rating',
  tagsLabel: 'What stood out?',
  commentLabel: 'Anything else? (optional)',
  commentPlaceholder: 'What went well, and what could have been better?',
  submit: 'Post review',
  submitting: 'Posting…',
  needRating: 'Pick a rating first.',
  failed: "We couldn't post that. Please try again.",
  /** Said before posting, because a review cannot be edited afterwards. */
  permanenceNote: 'Once posted, a review stays on the organizer’s profile.',
};

/** Star words, so a screen reader hears a rating rather than a number. */
export const STAR_LABEL: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};
