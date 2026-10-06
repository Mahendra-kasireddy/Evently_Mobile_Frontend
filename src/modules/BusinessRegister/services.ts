import { apiClient } from '../../services/apiClient';
import { ONBOARDING_CONFIG_ENDPOINT, REGISTER_ORGANIZER_ENDPOINT } from './constants';
import type {
  OnboardingConfigDTO,
  OrganizerSignupDetails,
  RegisterOrganizerResponseDTO,
} from './types';

/**
 * Signs the account up as an organizer with the basic details, or — called
 * with none — resumes an existing registration. Reissues the session, since
 * the roles changed.
 */
export async function registerOrganizer(
  details?: OrganizerSignupDetails,
): Promise<RegisterOrganizerResponseDTO> {
  const { data } = await apiClient.post<RegisterOrganizerResponseDTO>(
    REGISTER_ORGANIZER_ENDPOINT,
    details ?? {},
  );
  return data;
}

/** The categories and cities the admin has configured. */
export async function fetchOnboardingConfig(): Promise<OnboardingConfigDTO> {
  const { data } = await apiClient.get<OnboardingConfigDTO>(ONBOARDING_CONFIG_ENDPOINT);
  return data;
}
