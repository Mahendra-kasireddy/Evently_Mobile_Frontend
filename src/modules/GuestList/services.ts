import { apiClient } from '../../services/apiClient';
import { GUESTS_BULK_ENDPOINT, GUESTS_ENDPOINT, GUEST_ENDPOINT } from './constants';
import type { BulkAddResultDTO, GuestDTO, GuestDraft } from './types';

export async function fetchGuests(bookingId: string): Promise<GuestDTO[]> {
  const { data } = await apiClient.get<GuestDTO[]>(GUESTS_ENDPOINT(bookingId));
  return Array.isArray(data) ? data : [];
}

export async function addGuest(bookingId: string, draft: GuestDraft): Promise<GuestDTO> {
  const { data } = await apiClient.post<GuestDTO>(GUESTS_ENDPOINT(bookingId), draft);
  return data;
}

/**
 * Corrects a guest already on the list.
 *
 * Their share link is untouched server-side, so a link already sitting in
 * somebody's WhatsApp keeps working after their name is fixed.
 */
export async function updateGuest(
  bookingId: string,
  guestId: string,
  draft: GuestDraft,
): Promise<GuestDTO> {
  const { data } = await apiClient.patch<GuestDTO>(GUEST_ENDPOINT(bookingId, guestId), draft);
  return data;
}

/**
 * Several at once, for a phonebook import.
 *
 * The server attempts every entry and reports the ones it could not take, so
 * one landline in a batch of twenty does not lose the other nineteen.
 */
export async function addGuests(
  bookingId: string,
  guests: GuestDraft[],
): Promise<BulkAddResultDTO> {
  const { data } = await apiClient.post<BulkAddResultDTO>(GUESTS_BULK_ENDPOINT(bookingId), {
    guests,
  });
  return { added: data?.added ?? [], skipped: data?.skipped ?? [] };
}
