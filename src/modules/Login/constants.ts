export const SEND_OTP_ENDPOINT = '/auth/sendOtp';
export const VERIFY_OTP_ENDPOINT = '/auth/verifyOtp';

export const MOBILE_PATTERN = /^\d{10}$/;
export const OTP_CODE_PATTERN = /^\d{6}$/;
export const OTP_LENGTH = 6;
export const DIAL_CODE = '+91';

/** Matches web's OtpForm.tsx resend cooldown exactly. */
export const RESEND_COOLDOWN_SECONDS = 30;

// Web's actual brand palette (evently-FrontEnd/src/index.css :root) — the
// same navy/orange/cream identity Home/Plan already port. Scoped to this
// module only, not applied app-wide.
export const LOGIN_BG = '#f8f8f6'; // --color-bg
export const LOGIN_NAVY = '#1a2e5a'; // --color-navy / --color-text
export const LOGIN_NAVY_DEEP = '#0e1a33'; // --color-navy-deep
export const LOGIN_ACCENT = '#e8633a'; // --color-primary
export const LOGIN_ACCENT_WARM = '#ff8b5e'; // --color-accent-warm
export const LOGIN_BORDER = '#ebebeb'; // --color-border
export const LOGIN_TEXT_MUTED = '#5b6675'; // --color-text-muted
// A soft warm-orange glow behind the wordmark — low opacity so it reads as a
// subtle tint against the navy, not a solid muddy shape.
export const LOGIN_DECOR_CIRCLE_COLOR = 'rgba(255,139,94,0.14)';

// Trimmed to just the wordmark + a one-line tagline (same line Splash uses)
// per explicit feedback that the full web promo panel (badge/description/
// features/proof) reads as too much content for a mobile login screen.
export const LOGIN_TAGLINE = 'Effortless celebrations, planned beautifully.';

// "Sign up" is a distinct, separate flow ONLY for organizer/sub-vendor
// business accounts on web (the /join role picker → business onboarding
// wizards) — confirmed by reading evently-FrontEnd's actual /join + onboarding
// routes. A regular customer on web has no signup form at all: phone+OTP
// verification both logs in AND silently creates the account on first use,
// exactly like mobile already does. So this screen never says "sign up" —
// there's nothing separate to sign up for on the customer app.
export const LOGIN_FORM_COPY = {
  title: 'Welcome to Evently',
  subtitle: "Enter your mobile number to continue. We'll text you a one-time code to verify it's you.",
  mobileLabel: 'Mobile number',
  placeholder: '98765 43210',
  sendCta: 'Send OTP',
} as const;

export const LOGIN_TRUST_NOTE = "Your number is only used to verify it's you.";

// Deliberately scoped to organizers/sub-vendors, not customers — a regular
// customer never needs this (entering their number above already logs them
// in or signs them up). Worded explicitly so a customer doesn't mistake this
// for "the signup button" and gets confused about which path is theirs.
export const JOIN_LINK_COPY = {
  label: 'Organizer or sub-vendor?',
  cta: 'Create a business account',
} as const;
