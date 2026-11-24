import type { MenuGroupSpec, ProfileAction } from './types';

export const PROFILE_ENDPOINT = '/organizer/profile';
export const PREVIEW_ENDPOINT = '/organizer/profile/preview';
export const SERVICES_CONFIG_ENDPOINT = '/organizer/services-config';
export const SERVICES_SECTION_ENDPOINT = '/organizer/profile/services';
export const PORTFOLIO_SECTION_ENDPOINT = '/organizer/profile/portfolio';
export const LOGOUT_ENDPOINT = '/auth/logoutUser';

/** Upload purposes — must match the backend's UploadPurpose enum. */
export const PURPOSE_PROFILE_IMAGE = 'profileImage';
export const PURPOSE_GALLERY = 'gallery';

/** Limits mirrored from the backend so the form fails fast. */
export const BUSINESS_NAME_MAX = 120;
export const TAGLINE_MAX = 120;
export const BIO_MAX = 4000;
export const GALLERY_MAX = 8;

/** Go-live setup opened at one step. */
export const setupStepPath = (step: string) => `/organizer/setup?step=${step}`;

/** Each menu row's icon tile — the customer Profile's gradients. Log out is the one red. */
export const ROW_GRADIENT: Record<ProfileAction, [string, string]> = {
  editProfile: ['#ff8a5c', '#7c5cdb'],
  setup: ['#ff8a5c', '#e8433a'],
  services: ['#a084ff', '#5a35e0'],
  bank: ['#3cc9a1', '#0e8a68'],
  coupons: ['#ff6f9f', '#c2416b'],
  badges: ['#ffc65c', '#e8902a'],
  academy: ['#5b9bff', '#2554b8'],
  subvendors: ['#2fb894', '#0e7358'],
  notifications: ['#f472b6', '#be185d'],
  switchCustomer: ['#5b9bff', '#7c5cdb'],
  help: ['#38bdf8', '#0369a1'],
  signOut: ['#ff7a7a', '#d93b3b'],
};

export const MENU: MenuGroupSpec[] = [
  {
    key: 'business',
    title: 'Your business',
    rows: [
      {
        action: 'editProfile',
        icon: 'storefront-edit-outline',
        label: 'Edit business profile',
      },
      {
        action: 'setup',
        icon: 'rocket-launch-outline',
        label: 'Go-live setup',
      },
      {
        action: 'services',
        icon: 'tag-multiple-outline',
        label: 'Services & pricing',
      },
      { action: 'bank', icon: 'bank-outline', label: 'Bank details' },
      { action: 'coupons', icon: 'ticket-percent-outline', label: 'Coupons' },
    ],
  },
  {
    key: 'grow',
    title: 'Grow',
    rows: [
      { action: 'badges', icon: 'medal-outline', label: 'Badges & tiers' },
      { action: 'academy', icon: 'school-outline', label: 'Evently Academy' },
      {
        action: 'subvendors',
        icon: 'account-hard-hat-outline',
        label: 'Sub-vendors',
      },
    ],
  },
  {
    key: 'account',
    title: 'Account',
    rows: [
      { action: 'notifications', icon: 'bell-outline', label: 'Notifications' },
      {
        action: 'switchCustomer',
        icon: 'account-switch-outline',
        label: 'Switch to customer app',
      },
      { action: 'help', icon: 'help-circle-outline', label: 'Help & support' },
      { action: 'signOut', icon: 'logout', label: 'Log out' },
    ],
  },
];

export const PROFILE_COPY = {
  title: 'Profile',
  loading: 'Loading your profile…',
  error: 'We couldn’t load your profile.',
  retry: 'Try again',

  live: 'Live',
  notLive: 'Not live yet',
  noRating: 'New',
  rating: 'Rating',
  reviews: 'Reviews',
  events: 'Events',
  changePhoto: 'Change photo',
  photoTitle: 'Profile photo',
  edit: 'Edit',

  workTitle: 'Your work',
  workHint: (n: number, max: number) =>
    `${n}/${max} photos · customers see these first`,
  workAdd: 'Add photo',
  workEmpty:
    'Add photos of your best events — profiles with photos get more enquiries.',
  workPhotoTitle: 'Add a photo of your work',
  removePhotoTitle: 'Remove this photo?',
  removePhotoBody: 'It will no longer show on your profile.',
  remove: 'Remove',
  cancel: 'Cancel',

  switching: 'Opening…',
  signingOut: 'Signing out…',
  uploadFailed: 'We couldn’t upload that photo. Please try another one.',
  removeFailed: 'We couldn’t remove that photo. Please try again.',

  // Edit screen
  editTitle: 'Edit business profile',
  businessName: 'Business name',
  businessNamePh: 'e.g. Sri Lakshmi Events',
  displayName: 'Display name',
  displayNameHint: 'Shown to customers instead of the business name, if set.',
  displayNamePh: 'Optional',
  tagline: 'Tagline',
  taglinePh: 'e.g. Weddings that feel like you',
  about: 'About your business',
  aboutPh: 'What you do, your style, and what makes your events special…',
  services: 'Services you offer',
  servicesHint: 'Tap all that apply.',
  save: 'Save changes',
  saving: 'Saving…',
  saved: 'Saved',
  saveFailed: 'We couldn’t save your changes. Please try again.',
  fixFields: 'Please fix the highlighted fields.',
  businessNameShort: 'Enter at least 2 characters.',
  tooLong: (max: number) => `Keep this under ${max} characters.`,
  count: (n: number, max: number) => `${n}/${max}`,
  discardTitle: 'Discard changes?',
  discardBody: 'You have unsaved changes.',
  discard: 'Discard',
  keepEditing: 'Keep editing',
} as const;
