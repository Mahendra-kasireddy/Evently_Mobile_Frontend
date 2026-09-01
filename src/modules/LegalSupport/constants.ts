import type { LegalSupportItem } from './types';

export const CONTACT_ENDPOINT = '/contact';
export const CONTACT_SUBJECTS_ENDPOINT = '/contact/subjects';
export const CONTACT_PREFILL_ENDPOINT = '/contact/prefill';

export const LEGAL_ACCENT = '#e8633a';
export const LEGAL_NAVY = '#1a2e5a';
export const LEGAL_ACCENT_SOFT = '#fdeee7';
export const LEGAL_GREEN = '#1d9e75';

/**
 * What this screen offers.
 *
 * "Blog" and "Resources" used to sit here and popped an alert saying they were
 * coming soon — they are marketing pages with no content on either platform,
 * so they are gone rather than listed as things that do not work.
 *
 * The three policies stay: they are documents the app is expected to carry,
 * and a row that says so is better than pretending they do not exist. Contact
 * Us is the one that does real work.
 */
export const LEGAL_SUPPORT_ITEMS: LegalSupportItem[] = [
  {
    key: 'contact',
    icon: 'email-outline',
    label: 'Contact us',
    hint: 'Send a message to the Evently team',
    action: 'contact',
  },
  { key: 'privacy', icon: 'shield-lock-outline', label: 'Privacy Policy', action: 'pending' },
  { key: 'terms', icon: 'gavel', label: 'Terms & Conditions', action: 'pending' },
  { key: 'refund', icon: 'cash-refund', label: 'Refund Policy', action: 'pending' },
];

export const LEGAL_COPY = {
  title: 'Legal & Support',
  supportSection: 'Support',
  legalSection: 'Legal',
  pendingTitle: 'Not published yet',
  pendingBody: 'This document is not available in the app yet. Contact us if you need it now.',
};

/** Fallback labels; the live list comes from GET /contact/subjects. */
export const CONTACT_SUBJECT_FALLBACK: Array<{ value: string; label: string }> = [
  { value: 'general', label: 'General enquiry' },
  { value: 'event_planning', label: 'Planning an event' },
  { value: 'organizer', label: 'About an organizer' },
  { value: 'booking', label: 'A booking' },
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Something is broken' },
  { value: 'other', label: 'Something else' },
];

export const CONTACT_COPY = {
  title: 'Contact us',
  intro: 'Tell us what you need and we will come back to you by email.',
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  subject: 'What is this about?',
  message: 'Your message',
  messagePlaceholder: 'Give us enough detail to help properly…',
  send: 'Send message',
  sending: 'Sending…',
  sentTitle: 'Message sent',
  sentBody: 'We have your message and will reply by email. Nothing else to do.',
  sentAgain: 'Send another message',
  needName: 'Enter your name.',
  needEmail: 'Enter a valid email address — that is where the reply goes.',
  needPhone: 'Enter a phone number we can reach you on.',
  needSubject: 'Choose what your message is about.',
  needMessage: 'Tell us a little more — at least a sentence.',
};
