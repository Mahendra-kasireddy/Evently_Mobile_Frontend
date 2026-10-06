import type { LiveState, SaleState, TicketOption, TicketState } from './types';

/** Where the customer-facing public event routes live. */
export const BROWSE_ENDPOINT = '/public-event/browse';
export const MY_TICKETS_ENDPOINT = '/public-event/my-tickets';
export const BOOKINGS_ENDPOINT = '/public-event/bookings';

export const PUBLIC_EVENTS_COPY = {
  sectionTitle: 'Events near you',
  seeAll: 'See all',
  viewEvent: 'View event',
  from: 'From',
  sectionHint: 'Shows, workshops and nights out you can book a seat at',
  screenTitle: 'Public events',
  empty: 'No public events are on sale right now. Check back soon.',
  emptySearch: 'Nothing matched that. Try a different word.',
  soldOut: 'Sold out',
  bookCta: 'Book ticket',
  watchLive: 'Watch live',
  loading: 'Finding events…',
  retry: 'Try again',
  ticketsTitle: 'My tickets',
  ticketsEmpty: 'No tickets yet. When you book one, it lives here.',
  showAtEntry: 'Show this QR code at entry',
  checkedIn: "You're checked in",
};

/** What each ticket state is called, and the tone it is drawn in. */
export const TICKET_STATE_LABEL: Record<TicketState, string> = {
  upcoming: 'Upcoming',
  checked_in: 'Checked in',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const LIVE_LABEL: Record<LiveState, string> = {
  upcoming: 'Live stream available',
  live: 'LIVE NOW',
  ended: 'Watch replay',
};

/** The filters across the top of My Tickets. */
export const TICKET_FILTERS: Array<{
  key: TicketState | 'all';
  label: string;
}> = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'checked_in', label: 'Checked in' },
  { key: 'completed', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
];

/** Rupees, in the Indian grouping. */
export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return 'Free';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/** A date and time in the event's own zone, so nobody turns up an hour early. */
export function formatEventWhen(
  iso: string | null | undefined,
  timezone: string,
): string {
  if (!iso) return '';
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timezone || undefined,
    }).format(at);
  } catch {
    /* An unknown zone is the organizer's typo, not a reason to show nothing. */
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    }).format(at);
  }
}

/* ------------------------------------------------------------ Redesign */

/** Category chips across the top of the list; '' is every category. */
export const EVENT_CATEGORIES: Array<{ value: string; label: string }> = [
  { value: '', label: 'All' },
  { value: 'Music', label: 'Music' },
  { value: 'Concert', label: 'Concert' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Conference', label: 'Conference' },
];

export type SortKey = 'soon' | 'price' | 'new' | 'popular';
export const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  /* What has actually sold, counted from the tickets rather than from views —
     a view is somebody who looked, a sale is somebody who came. */
  { key: 'popular', label: 'Popular' },
  { key: 'soon', label: 'Soonest' },
  { key: 'price', label: 'Cheapest' },
  { key: 'new', label: 'Just added' },
];

/**
 * How far out to look, and how far ahead.
 *
 * Both are real filters the catalogue understands: the first needs the
 * customer's coordinates, which this app already keeps, and the second is a
 * window rather than two dates — "this weekend" is the question somebody
 * browsing on a Thursday actually asks.
 */
export const DISTANCE_OPTIONS: Array<{ km: number; label: string }> = [
  /*
   * The number, and only the number.
   *
   * "Within 10 km" and "Any distance" are each a word and a half too long for
   * a third of a phone's width, so the chip clipped them and the customer saw
   * "Any distan…" — a filter whose own value you cannot read. The chip's icon
   * already says what it filters; the label only has to say what it is set to.
   */
  { km: 10, label: '10 km' },
  { km: 25, label: '25 km' },
  { km: 50, label: '50 km' },
  { km: 0, label: 'Distance' },
];

export type WhenKey = 'any' | 'today' | 'weekend' | 'month';
export const WHEN_OPTIONS: Array<{ key: WhenKey; label: string }> = [
  /* Short, for the same reason as the distances above — and "This weekend"
     reads as a weekend whether or not the word "this" is in front of it. */
  { key: 'any', label: 'Date' },
  { key: 'today', label: 'Today' },
  { key: 'weekend', label: 'Weekend' },
  { key: 'month', label: '30 days' },
];

