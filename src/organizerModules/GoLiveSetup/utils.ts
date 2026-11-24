import { absoluteFileUrl } from '../../services/urls';
import type { StoredFile } from '../Shared';
import {
  FIELD_LABEL,
  LIMITS,
  NUMBER_FIELDS,
  SETUP_COPY as COPY,
  SKIP_WHEN_EMPTY,
  STEP_FIELDS,
  STEP_META,
  STEP_ORDER,
  STEP_PARTS,
} from './constants';
import type {
  FieldKey,
  FileModel,
  FormErrors,
  HubModel,
  OnboardingConfigDTO,
  OnboardingStatusDTO,
  Option,
  ServicesConfigDTO,
  SetupForm,
  SetupPhase,
  SetupProfileDTO,
  StepCardModel,
  StepId,
  StepOptions,
  SummaryRow,
} from './types';

// ---------------------------------------------------------------------------
// Formats — the backend DTOs' regexes, so a bad value never leaves the phone.
// ---------------------------------------------------------------------------

export const RE = {
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  aadhaar: /^[2-9][0-9]{11}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  upi: /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/,
  account: /^[0-9]{6,20}$/,
  time: /^([01]\d|2[0-3]):[0-5]\d$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  website: /^[^\s]+\.[^\s]{2,}$/,
} as const;

export const isValidPan = (v: string) => RE.pan.test(v.trim());
export const isValidAadhaar = (v: string) => RE.aadhaar.test(v.trim());
export const isValidGst = (v: string) => RE.gst.test(v.trim());
export const isValidIfsc = (v: string) => RE.ifsc.test(v.trim());
export const isValidUpi = (v: string) => RE.upi.test(v.trim());
export const isValidAccountNumber = (v: string) => RE.account.test(v.trim());
export const isValidTime = (v: string) => RE.time.test(v.trim());
export const isValidEmail = (v: string) => RE.email.test(v.trim());
export const isValidWebsite = (v: string) => RE.website.test(v.trim());

/** Both typed, and the same. */
export const accountsMatch = (account: string, confirm: string) =>
  account.trim() !== '' && account.trim() === confirm.trim();

// ---------------------------------------------------------------------------
// Input normalisers — applied as the organizer types.
// ---------------------------------------------------------------------------

/** PAN, GSTIN, IFSC: capitals and digits only. */
export const upperAlnum = (v: string, max: number) =>
  v
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, max);

/** Aadhaar, account number, amounts: digits only. */
export const digitsOnly = (v: string, max: number) =>
  v.replace(/\D/g, '').slice(0, max);

