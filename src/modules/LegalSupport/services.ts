import { apiClient } from '../../services/apiClient';
import { CONTACT_ENDPOINT, CONTACT_PREFILL_ENDPOINT, CONTACT_SUBJECTS_ENDPOINT } from './constants';
import type { ContactDraft, ContactPrefillDTO, ContactSubjectDTO } from './types';

export async function fetchContactSubjects(): Promise<ContactSubjectDTO[]> {
  const { data } = await apiClient.get<ContactSubjectDTO[]>(CONTACT_SUBJECTS_ENDPOINT);
  return data;
}

/** Name, email and phone already on file, so a signed-in customer retypes nothing. */
export async function fetchContactPrefill(): Promise<ContactPrefillDTO> {
  const { data } = await apiClient.get<ContactPrefillDTO>(CONTACT_PREFILL_ENDPOINT);
  return data;
}

export async function sendContactRequest(draft: ContactDraft): Promise<void> {
  await apiClient.post(CONTACT_ENDPOINT, draft);
}
