import { useAsync, type AsyncResult } from '../../hooks/useAsync';
import { useAsyncCallback, type AsyncCallbackResult } from '../../hooks/useAsyncCallback';
import { fetchContactPrefill, fetchContactSubjects, sendContactRequest } from './services';
import type { ContactDraft, ContactPrefillDTO, ContactSubjectDTO } from './types';

export function useContactSubjects(): AsyncResult<ContactSubjectDTO[]> {
  return useAsync(fetchContactSubjects, []);
}

export function useContactPrefill(): AsyncResult<ContactPrefillDTO> {
  return useAsync(fetchContactPrefill, []);
}

export function useSendContact(): AsyncCallbackResult<[ContactDraft], void> {
  return useAsyncCallback(sendContactRequest);
}
