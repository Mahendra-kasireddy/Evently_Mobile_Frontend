import { relativeTime } from '../../modules/Notification/utils';
import { formatInr } from '../Shared';
import {
  ALL_FILTER,
  CATEGORY_ICON,
  CATEGORY_LABEL,
  PHONE_LENGTH,
  SUBVENDORS_COPY as COPY,
} from './constants';
import type {
  CategoryFilter,
  FilterChip,
  MemberItem,
  PendingItem,
  PerformanceTone,
  SubVendorLinkDTO,
} from './types';

/** "food" → "Catering"; an unknown key is title-cased rather than hidden. */
export function categoryLabel(key: string | null | undefined): string {
  const k = (key ?? '').trim().toLowerCase();
  if (!k) return CATEGORY_LABEL.other;
  return CATEGORY_LABEL[k] ?? k.charAt(0).toUpperCase() + k.slice(1);
}

export function categoryIcon(key: string | null | undefined): string {
  return CATEGORY_ICON[(key ?? '').trim().toLowerCase()] ?? CATEGORY_ICON.other;
}

/**
 * What the phone field keeps from what was typed or pasted: digits only, with
 * a pasted "+91" or trunk "0" dropped, capped at ten — so "+91 98765 43210"
 * and "098765 43210" both become "9876543210", and an eleventh digit typed by
 * mistake is ignored rather than shifting the number.
 */
export function sanitizePhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === PHONE_LENGTH + 2 && digits.startsWith('91'))
    return digits.slice(2);
  if (digits.length === PHONE_LENGTH + 1 && digits.startsWith('0'))
    return digits.slice(1);
  return digits.slice(0, PHONE_LENGTH);
}

/** The backend's rule: exactly ten digits. Null when valid. */
export function phoneError(phone: string): string | null {
  return /^\d{10}$/.test(phone) ? null : COPY.invalidPhone;
}

/** "+91 98765 43210"; anything that isn't a 10-digit mobile is shown as given. */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  const local =
    digits.length > PHONE_LENGTH ? digits.slice(-PHONE_LENGTH) : digits;
  if (local.length !== PHONE_LENGTH) return raw.trim();
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}

export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map(w => w[0]?.toUpperCase() ?? '');
  return letters.join('') || '•';
}

export function performanceTone(percent: number): PerformanceTone {
  if (percent >= 85) return 'good';
  if (percent >= 70) return 'fair';
  return 'low';
}

/** A link is on the team once it has resolved to a sub-vendor profile. */
export function isMember(link: SubVendorLinkDTO): boolean {
  return link.status === 'active' && !!link.subVendor;
}

export function isPending(link: SubVendorLinkDTO): boolean {
  return (
    link.status === 'pending' || (link.status === 'active' && !link.subVendor)
  );
}

export function mapMember(link: SubVendorLinkDTO): MemberItem {
  const sv = link.subVendor;
  const name =
    sv?.fullName?.trim() || formatPhone(link.invitedPhone) || 'Sub-vendor';
  const category = (sv?.category ?? 'other').toLowerCase();
  const done = Math.max(0, Math.round(link.eventsCount ?? 0));
  const percent = Math.min(
    100,
    Math.max(0, Math.round(link.performancePercent ?? 0)),
  );
  const available = sv?.active !== false;
  return {
    linkId: link.linkId,
    name,
    initials: sv?.initials?.trim() || initialsOf(name),
    category,
    categoryLabel: categoryLabel(category),
    categoryIcon: categoryIcon(category),
    serviceArea: sv?.serviceArea?.trim() ?? '',
    rate:
      sv && sv.baseRate > 0
        ? COPY.rate(formatInr(sv.baseRate), sv.baseRateUnit?.trim() ?? '')
        : '',
    // The API sends 0% both for "never assigned" and "assigned, none done";
    // only the second is a real score.
    performance: done > 0 || percent > 0 ? percent : null,
    eventsDone: done,
    chip: available
      ? { label: COPY.chip.active, tone: 'green' }
      : { label: COPY.chip.away, tone: 'grey' },
  };
}

export function mapPending(
  link: SubVendorLinkDTO,
  now = new Date(),
): PendingItem {
  const ago = relativeTime(link.invitedAt, now);
  return {
    linkId: link.linkId,
    phone: formatPhone(link.invitedPhone) || COPY.chip.pending,
    sentAgo: ago ? COPY.sent(ago) : '',
  };
}

/** The roster split into the team and the invites still waiting. */
export function splitRoster(
  links: SubVendorLinkDTO[] | null | undefined,
  now = new Date(),
): { members: MemberItem[]; pending: PendingItem[] } {
  const live = (links ?? []).filter(l => l && l.status !== 'removed');
  return {
    members: live
      .filter(isMember)
      .map(mapMember)
      .sort((a, b) => a.name.localeCompare(b.name)),
    pending: live.filter(isPending).map(l => mapPending(l, now)),
  };
}

/** "All", then one chip per category on the team, biggest first. */
export function categoryChips(members: MemberItem[]): FilterChip[] {
  const counts = new Map<string, number>();
  members.forEach(m =>
    counts.set(m.category, (counts.get(m.category) ?? 0) + 1),
  );
  const chips = [...counts.entries()]
    .map(([key, count]) => ({ key, label: categoryLabel(key), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return [
    { key: ALL_FILTER, label: COPY.all, count: members.length },
    ...chips,
  ];
}

export function applyCategory(
  members: MemberItem[],
  filter: CategoryFilter,
): MemberItem[] {
  return filter === ALL_FILTER
    ? members
    : members.filter(m => m.category === filter);
}

/**
 * The chosen chip, or All once that category has emptied (after a removal) —
 * so the list never sticks on a chip that is no longer shown.
 */
export function effectiveFilter(
  chosen: CategoryFilter,
  chips: FilterChip[],
): CategoryFilter {
  return chips.some(c => c.key === chosen && c.count > 0) ? chosen : ALL_FILTER;
}

/**
 * The server answers an invite to an existing link with that link instead of
 * an error; spotting its id in the roster is how "already invited" is told.
 */
export function isAlreadyLinked(
  linkId: string,
  links: SubVendorLinkDTO[] | null | undefined,
): boolean {
  return (links ?? []).some(l => l.linkId === linkId && l.status !== 'removed');
}
