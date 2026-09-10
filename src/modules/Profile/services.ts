import { apiClient } from '../../services/apiClient';
import {
  GET_USER_DETAILS_ENDPOINT,
  LOGOUT_ENDPOINT,
  MY_INVITATIONS_ENDPOINT,
  SAVED_PACKAGES_ENDPOINT,
} from './constants';
import type { UserDetailsDTO } from './types';
import type { ProfileBadges } from './types';

export async function getUserDetails(): Promise<UserDetailsDTO> {
  const { data } = await apiClient.get<UserDetailsDTO>(GET_USER_DETAILS_ENDPOINT);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post(LOGOUT_ENDPOINT);
}

/**
 * The two numbers the menu wears as pills.
 *
 * Both come from endpoints that already exist. Neither is worth failing the
 * screen over — a profile that will not open because a badge count could not be
 * fetched is a bad trade — so each falls back to zero and the pill simply does
 * not appear.
 */
export async function fetchProfileBadges(): Promise<ProfileBadges> {
  const [saved, invitations] = await Promise.all([
    apiClient
      .get<unknown[]>(SAVED_PACKAGES_ENDPOINT)
      .then(({ data }) => (Array.isArray(data) ? data.length : 0))
      .catch(() => 0),
    apiClient
      .get<Array<{ status?: string }>>(MY_INVITATIONS_ENDPOINT)
      // "Sent" is the state that is waiting on the customer: the organizer has
      // shared it and nobody has approved it yet.
      .then(({ data }) => (Array.isArray(data) ? data.filter((i) => i.status === 'sent').length : 0))
      .catch(() => 0),
  ]);

  return { savedPackages: saved, invitationsToApprove: invitations };
}
