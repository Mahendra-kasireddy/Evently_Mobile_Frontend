import { apiClient } from '../../services/apiClient';
import {
  CLOSE_ACCOUNT_ENDPOINT,
  GET_USER_DETAILS_ENDPOINT,
  PREFERENCES_ENDPOINT,
  UPDATE_PROFILE_ENDPOINT,
} from './constants';
import type { NotificationPrefs, UpdateProfileBody, UserDetailsDTO } from './types';

export async function getUserDetails(): Promise<UserDetailsDTO> {
  const { data } = await apiClient.get<UserDetailsDTO>(GET_USER_DETAILS_ENDPOINT);
  return data;
}

/**
 * Saves the customer's own details.
 *
 * Only the three fields the screen owns are sent. `roles` and `status` are not
 * on the server's self-service DTO — their absence there is the access
 * control — and this client has no business naming them either.
 */
export async function updateProfile(body: UpdateProfileBody): Promise<UserDetailsDTO> {
  const { data } = await apiClient.patch<UserDetailsDTO>(UPDATE_PROFILE_ENDPOINT, body);
  return data;
}

export async function getNotificationPrefs(): Promise<NotificationPrefs> {
  const { data } = await apiClient.get<NotificationPrefs>(PREFERENCES_ENDPOINT);
  return data;
}

/** Sends the one flag that changed, not the whole set. */
export async function updateNotificationPrefs(patch: Partial<NotificationPrefs>): Promise<void> {
  await apiClient.patch(PREFERENCES_ENDPOINT, patch);
}

/**
 * Closes the signed-in account. The route takes no id — it can only ever act
 * on the caller — and the server keeps the record so that bookings already
 * placed still resolve for the organizers delivering them.
 */
export async function closeAccount(): Promise<void> {
  await apiClient.post(CLOSE_ACCOUNT_ENDPOINT);
}