/** A category's pill colour, read off its words, so cards scan by kind. */
export function categoryTint(category: string): { bg: string; fg: string } {
  const c = (category ?? '').toLowerCase();
  if (/concert|music|gig|launch/.test(c))
    return { bg: '#7c5cdb', fg: '#ffffff' };
  if (/workshop|class|course/.test(c)) return { bg: '#1d9e75', fg: '#ffffff' };
  if (/festival|fest|fair/.test(c)) return { bg: '#ec5a8c', fg: '#ffffff' };
  if (/comedy|stand/.test(c)) return { bg: '#f2b134', fg: '#3a2a05' };
  if (/conference|talk|summit|meetup/.test(c))
    return { bg: '#3b6fd8', fg: '#ffffff' };
  return { bg: '#e8633a', fg: '#ffffff' };
}

/** Two letters for an avatar: "S S Rajamouli" -> "SR". */
export function initialsOf(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'EV';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}

/**
 * A Google Calendar "add event" link.
 *
 * Opens in the browser or the Calendar app on either platform, with nothing to
 * install and no calendar permission to ask for.
 */
export function calendarUrl(event: {
  title: string;
  startDateTime: string;
  endDateTime: string | null;
  venueName?: string;
  address?: string;
  description?: string;
}): string {
  const stamp = (iso: string) =>
    new Date(iso)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const start = new Date(event.startDateTime);
  const end = event.endDateTime
    ? new Date(event.endDateTime)
    : new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const params = [
    'action=TEMPLATE',
    `text=${encodeURIComponent(event.title)}`,
    `dates=${stamp(start.toISOString())}/${stamp(end.toISOString())}`,
    `location=${encodeURIComponent(
      [event.venueName, event.address].filter(Boolean).join(', '),
    )}`,
    `details=${encodeURIComponent((event.description ?? '').slice(0, 500))}`,
  ];
  return `https://calendar.google.com/calendar/render?${params.join('&')}`;
}

/**
 * Why a ticket cannot be bought, rather than a flat "unavailable": a ticket
 * that goes on sale on Friday is not one that has run out.
 */
export function ticketAvailability(
  option: TicketOption,
  timezone: string,
): string {
  if (!option.onSale) {
    if (option.salesStart && new Date(option.salesStart) > new Date()) {
      return `On sale from ${formatEventWhen(option.salesStart, timezone)}`;
    }
    return option.available <= 0 ? 'Sold out' : 'Not on sale right now';
  }
  if (option.maxForYou <= 0)
    return 'Per-person limit reached — you’ve already booked the maximum';
  return `${option.available} left · up to ${option.maxForYou} for you`;
}

/**
 * What to say instead of a price when tickets cannot be bought, or '' when
 * they can. "Sold out" only when the seats are gone — a window that has not
 * opened, or has closed, is a different thing to be told.
 */
export function saleNote(
  state: SaleState | undefined,
  soldOut: boolean,
  opensAt: string | null | undefined,
  timezone: string,
): string {
  const s = state ?? (soldOut ? 'sold_out' : 'on_sale');
  switch (s) {
    case 'sold_out':
      return 'Sold out';
    case 'upcoming':
      return opensAt
        ? `Sales open ${formatEventWhen(opensAt, timezone)}`
        : 'Sales open soon';
    case 'closed':
      return 'Sales closed';
    case 'unavailable':
      return 'Tickets coming soon';
    default:
      return '';
  }
}

/* ------------------------------------------------------------ Poster list */

/** Each category's chip and pill: an icon and a gradient. */
export const CATEGORY_LOOK: Record<string, { icon: string; gradient: [string, string] }> = {
  All: { icon: 'view-grid-outline', gradient: ['#ff8a5c', '#e8433a'] },
  Music: { icon: 'music-note', gradient: ['#a084ff', '#5a35e0'] },
  Concert: { icon: 'microphone-variant', gradient: ['#ff6f9f', '#c2416b'] },
  Workshop: { icon: 'palette-outline', gradient: ['#3cc9a1', '#0e8a68'] },
  Comedy: { icon: 'emoticon-happy-outline', gradient: ['#ffb547', '#e8791a'] },
  Festival: { icon: 'party-popper', gradient: ['#f472b6', '#be185d'] },
  Conference: { icon: 'account-group-outline', gradient: ['#5b9bff', '#2554b8'] },
};

