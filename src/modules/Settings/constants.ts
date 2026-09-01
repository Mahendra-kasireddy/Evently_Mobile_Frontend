import type { PrefToggle, SettingsField } from './types';

export const GET_USER_DETAILS_ENDPOINT = '/user/getUserDetails';
export const UPDATE_PROFILE_ENDPOINT = '/user/updateProfile';
export const PREFERENCES_ENDPOINT = '/user/preferences';
export const CLOSE_ACCOUNT_ENDPOINT = '/user/close-account';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const SETTINGS_ACCENT = '#e8633a';
export const SETTINGS_NAVY = '#1a2e5a';
export const SETTINGS_ACCENT_SOFT = '#fdeee7';
export const SETTINGS_GREEN = '#1d9e75';

/**
 * The three details the customer can actually change. Phone is deliberately
 * absent: it is the account's identity and is changed by verifying a new
 * number, not by typing over the old one.
 */
export const SETTINGS_FIELDS: SettingsField[] = [
  {
    key: 'name',
    label: 'Your name',
    hint: 'How organizers see you on a quote request.',
    placeholder: 'e.g. Meera Rao',
    keyboard: 'default',
    autoCapitalize: 'words',
  },
  {
    key: 'email',
    label: 'Email',
    hint: 'Where booking confirmations go.',
    placeholder: 'you@example.com',
    keyboard: 'email-address',
    autoCapitalize: 'none',
  },
  {
    key: 'city',
    label: 'City',
    hint: 'What “organizers near you” matches on.',
    placeholder: 'e.g. Hyderabad',
    keyboard: 'default',
    autoCapitalize: 'words',
  },
];

/**
 * What the customer can silence.
 *
 * Booking and payment notices are deliberately not offered: they are the
 * record of money moving and of a commitment made, and an app that lets you
 * miss "your organizer declined" is not doing you a favour. The server holds
 * the same line — those types are not governed by any preference.
 */
export const PREF_TOGGLES: PrefToggle[] = [
  {
    key: 'quotes',
    title: 'Quotes from organizers',
    subtitle: 'When an organizer replies to a request you made.',
  },
  {
    key: 'invitations',
    title: 'Guest invitations',
    subtitle: 'When an organizer shares an invitation for your approval.',
  },
  {
    key: 'marketing',
    title: 'Ideas & offers',
    subtitle: 'Occasional tips for planning. Off unless you ask for it.',
  },
];

export const SETTINGS_COPY = {
  title: 'Settings',
  detailsSection: 'Your details',
  phoneLabel: 'Phone',
  phoneNote: 'Your phone is how you sign in. Contact support to change it.',
  verified: 'Verified',
  unverified: 'Not verified',
  save: 'Save changes',
  saving: 'Saving…',
  saved: 'Saved',
  invalidEmail: 'Enter a valid email address, or leave it blank.',
  notificationsSection: 'Notifications',
  notificationsNote:
    'Booking and payment updates always come through — they are the record of your event, not a preference.',
  prefSaveError: "That preference didn't save. Check your connection and try again.",

  dangerSection: 'Account',
  closeAccount: 'Close my account',
  closeHint: 'Sign out everywhere and close this account.',
  closeTitle: 'Close your account?',
  closeBody:
    'You will be signed out and will not be able to sign in again with this number. Your existing bookings stay with their organizers, who are still delivering them.',
  closeConfirm: 'Close account',
  closeCancel: 'Keep my account',
  closeError: "We couldn't close the account. Please try again.",

  loading: 'Loading your details…',
  errorTitle: "We couldn't load your details",
  retry: 'Try again',
};
