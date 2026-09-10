export const QUOTE_REQUEST_ENDPOINT = '/quote/getQuoteRequest';
export const ACCEPT_QUOTATION_ENDPOINT = '/quote/acceptQuotation';
export const REJECT_QUOTATION_ENDPOINT = '/quote/rejectQuotation';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const COMPARE_ACCENT = '#e8633a';
export const COMPARE_NAVY = '#1a2e5a';
export const COMPARE_ACCENT_SOFT = '#fdeee7';
export const COMPARE_GREEN = '#1d9e75';
export const COMPARE_GREEN_SOFT = '#e8f6ef';
export const COMPARE_CANVAS = '#faf8f7';

export const COMPARE_COPY = {
  title: 'Compare quotes',
  lowest: 'LOWEST',
  accepted: 'ACCEPTED',
  total: 'Total',
  advance: 'Advance to confirm',
  breakdown: 'What is included',
  accept: 'Accept this quote',
  accepting: 'Accepting…',
  decline: 'Decline',
  /** Said before anything is accepted, because accepting is not reversible. */
  acceptNote: 'Accepting creates your booking with this organizer and declines the rest.',
  decidedNote: 'You have accepted a quote for this event. The others are closed.',
  acceptFailed: "We couldn't accept that quote. Please try again.",

  loading: 'Loading your quotes…',
  errorTitle: "We couldn't load your quotes",
  retry: 'Try again',
  emptyTitle: 'No quotes yet',
  emptyBody:
    'Organizers are still pricing your event. You will get a notification the moment one replies.',
};
