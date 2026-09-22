import { brand } from '../../theme';
import type { GuestGroup } from './types';

export const GUESTS_ENDPOINT = (bookingId: string) =>
  `/invitation/mine/${bookingId}/guests`;
export const GUESTS_BULK_ENDPOINT = (bookingId: string) =>
  `/invitation/mine/${bookingId}/guests/bulk`;
export const GUEST_ENDPOINT = (bookingId: string, guestId: string) =>
  `/invitation/mine/${bookingId}/guests/${guestId}`;

/* Sampled from the signed-off design. Most are already in `brand`. */
export const GUEST_NAVY = brand.navy;
export const GUEST_ACCENT = brand.accent;
export const GUEST_CANVAS = '#fffcf8';
export const GUEST_SURFACE = brand.surface;
export const GUEST_HAIRLINE = brand.border;
export const GUEST_MUTED = brand.textMuted;

/**
 * The monogram palette, cycled by name rather than picked at random.
 *
 * Stable per guest: a colour that changed between two openings of the same
 * list would make the row harder to find again, which is the only thing a
 * monogram colour is for.
 */
export const GUEST_AVATAR_COLORS = [
  '#d86b46',
  '#1f2e57',
  '#4b9c78',
  '#775ede',
  '#b29340',
] as const;

/** The three the host files people into. `other` is deliberately not here. */
export const GUEST_GROUPS: GuestGroup[] = ['family', 'friends', 'work'];

export const GROUP_LABEL: Record<GuestGroup, string> = {
  family: 'Family',
  friends: 'Friends',
  work: 'Work',
  other: 'Other',
};

export const GUEST_COPY = {
  title: 'Guest list',
  everyone: 'Everyone',
  addGuest: 'Add guest',
  fromContacts: 'Add from contacts',
  /** "8 guests", and the share count only once something has been sent. */
  count: (n: number) => `${n} ${n === 1 ? 'guest' : 'guests'}`,
  invited: (n: number) => `${n} invited`,

  sheetAddTitle: 'Add a guest',
  sheetEditTitle: 'Edit guest',
  name: 'Name',
  namePlaceholder: 'e.g. Sruthi Reddy',
  phone: 'Phone',
  phonePlaceholder: '+91 98490 11234',
  group: 'Group',
  save: 'Save guest',
  saving: 'Saving…',
  close: 'Close',

  nameRequired: 'Enter the guest’s name.',
  phoneRequired: 'Enter a mobile number.',

  /* Choosing an event, when the screen was opened without one. */
  pickEvent: 'Which event’s guest list?',
  loadingEvents: 'Loading your events…',
  eventsErrorTitle: "We couldn't load your events",
  noEventsTitle: 'No invitations yet',
  noEventsBody:
    'A guest list belongs to an invitation. Once your organizer shares one for an event, its guest list opens here.',

  loading: 'Loading your guest list…',
  errorTitle: "We couldn't load your guest list",
  retry: 'Try again',
  emptyTitle: 'No guests yet',
  emptyBody:
    'Add the people you want to invite, or bring them in from your contacts. Nothing is sent until you share the invitation.',
  /** Shown when a filter, not the list, is what is empty. */
  emptyGroup: (label: string) => `Nobody is filed under ${label} yet.`,

  /** Said after an import, naming what could not be taken. */
  importedNone: 'None of those contacts had a usable mobile number.',
  imported: (n: number) => `${n} ${n === 1 ? 'guest' : 'guests'} added.`,
  importSkipped: (n: number) =>
    `${n} ${n === 1 ? 'contact was' : 'contacts were'} skipped — no usable mobile number.`,
} as const;
