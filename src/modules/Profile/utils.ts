import { PROFILE_COPY, ROLE_LABEL } from './constants';
import type { ProfileFact, ProfileViewModel, UserDetailsDTO } from './types';

function initialsOf(name: string, fallback: string): string {
  const trimmed = (name ?? '').trim();
  const source = trimmed || (fallback ?? '').trim();
  if (!source) return '·';
  const parts = source.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function memberSince(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

/**
 * The account, as the profile screen reads it.
 *
 * `displayName` is '' for an account with no name rather than a stand-in: the
 * old fallback rendered the literal word "there" as the person's name, which
 * came from a greeting ("Hi there") and made no sense on its own.
 *
 * Facts the account does not hold keep their row but carry a prompt instead of
 * a value, because an empty city is something the customer can fix — unlike a
 * blank that just looks broken.
 */
export function mapProfile(user: UserDetailsDTO): ProfileViewModel {
  const facts: ProfileFact[] = [
    {
      key: 'phone',
      icon: 'phone-outline',
      label: 'Phone',
      value: user.phone ?? '',
      verified: user.phoneVerified === true,
    },
    {
      key: 'email',
      icon: 'email-outline',
      label: 'Email',
      value: user.email ?? '',
      emptyHint: 'Not added',
    },
    {
      key: 'city',
      icon: 'map-marker-outline',
      label: 'City',
      value: user.city ?? '',
      emptyHint: 'Not set',
    },
    {
      key: 'since',
      icon: 'calendar-outline',
      label: 'Member since',
      value: memberSince(user.createdAt),
    },
  ].filter((fact) => !!fact.value || !!fact.emptyHint);

  return {
    displayName: (user.name ?? '').trim(),
    initials: initialsOf(user.name, user.phone),
    // Every role the account holds: one that is both customer and organizer
    // previously read as "Customer" alone.
    roles: (user.roles ?? []).map((role) => ROLE_LABEL[role] ?? role).filter(Boolean),
    facts,
  };
}

export { PROFILE_COPY };
