/*
 * `GET /booking/organizer/earnings`, then the view models the Earnings screen
 * draws. Only the fields this screen reads are typed.
 */

export type PayoutStatus = 'pending' | 'paid';

export interface EarningsDTO {
  totalEarned: number;
  commission: number;
  netPayout: number;
  pendingPayout: number;
  /** 0.12 = 12%. */
  commissionRate: number;
  /** This month and the five before it, oldest first. */
  monthlyEarnings: Array<{ label: string; amount: number }>;
  eventMix: Array<{ occasion: string; percent: number }>;
  transactions: Array<{
    id: string;
    ref: string;
    customerName: string;
    eventDate: string;
    amount: number;
    commission: number;
    net: number;
    payoutStatus: PayoutStatus;
  }>;
}

export type EarningsPeriod = 'month' | 'quarter' | 'all';

export interface EarningsSummary {
  net: string;
  paid: string;
  pending: string;
  gross: string;
  commission: string;
  /** "12%". */
  rate: string;
  /** "+18% vs last month" — '' for All time or with nothing to compare. */
  change: string;
  changeUp: boolean;
}

export interface MonthBar {
  label: string;
  amount: number;
  /** "₹1.2L" — shown above the current month only. */
  short: string;
  /** 0–1 of the tallest month. */
  height: number;
  current: boolean;
}

export interface MixSlice {
  occasion: string;
  percent: number;
  color: string;
}

export interface PaymentItem {
  id: string;
  customerName: string;
  ref: string;
  date: string;
  amount: string;
  net: string;
  paid: boolean;
}
