import { CONTACT_COPY } from './constants';
import type { ContactDraft } from './types';

/**
 * The same rules the server's DTO enforces, checked before the round-trip so
 * the customer learns about a bad email now rather than after sending.
 */
export function validateContact(draft: ContactDraft): Partial<Record<keyof ContactDraft, string>> {
  const errors: Partial<Record<keyof ContactDraft, string>> = {};

  if (!draft.name.trim()) errors.name = CONTACT_COPY.needName;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = CONTACT_COPY.needEmail;
  if (!draft.phone.trim()) errors.phone = CONTACT_COPY.needPhone;
  if (!draft.subject) errors.subject = CONTACT_COPY.needSubject;
  if (draft.message.trim().length < 10) errors.message = CONTACT_COPY.needMessage;

  return errors;
}
