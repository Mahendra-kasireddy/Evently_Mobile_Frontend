import { PROFILE_COPY, PROFILE_GROUPS, ROLE_LABEL } from './constants';
import type { ProfileGroupSpec, ProfileViewModel, UserDetailsDTO } from './types';

/**
 * The monogram on the avatar.
 *
 * Two letters wherever two can be had: the first letter of the first and last
 * names, or — for a single name, which plenty of people have — its first two
 * letters. A lone capital in a 56pt square reads as a placeholder rather than
 * as somebody's initials.
 */
function initialsOf(name: string, fallback: string): string {
  const trimmed = (name ?? '').trim();
  const source = trimmed || (fallback ?? '').trim();
  if (!source) return '·';

  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    const first = parts[0][0] ?? '';
    const last = parts[parts.length - 1][0] ?? '';
    return (first + last).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

/** India's dial code — the only one this app signs anyone in with today. */
const DIAL_CODE = '+91';

/**
 * The phone with its middle hidden: `+91 98490 •••• 21`.
 *
 * One dot per hidden digit rather than a fixed run of them, so the masking
 * never implies a number is longer or shorter than it is — someone checking
 * which of their two numbers this account uses can still count.
 *
 * A number too short to mask meaningfully is shown whole. Hiding two digits of
 * a five-digit string protects nothing and just makes it unreadable.
 */
export function maskPhone(phone: string | null | undefined): string {
  let digits = (phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  /*
   * The account stores the number without its dial code, but a value that
   * arrived already formatted carries one — and counting "91" as part of the
   * number would mask the wrong digits and misstate its length.
   */
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2);

  const KEEP_START = 5;
  const KEEP_END = 2;
  if (digits.length <= KEEP_START + KEEP_END + 1) return `${DIAL_CODE} ${digits}`;

  const head = digits.slice(0, KEEP_START);
  const tail = digits.slice(-KEEP_END);
  const hidden = '•'.repeat(digits.length - KEEP_START - KEEP_END);
  return `${DIAL_CODE} ${head} ${hidden} ${tail}`;
}

/**
 * The account, as the profile screen reads it.
 *
 * `displayName` is '' for an account with no name rather than a stand-in: the
 * old fallback rendered the literal word "there" as the person's name, which
 * came from a greeting ("Hi there") and made no sense on its own.
 */
export function mapProfile(user: UserDetailsDTO): ProfileViewModel {
  const roles = user.roles ?? [];
  return {
    displayName: (user.name ?? '').trim(),
    initials: initialsOf(user.name, user.phone),
    maskedPhone: maskPhone(user.phone),
    // Every role the account holds: one that is both customer and organizer
    // previously read as "Customer" alone.
    roles: roles.map((role) => ROLE_LABEL[role] ?? role).filter(Boolean),
    isOrganizer: roles.includes('organizer'),
  };
}

/**
 * The menu for this particular account.
 *
 * Only one row is conditional, and it is dropped rather than disabled: an
 * organizer has already listed their business, and a greyed-out row invites a
 * tap that will do nothing.
 */
export function groupsFor(isOrganizer: boolean): ProfileGroupSpec[] {
  if (!isOrganizer) return PROFILE_GROUPS;
  return PROFILE_GROUPS.map((group) =>
    group.key === 'more'
      ? { ...group, rows: group.rows.filter((row) => row.action !== 'listBusiness') }
      : group,
  );
}

export { PROFILE_COPY };
