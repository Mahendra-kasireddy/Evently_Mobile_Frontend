import type { LiveState, TicketOption, TicketState } from './types';

/** Where the customer-facing public event routes live. */
export const BROWSE_ENDPOINT = '/public-event/browse';
export const MY_TICKETS_ENDPOINT = '/public-event/my-tickets';
export const BOOKINGS_ENDPOINT = '/public-event/bookings';

export const PUBLIC_EVENTS_COPY = {
  sectionTitle: 'Events near you',
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

export type SortKey = 'soon' | 'price' | 'new';
export const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: 'soon', label: 'Soonest' },
  { key: 'price', label: 'Cheapest' },
  { key: 'new', label: 'Just added' },
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
