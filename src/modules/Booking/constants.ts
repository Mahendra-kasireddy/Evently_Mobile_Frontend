import { colors } from '../../theme';
import type { BookingItem, BookingStatus, BookingTab, PaymentStatus } from './types';

export const MY_BOOKINGS_ENDPOINT = '/booking/my-bookings';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const BOOKING_ACCENT = '#e8633a';
export const BOOKING_NAVY = '#1a2e5a';
export const BOOKING_ACCENT_SOFT = '#fdeee7';
export const BOOKING_GREEN = '#1d9e75';
export const BOOKING_GREEN_SOFT = '#e8f6ef';

/**
 * A booking awaiting the organizer's acceptance is not "pending" to the
 * customer — they have chosen an organizer and paid. What is outstanding is
 * the organizer's answer, and the label says so.
 */
export const BOOKING_STATUS_COPY: Record<
  BookingStatus,
  { label: string; tone: BookingItem['statusTone'] }
> = {
  pending: { label: 'Booking placed', tone: 'muted' },
  awaiting_organizer: { label: 'Awaiting organizer', tone: 'warning' },
  confirmed: { label: 'Confirmed', tone: 'primary' },
  in_progress: { label: 'In progress', tone: 'primary' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
  rejected: { label: 'Declined by organizer', tone: 'danger' },
  expired: { label: 'Expired — no response', tone: 'danger' },
};

export const STATUS_TONE_COLOR: Record<BookingItem['statusTone'], string> = {
  primary: BOOKING_ACCENT,
  success: BOOKING_GREEN,
  muted: colors.textMuted,
  danger: colors.danger,
  warning: colors.accent,
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

export const BOOKING_COPY = {
  title: 'My Bookings',
  open: 'Open workspace',
  loading: 'Loading your bookings…',
  errorTitle: "We couldn't load your bookings",
  retry: 'Try again',
  emptyTitle: 'No bookings yet',
  emptyBody:
    'When you accept an organizer’s quote, the booking shows up here — with its plan, payments and guest invitation.',
  emptyCta: 'Plan an event',
  emptyPastTitle: 'Nothing here yet',
  emptyPastBody: 'Bookings move here once they are completed, cancelled or declined.',
  daysToGo: (n: number) => (n === 1 ? '1 day to go' : `${n} days to go`),
  today: 'Today',
  organizerTbd: 'Organizer to be confirmed',
};
