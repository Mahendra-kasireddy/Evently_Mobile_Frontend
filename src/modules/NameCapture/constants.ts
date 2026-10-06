// Same endpoints Profile's module already uses (getUserDetails) and the
// backend's self-service update route — see evently-BackEnd user.controller.ts.
export const GET_USER_DETAILS_ENDPOINT = '/user/getUserDetails';
export const UPDATE_PROFILE_ENDPOINT = '/user/updateProfile';
export const UPLOAD_ENDPOINT = '/upload';
/** The upload purpose the server validates a profile photo against (≤5MB, 100–4096px). */
export const PROFILE_PHOTO_PURPOSE = 'profileImage';

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

/** The Continue button: the sign-in screen's warm gradient, left to right. */
export const NAME_GATE_CTA_GRADIENT: [string, string] = ['#f47b4d', '#f9a679'];

export const NAME_GATE_COPY = {
  heading: 'What’s your name?',
  subtitle: 'Let’s personalize your experience with a friendly greeting.',
  greeting: 'Hi!',
  placeholder: 'Enter your name',
  addPhoto: 'Add your photo',
  changePhoto: 'Change photo',
  uploading: 'Uploading…',
  photoSheetTitle: 'Profile photo',
  takePhoto: 'Take a photo',
  chooseFromLibrary: 'Choose from library',
  cancel: 'Cancel',
  cta: 'Continue',
  needPhoto: 'Add a photo to continue.',
  errorTooShort: 'Please enter at least 2 characters.',
  uploadFailed: 'Could not upload your photo. Please try again.',
} as const;
