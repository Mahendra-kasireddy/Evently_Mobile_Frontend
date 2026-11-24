import { absoluteFileUrl } from '../../services/urls';
import {
  BIO_MAX,
  BUSINESS_NAME_MAX,
  PROFILE_COPY as COPY,
  TAGLINE_MAX,
} from './constants';
import type {
  EditErrors,
  EditForm,
  IdentityModel,
  OrganizerProfileDTO,
  PortfolioImage,
  ProfilePreviewDTO,
  ServicesConfigDTO,
} from './types';

export function initialsOf(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return (
    words
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('') || '•'
  );
}

/** The name customers see: the display name when set, else the business. */
export function publicName(p: OrganizerProfileDTO): string {
  return (
    p.displayName?.trim() ||
    p.businessName?.trim() ||
    [p.firstName, p.lastName].filter(Boolean).join(' ').trim() ||
    'Your business'
  );
}

export function categoryLabel(
  key: string,
  config: ServicesConfigDTO | null,
): string {
  return config?.categories.find(c => c.key === key)?.label ?? key;
}

export function mapIdentity(
  p: OrganizerProfileDTO,
  preview: ProfilePreviewDTO | null,
  config: ServicesConfigDTO | null,
): IdentityModel {
  const name = publicName(p);
  const category = p.primaryCategory
    ? categoryLabel(p.primaryCategory, config)
    : '';
  return {
    name,
    subtitle: [category, p.city].filter(Boolean).join(' · '),
    initials: initialsOf(name),
    photoUrl: p.profilePhoto?.url ? absoluteFileUrl(p.profilePhoto.url) : '',
    tier: preview?.tier || 'Silver',
    isLive: preview?.isLive ?? p.onboardingStatus === 'approved',
    rating:
      preview && preview.rating > 0 ? preview.rating.toFixed(1) : COPY.noRating,
    reviews: preview?.reviews ?? 0,
    events: preview?.events ?? 0,
  };
}

export function mapGallery(p: OrganizerProfileDTO): PortfolioImage[] {
  return (p.gallery ?? []).map(file => ({
    key: file.key || file.url,
    uri: absoluteFileUrl(file.url),
  }));
}

export function formFrom(p: OrganizerProfileDTO): EditForm {
  return {
    businessName: p.businessName ?? '',
    displayName: p.displayName ?? '',
    tagline: p.tagline ?? '',
    businessDescription: p.businessDescription ?? '',
    secondaryCategories: p.secondaryCategories ?? [],
  };
}

/** The backend's limits, checked before anything is sent. */
export function validate(form: EditForm): EditErrors {
  const errors: EditErrors = {};
  const name = form.businessName.trim();
  if (name.length < 2) errors.businessName = COPY.businessNameShort;
  else if (name.length > BUSINESS_NAME_MAX)
    errors.businessName = COPY.tooLong(BUSINESS_NAME_MAX);
  if (form.displayName.trim().length > BUSINESS_NAME_MAX)
    errors.displayName = COPY.tooLong(BUSINESS_NAME_MAX);
  if (form.tagline.trim().length > TAGLINE_MAX)
    errors.tagline = COPY.tooLong(TAGLINE_MAX);
  if (form.businessDescription.trim().length > BIO_MAX)
    errors.businessDescription = COPY.tooLong(BIO_MAX);
  return errors;
}

/**
 * Which sections changed, as the PATCH bodies to send — so one edit never
 * rewrites unrelated parts of the profile.
 */
export function changedSections(
  before: EditForm,
  after: EditForm,
): {
  basics?: Record<string, string>;
  portfolio?: Record<string, string>;
  services?: Record<string, string[]>;
} {
  const t = (s: string) => s.trim();
  const out: ReturnType<typeof changedSections> = {};
  if (
    t(before.businessName) !== t(after.businessName) ||
    t(before.displayName) !== t(after.displayName)
  ) {
    out.basics = {
      businessName: t(after.businessName),
      displayName: t(after.displayName),
    };
  }
  if (
    t(before.tagline) !== t(after.tagline) ||
    t(before.businessDescription) !== t(after.businessDescription)
  ) {
    out.portfolio = {
      tagline: t(after.tagline),
      businessDescription: t(after.businessDescription),
    };
  }
  if (
    [...before.secondaryCategories].sort().join('|') !==
    [...after.secondaryCategories].sort().join('|')
  ) {
    out.services = { secondaryCategories: after.secondaryCategories };
  }
  return out;
}

export function isDirty(before: EditForm, after: EditForm): boolean {
  return Object.keys(changedSections(before, after)).length > 0;
}
