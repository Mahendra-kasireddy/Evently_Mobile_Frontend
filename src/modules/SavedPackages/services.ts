import { apiClient } from '../../services/apiClient';
import { SAVED_PACKAGES_ENDPOINT } from './constants';
import type { SavedPackageDTO } from './types';

/**
 * The account's saved packages.
 *
 * No id is sent: the endpoint reads the signed-in account from the token. A
 * client that could name an account here would be a client that could read
 * somebody else's list.
 */
export async function fetchSavedPackages(): Promise<SavedPackageDTO[]> {
  const { data } = await apiClient.get<SavedPackageDTO[]>(SAVED_PACKAGES_ENDPOINT);
  return Array.isArray(data) ? data : [];
}

export async function savePackage(packageId: string): Promise<void> {
  await apiClient.post(`${SAVED_PACKAGES_ENDPOINT}/${packageId}`);
}

export async function unsavePackage(packageId: string): Promise<void> {
  await apiClient.delete(`${SAVED_PACKAGES_ENDPOINT}/${packageId}`);
}
