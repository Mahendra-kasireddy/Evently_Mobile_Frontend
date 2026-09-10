import type { ProfileGroupSpec } from './types';

export const GET_USER_DETAILS_ENDPOINT = '/user/getUserDetails';
export const LOGOUT_ENDPOINT = '/auth/logoutUser';
export const SAVED_PACKAGES_ENDPOINT = '/user/saved-packages';
export const MY_INVITATIONS_ENDPOINT = '/invitation/mine';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const PROFILE_ACCENT = '#e8633a';
export const PROFILE_NAVY = '#1a2e5a';
export const PROFILE_NAVY_DEEP = '#0e1a33';
export const PROFILE_ACCENT_SOFT = '#fdeee7';
export const PROFILE_GREEN = '#1d9e75';
/** The page's own ground, matching Your events. */
export const PROFILE_CANVAS = '#faf8f7';

export const ROLE_LABEL: Record<string, string> = {
  customer: 'Customer',
  organizer: 'Organizer',
  subvendor: 'Sub-vendor',
  admin: 'Admin',
};

/**
 * The whole menu, in the order it is read.
 *
 * Every row here leads to a screen that exists. "List your business" is
 * dropped for an account that already holds the organizer role — inviting
 * someone to sign up for what they already have is worse than a shorter list.
 */
export const PROFILE_GROUPS: ProfileGroupSpec[] = [
  {
    key: 'events',
    title: 'Your events',
    rows: [
      { action: 'bookings', icon: 'clipboard-text-outline', label: 'Bookings' },
      { action: 'savedPackages', icon: 'heart-outline', label: 'Saved packages' },
      { action: 'invitations', icon: 'card-account-details-outline', label: 'Invitations' },
      { action: 'payments', icon: 'credit-card-outline', label: 'Payments' },
    ],
  },
  {
    key: 'account',
    title: 'Account',
    rows: [
      // "Location", not "Saved locations": what this opens is the one current
      // location the app reads from the device. There is no stored address book.
      { action: 'location', icon: 'map-marker-outline', label: 'Location' },
      { action: 'notifications', icon: 'bell-outline', label: 'Notifications' },
      { action: 'settings', icon: 'cog-outline', label: 'Settings' },
    ],
  },
  {
    key: 'more',
    title: 'More',
    rows: [
      { action: 'listBusiness', icon: 'storefront-outline', label: 'List your business' },
      { action: 'help', icon: 'help-circle-outline', label: 'Help & support' },
      { action: 'signOut', icon: 'logout', label: 'Log out' },
    ],
  },
];

export const PROFILE_COPY = {
  title: 'Profile',
  /** An account with no name yet — a prompt, not a fake name. */
  noName: 'Add your name',
  edit: 'Edit',
  signingOut: 'Signing out…',

  savedBadge: (n: number) => `${n} saved`,
  approveBadge: (n: number) => (n === 1 ? '1 to approve' : `${n} to approve`),

  loading: 'Loading your profile…',
  errorTitle: "We couldn't load your profile",
  retry: 'Try again',
};
