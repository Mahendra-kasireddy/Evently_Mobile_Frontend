import { apiClient } from '../../services/apiClient';
import {
  COMPLETE_ENDPOINT,
  ONBOARDING_CONFIG_ENDPOINT,
  PROFILE_ENDPOINT,
  SERVICES_CONFIG_ENDPOINT,
  STATUS_ENDPOINT,
  STEP_ENDPOINT,
} from './constants';
import type {
  OnboardingConfigDTO,
  OnboardingStatusDTO,
  ServicesConfigDTO,
  SetupProfileDTO,
  StepId,
} from './types';

export async function getProfile(): Promise<SetupProfileDTO> {
  const { data } = await apiClient.get<SetupProfileDTO>(PROFILE_ENDPOINT);
  return data;
}

export async function getStatus(): Promise<OnboardingStatusDTO> {
  const { data } = await apiClient.get<OnboardingStatusDTO>(STATUS_ENDPOINT);
  return data;
}

export async function getOnboardingConfig(): Promise<OnboardingConfigDTO> {
  const { data } = await apiClient.get<OnboardingConfigDTO>(
    ONBOARDING_CONFIG_ENDPOINT,
  );
  return data;
}

export async function getServicesConfig(): Promise<ServicesConfigDTO> {
  const { data } = await apiClient.get<ServicesConfigDTO>(
    SERVICES_CONFIG_ENDPOINT,
  );
  return data;
}

/** Saves one step's changed fields; the API answers with the whole profile. */
export async function patchStep(
  step: StepId,
  body: Record<string, unknown>,
): Promise<SetupProfileDTO> {
  const { data } = await apiClient.patch<SetupProfileDTO>(
    STEP_ENDPOINT[step],
    body,
  );
  return data;
}

/** Sends the profile to Evently's team for verification. */
export async function completeOnboarding(): Promise<SetupProfileDTO> {
  const { data } = await apiClient.post<SetupProfileDTO>(COMPLETE_ENDPOINT, {});
  return data;
}
