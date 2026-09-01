import { apiClient } from '../../services/apiClient';
import { isNormalizedApiError } from '../../services/errors';
import { MY_INVITATIONS_ENDPOINT } from './constants';
import type {
  BlockPatch,
  GuestDTO,
  InvitationDTO,
  InvitationSummaryDTO,
  ShareResultDTO,
} from './types';

/** Every invitation shared with the customer. Drafts are never included. */
export async function fetchMyInvitations(): Promise<InvitationSummaryDTO[]> {
  const { data } = await apiClient.get<InvitationSummaryDTO[]>(MY_INVITATIONS_ENDPOINT);
  return data;
}

/**
 * One booking's invitation, or null while it is still the organizer's draft —
 * the endpoint 404s that case, which is a normal early state, not a failure.
 */
export async function fetchInvitation(bookingId: string): Promise<InvitationDTO | null> {
  try {
    const { data } = await apiClient.get<InvitationDTO>(`${MY_INVITATIONS_ENDPOINT}/${bookingId}`);
    return data;
  } catch (error) {
    if (isNormalizedApiError(error) && error.status === 404) return null;
    throw error;
  }
}

/** Customer sign-off — this, and only this, makes the guest link live. */
export async function approveInvitation(bookingId: string): Promise<InvitationDTO> {
  const { data } = await apiClient.post<InvitationDTO>(
    `${MY_INVITATIONS_ENDPOINT}/${bookingId}/approve`,
  );
  return data;
}

/** Edit a section the customer owns. */
export async function personalizeBlock(
  bookingId: string,
  blockKey: string,
  patch: BlockPatch,
): Promise<InvitationDTO> {
  const { data } = await apiClient.patch<InvitationDTO>(
    `${MY_INVITATIONS_ENDPOINT}/${bookingId}/blocks/${blockKey}`,
    patch,
  );
  return data;
}

/** Ask the organizer for a change — on one section, or the whole invitation. */
export async function requestInvitationChange(
  bookingId: string,
  note: string,
  blockKey?: string,
): Promise<void> {
  await apiClient.post(`${MY_INVITATIONS_ENDPOINT}/${bookingId}/request-change`, {
    note,
    ...(blockKey ? { blockKey } : {}),
  });
}

/** The guest list for a published invitation. */
export async function fetchGuests(bookingId: string): Promise<GuestDTO[]> {
  const { data } = await apiClient.get<GuestDTO[]>(`${MY_INVITATIONS_ENDPOINT}/${bookingId}/guests`);
  return data;
}

/**
 * Send the invitation — or one section of it — to chosen guests, plus anyone
 * typed in on the spot. A number that already belongs to a guest resolves to
 * them server-side rather than creating a duplicate.
 */
export async function shareInvitation(
  bookingId: string,
  args: { section?: string; guestIds: string[]; newGuests: Array<{ name: string; phone: string }> },
): Promise<ShareResultDTO> {
  const { data } = await apiClient.post<ShareResultDTO>(
    `${MY_INVITATIONS_ENDPOINT}/${bookingId}/share`,
    {
      ...(args.section ? { section: args.section } : {}),
      guestIds: args.guestIds,
      newGuests: args.newGuests,
    },
  );
  return data;
}
