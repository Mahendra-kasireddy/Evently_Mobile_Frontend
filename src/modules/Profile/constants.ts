export const GET_USER_DETAILS_ENDPOINT = '/user/getUserDetails';
export const LOGOUT_ENDPOINT = '/auth/logoutUser';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const PROFILE_ACCENT = '#e8633a';
export const PROFILE_NAVY = '#1a2e5a';
export const PROFILE_NAVY_DEEP = '#0e1a33';
export const PROFILE_ACCENT_SOFT = '#fdeee7';
export const PROFILE_GREEN = '#1d9e75';

export const ROLE_LABEL: Record<string, string> = {
  customer: 'Customer',
  organizer: 'Organizer',
  subvendor: 'Sub-vendor',
  admin: 'Admin',
};

export const PROFILE_COPY = {
  title: 'Profile',
  /** An account with no name yet — a prompt, not a fake name. */
  noName: 'Add your name',
  verified: 'Verified',
  unverified: 'Not verified',

  sectionEvents: 'Your events',
  sectionAccount: 'Account',

  bookings: 'My Bookings',
  bookingsHint: 'Plans, payments and progress',
  invitations: 'My Invitations',
  invitationsHint: 'Review and send to guests',
  settings: 'Settings',
  settingsHint: 'Your name, email and city',
  legal: 'Legal & Support',
  legalHint: 'Contact us, terms and privacy',

  switchToOrganizer: 'Switch to organizer dashboard',
  switchToCustomer: 'Switch to the customer app',
  switchHint: 'This account holds both roles.',

  signOut: 'Sign out',
  signingOut: 'Signing out…',

  loading: 'Loading your profile…',
  errorTitle: "We couldn't load your profile",
  retry: 'Try again',
};
