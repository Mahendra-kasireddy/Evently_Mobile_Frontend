import type { PayOption } from './types';

export const PAYMENT_ORDER_ENDPOINT = '/payment/order';
export const PAYMENT_VERIFY_ENDPOINT = '/payment/verify';
export const PAYMENT_CASH_ENDPOINT = '/payment/cash';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const PAY_ACCENT = '#e8633a';
export const PAY_NAVY = '#1a2e5a';
export const PAY_NAVY_DEEP = '#0e1a33';
export const PAY_CANVAS = '#faf8f7';
export const PAY_HAIRLINE = '#efe9e5';
export const PAY_GREEN = '#1d9e75';
export const PAY_GREEN_SOFT = '#e8f6ef';

/**
 * The methods offered, and what each one opens.
 *
 * These are not decorative: the choice is passed to Razorpay as the method its
 * checkout opens on, so picking UPI here means the sheet lands on UPI rather
 * than on a menu the customer has to navigate twice.
 */
export const PAY_OPTIONS: PayOption[] = [
  { id: 'upi', label: 'UPI', hint: 'GPay, PhonePe, Paytm', icon: 'swap-vertical' },
  { id: 'card', label: 'Card', hint: 'Visa, Mastercard, RuPay', icon: 'credit-card-outline' },
  { id: 'netbanking', label: 'Net banking', hint: 'All major banks', icon: 'bank-outline' },
  /*
   * Cash is on the same list because it is the same decision — how the advance
   * gets to the organizer — and hiding it under "other options" would make the
   * one path that needs no gateway the hardest to find. It is last because it
   * is the one Evently cannot stand behind.
   */
  { id: 'cash', label: 'Cash', hint: 'Hand it to the organizer', icon: 'cash' },
];

export const PAYMENT_COPY = {
  title: 'Payment',
  payWith: 'Pay with',
  loading: 'Working out what you owe…',
  errorTitle: "We couldn't start this payment",
  retry: 'Try again',
  /*
   * What is actually true.
   *
   * The advance is taken now and the organizer has 48 hours to answer; if they
   * decline or let it lapse, the booking expires and the advance is refunded
   * to the same account. Every clause here is something the code does — the
   * refund is `PaymentService.refundForBooking`, fired on exactly those two
   * transitions. Nothing is "held in escrow", because nothing is.
   */
  assurance:
    'Paid securely through Razorpay. Your organizer has 48 hours to confirm — if they decline or do not respond, your booking expires and the advance is refunded to the same account.',
  /*
   * What is actually true of cash, said plainly.
   *
   * Evently never touches this money, so none of the protection above applies
   * and saying otherwise would be the most expensive lie on this screen. The
   * booking is still real and the organizer still has to answer — that part is
   * the same, and worth saying so the option does not read as second-class.
   */
  cashAssurance:
    'Nothing is charged now. You pay the advance directly to your organizer, and they confirm it in the app once it reaches them. Evently does not hold this money, so it cannot be refunded by us — your organizer still has 48 hours to accept or decline.',
  cashFailed: "We couldn't book that. Nothing has been charged — please try again.",
  /*
   * Said when no gateway is configured.
   *
   * The screen used to fail outright here — "payments are not available" — and
   * take the cash option down with it, which is the one path that does not
   * need a gateway. Now it says which half is unavailable, and leaves the half
   * that works.
   */
  gatewayOff: 'Online payment is unavailable right now. You can still book by paying your organizer directly.',
  /** The path for a customer who wants to settle details before committing. */
  talkFirst: 'Message the organizer first',
  talkFirstHint: 'Your quote stays open — you can pay whenever you are ready.',
  cancelled: 'Payment cancelled. Nothing has been charged.',
  failed: "That payment didn't go through. Nothing has been charged.",
  unavailable: 'Payments are not available right now. Please try again shortly.',
} as const;

export const SUCCESS_COPY = {
  title: 'Payment',
  heading: 'Advance paid',
  /** Filled with the organizer's name and what happens next. */
  body: (organizer: string) =>
    `${organizer} has been notified. They have 48 hours to confirm, and the balance is due before your event.`,
  /*
   * The cash receipt says something different because something different
   * happened: the event is booked, but the advance is still owed. Calling this
   * "Advance paid" would tell the customer money had changed hands when it has
   * not — and the amount is theirs to hand over.
   */
  cashHeading: 'Booked · pay in cash',
  cashBody: (organizer: string) =>
    `${organizer} has been notified and has 48 hours to confirm. Pay them the advance directly — it shows as paid here once they confirm it.`,
  cta: 'Open workspace',
} as const;
