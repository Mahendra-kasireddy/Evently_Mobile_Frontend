export type AuthGateStep = 'phone' | 'otp';

export type StepId = 'basic' | 'verification' | 'bank' | 'services' | 'portfolio';
export type StepStatus = 'completed' | 'current' | 'pending';

export interface OnboardingStep {
  id: StepId;
  order: number;
  title: string;
  status: StepStatus;
}

/** A dynamic dropdown option (from the backend config API). */
export interface Option {
  key: string;
  label: string;
}

/** Step 1 dropdown config — everything comes from MongoDB, nothing hardcoded. */
export interface OnboardingConfig {
  businessTypes: Option[];
  categories: Option[];
  cities: string[];
}

/** Step 4/2 dropdown config — all from MongoDB. */
export interface ServicesConfig {
  experienceRanges: Option[];
  teamSizes: Option[];
  languages: Option[];
  travelOptions: Option[];
  paymentMethods: Option[];
  workingDays: Option[];
  documentTypes: Option[];
  categories: Option[];
  occasions: Option[];
  serviceCategories: Option[];
}

/** Uploaded-file metadata returned by POST /upload. */
export interface StoredFileMeta {
  url: string;
  key: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
}

export interface FileRef {
  url: string;
  key: string;
  originalName?: string;
}

/** The full organizer profile view returned by the backend (all 5 steps). */
export interface OrganizerProfile {
  id: string;
  onboardingStatus: 'draft' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  profileCompletion: number;
  submittedAt: string | null;
  // Step 1
  firstName: string;
  lastName: string;
  contactEmail: string;
  mobile: string;
  businessName: string;
  displayName: string;
  businessType: string;
  primaryCategory: string;
  city: string;
  profilePhoto: FileRef | null;
  // Step 2
  aadhaarNumber: string;
  panNumber: string;
  gstNumber: string;
  businessRegNumber: string;
  governmentIdType: string;
  governmentIdFile: FileRef | null;
  panFile: FileRef | null;
  gstFile: FileRef | null;
  businessRegFile: FileRef | null;
  // Step 3
  accountHolderName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
  cancelledChequeFile: FileRef | null;
  // Step 4
  experience: string;
  teamSize: string;
  languages: string[];
  secondaryCategories: string[];
  servicesOffered: string[];
  occasions: string[];
  serviceRadius: number;
  travelOption: string;
  paymentMethods: string[];
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  minBudget: number;
  maxBudget: number;
  advancePercentage: number;
  emergencyAvailability: boolean;
  destinationEvents: boolean;
  internationalEvents: boolean;
  // Step 5
  tagline: string;
  businessDescription: string;
  yearsOfExperience: number;
  featuredProjects: string[];
  instagram: string;
  facebook: string;
  youtube: string;
  website: string;
  linkedin: string;
  coverPhoto: FileRef | null;
  gallery: FileRef[];
  videos: FileRef[];
  certificates: FileRef[];
  awards: FileRef[];
}

/** Full editable form state (files are tracked separately in ProfileFiles). */
export interface ProfileForm {
  // basic
  firstName: string;
  lastName: string;
  contactEmail: string;
  businessName: string;
  displayName: string;
  businessType: string;
  primaryCategory: string;
  city: string;
  // verification
  aadhaarNumber: string;
  panNumber: string;
  gstNumber: string;
  businessRegNumber: string;
  governmentIdType: string;
  // bank
  accountHolderName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  confirmAccountNumber: string; // client-only, never sent
  ifsc: string;
  upiId: string;
  // services
  experience: string;
  teamSize: string;
  languages: string[];
  secondaryCategories: string[];
  occasions: string[];
  serviceRadius: string;
  travelOption: string;
  workingDays: string[];
  minBudget: string;
  maxBudget: string;
  // portfolio
  tagline: string;
  businessDescription: string;
  yearsOfExperience: string;
}

export interface ProfileFiles {
  profilePhoto: FileRef | null;
  governmentIdFile: FileRef | null;
  panFile: FileRef | null;
  gstFile: FileRef | null;
  businessRegFile: FileRef | null;
  cancelledChequeFile: FileRef | null;
  coverPhoto: FileRef | null;
  gallery: FileRef[];
}

export type ScalarField = keyof ProfileForm;
export type SingleFileField =
  | 'profilePhoto'
  | 'governmentIdFile'
  | 'panFile'
  | 'gstFile'
  | 'businessRegFile'
  | 'cancelledChequeFile'
  | 'coverPhoto';
export type MultiFileField = 'gallery';

/** Which section each editable field belongs to (routes debounced autosave). */
export const FIELD_SECTION: Record<string, StepId> = {
  firstName: 'basic', lastName: 'basic', contactEmail: 'basic', businessName: 'basic',
  displayName: 'basic', businessType: 'basic', primaryCategory: 'basic', city: 'basic',
  profilePhoto: 'basic',
  aadhaarNumber: 'verification', panNumber: 'verification', gstNumber: 'verification',
  businessRegNumber: 'verification', governmentIdType: 'verification',
  governmentIdFile: 'verification', panFile: 'verification', gstFile: 'verification',
  businessRegFile: 'verification',
  accountHolderName: 'bank', bankName: 'bank', branchName: 'bank', accountNumber: 'bank',
  ifsc: 'bank', upiId: 'bank', cancelledChequeFile: 'bank',
  experience: 'services', teamSize: 'services', languages: 'services',
  secondaryCategories: 'services', occasions: 'services',
  serviceRadius: 'services', travelOption: 'services', workingDays: 'services',
  minBudget: 'services', maxBudget: 'services',
  tagline: 'portfolio', businessDescription: 'portfolio', yearsOfExperience: 'portfolio',
  coverPhoto: 'portfolio', gallery: 'portfolio',
};

/** Upload purpose per file field (drives server-side validation rules). */
export const FILE_PURPOSE: Record<SingleFileField | MultiFileField, string> = {
  profilePhoto: 'profileImage',
  governmentIdFile: 'governmentId',
  panFile: 'pan',
  gstFile: 'gst',
  businessRegFile: 'businessLicense',
  cancelledChequeFile: 'cancelledCheque',
  coverPhoto: 'coverImage',
  gallery: 'gallery',
};

// ---- Format validators (mirror the backend regex exactly) ----
export const RE = {
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  aadhaar: /^[2-9][0-9]{11}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  upi: /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  accountNumber: /^[0-9]{6,20}$/,
};

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/** A section PATCH body — a partial of any onboarding fields. */
export type SectionPatch = Record<string, unknown>;

/** A file picked on-device, before it's uploaded. */
export interface PickedFile {
  uri: string;
  name: string;
  type: string;
}
