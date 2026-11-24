/** The organizer profile as `POST /organizer/register` returns it — only what this module reads. */
export interface RegisteredOrganizerDTO {
  id: string;
  onboardingStatus: string;
}

export interface RegisterOrganizerResponseDTO {
  profile: RegisteredOrganizerDTO;
  token: string;
  refreshToken: string;
}

/**
 * The sign-up form: the only details asked before the dashboard opens.
 * Everything else — documents, services, portfolio, bank — is the
 * dashboard's go-live checklist.
 */
export interface OrganizerSignupDetails {
  firstName: string;
  lastName: string;
  businessName: string;
  primaryCategory: string;
  city: string;
  /** 'individual' for a freelancer; omitted for a business, which picks its legal structure at verification. */
  businessType?: string;
}

/** Freelancer or business — decides whether a business name is asked for. */
export type WorkStyle = 'freelancer' | 'business';

export interface ConfigOptionDTO {
  key: string;
  label: string;
}

/** `GET /organizer/onboarding-config`, as far as sign-up reads it. */
export interface OnboardingConfigDTO {
  businessTypes?: ConfigOptionDTO[];
  categories: ConfigOptionDTO[];
  cities: string[];
}
