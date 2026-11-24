import { apiClient } from '../../services/apiClient';
import {
  INVITE_ENDPOINT,
  SUBVENDORS_ENDPOINT,
  removeEndpoint,
} from './constants';
import type { InviteResult, SubVendorLinkDTO } from './types';

/** Every live link — active team members and pending invites, newest first. */
export async function getSubVendors(): Promise<SubVendorLinkDTO[]> {
  const { data } = await apiClient.get<SubVendorLinkDTO[]>(SUBVENDORS_ENDPOINT);
  return data;
}

/**
 * Invite a 10-digit mobile. Idempotent on the server: inviting a number that is
 * already linked returns the existing link rather than an error.
 */
export async function inviteSubVendor(phone: string): Promise<InviteResult> {
  const { data } = await apiClient.post<InviteResult>(INVITE_ENDPOINT, {
    phone,
  });
  return data;
}

/** Take a member off the team, or cancel a pending invite. */
export async function removeSubVendor(linkId: string): Promise<void> {
  await apiClient.delete(removeEndpoint(linkId));
}
