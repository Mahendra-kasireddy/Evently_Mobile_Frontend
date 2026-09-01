import { BOOKING_STATUS_COPY, PAST_STATUSES, PAYMENT_STATUS_LABEL } from './constants';
import type { BookingDTO, BookingItem, BookingStatus } from './types';

function titleizeStatus(status: string): string {
  return status
    .split('_')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

/** Two-letter monogram, from whatever name we actually have. */
export function initials(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '·';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function dateLabel(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Indian-format currency; '' for an amount nobody has set. */
export function formatINR(amount: number | undefined): string {
  if (!Number.isFinite(amount) || (amount as number) <= 0) return '';
  return `₹${Math.round(amount as number).toLocaleString('en-IN')}`;
}

export function isPast(status: BookingStatus): boolean {
  return PAST_STATUSES.includes(status);
}

export function mapBookings(dtos: BookingDTO[]): BookingItem[] {
  return (dtos ?? []).map((b) => {
    const copy = BOOKING_STATUS_COPY[b.status] ?? {
      label: titleizeStatus(b.status ?? 'unknown'),
      tone: 'muted' as const,
    };
    const organizerName = b.organizer?.name ?? null;
    const paid = formatINR(b.amountPaid);
    const total = formatINR(b.amount);

    return {
      id: b.id,
      ref: b.ref,
      title: b.title,
      occasion: (b.occasion ?? '').toLowerCase(),
      location: b.location ?? '',
      status: b.status,
      statusLabel: copy.label,
      statusTone: copy.tone,
      progress: Math.min(100, Math.max(0, Math.round(b.progress ?? 0))),
      /*
       * A past booking has no countdown — "3 days to go" on a completed event
       * is nonsense — and a booking with no date has none either. 0 is a real
       * answer, though: the event is today.
       */
      daysToGo: isPast(b.status) || !b.eventDate ? null : Math.max(0, Math.trunc(b.daysToGo ?? 0)),
      eventDateLabel: dateLabel(b.eventDate),
      organizerName,
      organizerInitials: initials(organizerName ?? ''),
      organizerColor: b.organizer?.avatarColor || '#1a2e5a',
      // Both halves or neither: "₹72,000" alone says nothing about the total.
      paidLabel: paid && total ? `${paid} of ${total}` : '',
      paymentLabel: PAYMENT_STATUS_LABEL[b.paymentStatus] ?? '',
      tab: isPast(b.status) ? 'past' : 'active',
    };
  });
}
