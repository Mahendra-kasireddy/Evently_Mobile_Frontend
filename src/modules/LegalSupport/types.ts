export type LegalSupportAction = 'contact' | 'pending';

export interface LegalSupportItem {
  key: string;
  icon: string;
  label: string;
  hint?: string;
  action: LegalSupportAction;
}

/** GET /contact/subjects */
export interface ContactSubjectDTO {
  value: string;
  label: string;
}

/** GET /contact/prefill — what the account already knows about the customer. */
export interface ContactPrefillDTO {
  name: string;
  email: string;
  phone: string;
}

export interface ContactDraft {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
