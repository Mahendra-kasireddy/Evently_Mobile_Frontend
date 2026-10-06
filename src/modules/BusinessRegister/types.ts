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
}

export interface ConfigOptionDTO {
  key: string;
  label: string;
}

/** `GET /organizer/onboarding-config`, as far as sign-up reads it. */
export interface OnboardingConfigDTO {
  categories: ConfigOptionDTO[];
  cities: string[];
}
