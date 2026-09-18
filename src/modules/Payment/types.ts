/** POST /payment/order — what the advance is, and the order to pay it with. */
export interface PaymentOrderDTO {
  orderId: string;
  /** Paise. Razorpay's checkout is given this; the screen never shows it. */
  amountInPaise: number;
  currency: 'INR';
  /** The publishable key. The secret stays on the server. */
  keyId: string;
  advanceAmount: number;
  totalAmount: number;
  balanceAmount: number;
  advancePercentage: number;
  couponCode: string;
  couponDiscount: number;
  organizerName: string;
  /**
   * Whether online payment is possible at all.
   *
   * False means `orderId` and `keyId` are empty — the amounts above are still
   * real, because they are read from the quotation, but Razorpay cannot be
   * opened. Cash needs no gateway, so it remains.
   */
  gatewayAvailable?: boolean;
}

/** What Razorpay's checkout hands back, and what the server verifies. */
export interface RazorpayResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** The booking the verified payment produced. */
export interface PaidBookingDTO {
  id: string;
  ref: string;
  organizer: { id: string; name: string } | null;
}

/**
  * How the advance is settled.
  *
  * The first three open Razorpay's sheet. `cash` does not: the customer hands
  * the money to the organizer, so nothing is charged here and nothing is held.
  */
export type PayMethod = 'upi' | 'card' | 'netbanking' | 'cash';

/** The three that go through the gateway. */
export type GatewayMethod = Exclude<PayMethod, 'cash'>;

/** One row of the "Pay with" list. */
export interface PayOption {
  id: PayMethod;
  label: string;
  hint: string;
  icon: string;
}

/** The money, as the screen states it. */
export interface PaymentViewModel {
  /** "ADVANCE DUE NOW · 30%". */
  eyebrow: string;
  advanceLabel: string;
  /** "of ₹6,84,000 total · balance before the event". */
  totalLine: string;
  /** "FESTIVE10 saved ₹20,000", or '' when no coupon was applied. */
  couponLine: string;
  /** "Pay ₹2,05,200 advance". */
  ctaLabel: string;
  /** "Book with ₹2,05,200 in cash" — the same money, handed over instead. */
  cashCtaLabel: string;
  organizerName: string;
}
