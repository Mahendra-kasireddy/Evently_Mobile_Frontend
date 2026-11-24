import type { BookingStatus, StatusTone } from './types';

export const MY_BOOKINGS_ENDPOINT = '/booking/organizer/mine';

/** The web workspace for one event — native in a later phase. */
export const eventPath = (bookingId: string) =>
  `/organizer/events/${bookingId}`;

export const AWAITING: BookingStatus[] = ['pending', 'awaiting_organizer'];
export const PAST: BookingStatus[] = [
  'completed',
  'cancelled',
  'rejected',
  'expired',
];

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

export const EVENTS_COPY = {
  title: 'Events',
  loading: 'Loading your events…',
  error: 'We couldn’t load your events.',
  retry: 'Try again',

  shortcuts: {
    calendar: 'Calendar',
    subvendors: 'Sub-vendors',
    publicEvents: 'Tickets',
  },

  views: { upcoming: 'Upcoming', past: 'Past' },

  awaitingTitle: 'Needs your confirmation',
  awaitingHint: (n: number) =>
    `${n} paid ${
      n === 1 ? 'booking is' : 'bookings are'
    } waiting for you to accept or decline.`,
  upcomingTitle: 'Coming up',

  respondIn: (text: string) => `Respond ${text}`,
  respondOverdue: 'Response overdue',
  review: 'Review & respond',
  open: 'Open event',
  tasks: (done: number, total: number) => `${done}/${total} tasks`,
  noTasks: 'No tasks yet',
  noDate: 'Date to be set',
  advancePaid: 'Advance paid',
  paidInFull: 'Paid in full',

  emptyUpcoming: {
    title: 'No upcoming events',
    body: 'When a customer books you, the event shows up here.',
    action: 'See enquiries',
  },
  emptyPast: {
    title: 'No past events yet',
    body: 'Finished and cancelled events are kept here.',
  },
} as const;
