import type { BusinessView, ProfileAction, ProfileGroupSpec, ProfileRowSpec } from './types';

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

/** The identity card: coral warming into violet. */
export const PROFILE_HEADER_GRADIENT: [string, string] = ['#ff8a5c', '#7c5cdb'];

/** Each menu row's icon tile. Log out is the one red. */
export const PROFILE_ROW_GRADIENT: Record<ProfileAction, [string, string]> = {
  bookings: ['#ff8a5c', '#e8433a'],
  savedPackages: ['#ff6f9f', '#c2416b'],
  invitations: ['#a084ff', '#5a35e0'],
  guestList: ['#3cc9a1', '#0e8a68'],
  payments: ['#5b9bff', '#2554b8'],
  location: ['#ffb547', '#e8791a'],
  notifications: ['#f472b6', '#be185d'],
  settings: ['#8a9ab3', '#4a5872'],
  listBusiness: ['#2fb894', '#0e7358'],
  switchOrganizer: ['#ff8a5c', '#7c5cdb'],
  switchVendor: ['#5b9bff', '#7c5cdb'],
  help: ['#38bdf8', '#0369a1'],
  signOut: ['#ff7a7a', '#d93b3b'],
};

export const ROLE_LABEL: Record<string, string> = {
  customer: 'Customer',
  organizer: 'Organizer',
  subvendor: 'Sub-vendor',
  vendor: 'Sub-vendor',
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
      // Separate from Invitations on purpose: that is the card itself, and
      // this is who receives it — work a host does long before anything is sent.
      { action: 'guestList', icon: 'account-multiple-outline', label: 'Guest list' },
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

/**
 * Opens a business dashboard and makes it the default, so the app opens
 * there from now on. Shown, in their own group at the top, only for the
 * business roles the account actually holds.
 */
export const SWITCH_ROWS: Record<BusinessView, ProfileRowSpec> = {
  organizer: { action: 'switchOrganizer', icon: 'briefcase-outline', label: 'Switch to organizer dashboard' },
  vendor: { action: 'switchVendor', icon: 'account-switch-outline', label: 'Switch to sub-vendor dashboard' },
};

export const BUSINESS_GROUP_TITLE = 'Your business';

export const PROFILE_COPY = {
  title: 'Profile',
  /** An account with no name yet — a prompt, not a fake name. */
  noName: 'Add your name',
  edit: 'Edit',
  signingOut: 'Signing out…',
  switching: 'Opening…',

  savedBadge: (n: number) => `${n} saved`,
  approveBadge: (n: number) => (n === 1 ? '1 to approve' : `${n} to approve`),

  loading: 'Loading your profile…',
  errorTitle: "We couldn't load your profile",
  retry: 'Try again',
};
