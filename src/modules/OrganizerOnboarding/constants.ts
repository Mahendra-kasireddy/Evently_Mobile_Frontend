import type { MultiFileField, ProfileFiles, ProfileForm, ScalarField, SingleFileField, StepId } from './types';

// Endpoints (all under the existing, already-live organizer-onboarding backend).
export const ONBOARDING_CONFIG_ENDPOINT = '/organizer/onboarding-config';
export const SERVICES_CONFIG_ENDPOINT = '/organizer/services-config';
export const REGISTER_ENDPOINT = '/organizer/register';
export const PROFILE_ENDPOINT = '/organizer/profile';
export const COMPLETE_ENDPOINT = '/organizer/complete-onboarding';
export const UPLOAD_ENDPOINT = '/upload';
export const sectionEndpoint = (id: StepId): string =>
  id === 'basic' ? PROFILE_ENDPOINT : `${PROFILE_ENDPOINT}/${id}`;

// Web's actual brand palette (evently-FrontEnd src/index.css :root) — same
// navy/orange identity Login/Join already port on mobile. Scoped to this
// module only, not applied app-wide.
export const ORG_BG = '#f8f8f6';
export const ORG_NAVY = '#1a2e5a';
export const ORG_ACCENT = '#e8633a';
export const ORG_ACCENT_SOFT = '#fdeee7';
export const ORG_BORDER = '#ebebeb';
export const ORG_TEXT_MUTED = '#5b6675';
export const ORG_GREEN = '#1d9e75';
export const ORG_GREEN_DARK = '#0f6b4f';
export const ORG_GREEN_SOFT = '#e5f6f0';
export const ORG_DANGER = '#dc2626';

export const ONB_COPY = {
  title: 'Become an Evently organizer',
  subtitle: 'A few quick steps to get verified and start receiving matched leads.',
  verifyNote: 'Verification typically takes 24–48 hrs after submission.',
  authTitle: 'Verify your mobile to continue',
  authSubtitle: 'Organizer onboarding uses the same secure login. Verify your number to start.',
} as const;

export const ONBOARDING_STEPS: Array<{ id: StepId; order: number; title: string }> = [
  { id: 'basic', order: 1, title: 'Basic info' },
  { id: 'verification', order: 2, title: 'Verification' },
  { id: 'bank', order: 3, title: 'Bank account' },
  { id: 'services', order: 4, title: 'Services' },
  { id: 'portfolio', order: 5, title: 'Profile & portfolio' },
];

export const STEP_STATUS_LABEL: Record<string, string> = {
  completed: 'Completed',
  current: 'In progress',
  pending: 'Pending',
};

export const EMPTY_FORM: ProfileForm = {
  firstName: '', lastName: '', contactEmail: '', businessName: '', displayName: '',
  businessType: '', primaryCategory: '', city: '',
  aadhaarNumber: '', panNumber: '', gstNumber: '', businessRegNumber: '', governmentIdType: '',
  accountHolderName: '', bankName: '', branchName: '', accountNumber: '', confirmAccountNumber: '',
  ifsc: '', upiId: '',
  experience: '', teamSize: '', languages: [], secondaryCategories: [], occasions: [],
  serviceRadius: '', travelOption: '', workingDays: [], minBudget: '', maxBudget: '',
  tagline: '', businessDescription: '', yearsOfExperience: '',
};

export const EMPTY_FILES: ProfileFiles = {
  profilePhoto: null, governmentIdFile: null, panFile: null, gstFile: null, businessRegFile: null,
  cancelledChequeFile: null, coverPhoto: null, gallery: [],
};

export const NUMBER_FIELDS = new Set<ScalarField>(['serviceRadius', 'minBudget', 'maxBudget', 'yearsOfExperience']);

/** Per-field format validators used both for inline errors and autosave gating. */
export const FIELD_RE: Partial<Record<ScalarField, RegExp>> = {
  contactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  aadhaarNumber: /^[2-9][0-9]{11}$/,
  panNumber: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  gstNumber: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  accountNumber: /^[0-9]{6,20}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  upiId: /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/,
};

export const FIELD_MSG: Partial<Record<ScalarField, string>> = {
  contactEmail: 'Enter a valid email',
  aadhaarNumber: 'Enter a valid 12-digit Aadhaar number',
  panNumber: 'Enter a valid PAN (ABCDE1234F)',
  gstNumber: 'Enter a valid 15-char GSTIN',
  accountNumber: 'Account number must be 6–20 digits',
  ifsc: 'Enter a valid IFSC (HDFC0001234)',
  upiId: 'Enter a valid UPI ID (name@bank)',
};

/** FE mirror of the backend's required-field sets — drives step-completion ticks. */
export const STEP_REQUIRED: Record<StepId, ScalarField[]> = {
  basic: ['firstName', 'lastName', 'contactEmail', 'businessName', 'businessType', 'primaryCategory', 'city'],
  verification: ['aadhaarNumber', 'panNumber', 'governmentIdType'],
  bank: ['accountHolderName', 'bankName', 'accountNumber', 'ifsc'],
  services: ['experience', 'teamSize', 'languages', 'occasions', 'travelOption', 'workingDays', 'minBudget', 'maxBudget'],
  portfolio: ['businessDescription'],
};

export const STEP_REQUIRED_FILES: Record<StepId, Array<SingleFileField | MultiFileField>> = {
  basic: ['profilePhoto'],
  verification: ['governmentIdFile', 'panFile'],
  bank: ['cancelledChequeFile'],
  services: [],
  portfolio: ['coverPhoto', 'gallery'],
};

/** Fallback government-ID type options if servicesConfig.documentTypes is empty. */
export const DEFAULT_DOCUMENT_TYPES = [
  { key: 'aadhaar', label: 'Aadhaar card' },
  { key: 'voter_id', label: 'Voter ID' },
  { key: 'passport', label: 'Passport' },
  { key: 'driving_license', label: 'Driving licence' },
];

/** Icon per category key, for the Step 4 toggle grid — falls back to a generic icon. */
export const CATEGORY_ICON: Record<string, string> = {
  catering: 'food-variant', food: 'food-variant',
  decoration: 'flower-tulip-outline', decor: 'flower-tulip-outline',
  photography: 'camera-outline', photo: 'camera-outline',
  music: 'music-note-outline', sound: 'music-note-outline',
  priest: 'account-tie-outline', pandit: 'account-tie-outline',
  transportation: 'car-outline', transport: 'car-outline',
  venue: 'home-city-outline', makeup: 'face-woman-outline', mehendi: 'hand-back-left-outline',
  anchor: 'microphone-outline', dj: 'headphones', security: 'shield-account-outline',
};
export const DEFAULT_CATEGORY_ICON = 'star-outline';

export const GALLERY_MAX = 8;
