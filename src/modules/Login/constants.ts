export const SEND_OTP_ENDPOINT = '/auth/sendOtp';
export const VERIFY_OTP_ENDPOINT = '/auth/verifyOtp';

export const MOBILE_PATTERN = /^\d{10}$/;
export const OTP_CODE_PATTERN = /^\d{6}$/;
export const MOBILE_LENGTH = 10;
export const OTP_LENGTH = 6;
export const DIAL_CODE = '+91';

/** Matches web's OtpForm.tsx resend cooldown exactly. */
export const RESEND_COOLDOWN_SECONDS = 30;

/**
 * The only region Evently onboards today — the backend validates a bare
 * 10-digit Indian mobile and GST registration is India-only, so offering a
 * second dial code here would be a promise the rest of the stack cannot keep.
 * The picker exists so adding one is a line in this array, not a redesign.
 */
export const DIAL_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
] as const;

export const LOGIN_TAGLINE = 'Effortless celebrations, planned beautifully.';

/** The three promises the hero makes. Each is checkable, so none of them is marketing. */
export const LOGIN_TRUST_CHIPS = [
  'Verified organizers',
  'Itemised quotes',
  'Free to compare',
] as const;

/**
 * A customer has no separate sign-up: verifying a number both signs them in
 * and, on a first use, creates the account. So this screen never says "sign
 * up" — there is nothing for a customer to sign up to.
 */
export const PHONE_COPY = {
  placeholder: 'Mobile number',
  ctaIdle: `Enter ${MOBILE_LENGTH} digits`,
  ctaReady: 'Continue',
  a11yField: 'Mobile number',
} as const;

/**
 * The one entry point to the business side. Worded so a customer reads it and
 * moves on: the second line says outright that an existing business account
 * signs in with the field above, which is the mistake this card used to cause.
 */
export const BUSINESS_ENTRY_COPY = {
  title: 'Organizer or sub-vendor?',
  body: 'Register a business profile · already registered? Just sign in above',
} as const;

export const TERMS_COPY = {
  lead: "By continuing you agree to Evently's",
  terms: 'Terms',
  conjunction: '&',
  privacy: 'Privacy Policy',
} as const;

export const OTP_COPY = {
  title: 'Verify number',
  sentToPrefix: 'OTP sent to',
  edit: 'Edit',
  label: 'Enter OTP',
  retryLead: "Didn't receive OTP? Retry via",
  retryChannel: 'SMS',
  ctaIdle: `Enter ${OTP_LENGTH} digits`,
  ctaReady: 'Verify',
  /** Deliberately blunt. OTP phishing scripts ask people to read the code aloud. */
  safetyNote: 'Never share your code with anyone.',
} as const;
