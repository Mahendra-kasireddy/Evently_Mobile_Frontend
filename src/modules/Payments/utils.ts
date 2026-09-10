import { formatINR, mapBookings } from '../Booking/utils';
import type { BookingDTO, BookingItem } from '../Booking/types';
import { PAYMENTS_COPY as COPY } from './constants';
import type { PaymentItem, PaymentsSummary } from './types';

/**
 * The bookings list, read for money.
 *
 * Every figure here already travels with `/booking/my-bookings` — the agreed
 * amount, what has been paid and the balance — so this screen adds no endpoint
 * of its own; it reuses the Booking module's own mapper and then reads the
 * result. That also means the statuses, dates and organizer names cannot drift
 * apart from the ones on Your events.
 *
 * A booking with no agreed amount is dropped rather than shown as ₹0: a quote
 * nobody has accepted yet has no money attached, and listing it under Payments
 * would invent a debt.
 */
export function mapPayments(dtos: BookingDTO[]): PaymentItem[] {
  return mapBookings(dtos)
    .filter((b) => b.amount > 0)
    .map(toPayment)
    // Largest balance first — what is owed is why this screen is open. Settled
    // events keep their place at the bottom as a record.
    .sort((a, b) => b.dueAmount - a.dueAmount);
}

function toPayment(b: BookingItem): PaymentItem {
  const due = Math.max(0, b.balanceAmount);
  return {
    bookingId: b.id,
    title: b.title,
    ref: b.ref,
    organizerName: b.organizerName,
    eventDateLabel: b.eventDateLabel,
    statusLabel: b.statusLabel,
    settled: due === 0,
    agreedLabel: formatINR(b.amount),
    paidLabel: formatINR(b.amountPaid),
    dueLabel: formatINR(due),
    paidPercent: b.amount > 0 ? Math.min(100, Math.round((b.amountPaid / b.amount) * 100)) : 0,
    dueAmount: due,
  };
}

/**
 * What is outstanding in total.
 *
 * Deliberately labelled as a sum across events rather than as one bill: these
 * balances are owed to different organizers on different dates, and a single
 * headline figure with no such caveat reads like something that can be paid
 * here and now.
 */
export function summarise(items: PaymentItem[]): PaymentsSummary {
  const outstanding = items.reduce((total, item) => total + item.dueAmount, 0);
  return {
    outstandingLabel: formatINR(outstanding),
    eventsWithBalance: items.filter((item) => item.dueAmount > 0).length,
  };
}

export { COPY as PAYMENTS_COPY };
