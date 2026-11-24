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
  /** The hero heading, in two lines: plain, then the gradient word. */
  titleLead: string;
  titleAccent: string;
  /** Under the heading — what this step is for. */
  heroSubtitle: string;
}

/** The OTP step, per role. Same sign-in as customers — said outright so nobody registers twice. */
export const AUTH_COPY: Record<JoinRole, AuthGateCopy> = {
  organizer: {
    header: 'Become an organizer',
    titleLead: 'Organizer',
    titleAccent: 'Verification',
    heroSubtitle:
      'Help us verify your identity to become a trusted event organizer.',
  },
  subvendor: {
    header: 'Become a sub-vendor',
    titleLead: 'Sub-vendor',
    titleAccent: 'Verification',
    heroSubtitle:
      'Help us verify your identity to become a trusted event partner.',
  },
};

/** The phone step: registration is for new numbers; existing ones sign in. */
export const GATE_COPY = {
  alreadyRegistered:
    'This number is already registered with Hypie. Sign in to continue.',
  haveAccount: 'Already registered?',
  signIn: 'Sign in',
} as const;

/** The brand lockup in the verification hero. */
export const VERIFY_HERO_COPY = {
  wordmark: 'Hypie',
  tagline: 'Moments Made Special',
  otpLead: 'Enter your',
  otpAccent: '6-digit code',
  otpSubtitle: 'Check your messages and enter the code to verify your number.',
  sentBySms: 'We sent it by SMS to',
  noCode: "Didn't get the code?",
} as const;

/** Hero palette: blush wash, navy heading, violet→pink accent word. */
export const VERIFY_HERO_BG: [string, string] = ['#fff7f2', '#fde6ee'];
export const VERIFY_TITLE_GRADIENT = ['#5b3bd6', '#a33ad6', '#e8457f'] as const;
export const VERIFY_TAGLINE = '#d6336c';
export const VERIFY_BADGE_GRADIENT: [string, string] = ['#7b5cf0', '#e8457f'];

export const REGISTER_COPY = {
  settingUp: 'Setting up your dashboard…',
  retry: 'Try again',
  registerFailed: 'Could not start your registration',
  configFailed: 'Could not load categories and cities',
  subvendorHeader: 'Become a sub-vendor',
} as const;

/** The one-screen organizer sign-up — for freelancers and businesses alike. */
export const SIGNUP_COPY = {
  header: 'Become an organizer',
  step: 'STEP 2 OF 2 · ABOUT YOU',
  title: 'Tell us about your work',
  subtitle:
    'Freelancer or full team — just the basics to open your dashboard. Documents and bank details can wait.',
  workStyle: 'How do you work?',
  workStyles: [
    {
      key: 'freelancer',
      icon: 'account-outline',
      title: 'Freelancer',
      body: 'Just me, under my own name',
    },
    {
      key: 'business',
      icon: 'storefront-outline',
      title: 'Business',
      body: 'A team, studio or company',
    },
  ],
  firstName: 'First name',
  firstNamePlaceholder: 'Enter first name',
  lastName: 'Surname',
  lastNamePlaceholder: 'Enter surname',
  businessName: 'Business name',
  businessPlaceholder: 'e.g. Sri Lakshmi Events',
  brandName: 'Brand name (optional)',
  brandPlaceholder: 'e.g. Clicks by Ravi',
  brandHint: 'Leave it blank and customers will see your own name.',
  category: 'What do you do?',
  city: 'Where do you work?',
  cta: 'Continue',
  laterNote:
    'Next, from your dashboard: add your services and portfolio, verify your documents, and go live. Bank details are only needed before your first payout.',
  required: 'Fill in every field to continue.',
} as const;

/** The business-type key the server uses for a freelancer. */
export const FREELANCER_BUSINESS_TYPE = 'individual';
