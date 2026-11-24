import { dateParts, formatInr } from '../Shared';
import { AWAITING, EVENTS_COPY as COPY, PAST, STATUS_LOOK } from './constants';
import type { EventItem, EventsSections, OrganizerBookingDTO } from './types';

const DAY = 86_400_000;

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** "Today", "Tomorrow", "In 12 days", "Yesterday", "3 days ago". */
export function whenLabel(iso: string | undefined, now = new Date()): string {
  if (!iso) return COPY.noDate;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return COPY.noDate;
  const days = Math.round((startOfDay(date) - startOfDay(now)) / DAY);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  return days > 0 ? `In ${days} days` : `${-days} days ago`;
}

/** "within 6h" / "within 2 days" — the time left to accept or decline. */
export function respondByLabel(
  iso: string | null,
  now = Date.now(),
): { text: string; urgent: boolean } | null {
  if (!iso) return null;
  const left = new Date(iso).getTime() - now;
  if (Number.isNaN(left)) return null;
  if (left <= 0) return { text: COPY.respondOverdue, urgent: true };
  const hours = Math.ceil(left / 3_600_000);
  const text =
    hours < 48 ? `within ${hours}h` : `within ${Math.round(hours / 24)} days`;
  return { text: COPY.respondIn(text), urgent: hours <= 12 };
}

export function mapEvent(b: OrganizerBookingDTO, now = new Date()): EventItem {
  const parts = dateParts(b.eventDate);
  const awaiting = AWAITING.includes(b.status);
  const respond = awaiting
    ? respondByLabel(b.organizerRespondBy, now.getTime())
    : null;
  const time = b.eventDate ? new Date(b.eventDate).getTime() : NaN;
  return {
    id: b.id,
    title: b.title || b.occasion || 'Event',
    customerName: b.customer?.name ?? '',
    location: b.location,
    day: parts?.day ?? '',
    month: parts?.month ?? '',
    when: whenLabel(b.eventDate, now),
    status: STATUS_LOOK[b.status] ?? { label: b.status, tone: 'grey' },
    amount: formatInr(b.amount),
    paid:
      b.paymentStatus === 'paid_in_full'
        ? COPY.paidInFull
        : b.paymentStatus === 'advance_paid'
        ? COPY.advancePaid
        : '',
    tasksDone: (b.tasks ?? []).filter(t => t.status === 'done').length,
    tasksTotal: (b.tasks ?? []).length,
    awaiting,
    respondBy: respond?.text ?? '',
    respondUrgent: respond?.urgent ?? false,
    past: PAST.includes(b.status),
    // Undated bookings go to the end of a list rather than the start.
    sortKey: Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time,
  };
}

const pastRank = (i: EventItem) =>
  i.sortKey === Number.MAX_SAFE_INTEGER ? -1 : i.sortKey;

/**
 * Three lists: bookings waiting on the organizer (soonest deadline first),
 * everything coming up (soonest first), and the past (most recent first).
 */
export function groupEvents(
  dtos: OrganizerBookingDTO[] | null,
  now = new Date(),
): EventsSections {
  const items = (dtos ?? []).map(b => mapEvent(b, now));
  const live = items.filter(i => !i.past);
  return {
    awaiting: live
      .filter(i => i.awaiting)
      .sort((a, b) => a.sortKey - b.sortKey),
    upcoming: live
      .filter(i => !i.awaiting)
      .sort((a, b) => a.sortKey - b.sortKey),
    // Most recent first; an undated one goes last here too.
    past: items.filter(i => i.past).sort((a, b) => pastRank(b) - pastRank(a)),
  };
}
