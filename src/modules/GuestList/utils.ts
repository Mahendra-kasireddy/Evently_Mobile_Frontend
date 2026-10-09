import { GROUP_LABEL, GUEST_AVATAR_COLORS } from './constants';
import type {
  GuestDTO,
  GuestGroup,
  GroupFilterOption,
  GuestRowViewModel,
  GuestStats,
} from './types';

/**
 * Up to two initials, from the words the name actually has.
 *
 * "Sruthi Reddy" is SR; "Ravi" is R, not RA — a second letter from the same
 * word reads as a different person's initials.
 */
export function initialsOf(name: string): string {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0] ?? '';
  const last = words.length > 1 ? words[words.length - 1][0] ?? '' : '';
  return `${first}${last}`.toUpperCase();
}

/**
 * A stable colour for one guest.
 *
 * Derived from the name rather than from the row's position, so adding
 * somebody at the top does not recolour everybody below them — a list whose
 * colours shuffle on every edit is harder to scan than one with no colour.
 */
export function avatarColorFor(name: string): string {
  const seed = (name ?? '')
    .split('')
    .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return GUEST_AVATAR_COLORS[seed % GUEST_AVATAR_COLORS.length];
}

const FILED: GuestGroup[] = ['family', 'friends', 'work'];

export function groupOf(guest: GuestDTO): GuestGroup {
  const group = guest.group;
  return group && FILED.includes(group) ? group : 'other';
}

export function toRow(guest: GuestDTO): GuestRowViewModel {
  const group = groupOf(guest);
  return {
    id: guest.id,
    name: guest.name,
    initials: initialsOf(guest.name),
    avatarColor: avatarColorFor(guest.name),
    /*
     * The group half is dropped for an unfiled guest rather than shown as
     * "Other": a phonebook import cannot know, and labelling it reads as a
     * decision the host made.
     */
    metaLine: [
      guest.phoneDisplay || guest.phone,
      group === 'other' ? '' : GROUP_LABEL[group],
    ]
      .filter(Boolean)
      .join(' · '),
    group,
    phone: guest.phoneDisplay || guest.phone,
    status: guest.viewed ? 'opened' : guest.lastSharedAt ? 'invited' : 'new',
    draft: {
      name: guest.name,
      phone: guest.phoneDisplay || guest.phone,
      group,
    },
  };
}

/** The chips, each carrying its own count so none of them lies about the list. */
export function groupFilters(guests: GuestDTO[]): GroupFilterOption[] {
  const counts = guests.reduce<Record<string, number>>((acc, guest) => {
    const key = groupOf(guest);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return [
    { key: null, label: 'Everyone', count: guests.length },
    ...FILED.map(key => ({
      key,
      label: GROUP_LABEL[key],
      count: counts[key] ?? 0,
    })),
  ];
}

/** "8 guests · 5 invited" — the second half only once something has been sent. */
export function summaryLine(
  guests: GuestDTO[],
  count: (n: number) => string,
  invited: (n: number) => string,
): string {
  const sent = guests.filter(g => !!g.lastSharedAt).length;
  return [count(guests.length), sent > 0 ? invited(sent) : '']
    .filter(Boolean)
    .join(' · ');
}

/** Digits only, so "+91 98490 11234" and "9849011234" are one number. */
export function digitsOf(phone: string): string {
  return (phone ?? '').replace(/\D/g, '');
}

/** Total, invited (sent at least once), opened, and not yet sent. */
export function guestStats(guests: GuestDTO[]): GuestStats {
  const invited = guests.filter(g => !!g.lastSharedAt || g.viewed).length;
  const opened = guests.filter(g => g.viewed).length;
  return {
    total: guests.length,
    invited,
    opened,
    notSent: guests.length - invited,
  };
}

/** Rows whose name or number contains the query. Digits match any spelling. */
export function matchesQuery(row: GuestRowViewModel, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (row.name.toLowerCase().includes(q)) return true;
  const digits = digitsOf(q);
  return digits.length > 0 && digitsOf(row.phone).includes(digits);
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * An event date for a card: the day and month for the tile, and a readable
 * line — or nulls when there is no usable date. Date-only strings are read
 * as local dates, so "2026-10-06" is the 6th everywhere.
 */
export function eventDateParts(
  value: string | null | undefined,
): { day: string; month: string; line: string } | null {
  const raw = (value ?? '').trim();
  if (!raw) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    : new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: String(d.getDate()),
    month: MONTHS[d.getMonth()].toUpperCase(),
    line: `${DAYS[d.getDay()]}, ${d.getDate()} ${
      MONTHS[d.getMonth()]
    } ${d.getFullYear()}`,
  };
}

/** "9849011234" from "+91 98490 11234" — the number as the field shows it, next to its fixed +91. */
export function localNumber(phone: string): string {
  return (phone ?? '').replace(/^\s*\+?91[\s-]*/, '').trim();
}
