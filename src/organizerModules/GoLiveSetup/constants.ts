import type { FieldKey, FileKey, StepId, StepPart } from './types';

export const PROFILE_ENDPOINT = '/organizer/profile';
export const STATUS_ENDPOINT = '/organizer/onboarding-status';
export const ONBOARDING_CONFIG_ENDPOINT = '/organizer/onboarding-config';
export const SERVICES_CONFIG_ENDPOINT = '/organizer/services-config';
export const COMPLETE_ENDPOINT = '/organizer/complete-onboarding';

/** Where each step saves. Basic info is the profile itself. */
export const STEP_ENDPOINT: Record<StepId, string> = {
  basic: PROFILE_ENDPOINT,
  services: '/organizer/profile/services',
  portfolio: '/organizer/profile/portfolio',
  verification: '/organizer/profile/verification',
  bank: '/organizer/profile/bank',
};

/** Upload purpose per file field — the backend's UploadPurpose enum. */
export const FILE_PURPOSE: Record<FileKey, string> = {
  profilePhoto: 'profileImage',
  coverPhoto: 'coverImage',
  gallery: 'gallery',
  governmentIdFile: 'governmentId',
  panFile: 'pan',
  gstFile: 'gst',
  businessRegFile: 'businessLicense',
  cancelledChequeFile: 'cancelledCheque',
};

/** In the order the backend lists them: who you are, what you offer, how it looks, paperwork, payouts. */
export const STEP_ORDER: StepId[] = [
  'basic',
  'services',
  'portfolio',
  'verification',
  'bank',
];

export const STEP_META: Record<
  StepId,
  { title: string; icon: string; blurb: string; gradient: [string, string] }
> = {
  basic: {
    title: 'Basic info',
    icon: 'account-outline',
    blurb: 'Who you are and where you work.',
    gradient: ['#ff8a5c', '#e8433a'],
  },
  services: {
    title: 'Services',
    icon: 'tag-multiple-outline',
    blurb: 'What you offer, when, and for how much.',
    gradient: ['#a084ff', '#5a35e0'],
  },
  portfolio: {
    title: 'Profile & portfolio',
    icon: 'image-multiple-outline',
    blurb: 'Your story and your best photos.',
    gradient: ['#ff6f9f', '#c2416b'],
  },
  verification: {
    title: 'Verification',
    icon: 'shield-check-outline',
    blurb: 'Your ID — never shown to customers.',
    gradient: ['#5b9bff', '#2554b8'],
  },
  bank: {
    title: 'Bank details',
    icon: 'bank-outline',
    blurb: 'Where your payouts go.',
    gradient: ['#3cc9a1', '#0e8a68'],
  },
};

/** The fields each step edits — and the only ones its Save may send. */
export const STEP_FIELDS: Record<StepId, FieldKey[]> = {
  basic: [
    'profilePhoto',
    'firstName',
    'lastName',
    'contactEmail',
    'businessName',
    'displayName',
    'businessType',
    'primaryCategory',
    'city',
  ],
  services: [
    'experience',
    'teamSize',
    'languages',
    'secondaryCategories',
    'servicesOffered',
    'occasions',
    'travelOption',
    'serviceRadius',
    'workingDays',
    'workingHoursStart',
    'workingHoursEnd',
    'emergencyAvailability',
    'destinationEvents',
    'internationalEvents',
    'minBudget',
    'maxBudget',
    'advancePercentage',
    'paymentMethods',
  ],
  portfolio: [
    'tagline',
    'businessDescription',
    'yearsOfExperience',
    'coverPhoto',
    'gallery',
    'website',
    'instagram',
    'facebook',
    'youtube',
    'linkedin',
  ],
  verification: [
    'aadhaarNumber',
    'panNumber',
    'governmentIdType',
    'gstNumber',
    'businessRegNumber',
    'governmentIdFile',
    'panFile',
    'gstFile',
    'businessRegFile',
  ],
  bank: [
    'accountHolderName',
    'bankName',
    'branchName',
    'accountNumber',
    'ifsc',
    'upiId',
    'cancelledChequeFile',
  ],
};

/**
 * Long steps split into short tabs, so no screen is a wall of fields. A step
 * with one part shows no tabs.
 */
