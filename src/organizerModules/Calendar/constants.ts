import type { BookingStatus, StatusTone } from './types';

export const CALENDAR_ENDPOINT = '/booking/organizer/calendar';
export const BLOCKED_DATES_ENDPOINT = '/booking/organizer/blocked-dates';

/** The web workspace for one event — native in a later phase. */
export const eventPath = (bookingId: string) =>
  `/organizer/events/${bookingId}`;

/**
 * Blocking is one request per date, so a multi-day block fans out. Capped to
 * keep one confirm from firing a flood of requests (the web caps at 62).
 */
export const MAX_BLOCK_DAYS = 62;

/** Monday-first would be nicer, but the web and the server's week start Sunday. */
export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
export const WEEKDAY_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const;
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const STATUS_LOOK: Record<
  BookingStatus,
  { label: string; tone: StatusTone }
> = {
  pending: { label: 'Booking placed', tone: 'amber' },
  awaiting_organizer: { label: 'Needs your yes', tone: 'amber' },
  confirmed: { label: 'Confirmed', tone: 'green' },
  in_progress: { label: 'In progress', tone: 'blue' },
  completed: { label: 'Completed', tone: 'grey' },
  cancelled: { label: 'Cancelled', tone: 'red' },
  rejected: { label: 'Declined', tone: 'red' },
  expired: { label: 'Expired', tone: 'grey' },
};

export const CALENDAR_COPY = {
  title: 'Calendar',
  loading: 'Loading your calendar…',
  error: 'We couldn’t load your calendar.',
  retry: 'Try again',

  today: 'Today',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',

  legend: {
    booked: 'Booked',
    blocked: 'Blocked',
    free: 'Free',
    today: 'Today',
  },

  bookingsOn: (n: number) => (n === 1 ? '1 booking' : `${n} bookings`),
  bookedHint: 'Booked days can’t be blocked.',
  freeTitle: 'You’re free',
  freeBody: 'Customers can book you on this day.',
  blockedTitle: 'You’ve blocked this day',
  blockedBody: 'Customers can’t book you on this day.',
  pastTitle: 'This day has passed',
  pastBody: 'Nothing was booked.',
  pastBlockedBody: 'You had blocked this day.',
  block: 'Block this day',
  unblock: 'Unblock this day',
  open: 'Open event',

  blockSeveral: 'Block several days',
  selectTitle: 'Pick the days to block',
  selectHint:
    'Tap free days to add or remove them. Press and hold a day to fill in every free day since the last one you tapped.',
  selectCount: (n: number) =>
    n === 0
      ? 'No days picked yet'
      : n === 1
      ? '1 day picked'
      : `${n} days picked`,
  confirmBlock: (n: number) => (n <= 1 ? 'Block 1 day' : `Block ${n} days`),
  cancel: 'Cancel',
  tooMany: `Pick ${MAX_BLOCK_DAYS} days or fewer at a time.`,

  upcomingTitle: 'Booked this month',
  upcomingEmpty: 'No more bookings this month.',

  blockFailed: 'Couldn’t block that day. Please try again.',
  unblockFailed: 'Couldn’t unblock that day. Please try again.',
  blockManyFailed:
    'Some days couldn’t be blocked. Your calendar shows what was saved.',
} as const;
