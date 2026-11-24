import type { StoredFile } from '../Shared';

/*
 * The go-live setup endpoints, then the form and view models the hub and the
 * step views draw. DTOs mirror the backend's OrganizerProfileView and
 * getOnboardingStatus; only the fields these screens read are typed.
 */

export type StepId =
  | 'basic'
  | 'services'
  | 'portfolio'
  | 'verification'
  | 'bank';

/** The backend's OnboardingStatus enum. */
export type OnboardingStatusValue =
  | 'pending_review'
  | 'draft'
  | 'in_progress'
  | 'submitted'
  | 'changes_requested'
  | 'approved'
  | 'rejected';

export interface Option {
  key: string;
  label: string;
}

/** One step of `GET /organizer/onboarding-status`. */
export interface OnboardingStepDTO {
  id: string;
  title: string;
  complete: boolean;
  /** Labels of what is still empty, e.g. "Profile photo". */
  missingFields: string[];
  /** False for bank details — needed before payouts, not before going live. */
  requiredForGoLive: boolean;
}

/** `GET /organizer/onboarding-status`. */
export interface OnboardingStatusDTO {
  onboardingStatus: OnboardingStatusValue;
  canEdit: boolean;
  canEditBank: boolean;
  canSubmit: boolean;
  goLiveMissing: string[];
  payoutReady: boolean;
  reviewNote: string;
  submittedAt: string | null;
  steps: OnboardingStepDTO[];
}

/** `GET /organizer/onboarding-config` — basic info's option lists. */
export interface OnboardingConfigDTO {
  businessTypes: Option[];
  categories: Option[];
  cities: string[];
}

/** `GET /organizer/services-config` — every other option list. */
export interface ServicesConfigDTO {
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

/** `GET /organizer/profile` — every onboarding field, as the API returns it. */
export interface SetupProfileDTO {
  id: string;
  onboardingStatus: OnboardingStatusValue;
  canEdit: boolean;
  canEditBank: boolean;
  payoutReady: boolean;
  reviewNote: string;
  mobile: string;
  // Basic
  firstName: string;
  lastName: string;
  contactEmail: string;
  businessName: string;
  displayName: string;
  businessType: string;
  primaryCategory: string;
  city: string;
  profilePhoto: StoredFile | null;
  // Verification
  aadhaarNumber: string;
  panNumber: string;
  gstNumber: string;
  businessRegNumber: string;
  governmentIdType: string;
  governmentIdFile: StoredFile | null;
  panFile: StoredFile | null;
  gstFile: StoredFile | null;
  businessRegFile: StoredFile | null;
  // Bank
  accountHolderName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
  cancelledChequeFile: StoredFile | null;
  // Services
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
  // Portfolio
  tagline: string;
  businessDescription: string;
  yearsOfExperience: number;
  instagram: string;
  facebook: string;
  youtube: string;
  website: string;
  linkedin: string;
  coverPhoto: StoredFile | null;
  gallery: StoredFile[];
}

/**
 * Every editable field of every step, as the form holds it: numbers as the
 * text being typed, files as what the server stored. Each step edits its own
 * slice (STEP_FIELDS); `confirmAccountNumber` is client-only.
 */
export interface SetupForm {
  // Basic
  firstName: string;
  lastName: string;
  contactEmail: string;
  businessName: string;
  displayName: string;
  businessType: string;
  primaryCategory: string;
  city: string;
  profilePhoto: StoredFile | null;
  // Services
  experience: string;
  teamSize: string;
  languages: string[];
  secondaryCategories: string[];
  servicesOffered: string[];
  occasions: string[];
  travelOption: string;
  serviceRadius: string;
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  paymentMethods: string[];
  minBudget: string;
  maxBudget: string;
  advancePercentage: string;
  emergencyAvailability: boolean;
  destinationEvents: boolean;
  internationalEvents: boolean;
  // Portfolio
  tagline: string;
  businessDescription: string;
  yearsOfExperience: string;
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  coverPhoto: StoredFile | null;
  gallery: StoredFile[];
  // Verification
  aadhaarNumber: string;
  panNumber: string;
  gstNumber: string;
  businessRegNumber: string;
  governmentIdType: string;
  governmentIdFile: StoredFile | null;
  panFile: StoredFile | null;
  gstFile: StoredFile | null;
  businessRegFile: StoredFile | null;
  // Bank
  accountHolderName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifsc: string;
  upiId: string;
  cancelledChequeFile: StoredFile | null;
}

export type FieldKey = keyof SetupForm;

type KeysOf<T> = {
  [K in FieldKey]: SetupForm[K] extends T
    ? T extends SetupForm[K]
      ? K
      : never
    : never;
}[FieldKey];

export type TextKey = KeysOf<string>;
export type ListKey = KeysOf<string[]>;
export type BoolKey = KeysOf<boolean>;
export type SingleFileKey = KeysOf<StoredFile | null>;
export type FileKey = SingleFileKey | 'gallery';

export type FormErrors = Partial<Record<FieldKey, string>>;

export type SetField = <K extends FieldKey>(
  key: K,
  value: SetupForm[K],
) => void;

/** One tab inside a long step. */
export interface StepPart {
  key: string;
  label: string;
  fields: FieldKey[];
}

/** Every option list a step can draw, merged from both config endpoints. */
export interface StepOptions {
  businessTypes: Option[];
  categories: Option[];
  cities: Option[];
  experienceRanges: Option[];
  teamSizes: Option[];
  languages: Option[];
  travelOptions: Option[];
  paymentMethods: Option[];
  workingDays: Option[];
  documentTypes: Option[];
  occasions: Option[];
  serviceCategories: Option[];
}

/** A stored file ready to draw: `uri` is already absolutised. */
export interface FileModel {
  key: string;
  uri: string;
  name: string;
  isImage: boolean;
}

/** What the hub shows for one step. */
export interface StepCardModel {
  id: StepId;
  title: string;
  icon: string;
  done: boolean;
  /** Bank details: not needed to go live. */
  optional: boolean;
  /** "Done", or what is still missing. */
  line: string;
  /** False when the step can only be viewed. */
  editable: boolean;
}

/** Where the organizer is in the lifecycle, as the hub draws it. */
export type SetupPhase =
  | 'setup'
  | 'changes'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'pending';

export interface HubModel {
  phase: SetupPhase;
  done: number;
  total: number;
  percent: number;
  steps: StepCardModel[];
  /** The admin's note when changes were requested or the profile was rejected. */
  reviewNote: string;
  canSubmit: boolean;
  /** Submit lives on the hub only while onboarding is open. */
  showSubmit: boolean;
  payoutReady: boolean;
}

/** A label/value line of a read-only step. */
export interface SummaryRow {
  key: string;
  label: string;
  value: string;
}

/** What every step component receives from the step view. */
export interface StepProps {
  form: SetupForm;
  /** What is saved — secret fields show it masked until "Change". */
  baseline: SetupForm;
  errors: FormErrors;
  /** The active tab's key ('all' for a one-part step). */
  part: string;
  options: StepOptions;
  uploading: FileKey | null;
  mobile: string;
  setField: SetField;
  toggle: (key: ListKey, value: string) => void;
  upload: (key: FileKey) => void;
  removeFile: (key: FileKey, index?: number) => void;
}
