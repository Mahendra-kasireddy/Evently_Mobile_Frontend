export const ORGANIZER_BY_ID_ENDPOINT = '/organizer/getOrganizerById';
export const SERVICE_CATEGORIES_ENDPOINT = '/plan/service-categories';
export const REVIEWS_ENDPOINT = '/review/organizer';
export const REVIEW_TAGS_ENDPOINT = '/review/tags';
export const MY_REVIEW_ENDPOINT = '/review/mine';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const ORG_ACCENT = '#e8633a';
export const ORG_NAVY = '#1a2e5a';
export const ORG_NAVY_DEEP = '#0e1a33';
/** One step lighter than the header, for a tile sitting on it. */
export const ORG_NAVY_PANEL = '#1b2a49';
export const ORG_GREEN = '#1d9e75';
export const ORG_STAR = '#e8a33a';
export const ORG_CANVAS = '#faf8f7';
export const ORG_HAIRLINE = '#efe9e5';
export const ORG_TRACK = '#f0ecea';

export const ORGANIZER_COPY = {
  allReviews: 'All reviews',
  recentWork: 'Recent work',
  handles: 'Handles',
  rating: 'Rating',
  reviewsSuffix: (n: number) => (n === 1 ? '1 review' : `${n} reviews`),
  eventsCompleted: (n: number) => `${n} events completed`,
  noReviews: 'No reviews yet',
  noReviewsBody: 'This organizer has not been reviewed yet. Ratings appear once their customers leave one.',
  typical: 'Typical',
  freeToAsk: 'Free to ask · no card needed',
  requestQuote: 'Request a quote',
  message: 'Message this organizer',
  requesting: 'Sending…',
  requested: 'Request sent',

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
