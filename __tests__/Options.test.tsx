/**
 * @format
 *
 * Settings and Legal & Support — the app's options.
 *
 * The theme: an option that does nothing is worse than no option, so what
 * remains has to actually persist, and what cannot is either removed or says
 * so on its face.
 */

import { changedFields, detailsOf, hasChanges, isValidEmail } from '../src/modules/Settings/utils';
import { SETTINGS_FIELDS } from '../src/modules/Settings/constants';
import { validateContact } from '../src/modules/LegalSupport/utils';
import { LEGAL_SUPPORT_ITEMS } from '../src/modules/LegalSupport/constants';
import type { UserDetailsDTO } from '../src/modules/Settings/types';
import type { ContactDraft } from '../src/modules/LegalSupport/types';

const user = (over: Partial<UserDetailsDTO> = {}): UserDetailsDTO =>
  ({
    id: 'u1',
    name: 'Meera Rao',
    phone: '+919000000000',
    email: 'meera@example.com',
    phoneVerified: true,
    city: 'Hyderabad',
    roles: ['customer'],
    status: 'active',
    createdAt: '2026-02-11T00:00:00.000Z',
    ...over,
  }) as UserDetailsDTO;

describe('Settings fields', () => {
  it('offers only what the customer may actually change', () => {
    // The server's self-service DTO omits roles and status — their absence is
    // the access control — and phone is identity, changed by verification.
    expect(SETTINGS_FIELDS.map((f) => f.key)).toEqual(['name', 'email', 'city']);
  });

  it('sends only the fields that changed', () => {
    // Resending the whole form would rewrite values the customer never
    // touched, and a PATCH of identical values is a write nobody needed.
    const before = detailsOf(user());
    expect(changedFields(before, { ...before, city: 'Bengaluru' })).toEqual({ city: 'Bengaluru' });
    expect(changedFields(before, before)).toEqual({});
    expect(hasChanges(before, before)).toBe(false);
  });

  it('treats whitespace as no change', () => {
    const before = detailsOf(user());
    expect(hasChanges(before, { ...before, name: '  Meera Rao  ' })).toBe(false);
  });

  it('accepts a blank email but not a broken one', () => {
    // An email nobody has given is not an invalid one.
    expect(isValidEmail('')).toBe(true);
    expect(isValidEmail('   ')).toBe(true);
    expect(isValidEmail('meera@example.com')).toBe(true);
    expect(isValidEmail('meera@')).toBe(false);
    expect(isValidEmail('not an email')).toBe(false);
  });

  it('reads an account with nothing filled in', () => {
    expect(detailsOf(user({ name: '', email: undefined, city: '' }))).toEqual({
      name: '',
      email: '',
      city: '',
    });
  });
});

describe('Legal & support items', () => {
  it('lists nothing that merely alerts "coming soon"', () => {
    // Blog and Resources were marketing pages with no content on either
    // platform; they did nothing but apologise.
    const keys = LEGAL_SUPPORT_ITEMS.map((i) => i.key);
    expect(keys).not.toContain('blog');
    expect(keys).not.toContain('resources');
  });

  it('keeps exactly one item that does real work', () => {
    const actions = LEGAL_SUPPORT_ITEMS.filter((i) => i.action === 'contact');
    expect(actions).toHaveLength(1);
    expect(actions[0].key).toBe('contact');
  });

  it('marks the unpublished documents as pending rather than hiding them', () => {
    // They are documents the app is expected to carry; a row saying so beats
    // pretending they do not exist.
    expect(LEGAL_SUPPORT_ITEMS.filter((i) => i.action === 'pending').map((i) => i.key)).toEqual([
      'privacy',
      'terms',
      'refund',
    ]);
  });
});

const draft = (over: Partial<ContactDraft> = {}): ContactDraft => ({
  name: 'Meera Rao',
  email: 'meera@example.com',
  phone: '9000000000',
  subject: 'billing',
  message: 'My advance payment has not shown up on the booking.',
  ...over,
});

describe('validateContact', () => {
  it('passes a complete message', () => {
    expect(validateContact(draft())).toEqual({});
  });

  it('catches what the server would reject, before the round-trip', () => {
    expect(validateContact(draft({ name: '   ' })).name).toBeDefined();
    expect(validateContact(draft({ email: 'meera@' })).email).toBeDefined();
    expect(validateContact(draft({ phone: '' })).phone).toBeDefined();
    expect(validateContact(draft({ subject: '' })).subject).toBeDefined();
  });

  it('asks for a message worth sending', () => {
    // The server takes anything; a two-word message wastes both sides' time.
    expect(validateContact(draft({ message: 'help' })).message).toBeDefined();
    expect(validateContact(draft({ message: 'A booking went wrong.' })).message).toBeUndefined();
  });

  it('reports every problem at once, not the first one', () => {
    const errors = validateContact(draft({ name: '', email: 'x', phone: '', subject: '', message: '' }));
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'phone', 'subject']);
  });
});
