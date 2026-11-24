/*
 * `/coupon/organizer/*` — the Nest `CouponView` / `RedemptionView` shapes and
 * the `CouponTermsDto` body — then the view models the Coupons screen draws.
 */

export type CouponDiscountType = 'percentage' | 'fixed';

/** Stored status: only on or off. "Expired" is the clock against `endsAt`. */
export type CouponStatusDTO = 'active' | 'disabled';

export type RedemptionStatus = 'redeemed' | 'reversed';

export interface CouponDTO {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: CouponDiscountType;
  /** Percent (1–100) or rupees off, depending on `discountType`. */
  discountValue: number;
  /** Rupee cap on a percentage discount; 0 = uncapped. */
  maxDiscount: number;
  /** 0 = any booking. */
  minBookingAmount: number;
  startsAt: string | null;
  endsAt: string | null;
  /** Total uses allowed; 0 = unlimited. */
  usageLimit: number;
  perCustomerLimit: number;
  usedCount: number;
  status: CouponStatusDTO;
  createdAt: string | null;
}

export interface RedemptionDTO {
  id: string;
  code: string;
  customerName: string;
  bookingRef: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: RedemptionStatus;
  redeemedAt: string | null;
}

/** `POST /coupon/organizer` — `CouponTermsDto`. Blank optionals are left out. */
export interface CouponTermsBody {
  code: string;
  title: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscount?: number;
  minBookingAmount?: number;
  startsAt?: string;
  endsAt?: string;
}

/** What a coupon's chip says, from its status, dates and usage together. */
export type CouponState =
  | 'active'
  | 'scheduled'
  | 'paused'
  | 'usedUp'
  | 'expired';

export interface CouponCardModel {
  id: string;
  code: string;
  title: string;
  /** "20% off · up to ₹5,000". */
  discount: string;
  /** "Bookings over ₹10,000" / "Any booking". */
  minBooking: string;
  /** "Ends 12 Dec" / "Starts 1 Nov" / "Ended 3 Oct" / "No end date". */
  validity: string;
  /** "Used 3 times" / "Used 3 of 50" / "Not used yet". */
  used: string;
  state: CouponState;
  /** The switch: the stored on/off, whatever the dates say. */
  enabled: boolean;
}

export interface UsageRowModel {
  id: string;
  customer: string;
  booking: string;
  code: string;
  discount: string;
  date: string;
  reversed: boolean;
}

export interface CouponsSummary {
  active: number;
  timesUsed: number;
  /** "₹12.5K". */
  discountGiven: string;
}

/** The create form, as typed. Amounts are digit strings; dates `YYYY-MM-DD` or ''. */
export interface CouponForm {
  code: string;
  title: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: string;
  maxDiscount: string;
  minBookingAmount: string;
  startsOn: string;
  endsOn: string;
}

export type CouponFormErrors = Partial<Record<keyof CouponForm, string>>;
