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
export const COMPARE_NAVY_DEEP = '#0e1a33';

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
  /**
   * Said before anything is accepted, because accepting is not reversible.
   *
   * Two versions, because "declines the rest" is simply untrue when one
   * organizer has replied — and a customer who is told their other quotes were
   * declined will go looking for quotes that never existed.
   */
  acceptNote:
    'Accepting picks this organizer and declines the rest. The advance confirms it.',
  acceptNoteOnly: 'Accepting picks this organizer. The advance confirms it.',
  /*
   * What is actually true between accepting and paying.
   *
   * "The others are closed" was the whole message, which left a customer
   * looking at an accepted quote with nothing to do and no idea anything was
   * outstanding. Accepting is the choice; the advance is what books it, and
   * until it is paid the organizer has not been asked to hold the date.
   */
  decidedNote:
    'You have accepted this quote and the others are closed. Pay the advance to confirm the booking.',
  /** On the accepted card, in place of the accept button. */
  payAdvance: (advance: string) =>
    advance ? `Pay ${advance} advance` : 'Pay the advance',
  payAdvanceNote: 'Your organizer is asked to confirm once the advance is in.',
  acceptFailed: "We couldn't accept that quote. Please try again.",

  loading: 'Loading your quotes…',
  errorTitle: "We couldn't load your quotes",
  retry: 'Try again',
  emptyTitle: 'No quotes yet',
  emptyBody:
    'Organizers are still pricing your event. You will get a notification the moment one replies.',
};

/** Screen-scoped tokens for the line-by-line sheet, which sits on white. */
export const COMPARE_LINE_HAIRLINE = '#eceae8';
export const COMPARE_LOWER_GREEN = '#1d9e75';

export const LINE_BY_LINE_ENTRY = 'Compare the two cheapest, line by line';

export const LINE_BY_LINE_COPY = {
  title: 'Line by line',
  lower: 'LOWER',
  notIncluded: 'Not included',
  /*
   * Said once, under the table. Two quotes rarely cover exactly the same
   * ground, and a customer comparing only the totals will not notice that the
   * cheaper one left something out.
   */
  scopeNote:
    'A line one organizer did not quote is not a saving — check what each price covers before you decide.',
  accept: 'Accept',
  accepting: 'Accepting…',
  empty: 'These two quotes have no priced lines to compare.',
  failed: "That didn't go through. Please try again.",
} as const;

/** A request with no quotes yet — just sent, or still waiting. */
export const WAITING_COPY = {
  sentTitle: 'Request sent!',
  waitingTitle: 'Waiting for quotes',
  lead: (occasion: string) =>
    `Organizers who match your ${occasion.toLowerCase()} are preparing their quotes.`,
  leadSent: (count: number, occasion: string) =>
    `Sent to ${count} ${
      count === 1 ? 'organizer' : 'organizers'
    } who match your ${occasion.toLowerCase()}. They are preparing their quotes.`,
  sentToLabel: 'SENT TO',
  sentToCount: (count: number) =>
    `${count} ${count === 1 ? 'organizer' : 'organizers'}`,
  sentToMore: (count: number) => `+ ${count} more`,
  awaitingQuote: 'Preparing quote',
  sentToOpen: 'Organizers near you',
  sentToOpenBody:
    'No organizer matched every detail, so your brief is open to organizers in your area. Quotes still land here.',
  leadPlain: 'Organizers who match your event are preparing their quotes.',
  briefLabel: 'YOUR BRIEF',
  statusOpen: 'Open',
  factDate: 'Date',
  factPlace: 'Where',
  factGuests: 'Guests',
  nextLabel: 'WHAT HAPPENS NEXT',
  step1Title: 'Brief sent',
  step1Body: 'Matching organizers have your event details.',
  step2Title: 'Quotes arrive',
  step2Body: 'Usually within a day. You get a notification for each one.',
  step3Title: 'Compare & book',
  step3Body: 'See them side by side, pick one, and pay the advance to confirm.',
  home: 'Back to Home',
};
