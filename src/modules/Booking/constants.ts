import { colors } from '../../theme';
import type { BookingItem, BookingStatus, BookingTab, JumpTile, PaymentStatus } from './types';

export const MY_BOOKINGS_ENDPOINT = '/booking/my-bookings';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const BOOKING_ACCENT = '#e8633a';
export const BOOKING_NAVY = '#1a2e5a';
export const BOOKING_ACCENT_SOFT = '#fdeee7';
export const BOOKING_GREEN = '#1d9e75';
export const BOOKING_GREEN_SOFT = '#e8f6ef';
export const BOOKING_VIOLET = '#6d5bd0';
export const BOOKING_VIOLET_SOFT = '#eeebfb';
/** The page's own ground — a touch off white, as in the design. */
export const BOOKING_CANVAS = '#faf8f7';

/**
 * A booking awaiting the organizer's acceptance is not "pending" to the
 * customer — they have chosen an organizer and paid. What is outstanding is
 * the organizer's answer, and the label says so.
 */
export const BOOKING_STATUS_COPY: Record<
  BookingStatus,
  { label: string; tone: BookingItem['statusTone'] }
> = {
  pending: { label: 'Booking placed', tone: 'warning' },
  awaiting_organizer: { label: 'Awaiting organizer', tone: 'warning' },
  confirmed: { label: 'Confirmed', tone: 'primary' },
  in_progress: { label: 'In progress', tone: 'primary' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
  rejected: { label: 'Declined by organizer', tone: 'danger' },
  expired: { label: 'Expired — no response', tone: 'danger' },
};

export const STATUS_TONE_COLOR: Record<BookingItem['statusTone'], string> = {
  primary: BOOKING_GREEN,
  success: BOOKING_GREEN,
  muted: colors.textMuted,
  danger: colors.danger,
  warning: BOOKING_ACCENT,
};

/**
 * The pill's background. A flat soft wash rather than the tone at low alpha:
 * the design's chips sit on colour, and an alpha chip over the card's own
 * border reads muddy where the two overlap.
 */
export const STATUS_TONE_SOFT: Record<BookingItem['statusTone'], string> = {
  primary: BOOKING_GREEN_SOFT,
  success: BOOKING_GREEN_SOFT,
  muted: colors.surface,
  danger: '#fdecec',
  warning: BOOKING_ACCENT_SOFT,
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: 'Nothing paid yet',
  advance_paid: 'Advance paid',
  paid_in_full: 'Paid in full',
};

/** A booking stops being active once it can no longer change. */
export const PAST_STATUSES: BookingStatus[] = ['completed', 'cancelled', 'rejected', 'expired'];

export const OCCASION_ICON: Record<string, string> = {
  wedding: 'heart-outline',
  birthday: 'gift-outline',
  housewarming: 'home-outline',
  naming: 'creation',
  anniversary: 'star-outline',
  corporate: 'briefcase-outline',
};
export const OCCASION_ICON_FALLBACK = 'calendar-heart';

export const BOOKING_TAB_LABEL: Record<BookingTab, string> = {
  active: 'Active',
  past: 'Past',
};

/**
 * The four tiles, and what each one is actually for.
 *
 * `budget` is deliberately "Budget guide", not "Budget tool": what exists is
 * the plan wizard's budget step, which shows the typical ranges people plan
 * against. Naming it a tool would promise a screen this app does not have.
 *
 * Subtitles here are the fallbacks — each is replaced by a real figure as soon
 * as the booking, its guest list or its board has one.
 */
export const JUMP_TILES: JumpTile[] = [
  {
    key: 'payments',
    title: 'Payments',
    subtitle: 'Advance & balance',
    icon: 'credit-card-outline',
    tone: 'coral',
  },
  {
    key: 'invitation',
    title: 'Guest invitation',
    subtitle: 'Not published yet',
    icon: 'card-account-details-outline',
    tone: 'violet',
  },
  {
    key: 'budget',
    title: 'Budget guide',
    subtitle: 'Typical ranges',
    icon: 'chart-box-outline',
    tone: 'green',
  },
  {
    key: 'ideas',
    title: 'Ideas board',
    subtitle: 'Nothing shared yet',
    icon: 'creation',
    tone: 'violet',
  },
];

export const JUMP_TONE_COLOR: Record<JumpTile['tone'], { fg: string; bg: string }> = {
  coral: { fg: BOOKING_ACCENT, bg: BOOKING_ACCENT_SOFT },
  violet: { fg: BOOKING_VIOLET, bg: BOOKING_VIOLET_SOFT },
  green: { fg: BOOKING_GREEN, bg: BOOKING_GREEN_SOFT },
};

/**
 * The booking's own milestones, said as what happens next.
 *
 * `BOOKING_STEPS` on the server is a lifecycle checklist — "Advance paid",
 * "Organizer confirmed" — so "Next: Organizer confirmed" would read as a thing
 * that has already happened. These phrase the same milestone as the thing
 * still to come; the key is the label the server sends, lowercased, and any
 * label not listed here is shown verbatim rather than guessed at.
 */
export const NEXT_STEP_COPY: Record<string, string> = {
  'booking placed': 'place your booking',
  'advance paid': 'pay the advance',
  'organizer confirmed': 'organizer to confirm',
  'event in progress': 'your event day',
  completed: 'wrap-up after the event',
  'organizer booked': 'book an organizer',
  'vendors locked': 'organizer to lock the vendors',
  invitation: 'approve the guest invitation',
  'final walkthrough': 'the final walkthrough',
};

export const BOOKING_COPY = {
  title: 'Your events',
  jumpTo: 'Jump to',
  open: 'Open workspace',
  next: 'Next: ',
  loading: 'Loading your events…',
  errorTitle: "We couldn't load your events",
  retry: 'Try again',
  emptyTitle: 'No events yet',
  emptyBody:
    'When you accept an organizer’s quote, the event shows up here — with its plan, payments and guest invitation.',
  emptyCta: 'Plan an event',
  emptyActiveTitle: 'Nothing active',
  emptyActiveBody: 'Every event you have is finished, cancelled or expired. Start a new one any time.',
  emptyPastTitle: 'Nothing here yet',
  emptyPastBody: 'Events move here once they are completed, cancelled or declined.',
  daysToGo: (n: number) => (n === 1 ? '1 day to go' : `${n} days to go`),
  today: 'Today',
  organizerTbd: 'Organizer to be confirmed',
};
