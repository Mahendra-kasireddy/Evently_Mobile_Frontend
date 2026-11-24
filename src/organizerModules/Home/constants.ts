export const DASHBOARD_ENDPOINT = '/booking/organizer/dashboard';
export const BADGES_ENDPOINT = '/booking/organizer/badges';
export const ONBOARDING_STATUS_ENDPOINT = '/organizer/onboarding-status';
export const MY_BOOKINGS_ENDPOINT = '/booking/organizer/mine';
export const taskEndpoint = (bookingId: string, taskId: string) =>
  `/booking/${bookingId}/tasks/${taskId}`;

/** Bookings that wait on the organizer's yes or no. */
export const AWAITING_STATUSES = ['pending', 'awaiting_organizer'];

export const HOME_COPY = {
  locating: 'Locating…',
  setLocation: 'Set your location',
  loading: 'Loading your dashboard…',
  loadingTitle: 'Getting things ready',
  error: 'We couldn’t load your dashboard.',
  retry: 'Try again',

  goLiveTitle: 'Finish setting up to go live',
  goLiveBody:
    'Complete your profile and get verified so customers can find you.',
  changesTitle: 'A few changes needed',
  changesBody:
    'Our team asked for some changes. Update your profile and submit again.',
  submittedTitle: 'Verification in progress',
  submittedBody:
    'Usually 24–48 hours. We’ll notify you the moment you’re live.',
  rejectedTitle: 'Registration not approved',
  rejectedBody: 'Contact Evently support if you think this is a mistake.',
  payoutTitle: 'Add your bank details',
  payoutBody: 'So your first payout isn’t held up.',
  progress: (done: number, total: number) => `${done} of ${total} done`,
  next: (title: string) => `Next: ${title}`,
  readyToSubmit: 'Ready — submit for verification',

  needsTitle: 'Needs you now',
  toQuote: (n: number) => (n === 1 ? 'enquiry to quote' : 'enquiries to quote'),
  toConfirm: (n: number) =>
    n === 1 ? 'booking to confirm' : 'bookings to confirm',

  statsTitle: 'At a glance',
  statEnquiries: 'New enquiries',
  statBookings: 'Active bookings',
  statEarnings: 'This month',
  statRating: 'Rating',
  noRating: 'No reviews yet',

  tasksTitle: 'Today’s tasks',
  tasksDone: (done: number, total: number) => `${done}/${total} done`,

  weekTitle: 'Next 7 days',
  weekCalendar: 'Calendar',
  weekEmpty: 'No events this week',
  weekEmptyHint: 'Confirmed bookings show up here.',

  tierTitle: 'Your tier',
  tierTop: (tier: string) => `You’re at ${tier}, the top tier.`,
  tierNext: (events: number, tier: string) =>
    events > 0
      ? `${events} more ${events === 1 ? 'event' : 'events'} to ${tier}`
      : `Close to ${tier}`,
} as const;
