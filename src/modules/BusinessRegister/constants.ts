import type { JoinRole } from '../../navigation/types';

export const REGISTER_ORGANIZER_ENDPOINT = '/organizer/register';
export const ONBOARDING_CONFIG_ENDPOINT = '/organizer/onboarding-config';

// The partner palette, matching the web onboarding pages these lead into.
export const REG_BG = '#f8f8f6';
export const REG_NAVY = '#1a2e5a';
export const REG_ACCENT = '#e8633a';
export const REG_ACCENT_SOFT = '#fdeee7';
export const REG_BORDER = '#ebebeb';
export const REG_TEXT_MUTED = '#5b6675';
export const REG_GREEN = '#1d9e75';
export const REG_GREEN_SOFT = '#e5f6f0';
export const REG_GREEN_DARK = '#0f6b4f';

export interface AuthGateCopy {
  header: string;
  /** "Step 1 of 2" — the whole sign-up is two screens, and saying so keeps people going. */
  step: string;
  title: string;
  subtitle: string;
  /** The one-account rule, said where it matters: before the number is typed. */
  sameNumber: string;
}

/** The OTP step, per role. Same sign-in as customers — said outright so nobody registers twice. */
export const AUTH_COPY: Record<JoinRole, AuthGateCopy> = {
  organizer: {
    header: 'Become an organizer',
    step: 'STEP 1 OF 2 · VERIFY',
    title: 'Verify your mobile',
    subtitle: 'Use the number customers should reach your business on.',
    sameNumber:
      'Already use Hypie as a customer? Use that same number — your organizer profile is added to the same account.',
  },
  subvendor: {
    header: 'Become a sub-vendor',
    step: 'STEP 1 OF 2 · VERIFY',
    title: 'Verify your mobile',
    subtitle: 'Use the number organizers already know you by.',
    sameNumber:
      'Already use Hypie as a customer? Use that same number — your sub-vendor profile is added to the same account.',
  },
};

export const REGISTER_COPY = {
  settingUp: 'Setting up your dashboard…',
  retry: 'Try again',
  registerFailed: 'Could not start your registration',
  configFailed: 'Could not load categories and cities',
  subvendorHeader: 'Become a sub-vendor',
} as const;

/** The one-screen organizer sign-up. */
export const SIGNUP_COPY = {
  header: 'Become an organizer',
  title: 'Tell us about your business',
  subtitle:
    'Just the basics to open your dashboard. Documents and bank details can wait.',
  firstName: 'First name',
  lastName: 'Last name',
  businessName: 'Business name',
  businessPlaceholder: 'e.g. Sri Lakshmi Events',
  category: 'What do you organize?',
  city: 'Your city',
  cta: 'Open my dashboard',
  laterNote:
    'Next, from your dashboard: add your services and portfolio, verify your documents, and go live. Bank details are only needed before your first payout.',
  required: 'Fill in every field to continue.',
} as const;
