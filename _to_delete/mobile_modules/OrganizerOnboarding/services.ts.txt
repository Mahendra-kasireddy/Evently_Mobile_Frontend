import { apiClient } from '../../services/apiClient';
import {
  COMPLETE_ENDPOINT,
  ONBOARDING_CONFIG_ENDPOINT,
  PROFILE_ENDPOINT,
  REGISTER_ENDPOINT,
  SERVICES_CONFIG_ENDPOINT,
  UPLOAD_ENDPOINT,
  sectionEndpoint,
} from './constants';
import type { OnboardingConfig, OrganizerProfile, PickedFile, SectionPatch, ServicesConfig, StepId, StoredFileMeta } from './types';

export async function fetchOnboardingConfig(): Promise<OnboardingConfig> {
  const { data } = await apiClient.get<OnboardingConfig>(ONBOARDING_CONFIG_ENDPOINT);
  return data;
}

export async function fetchServicesConfig(): Promise<ServicesConfig> {
  const { data } = await apiClient.get<ServicesConfig>(SERVICES_CONFIG_ENDPOINT);
  return data;
}

interface RegisterResult {
  profile: OrganizerProfile;
  token: string;
  refreshToken: string;
}

/** Upgrades the current (OTP-verified) user to an organizer + creates/resumes the draft profile. */
export async function registerOrganizer(): Promise<RegisterResult> {
  const { data } = await apiClient.post<RegisterResult>(REGISTER_ENDPOINT, {});
  return data;
}

export async function fetchProfile(): Promise<OrganizerProfile> {
  const { data } = await apiClient.get<OrganizerProfile>(PROFILE_ENDPOINT);
  return data;
}

export async function patchSection(id: StepId, body: SectionPatch): Promise<OrganizerProfile> {
  const { data } = await apiClient.patch<OrganizerProfile>(sectionEndpoint(id), body);
  return data;
}

export async function completeOnboarding(): Promise<OrganizerProfile> {
  const { data } = await apiClient.post<OrganizerProfile>(COMPLETE_ENDPOINT, {});
  return data;
}

/** Uploads a device-picked file to the shared /upload endpoint, returns its stored metadata. */
export async function uploadFile(file: PickedFile, purpose: string): Promise<StoredFileMeta> {
  const form = new FormData();
  // React Native's FormData accepts this {uri,name,type} shape directly for file parts.
  form.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
  form.append('purpose', purpose);
  const { data } = await apiClient.post<StoredFileMeta>(UPLOAD_ENDPOINT, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
