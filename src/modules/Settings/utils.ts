import type {
  ProfileDetails,
  UpdateProfileBody,
  UserDetailsDTO,
} from './types';

export function detailsOf(user: UserDetailsDTO): ProfileDetails {
  return {
    name: user.name ?? '',
    email: user.email ?? '',
    city: user.city ?? '',
  };
}

/** Blank is allowed — an email nobody has given is not an invalid one. */
export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Only what actually changed.
 *
 * Sending the whole form would rewrite fields the customer never touched, and
 * a PATCH that resends identical values is a write the server did not need.
 */
export function changedFields(
  before: ProfileDetails,
  after: ProfileDetails,
): UpdateProfileBody {
  const body: UpdateProfileBody = {};
  (Object.keys(after) as Array<keyof ProfileDetails>).forEach(key => {
    const next = after[key].trim();
    if (next !== (before[key] ?? '').trim()) body[key] = next;
  });
  return body;
}

export function hasChanges(
  before: ProfileDetails,
  after: ProfileDetails,
): boolean {
  return Object.keys(changedFields(before, after)).length > 0;
}

/**
 * An avatar's initials, the same way the Profile card makes them: first and
 * last word's first letters, or a one-word name's first two letters.
 */
export function initialsOf(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '·';
  if (parts.length > 1) {
    return (
      (parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')
    ).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}
