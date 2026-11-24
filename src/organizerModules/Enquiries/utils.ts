import { relativeTime } from '../../modules/Notification/utils';
import { formatInr } from '../Shared';
import { ENQUIRIES_COPY as COPY, FILTER_ORDER } from './constants';
import type {
  ChipTone,
  EnquiryFilter,
  EnquiryItem,
  EnquiryStage,
  FilterChip,
  IncomingRequestDTO,
} from './types';

const CLOSED_QUOTES = new Set(['rejected', 'withdrawn']);

/** Where an enquiry sits for this organizer. */
export function stageOf(r: IncomingRequestDTO): EnquiryStage {
  if (r.status === 'cancelled' || r.status === 'closed') return 'closed';
  const q = r.myQuotation;
  if (!q) return 'new';
  if (CLOSED_QUOTES.has(q.status)) return 'closed';
  if (q.status === 'accepted') return 'confirmed';
  if (q.status === 'draft') return 'draft';
  return 'sent';
}

/**
 * Time left to reply, against a 24-hour target. Worked out from `createdAt` —
 * the API has no deadline field.
 */
export function slaChip(
  createdAt: string | undefined,
  now = Date.now(),
): { label: string; tone: ChipTone } {
  const created = createdAt ? new Date(createdAt).getTime() : NaN;
  if (Number.isNaN(created)) return { label: COPY.chip.newSla, tone: 'violet' };
  const hoursLeft = 24 - (now - created) / 3_600_000;
  if (hoursLeft <= 0) return { label: COPY.chip.slaPassed, tone: 'red' };
  if (hoursLeft >= 23) return { label: COPY.chip.newSla, tone: 'violet' };
  return {
    label: COPY.chip.hoursLeft(Math.ceil(hoursLeft)),
    tone: hoursLeft <= 6 ? 'red' : 'amber',
  };
}

function statusChip(
  r: IncomingRequestDTO,
  stage: EnquiryStage,
): { label: string; tone: ChipTone } {
  if (stage === 'closed' && !r.myQuotation)
    return { label: COPY.chip.closed, tone: 'grey' };
  const status = r.myQuotation?.status ?? 'sent';
  const label = COPY.chip[status];
  const tone: ChipTone =
    status === 'accepted'
      ? 'green'
      : status === 'draft'
      ? 'blue'
      : CLOSED_QUOTES.has(status)
      ? 'grey'
      : 'violet';
  return { label, tone };
}

function initialsOf(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const letters = words.slice(0, 2).map(w => w[0]?.toUpperCase() ?? '');
  return letters.join('') || '•';
}

export function mapEnquiry(
  r: IncomingRequestDTO,
  now = new Date(),
): EnquiryItem {
  const stage = stageOf(r);
  const title = r.customerName || r.occasion || 'Event';
  return {
    id: r.id,
    stage,
    title,
    // Only as a chip when the name leads; otherwise the title already says it.
    occasion: r.customerName ? r.occasion : '',
    where: r.where,
    when: r.when,
    guests: r.guests,
    budget: r.budget,
    categories: r.categories ?? [],
    receivedAgo: relativeTime(r.createdAt, now),
    chip:
      stage === 'new'
        ? slaChip(r.createdAt, now.getTime())
        : statusChip(r, stage),
    quoteTotal: r.myQuotation ? formatInr(r.myQuotation.grandTotal) : '',
    action: COPY.actions[stage],
    initials: initialsOf(title),
    searchText: [
      r.customerName,
      r.occasion,
      r.when,
      r.where,
      ...(r.categories ?? []),
    ]
      .join(' ')
      .toLowerCase(),
  };
}

/** Newest first, so the enquiry that just came in is on top. */
export function mapEnquiries(
  dtos: IncomingRequestDTO[] | null,
  now = new Date(),
): EnquiryItem[] {
  return [...(dtos ?? [])]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .map(r => mapEnquiry(r, now));
}

export function filterChips(items: EnquiryItem[]): FilterChip[] {
  return FILTER_ORDER.map(key => ({
    key,
    label: COPY.filters[key],
    count:
      key === 'all' ? items.length : items.filter(i => i.stage === key).length,
  }));
}

export function applyFilter(
  items: EnquiryItem[],
  filter: EnquiryFilter,
  query: string,
): EnquiryItem[] {
  const q = query.trim().toLowerCase();
  return items.filter(
    i =>
      (filter === 'all' || i.stage === filter) &&
      (!q || i.searchText.includes(q)),
  );
}

/** Open on New when something is waiting for a reply, otherwise on All. */
export function defaultFilter(items: EnquiryItem[]): EnquiryFilter {
  return items.some(i => i.stage === 'new') ? 'new' : 'all';
}
