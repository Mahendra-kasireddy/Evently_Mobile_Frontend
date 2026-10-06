import { apiClient } from '../../services/apiClient';
import { LOGOUT_ENDPOINT } from './constants';

/** Ends the session on the server. Callers clear the local session whatever the outcome. */
export async function logoutOnServer(): Promise<void> {
  await apiClient.post(LOGOUT_ENDPOINT);
}
