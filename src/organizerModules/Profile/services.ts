import { apiClient } from '../../services/apiClient';
import {
  LOGOUT_ENDPOINT,
  PORTFOLIO_SECTION_ENDPOINT,
  PREVIEW_ENDPOINT,
  PROFILE_ENDPOINT,
  SERVICES_CONFIG_ENDPOINT,
  SERVICES_SECTION_ENDPOINT,
} from './constants';
import type {
  OrganizerProfileDTO,
  ProfilePreviewDTO,
  ServicesConfigDTO,
} from './types';

export async function getProfile(): Promise<OrganizerProfileDTO> {
  const { data } = await apiClient.get<OrganizerProfileDTO>(PROFILE_ENDPOINT);
  return data;
}

export async function getPreview(): Promise<ProfilePreviewDTO> {
  const { data } = await apiClient.get<ProfilePreviewDTO>(PREVIEW_ENDPOINT);
  return data;
}

export async function getServicesConfig(): Promise<ServicesConfigDTO> {
  const { data } = await apiClient.get<ServicesConfigDTO>(
    SERVICES_CONFIG_ENDPOINT,
  );
  return data;
}

/** Name fields and the profile photo. */
export async function patchBasics(
  body: Record<string, unknown>,
): Promise<OrganizerProfileDTO> {
  const { data } = await apiClient.patch<OrganizerProfileDTO>(
    PROFILE_ENDPOINT,
    body,
  );
  return data;
}

/** Services offered. */
export async function patchServices(
  body: Record<string, unknown>,
): Promise<OrganizerProfileDTO> {
  const { data } = await apiClient.patch<OrganizerProfileDTO>(
    SERVICES_SECTION_ENDPOINT,
    body,
  );
  return data;
}

/** Tagline, bio and the photo gallery. */
export async function patchPortfolio(
  body: Record<string, unknown>,
): Promise<OrganizerProfileDTO> {
  const { data } = await apiClient.patch<OrganizerProfileDTO>(
    PORTFOLIO_SECTION_ENDPOINT,
    body,
  );
  return data;
}

export async function logoutOnServer(): Promise<void> {
  await apiClient.post(LOGOUT_ENDPOINT);
}
