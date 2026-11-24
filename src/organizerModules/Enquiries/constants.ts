import type { EnquiryFilter } from './types';

export const INCOMING_ENDPOINT = '/quote/incoming';

/** The web page that writes a quote — native in a later phase. */
export const respondPath = (requestId: string) =>
  `/organizer/respond/${requestId}`;

/** The chips, in order. New first: that is what needs a reply. */
export const FILTER_ORDER: EnquiryFilter[] = [
  'new',
  'draft',
  'sent',
  'confirmed',
  'closed',
  'all',
];

export const ENQUIRIES_COPY = {
  title: 'Enquiries',
  searchPlaceholder: 'Search by name, occasion or place',
  slaNotice: 'Reply within 24 hours to rank higher in search.',
  loading: 'Loading enquiries…',
  error: 'We couldn’t load your enquiries.',
  retry: 'Try again',

  filters: {
    new: 'New',
    draft: 'Drafts',
    sent: 'Sent',
    confirmed: 'Confirmed',
    closed: 'Closed',
    all: 'All',
  } as Record<EnquiryFilter, string>,

  empty: {
    new: {
      title: 'You’re all caught up',
      body: 'New enquiries from customers will appear here.',
    },
    draft: {
      title: 'No drafts',
      body: 'Quotes you save without sending wait here.',
    },
    sent: {
      title: 'No quotes waiting',
      body: 'Quotes you send stay here until the customer decides.',
    },
    confirmed: {
      title: 'No confirmed quotes yet',
      body: 'When a customer accepts your quote, it shows here.',
    },
    closed: {
      title: 'Nothing closed',
      body: 'Declined, withdrawn and closed enquiries end up here.',
    },
    all: {
      title: 'No enquiries yet',
      body: 'Complete your profile so customers can find you and send enquiries.',
    },
  } as Record<EnquiryFilter, { title: string; body: string }>,
  noMatch: (q: string) => `No enquiries match “${q}”.`,
  clearSearch: 'Clear search',

  actions: {
    new: 'Send quote',
    draft: 'Finish draft',
    sent: 'View quote',
    confirmed: 'View quote',
    closed: 'View details',
  },
  quoteTitle: 'Quote',
  yourQuote: 'Your quote',
  guests: (n: string) => `${n} guests`,

  chip: {
    newSla: 'New',
    hoursLeft: (h: number) => `${h}h left`,
    slaPassed: 'Reply overdue',
    draft: 'Draft',
    sent: 'Sent',
    updated: 'Updated',
    accepted: 'Accepted',
    rejected: 'Declined',
    withdrawn: 'Withdrawn',
    superseded: 'Brief changed',
    closed: 'Closed',
  },
} as const;