export const STEP_PARTS: Record<StepId, StepPart[]> = {
  basic: [{ key: 'all', label: '', fields: STEP_FIELDS.basic }],
  services: [
    {
      key: 'offer',
      label: 'What you offer',
      fields: [
        'experience',
        'teamSize',
        'languages',
        'secondaryCategories',
        'servicesOffered',
        'occasions',
      ],
    },
    {
      key: 'when',
      label: 'Where & when',
      fields: [
        'travelOption',
        'serviceRadius',
        'workingDays',
        'workingHoursStart',
        'workingHoursEnd',
        'emergencyAvailability',
        'destinationEvents',
        'internationalEvents',
      ],
    },
    {
      key: 'pricing',
      label: 'Pricing',
      fields: ['minBudget', 'maxBudget', 'advancePercentage', 'paymentMethods'],
    },
  ],
  portfolio: [
    {
      key: 'about',
      label: 'About',
      fields: ['tagline', 'businessDescription', 'yearsOfExperience'],
    },
    { key: 'photos', label: 'Photos', fields: ['coverPhoto', 'gallery'] },
    {
      key: 'links',
      label: 'Links',
      fields: ['website', 'instagram', 'facebook', 'youtube', 'linkedin'],
    },
  ],
  verification: [
    {
      key: 'ids',
      label: 'ID numbers',
      fields: [
        'aadhaarNumber',
        'panNumber',
        'governmentIdType',
        'gstNumber',
        'businessRegNumber',
      ],
    },
    {
      key: 'docs',
      label: 'Documents',
      fields: ['governmentIdFile', 'panFile', 'gstFile', 'businessRegFile'],
    },
  ],
  bank: [
    {
      key: 'all',
      label: '',
      fields: [...STEP_FIELDS.bank, 'confirmAccountNumber'],
    },
  ],
};

/** Typed as whole numbers; sent as numbers. */
export const NUMBER_FIELDS: ReadonlySet<FieldKey> = new Set<FieldKey>([
  'serviceRadius',
  'minBudget',
  'maxBudget',
  'advancePercentage',
  'yearsOfExperience',
]);

/**
 * Fields the backend refuses as an empty string (a format or a minimum
 * length) — cleared, they are left out of the save rather than sent empty.
 */
export const SKIP_WHEN_EMPTY: ReadonlySet<FieldKey> = new Set<FieldKey>([
  'firstName',
  'lastName',
  'contactEmail',
  'businessName',
  'aadhaarNumber',
  'panNumber',
  'gstNumber',
  'accountNumber',
  'ifsc',
  'upiId',
  'website',
  'workingHoursStart',
  'workingHoursEnd',
]);

/** Shown masked once saved; changing them is a deliberate tap. */
export const SECRET_FIELDS: ReadonlySet<FieldKey> = new Set<FieldKey>([
  'aadhaarNumber',
  'accountNumber',
]);

/** Limits mirrored from the backend DTOs so the form fails fast. */
export const LIMITS = {
  name: 60,
  businessName: 120,
  email: 120,
  tagline: 120,
  bio: 4000,
  social: 200,
  regNumber: 40,
  bankText: 120,
  radius: 5000,
  advance: 100,
  years: 80,
  gallery: 8,
  budgetDigits: 9,
} as const;

/** Field labels — inputs and the read-only summary share them. */
export const FIELD_LABEL: Record<FieldKey, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  contactEmail: 'Contact email',
  businessName: 'Business name',
  displayName: 'Display name',
  businessType: 'Business type',
  primaryCategory: 'Main category',
  city: 'City',
  profilePhoto: 'Profile photo',
  experience: 'Experience',
  teamSize: 'Team size',
  languages: 'Languages you speak',
  secondaryCategories: 'Other categories',
  servicesOffered: 'Services you offer',
  occasions: 'Occasions you cover',
  travelOption: 'Travel',
  serviceRadius: 'Service radius (km)',
  workingDays: 'Working days',
  workingHoursStart: 'Opens at',
  workingHoursEnd: 'Closes at',
  paymentMethods: 'Payments you accept',
  minBudget: 'Minimum budget (₹)',
  maxBudget: 'Maximum budget (₹)',
  advancePercentage: 'Advance (%)',
  emergencyAvailability: 'Available for last-minute events',
  destinationEvents: 'Destination events',
  internationalEvents: 'International events',
  tagline: 'Tagline',
  businessDescription: 'About your business',
  yearsOfExperience: 'Years of experience',
  website: 'Website',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  coverPhoto: 'Cover photo',
  gallery: 'Portfolio photos',
  aadhaarNumber: 'Aadhaar number',
  panNumber: 'PAN',
  gstNumber: 'GSTIN',
  businessRegNumber: 'Business registration no.',
  governmentIdType: 'Government ID type',
  governmentIdFile: 'Government ID',
  panFile: 'PAN card',
  gstFile: 'GST certificate',
  businessRegFile: 'Business registration',
  accountHolderName: 'Account holder name',
  bankName: 'Bank name',
  branchName: 'Branch',
  accountNumber: 'Account number',
  confirmAccountNumber: 'Confirm account number',
  ifsc: 'IFSC',
  upiId: 'UPI ID',
  cancelledChequeFile: 'Cancelled cheque',
};