/** A category's gradient, read off its words when it is not one of the chips. */
export function categoryGradient(category: string): [string, string] {
  const exact = CATEGORY_LOOK[category];
  if (exact) return exact.gradient;
  const c = (category ?? '').toLowerCase();
  if (/concert|gig|launch/.test(c)) return CATEGORY_LOOK.Concert.gradient;
  if (/music|dj|band/.test(c)) return CATEGORY_LOOK.Music.gradient;
  if (/workshop|class|course|art/.test(c)) return CATEGORY_LOOK.Workshop.gradient;
  if (/comedy|stand/.test(c)) return CATEGORY_LOOK.Comedy.gradient;
  if (/festival|fest|fair/.test(c)) return CATEGORY_LOOK.Festival.gradient;
  if (/conference|talk|summit|meetup/.test(c)) return CATEGORY_LOOK.Conference.gradient;
  return CATEGORY_LOOK.All.gradient;
}

/** "17" and "OCT" for the date block on a poster, in the event's own zone. */
export function dateBlock(
  iso: string | null | undefined,
  timezone: string,
): { day: string; month: string } | null {
  if (!iso) return null;
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return null;
  const part = (opts: Intl.DateTimeFormatOptions) => {
    try {
      return new Intl.DateTimeFormat('en-US', { ...opts, timeZone: timezone || undefined }).format(at);
    } catch {
      return new Intl.DateTimeFormat('en-US', opts).format(at);
    }
  };
  return { day: part({ day: 'numeric' }), month: part({ month: 'short' }).toUpperCase() };
}

/** "Thu · 6:29 PM" — the time line on a poster, beside the date block. */
export function weekdayTime(iso: string | null | undefined, timezone: string): string {
  if (!iso) return '';
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return '';
  const fmt = (opts: Intl.DateTimeFormatOptions) => {
    try {
      return new Intl.DateTimeFormat('en-US', { ...opts, timeZone: timezone || undefined }).format(at);
    } catch {
      return new Intl.DateTimeFormat('en-US', opts).format(at);
    }
  };
  return `${fmt({ weekday: 'short' })} · ${fmt({ hour: 'numeric', minute: '2-digit' })}`;
}

/** The featured banner on Home (sections/FeaturedEvents). */
export const FEATURED_COPY = {
  eyebrow: 'FEATURED EVENT',
  explore: 'Explore',
};

/**
 * "Oct 25 – 27", "Oct 31 – Nov 2" or just "Oct 25", in the event's own zone:
 * the span a festival runs, short enough for a pill.
 */
export function formatDateSpan(
  startIso: string | null | undefined,
  endIso: string | null | undefined,
  timezone: string,
): string {
  const parts = (iso: string) => {
    const at = new Date(iso);
    if (Number.isNaN(at.getTime())) return null;
    const fmt = (opts: Intl.DateTimeFormatOptions) => {
      try {
        return new Intl.DateTimeFormat('en-IN', { ...opts, timeZone: timezone || undefined }).format(at);
      } catch {
        return new Intl.DateTimeFormat('en-IN', opts).format(at);
      }
    };
    return { month: fmt({ month: 'short' }), day: fmt({ day: 'numeric' }), key: fmt({ year: 'numeric', month: 'numeric', day: 'numeric' }) };
  };
  const start = startIso ? parts(startIso) : null;
  if (!start) return '';
  const end = endIso ? parts(endIso) : null;
  if (!end || end.key === start.key) return `${start.month} ${start.day}`;
  if (end.month === start.month) return `${start.month} ${start.day} – ${end.day}`;
  return `${start.month} ${start.day} – ${end.month} ${end.day}`;
}

/** The "Live Stream" row on Home (sections/LiveStreams). */
export const LIVE_STREAMS_COPY = {
  title: 'Live Stream',
  live: 'LIVE',
};
