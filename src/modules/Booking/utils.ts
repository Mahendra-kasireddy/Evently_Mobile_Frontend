import {
  BOOKING_STATUS_COPY,
  NEXT_STEP_COPY,
  PAST_STATUSES,
  PAYMENT_STATUS_LABEL,
} from './constants';
import type {
  BookingDTO,
  BookingItem,
  BookingStatus,
  BookingStepDTO,
  EventExtras,
  JumpTile,
} from './types';

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

/**
 * The countdown as it sits beside the progress bar: "3 days", not "3 days to
 * go". The long form is still what the card announces to a screen reader —
 * "3 days" alone is ambiguous when read out of the visual context of a bar.
 */
export function compactDays(days: number | null): string {
  if (days == null) return '';
  if (days === 0) return 'Today';
  return days === 1 ? '1 day' : `${days} days`;
}

/**
 * What the booking is waiting on, taken from its own milestones.
 *
 * The first step not yet done is the answer; a booking with every step done,
 * or with no steps at all, produces '' and the card drops the line rather than
 * inventing a task for it.
 */
export function nextStepOf(steps: BookingStepDTO[] | undefined): string {
  const pending = (steps ?? []).find((s) => !s.done && !!s.label);
  if (!pending) return '';
  const label = pending.label.trim();
  // A known milestone is said as the thing still to come; anything else is
  // shown exactly as the server wrote it rather than reworded by guesswork.
  return NEXT_STEP_COPY[label.toLowerCase()] ?? label;
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
    /*
     * A past booking has no countdown — "3 days to go" on a completed event
     * is nonsense — and a booking with no date has none either. 0 is a real
     * answer, though: the event is today.
     */
    const daysToGo =
      isPast(b.status) || !b.eventDate ? null : Math.max(0, Math.trunc(b.daysToGo ?? 0));

    return {
      id: b.id,
      ref: b.ref,
      title: b.title,
      occasion: (b.occasion ?? '').toLowerCase(),
      location: b.location ?? '',
      status: b.status,
      statusLabel: copy.label,
      statusPill: copy.label.toUpperCase(),
      statusTone: copy.tone,
      progress: Math.min(100, Math.max(0, Math.round(b.progress ?? 0))),
      daysToGo,
      daysLabel: compactDays(daysToGo),
      eventDateLabel: dateLabel(b.eventDate),
      organizerName,
      organizerInitials: initials(organizerName ?? ''),
      organizerColor: b.organizer?.avatarColor || '#1a2e5a',
      // Both halves or neither: "₹72,000" alone says nothing about the total.
      paidLabel: paid && total ? `${paid} of ${total}` : '',
      paymentLabel: PAYMENT_STATUS_LABEL[b.paymentStatus] ?? '',
      paymentStatus: b.paymentStatus,
      amount: b.amount ?? 0,
      amountPaid: b.amountPaid ?? 0,
      balanceAmount: Math.max(0, b.balanceAmount ?? (b.amount ?? 0) - (b.amountPaid ?? 0)),
      nextStep: nextStepOf(b.steps),
      tab: isPast(b.status) ? 'past' : 'active',
    };
  });
}

/**
 * Which event the "Jump to" tiles belong to.
 *
 * The soonest active one — the tiles are shortcuts into a single workspace, so
 * they have to name which. Soonest rather than newest: the event three days
 * away is the one being worked on, whatever order the bookings were placed in.
 * An event with no date sorts last rather than first, which is what a missing
 * `daysToGo` would otherwise do.
 */
export function focusEvent(active: BookingItem[]): BookingItem | null {
  if (active.length === 0) return null;
  return active.reduce((best, item) => {
    const a = item.daysToGo ?? Number.POSITIVE_INFINITY;
    const b = best.daysToGo ?? Number.POSITIVE_INFINITY;
    return a < b ? item : best;
  }, active[0]);
}

// ---------------------------------------------------------------------------
// Tile subtitles. Every one of these is a real figure or an honest absence —
// none of them counts something the backend does not record.
// ---------------------------------------------------------------------------

function paymentsSubtitle(item: BookingItem): string {
  if (item.paymentStatus === 'paid_in_full') return 'Paid in full';
  const due = formatINR(item.balanceAmount);
  if (due) return `${due} still due`;
  if (item.paymentStatus === 'unpaid') return 'Nothing paid yet';
  return 'Advance & balance';
}

/**
 * What the invitation tile can honestly say.
 *
 * Not "RSVPs": an invitation carries RSVP *settings* — whether to collect
 * them, by when, plus-ones — but nothing in this system records a guest's
 * answer, because a guest has no account to answer from. What is recorded is
 * who it was shared with and who opened it, so that is what the tile counts.
 */
function invitationSubtitle(guests: EventExtras['guests']): string | null {
  if (!guests) return null;
  if (guests.shared === 0) return 'Ready to share';
  const people = guests.shared === 1 ? '1 guest' : `${guests.shared} guests`;
  return guests.opened > 0 ? `${people} · ${guests.opened} opened` : `${people} · none opened yet`;
}

function ideasSubtitle(ideas: EventExtras['ideas']): string | null {
  if (!ideas) return null;
  if (ideas.awaitingApproval > 0) {
    return ideas.awaitingApproval === 1 ? '1 awaiting you' : `${ideas.awaitingApproval} awaiting you`;
  }
  if (ideas.shared > 0) return ideas.shared === 1 ? '1 idea shared' : `${ideas.shared} ideas shared`;
  return 'Share your first idea';
}

/**
 * The four tiles for one event, with every subtitle the app can back replaced
 * by the real one. A tile whose count has not arrived — or whose feature the
 * event has not reached — keeps the fallback wording from `JUMP_TILES`.
 */
export function jumpTilesFor(
  tiles: JumpTile[],
  item: BookingItem | null,
  extras: EventExtras,
): JumpTile[] {
  return tiles.map((tile) => {
    if (tile.key === 'payments' && item) return { ...tile, subtitle: paymentsSubtitle(item) };
    if (tile.key === 'invitation') {
      const subtitle = invitationSubtitle(extras.guests);
      return subtitle ? { ...tile, subtitle } : tile;
    }
    if (tile.key === 'ideas') {
      const subtitle = ideasSubtitle(extras.ideas);
      return subtitle ? { ...tile, subtitle } : tile;
    }
    return tile;
  });
}