/** "930" → "09:30" is too clever; "0930" → "09:30" and "09" → "09" is enough. */
export function formatTimeInput(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}:${digits.slice(2)}`
    : digits;
}

/** "123456789012" → "•••• •••• 9012". */
export function maskTail(v: string, visible = 4): string {
  const t = (v ?? '').trim();
  if (!t) return '';
  if (t.length <= visible) return t;
  return `•••• ${t.length > 8 ? '•••• ' : ''}${t.slice(-visible)}`;
}

/** "ABCDE1234F" → "AB••••••4F". */
export function maskMiddle(v: string): string {
  const t = (v ?? '').trim();
  if (t.length <= 4) return t;
  return `${t.slice(0, 2)}${'•'.repeat(t.length - 4)}${t.slice(-2)}`;
}

// ---------------------------------------------------------------------------
// Steps and the hub
// ---------------------------------------------------------------------------

/** Bank details' required fields on the backend — all missing reads as "not started". */
const BANK_REQUIRED_COUNT = 5;

export function isStepId(value: unknown): value is StepId {
  return typeof value === 'string' && STEP_ORDER.includes(value as StepId);
}

export function phaseOf(
  status: OnboardingStatusDTO['onboardingStatus'],
): SetupPhase {
  switch (status) {
    case 'submitted':
      return 'submitted';
    case 'approved':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'pending_review':
      return 'pending';
    case 'changes_requested':
      return 'changes';
    default:
      return 'setup';
  }
}

/** Whether a step can be edited now — bank details have their own gate. */
export function canEditStep(
  step: StepId,
  status: Pick<OnboardingStatusDTO, 'canEdit' | 'canEditBank'>,
): boolean {
  return step === 'bank' ? status.canEditBank : status.canEdit;
}

/** "Profile photo" → "profile photo" mid-sentence; "PAN upload" and "IFSC" stay as they are. */
export const softCase = (label: string) =>
  /^[A-Z]{2}/.test(label)
    ? label
    : label.charAt(0).toLowerCase() + label.slice(1);

/** "Add profile photo and city", "Add experience, team size +1 more". */
export function missingLine(fields: string[]): string {
  return fields.length ? COPY.missing(fields.map(softCase)) : COPY.done;
}

/**
 * The hub's checklist from `onboarding-status`: the four go-live steps counted
 * toward progress, bank details listed after them as optional.
 */
export function mapHub(status: OnboardingStatusDTO): HubModel {
  const byId = new Map(
    (status.steps ?? []).filter(s => isStepId(s.id)).map(s => [s.id, s]),
  );
  const steps: StepCardModel[] = STEP_ORDER.filter(id => byId.has(id)).map(
    id => {
      const s = byId.get(id)!;
      const optional = !s.requiredForGoLive;
      return {
        id,
        title: STEP_META[id].title,
        icon: STEP_META[id].icon,
        done: s.complete,
        optional,
        line: s.complete
          ? COPY.done
          : optional && s.missingFields.length >= BANK_REQUIRED_COUNT
          ? COPY.bankHint
          : missingLine(s.missingFields),
        editable: canEditStep(id, status),
      };
    },
  );
  const required = steps.filter(s => !s.optional);
  const done = required.filter(s => s.done).length;
  const phase = phaseOf(status.onboardingStatus);
  return {
    phase,
    done,
    total: required.length,
    percent: required.length ? Math.round((done / required.length) * 100) : 0,
    steps,
    reviewNote: status.reviewNote ?? '',
    canSubmit: !!status.canSubmit,
    showSubmit: phase === 'setup' || phase === 'changes',
    payoutReady: !!status.payoutReady,
  };
}

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------

const num = (n: number | null | undefined) =>
  typeof n === 'number' && n > 0 ? String(n) : '';

/** The form, filled from the saved profile. Numbers ≤ 0 read as "not set". */
export function formFrom(p: SetupProfileDTO): SetupForm {
  return {
    firstName: p.firstName ?? '',
    lastName: p.lastName ?? '',
    contactEmail: p.contactEmail ?? '',
    businessName: p.businessName ?? '',
    displayName: p.displayName ?? '',
    businessType: p.businessType ?? '',
    primaryCategory: p.primaryCategory ?? '',
    city: p.city ?? '',
    profilePhoto: p.profilePhoto ?? null,
    experience: p.experience ?? '',
    teamSize: p.teamSize ?? '',
    languages: p.languages ?? [],
    secondaryCategories: p.secondaryCategories ?? [],
    servicesOffered: p.servicesOffered ?? [],
    occasions: p.occasions ?? [],
    travelOption: p.travelOption ?? '',
    serviceRadius: num(p.serviceRadius),
    workingDays: p.workingDays ?? [],
    workingHoursStart: p.workingHoursStart ?? '',
    workingHoursEnd: p.workingHoursEnd ?? '',
    paymentMethods: p.paymentMethods ?? [],
    minBudget: num(p.minBudget),
    maxBudget: num(p.maxBudget),
    advancePercentage: num(p.advancePercentage),
    emergencyAvailability: !!p.emergencyAvailability,
    destinationEvents: !!p.destinationEvents,
    internationalEvents: !!p.internationalEvents,
    tagline: p.tagline ?? '',
    businessDescription: p.businessDescription ?? '',
    yearsOfExperience: num(p.yearsOfExperience),
    website: p.website ?? '',
    instagram: p.instagram ?? '',
    facebook: p.facebook ?? '',
    youtube: p.youtube ?? '',
    linkedin: p.linkedin ?? '',
    coverPhoto: p.coverPhoto ?? null,
    gallery: p.gallery ?? [],
    aadhaarNumber: p.aadhaarNumber ?? '',
    panNumber: p.panNumber ?? '',
    gstNumber: p.gstNumber ?? '',
    businessRegNumber: p.businessRegNumber ?? '',
    governmentIdType: p.governmentIdType ?? '',
    governmentIdFile: p.governmentIdFile ?? null,
    panFile: p.panFile ?? null,
    gstFile: p.gstFile ?? null,
    businessRegFile: p.businessRegFile ?? null,
    accountHolderName: p.accountHolderName ?? '',
    bankName: p.bankName ?? '',
    branchName: p.branchName ?? '',
    accountNumber: p.accountNumber ?? '',
    confirmAccountNumber: p.accountNumber ?? '',
    ifsc: p.ifsc ?? '',
    upiId: p.upiId ?? '',
    cancelledChequeFile: p.cancelledChequeFile ?? null,
  };
}

const isFile = (v: unknown): v is StoredFile =>
  !!v && typeof v === 'object' && 'url' in (v as object);

const fileId = (f: StoredFile | null | undefined) => (f ? f.key || f.url : '');

/**
 * Whether two field values are the same to the organizer: text ignores outer
 * spaces, multi-selects ignore order, files compare by stored key (gallery
 * order matters — it is the order customers see).
 */
export function sameValue(a: unknown, b: unknown): boolean {
  if (typeof a === 'string' && typeof b === 'string')
    return a.trim() === b.trim();
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    if (a.some(isFile) || b.some(isFile)) {
      return a.every((f, i) => fileId(f) === fileId(b[i]));
    }
    return [...a].sort().join('\u0000') === [...b].sort().join('\u0000');
  }
  if (isFile(a) || isFile(b) || a === null || b === null) {
    return fileId(a as StoredFile | null) === fileId(b as StoredFile | null);
  }
  return a === b;
}

/** The fields of a step that differ from what is saved. */
export function changedFields(
  step: StepId,
  before: SetupForm,
  after: SetupForm,
): FieldKey[] {
  return STEP_FIELDS[step].filter(key => !sameValue(before[key], after[key]));
}

export function isStepDirty(step: StepId, before: SetupForm, after: SetupForm) {
  return changedFields(step, before, after).length > 0;
}

/**
 * The PATCH body for a step: only what changed, in the backend's types. Text
 * is trimmed; numbers become whole numbers (cleared → 0, "not set"); fields
 * the backend refuses empty are left out when cleared; a removed file is sent
 * as null, which clears it.
 */
export function buildPatch(
  step: StepId,
  before: SetupForm,
  after: SetupForm,
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const key of changedFields(step, before, after)) {
    const value = after[key];
    if (NUMBER_FIELDS.has(key)) {
      const t = String(value).trim();
      body[key] = t === '' ? 0 : Math.round(Number(t));
    } else if (typeof value === 'string') {
      const t = value.trim();
      if (t === '' && SKIP_WHEN_EMPTY.has(key)) continue;
      body[key] = t;
    } else {
      body[key] = value;
    }
  }
  return body;
}

const tooLong = (v: string, max: number) => v.trim().length > max;

/** Format and range checks for one step. Empty is fine — the hub lists what is missing. */
export function validateStep(
  step: StepId,
  form: SetupForm,
  baseline: SetupForm,
): FormErrors {
  const e: FormErrors = {};
  const filled = (v: string) => v.trim() !== '';
  const E = COPY.errors;

  if (step === 'basic') {
    if (tooLong(form.firstName, LIMITS.name))
      e.firstName = E.tooLong(LIMITS.name);
    if (tooLong(form.lastName, LIMITS.name))
      e.lastName = E.tooLong(LIMITS.name);
    if (filled(form.contactEmail) && !isValidEmail(form.contactEmail))
      e.contactEmail = E.email;
    const name = form.businessName.trim();
    if (name && name.length < 2) e.businessName = E.businessName;
    else if (name.length > LIMITS.businessName)
      e.businessName = E.tooLong(LIMITS.businessName);
    if (tooLong(form.displayName, LIMITS.businessName))
      e.displayName = E.tooLong(LIMITS.businessName);
  }

  if (step === 'services') {
    if (filled(form.workingHoursStart) && !isValidTime(form.workingHoursStart))
      e.workingHoursStart = E.time;
    if (filled(form.workingHoursEnd) && !isValidTime(form.workingHoursEnd))
      e.workingHoursEnd = E.time;
    if (Number(form.serviceRadius || 0) > LIMITS.radius)
      e.serviceRadius = E.radius;
    if (Number(form.advancePercentage || 0) > LIMITS.advance)
      e.advancePercentage = E.advance;
    const min = Number(form.minBudget || 0);
    const max = Number(form.maxBudget || 0);
    if (min > 0 && max > 0 && max < min) e.maxBudget = E.budgetOrder;
  }

  if (step === 'portfolio') {
    if (tooLong(form.tagline, LIMITS.tagline))
      e.tagline = E.tooLong(LIMITS.tagline);
    if (tooLong(form.businessDescription, LIMITS.bio))
      e.businessDescription = E.tooLong(LIMITS.bio);
    if (Number(form.yearsOfExperience || 0) > LIMITS.years)
      e.yearsOfExperience = E.years;
    if (filled(form.website) && !isValidWebsite(form.website))
      e.website = E.website;
    for (const key of [
      'instagram',
      'facebook',
      'youtube',
      'linkedin',
    ] as const) {
      if (tooLong(form[key], LIMITS.social)) e[key] = E.tooLong(LIMITS.social);
    }
  }

  if (step === 'verification') {
    if (filled(form.aadhaarNumber) && !isValidAadhaar(form.aadhaarNumber))
      e.aadhaarNumber = E.aadhaar;
    if (filled(form.panNumber) && !isValidPan(form.panNumber))
      e.panNumber = E.pan;
    if (filled(form.gstNumber) && !isValidGst(form.gstNumber))
      e.gstNumber = E.gst;
    if (tooLong(form.businessRegNumber, LIMITS.regNumber))
      e.businessRegNumber = E.tooLong(LIMITS.regNumber);
  }

  if (step === 'bank') {
    for (const key of [
      'accountHolderName',
      'bankName',
      'branchName',
    ] as const) {
      if (tooLong(form[key], LIMITS.bankText))
        e[key] = E.tooLong(LIMITS.bankText);
    }
    const account = form.accountNumber.trim();
    if (account && !isValidAccountNumber(account)) e.accountNumber = E.account;
    else if (
      account &&
      account !== baseline.accountNumber.trim() &&
      !accountsMatch(account, form.confirmAccountNumber)
    )
      e.confirmAccountNumber = E.accountMatch;
    if (filled(form.ifsc) && !isValidIfsc(form.ifsc)) e.ifsc = E.ifsc;
    if (filled(form.upiId) && !isValidUpi(form.upiId)) e.upiId = E.upi;
  }

  return e;
}

/** The tab a field lives on, so Save can jump to the first problem. */
export function partIndexOf(step: StepId, field: FieldKey): number {
  const index = STEP_PARTS[step].findIndex(p => p.fields.includes(field));
  return index < 0 ? 0 : index;
}

export function firstErrorPart(
  step: StepId,
  errors: FormErrors,
): number | null {
  const keys = Object.keys(errors) as FieldKey[];
  if (!keys.length) return null;
  return Math.min(...keys.map(k => partIndexOf(step, k)));
}

// ---------------------------------------------------------------------------
// Options, files and the read-only summary
// ---------------------------------------------------------------------------

/** Both config endpoints as one set of option lists; either may be missing. */
export function mergeOptions(
  onboarding: OnboardingConfigDTO | null,
  services: ServicesConfigDTO | null,
): StepOptions {
  return {
    businessTypes: onboarding?.businessTypes ?? [],
    categories: onboarding?.categories ?? services?.categories ?? [],
    cities: (onboarding?.cities ?? []).map(c => ({ key: c, label: c })),
    experienceRanges: services?.experienceRanges ?? [],
    teamSizes: services?.teamSizes ?? [],
    languages: services?.languages ?? [],
    travelOptions: services?.travelOptions ?? [],
    paymentMethods: services?.paymentMethods ?? [],
    workingDays: services?.workingDays ?? [],
    documentTypes: services?.documentTypes ?? [],
    occasions: services?.occasions ?? [],
    serviceCategories: services?.serviceCategories ?? [],
  };
}

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif)(\?|$)/i;

/** A stored file as something to draw — never hand `file.url` to an Image. */
export function toFileModel(file: StoredFile): FileModel {
  const uri = absoluteFileUrl(file.url);
  const name =
    file.originalName?.trim() ||
    decodeURIComponent((file.url.split('?')[0] ?? '').split('/').pop() || '') ||
    'Document';
  return {
    key: file.key || file.url,
    uri,
    name,
    isImage:
      IMAGE_EXT.test(file.originalName ?? '') || IMAGE_EXT.test(file.url),
  };
}

const labelOf = (options: Option[], key: string) =>
  options.find(o => o.key === key)?.label ?? key;

const labels = (options: Option[], keys: string[]) =>
  keys.map(k => labelOf(options, k)).join(', ');

/** Which option list a choice field draws from. */
export const OPTIONS_FOR: Partial<Record<FieldKey, keyof StepOptions>> = {
  businessType: 'businessTypes',
  primaryCategory: 'categories',
  city: 'cities',
  experience: 'experienceRanges',
  teamSize: 'teamSizes',
  languages: 'languages',
  secondaryCategories: 'categories',
  servicesOffered: 'serviceCategories',
  occasions: 'occasions',
  travelOption: 'travelOptions',
  workingDays: 'workingDays',
  paymentMethods: 'paymentMethods',
  governmentIdType: 'documentTypes',
};

/**
 * A step as label/value lines for when it cannot be edited. Aadhaar and the
 * account number show only their last digits; PAN only its ends.
 */
export function summaryRows(
  step: StepId,
  form: SetupForm,
  options: StepOptions,
): SummaryRow[] {
  return STEP_FIELDS[step].map(key => {
    const value = form[key];
    let text: string;
    if (key === 'aadhaarNumber' || key === 'accountNumber') {
      text = maskTail(value as string);
    } else if (key === 'panNumber') {
      text = maskMiddle(value as string);
    } else if (key === 'gallery') {
      const n = (value as StoredFile[]).length;
      text = n ? COPY.photosCount(n) : '';
    } else if (typeof value === 'boolean') {
      text = value ? COPY.yes : COPY.no;
    } else if (Array.isArray(value)) {
      const list = OPTIONS_FOR[key];
      text = list ? labels(options[list], value as string[]) : value.join(', ');
    } else if (value === null || isFile(value)) {
      text = value ? COPY.onFile : '';
    } else {
      const list = OPTIONS_FOR[key];
      text = list && value ? labelOf(options[list], value) : value;
      if (value && (key === 'minBudget' || key === 'maxBudget')) {
        text = `₹${Number(value).toLocaleString('en-IN')}`;
      } else if (value && key === 'advancePercentage') {
        text = `${value}%`;
      } else if (value && key === 'serviceRadius') {
        text = `${value} km`;
      }
    }
    return {
      key,
      label: FIELD_LABEL[key].replace(/ \((₹|%|km)\)$/, ''),
      value: text.trim() || COPY.notAdded,
    };
  });
}
