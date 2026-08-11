// Same endpoints Profile's module already uses (getUserDetails) and the
// backend's self-service update route — see evently-BackEnd user.controller.ts.
export const GET_USER_DETAILS_ENDPOINT = '/user/getUserDetails';
export const UPDATE_PROFILE_ENDPOINT = '/user/updateProfile';

// Mirrors backend CreateUserDto's name validation (@MinLength(2) @MaxLength(80)).
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 80;

// Web's actual brand palette (evently-FrontEnd/src/index.css :root) — same
// navy/orange identity Home/Login already port. Scoped to this module only.
export const NAME_GATE_NAVY = '#1a2e5a'; // --color-navy / --color-text
export const NAME_GATE_ACCENT = '#e8633a'; // --color-primary
export const NAME_GATE_ACCENT_WARM = '#ff8b5e'; // --color-accent-warm
export const NAME_GATE_TEXT_MUTED = '#5b6675'; // --color-text-muted
export const NAME_GATE_BORDER = '#ebebeb'; // --color-border

export const NAME_GATE_COPY = {
  heading: 'What should we call you?',
  subtitle: "So your organizer and guests know it's you.",
  placeholder: 'e.g. Aditi Sharma',
  cta: 'Continue',
  reassurance: 'This is how organizers & guests will see you.',
  errorTooShort: 'Please enter at least 2 characters.',
} as const;
