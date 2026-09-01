import type { BlockOwner } from './types';

export const MY_INVITATIONS_ENDPOINT = '/invitation/mine';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const INV_ACCENT = '#e8633a';
export const INV_NAVY = '#1a2e5a';
export const INV_NAVY_DEEP = '#0e1a33';
export const INV_ACCENT_SOFT = '#fdeee7';
export const INV_GREEN = '#1d9e75';
export const INV_GREEN_SOFT = '#e8f6ef';

/**
 * The backend names each section's icon in its own vocabulary; this maps them
 * onto the app's icon set. An unknown key falls back rather than rendering a
 * blank square.
 */
export const BLOCK_ICON: Record<string, string> = {
  image: 'image-outline',
  sparkles: 'creation',
  clock: 'clock-outline',
  calendar: 'calendar-blank-outline',
  play: 'play-circle-outline',
  camera: 'camera-outline',
  users: 'account-group-outline',
  car: 'car-outline',
  qr: 'qrcode',
  map: 'map-marker-outline',
  gift: 'gift-outline',
  music: 'music-note-outline',
};
export const BLOCK_ICON_FALLBACK = 'card-text-outline';

/** The occasion an invitation belongs to, so a list row is identifiable. */
export const OCCASION_ICON: Record<string, string> = {
  wedding: 'heart-outline',
  birthday: 'gift-outline',
  housewarming: 'home-outline',
  naming: 'creation',
  anniversary: 'star-outline',
  corporate: 'briefcase-outline',
};
export const OCCASION_ICON_FALLBACK = 'email-heart-outline';

/**
 * What each badge means. The organizer assembles most of the invitation; a few
 * sections are the customer's own words, and the difference decides which
 * action a row offers.
 */
export const OWNER_BADGE: Record<BlockOwner, string> = {
  organizer: 'By your organizer',
  customer: 'Yours to personalize',
};

export const INVITATION_STATUS_LABEL: Record<string, string> = {
  sent: 'Needs your approval',
  approved: 'Approved · live',
};

export const INVITATION_COPY = {
  listTitle: 'My Invitations',
  listNeedsYou: (n: number) =>
    `${n} ${n === 1 ? 'invitation is' : 'invitations are'} waiting on you.`,
  listAllApproved: 'Everything is approved — your guest links are live.',
  untitledEvent: 'Your event',
  listReview: 'Review',
  listView: 'View',
  detailTitle: 'Guest invitation',
  eyebrow: (organizer: string) => `GUEST INVITATION · PREPARED BY ${organizer.toUpperCase()}`,
  heading: 'Your guest invitation',
  sub: 'Review each section, personalize what’s yours, and approve to publish the guest link.',

  approve: 'Approve & publish',
  approving: 'Publishing…',
  approved: 'Approved · live',
  approvedNote: 'You approved this invitation — the guest link is live.',
  awaitingNote: 'Nothing is live yet. Approve to publish the guest link.',
  requestChanges: 'Request changes',
  requestChange: 'Request change',
  preview: 'Preview',
  personalize: 'Personalize',
  share: 'Share',
  shareAll: 'Share invitation',

  bannerTitle: 'Your organizer built this invitation for you.',
  bannerBody:
    'Sections marked “By your organizer” are handled for you — ask for a change if you need one. Sections marked “Yours to personalize” you can edit yourself.',

  sections: 'Sections',
  hidden: 'Hidden from guests',
  ready: 'Ready',
  pendingRequests: (n: number) => `${n} change ${n === 1 ? 'request' : 'requests'} with your organizer`,

  // Personalize
  personalizeTitle: 'Personalize this section',
  fieldHeading: 'Headline guests see',
  fieldHeadingHint: 'Leave blank to use the section name.',
  fieldBody: 'What you want to say',
  fieldHide: 'Hide this section from guests',
  save: 'Save changes',
  saving: 'Saving…',
  cancel: 'Cancel',

  // Request change
  requestTitle: 'Ask your organizer for a change',
  requestSub: 'They’ll get your note and can update the invitation.',
  requestField: 'What would you like changed?',
  requestPlaceholder: 'e.g. the live stream should start at 6pm, not 7pm',
  requestSend: 'Send to organizer',
  requestSending: 'Sending…',
  requestSent: 'Sent to your organizer',

  // Preview
  previewTitle: 'Guest preview',
  previewSectionTitle: (section: string) => `“${section}” as guests see it`,
  previewSub: 'What your guests see when they open the link',
  previewClose: 'Close',
  previewAll: 'Preview whole invitation',
  previewSection: 'Preview',
  previewShareSection: 'Send this section',
  previewShareAll: 'Send to guests',
  /** Why the send button is not offered — stated, never left as a dead button. */
  previewShareNotApproved: 'Approve the invitation first — then you can send it to guests.',
  previewShareHidden: 'Hidden sections can’t be sent. Unhide it from Personalize first.',
  previewOwnerCustomer: 'Yours to personalize',
  previewOwnerOrganizer: 'Built by your organizer',
  previewHiddenNote: (n: number) =>
    `${n} ${n === 1 ? 'section is' : 'sections are'} hidden from guests.`,
  /**
   * A hidden section has no guest appearance to show. Saying so is the whole
   * answer to "what does this look like to a guest" — nothing.
   */
  previewHiddenSection: 'This section is hidden, so guests never see it. Unhide it from Personalize to include it.',
  previewEmptySection: 'This section has nothing in it yet, so guests see only its heading.',

  // Share
  shareTitle: 'Send to guests',
  shareIntro: 'Pick who to send it to, or add someone new. Guests need no account.',
  shareLoading: 'Loading your guest list…',
  shareNoGuests: 'No guests yet — add the first one below.',
  shareAddGuest: 'Add a guest',
  shareGuestName: 'Guest name',
  shareGuestPhone: 'WhatsApp number',
  sharePhoneHint: 'Indian mobiles need no country code; for anywhere else start with +.',
  shareNeedGuest: 'Choose at least one guest, or add a new one.',
  shareNeedName: 'Enter the guest’s name.',
  shareNeedPhone: 'Enter a WhatsApp number.',
  shareAlreadySent: 'Already sent',
  shareViewed: 'Opened it',
  shareSend: 'Send on WhatsApp',
  shareSending: 'Sending…',
  shareNotApproved: 'Approve the invitation first — then you can send it to guests.',
  shareWhatsappCaveat:
    'We can’t check whether a number has WhatsApp — if it doesn’t, the message won’t arrive.',
  shareHandoff: 'WhatsApp opens with the message ready — press send there to deliver it.',
  shareOpenWhatsapp: 'Open WhatsApp',
  shareFailed: 'That could not be sent.',
  shareDone: 'Done',

  // States
  emptyTitle: 'No invitation yet',
  emptyBody:
    'Once your organizer shares a guest invitation for one of your bookings, you can review and approve it here.',
  preparingTitle: 'Being prepared',
  preparingBody:
    'Your organizer is still putting this invitation together. You’ll be able to review and approve it here as soon as they share it — nothing reaches your guests until you do.',
  loading: 'Opening your invitation…',
  errorTitle: 'We couldn’t load your invitation',
  retry: 'Try again',
};
