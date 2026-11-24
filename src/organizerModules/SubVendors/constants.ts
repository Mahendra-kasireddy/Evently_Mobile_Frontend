/** The organizer's roster, enriched with per-organizer task stats. */
export const SUBVENDORS_ENDPOINT = '/booking/organizer/subvendors';
export const INVITE_ENDPOINT = '/organizer/subvendors/invite';
export const removeEndpoint = (linkId: string) =>
  `/organizer/subvendors/${encodeURIComponent(linkId)}`;

export const ALL_FILTER = 'all';
export const PHONE_LENGTH = 10;

/** The backend's SubVendorCategory, as the organizer reads it. */
export const CATEGORY_LABEL: Record<string, string> = {
  food: 'Catering',
  water: 'Water',
  decor: 'Decor',
  photography: 'Photography',
  music: 'Music',
  transport: 'Transport',
  priest: 'Priest',
  mehendi: 'Mehendi',
  other: 'Other',
};

export const CATEGORY_ICON: Record<string, string> = {
  food: 'silverware-fork-knife',
  water: 'water-outline',
  decor: 'flower-outline',
  photography: 'camera-outline',
  music: 'music-note',
  transport: 'car-outline',
  priest: 'hands-pray',
  mehendi: 'palette-outline',
  other: 'briefcase-outline',
};

export const SUBVENDORS_COPY = {
  title: 'Sub-vendors',
  loading: 'Loading your team…',
  error: 'We couldn’t load your sub-vendors.',
  retry: 'Try again',

  invite: 'Invite sub-vendor',
  all: 'All',
  teamCount: (n: number) =>
    n === 1 ? '1 person in your team' : `${n} people in your team`,

  chip: {
    active: 'Active',
    away: 'Not taking work',
    pending: 'Invite pending',
  },
  rateMissing: 'Rate not set',
  rate: (amount: string, unit: string) =>
    unit ? `${amount} / ${unit}` : amount,
  performance: 'Performance',
  noJobsYet: 'No jobs yet',
  eventsDone: (n: number) => (n === 1 ? '1 event done' : `${n} events done`),
  remove: 'Remove',
  removeTitle: 'Remove from your team?',
  removeBody: (name: string) =>
    `${name} will no longer appear in your team or be available for new tasks.`,
  removeConfirm: 'Remove',
  keep: 'Keep',
  removed: (name: string) => `${name} was removed from your team.`,

  pendingTitle: 'Pending invites',
  pendingHint:
    'They join your team automatically when they sign up on Evently with this number.',
  sent: (ago: string) => `Sent ${ago.toLowerCase()}`,
  cancelInvite: 'Cancel invite',
  cancelInviteTitle: 'Cancel this invite?',
  cancelInviteBody: (phone: string) =>
    `${phone} won’t join your team when they sign up.`,
  cancelInviteConfirm: 'Cancel invite',
  inviteCancelled: 'Invite cancelled.',
  removeFailed: 'Couldn’t remove. Please try again.',

  emptyTitle: 'Build your team',
  emptyBody:
    'Invite caterers, decorators, photographers you work with, so you can hand them tasks for your events.',
  emptyFilteredTitle: 'No one in this category',
  emptyFilteredBody: 'Switch back to All to see your whole team.',
  showAll: 'Show all',

  sheet: {
    title: 'Invite a sub-vendor',
    body: 'Enter their mobile number. If they’re already on Evently they join your team right away; otherwise they join when they sign up.',
    label: 'Mobile number',
    prefix: '+91',
    placeholder: '98765 43210',
    send: 'Send invite',
    sending: 'Sending…',
    cancel: 'Cancel',
    close: 'Close',
  },
  invalidPhone: 'Enter a valid 10-digit mobile number',
  alreadyLinked: 'This number is already on your team or invited.',
  inviteFailed: 'Couldn’t send the invite. Please try again.',
  invitedActive: 'Added to your team.',
  invitedPending:
    'Invite saved. They’ll join your team when they sign up with this number.',
  dismiss: 'Dismiss',
} as const;
