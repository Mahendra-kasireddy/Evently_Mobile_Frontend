import { useCallback, useState } from 'react';
import { useContactPrefill, useContactSubjects, useSendContact } from './hooks';
import { validateContact } from './utils';
import { CONTACT_SUBJECT_FALLBACK, LEGAL_SUPPORT_ITEMS } from './constants';
import type { ContactDraft, ContactSubjectDTO, LegalSupportItem } from './types';

const EMPTY: ContactDraft = { name: '', email: '', phone: '', subject: '', message: '' };

export interface ContactContainerResult {
  draft: ContactDraft;
  setField: (key: keyof ContactDraft, value: string) => void;
  subjects: ContactSubjectDTO[];
  errors: Partial<Record<keyof ContactDraft, string>>;
  isSending: boolean;
  sendErrorMessage: string | null;
  isSent: boolean;
  send: () => void;
  reset: () => void;
}

/**
 * Contact Us.
 *
 * The app previously answered "Contact Us" with a `mailto:` link, which leaves
 * the message in whatever mail client the phone has and nowhere the team can
 * see it. There is a real contact module behind /contact — subjects, prefill
 * and a stored request the admin console works from — and this uses it.
 */
export function useContactContainer(): ContactContainerResult {
  const subjectsQuery = useContactSubjects();
  const prefill = useContactPrefill();
  const sender = useSendContact();

  const [draft, setDraft] = useState<ContactDraft>(EMPTY);
  const [seeded, setSeeded] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactDraft, string>>>({});
  const [isSent, setIsSent] = useState(false);

  // Seeded during render, not from an effect — the house pattern here.
  if (!seeded && prefill.data) {
    setSeeded(true);
    setDraft((prev) => ({
      ...prev,
      name: prev.name || prefill.data?.name || '',
      email: prev.email || prefill.data?.email || '',
      phone: prev.phone || prefill.data?.phone || '',
    }));
  }

  const setField = useCallback((key: keyof ContactDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setIsSent(false);
  }, []);

  const send = useCallback(() => {
    const found = validateContact(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    sender
      .execute({
        name: draft.name.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        subject: draft.subject,
        message: draft.message.trim(),
      })
      .then(() => setIsSent(true))
      .catch(() => {
        // error surfaces through sender.error
      });
  }, [draft, sender]);

  const reset = useCallback(() => {
    setIsSent(false);
    setDraft((prev) => ({ ...prev, subject: '', message: '' }));
  }, []);

  return {
    draft,
    setField,
    // The live list, or the built-in one if the lookup fails — a form with no
    // subjects to choose from cannot be submitted at all.
    subjects: subjectsQuery.data?.length ? subjectsQuery.data : CONTACT_SUBJECT_FALLBACK,
    errors,
    isSending: sender.loading,
    sendErrorMessage: sender.error?.message ?? null,
    isSent,
    send,
    reset,
  };
}

export interface LegalSupportContainerResult {
  items: LegalSupportItem[];
}

export function useLegalSupportContainer(): LegalSupportContainerResult {
  return { items: LEGAL_SUPPORT_ITEMS };
}
