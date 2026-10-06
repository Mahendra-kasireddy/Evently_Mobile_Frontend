import { apiClient } from './apiClient';
import type { AppView } from '../store/authSlice';

export const DEFAULT_ROLE_ENDPOINT = '/user/default-role';

/**
 * Makes a side of the product the account's default on the server, so the
 * next sign-in — on this phone, another one, or the web — opens there. The
 * server refuses a role the account does not hold.
 */
export async function saveDefaultRole(role: AppView): Promise<void> {
  await apiClient.patch(DEFAULT_ROLE_ENDPOINT, { role });
}