export const SETUP_COPY = {
  title: 'Go-live setup',
  loading: 'Loading your setup…',
  error: 'We couldn’t load your setup.',
  retry: 'Try again',

  // Hero
  heroEyebrow: 'Your way to going live',
  progress: (done: number, total: number) => `${done} of ${total} done`,
  heroTodo:
    'Finish these steps, then send your profile to us for a quick check.',
  heroReady: 'All set — submit your profile for verification.',

  // Banners and status
  changesTitle: 'Changes requested',
  changesBody:
    'Our team asked for a few changes. Update the steps below and submit again.',
  rejectedTitle: 'Profile not approved',
  rejectedBody:
    'Your profile wasn’t approved. Contact Evently support if you have questions.',
  submittedTitle: 'Submitted for verification',
  submittedBody:
    'We usually review within 24–48 hours and will notify you. Your details are locked while we check them.',
  approvedTitle: 'You’re live',
  approvedBody:
    'Customers can find and book you. Contact support to change verified details.',
  pendingTitle: 'Registration under review',
  pendingBody:
    'You can start your setup as soon as Evently approves your registration.',
  payoutNudge: 'Add your bank details before your first payout.',

  // Step cards
  stepsLabel: 'Steps to go live',
  payoutLabel: 'For payouts',
  done: 'Done',
  optional: 'Optional',
  bankHint: 'Needed before your first payout',
  missing: (fields: string[]) =>
    fields.length <= 2
      ? `Add ${fields.join(' and ')}`
      : `Add ${fields.slice(0, 2).join(', ')} +${fields.length - 2} more`,
  viewOnly: 'View',

  // Submit
  submit: 'Submit for verification',
  submitting: 'Submitting…',
  submitHint: 'Finish the four required steps to submit.',
  submitFailed: 'We couldn’t submit your profile. Please try again.',
  successTitle: 'Submitted!',
  successBody:
    'Thanks — our team will review your profile, usually within 24–48 hours. We’ll notify you as soon as you’re live.',
  successDone: 'Back to dashboard',

  // Step view
  save: 'Save',
  saving: 'Saving…',
  saved: (title: string) => `${title} saved`,
  saveFailed: 'We couldn’t save your changes. Please try again.',
  fixFields: 'Please fix the highlighted fields.',
  readOnlyNote: {
    submitted:
      'Your profile is being reviewed. You can edit it again if we ask for changes.',
    approved:
      'Your profile is live. Contact Evently support to change verified details.',
    bankLocked:
      'Your bank details are on file. Contact Evently support to change them.',
    other: 'This step can’t be edited right now.',
  },
  optionsLoading: 'Loading options…',
  optionsFailed: 'We couldn’t load the options.',
  discardTitle: 'Discard changes?',
  discardBody: 'You have unsaved changes on this step.',
  discard: 'Discard',
  keepEditing: 'Keep editing',
  cancel: 'Cancel',
  remove: 'Remove',
  change: 'Change',
  keep: 'Keep saved',
  replace: 'Replace',
  uploading: 'Uploading…',
  uploadFailed: 'We couldn’t upload that file. Please try another one.',
  removeFileTitle: 'Remove this file?',
  removeFileBody: 'It is removed when you save.',
  addPhoto: 'Add photo',
  addDocument: 'Add a photo of it',
  onFile: 'On file',
  notAdded: 'Not added',
  yes: 'Yes',
  no: 'No',
  photosCount: (n: number) => `${n} photo${n === 1 ? '' : 's'}`,
  galleryHint: (n: number, max: number) =>
    `${n}/${max} · your best events, customers see these first`,
  optionalTag: 'Optional',
  required: 'Required to go live',
  count: (n: number, max: number) => `${n}/${max}`,

  // Field hints and placeholders
  phoneLabel: 'Mobile (verified)',
  photoHint: 'A clear photo of you or your logo.',
  coverHint: 'A wide banner photo of your work.',
  docHint: 'A clear photo — all corners visible.',
  idsNote:
    'Your identity documents are used only for verification and are never shown to customers.',
  bankNote: 'Bank details are kept private and never shared with customers.',
  bankStepHint: 'Optional for now — needed before your first payout.',
  timeHint: '24-hour time, e.g. 09:00',
  placeholders: {
    businessName: 'e.g. Sri Lakshmi Events',
    displayName: 'Optional',
    contactEmail: 'you@business.com',
    tagline: 'e.g. Weddings that feel like you',
    businessDescription:
      'What you do, your style, and what makes your events special…',
    aadhaarNumber: '12 digits',
    panNumber: 'ABCDE1234F',
    gstNumber: '15 characters',
    accountNumber: '6–20 digits',
    ifsc: 'HDFC0001234',
    upiId: 'name@bank',
    website: 'yourbusiness.com',
    social: 'Profile link or @handle',
    time: 'HH:MM',
    amount: 'e.g. 50000',
  },

  // Validation
  errors: {
    email: 'Enter a valid email',
    businessName: 'Enter at least 2 characters',
    aadhaar: 'Enter a valid 12-digit Aadhaar number',
    pan: 'Enter a valid PAN (e.g. ABCDE1234F)',
    gst: 'Enter a valid 15-character GSTIN',
    account: 'Account number must be 6–20 digits',
    accountMatch: 'Account numbers do not match',
    ifsc: 'Enter a valid IFSC (e.g. HDFC0001234)',
    upi: 'Enter a valid UPI ID (e.g. name@bank)',
    website: 'Enter a valid website',
    time: 'Use HH:MM, e.g. 09:30',
    radius: `Keep this under ${LIMITS.radius} km`,
    advance: 'Enter 0–100',
    years: `Enter 0–${LIMITS.years}`,
    budgetOrder: 'Must be more than the minimum budget',
    tooLong: (max: number) => `Keep this under ${max} characters`,
  },
} as const;
