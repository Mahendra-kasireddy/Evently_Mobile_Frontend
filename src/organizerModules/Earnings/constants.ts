import type { EarningsPeriod } from './types';

export const EARNINGS_ENDPOINT = '/booking/organizer/earnings';

export const PERIODS: EarningsPeriod[] = ['month', 'quarter', 'all'];

/** The event-mix colours, in order. */
export const MIX_COLORS = [
  '#e8633a',
  '#6d4df2',
  '#0f8a68',
  '#2b5aa8',
  '#d35d7e',
  '#c7741a',
];

export const EARNINGS_COPY = {
  title: 'Earnings',
  loading: 'Loading your earnings…',
  error: 'We couldn’t load your earnings.',
  retry: 'Try again',

  periods: {
    month: 'This month',
    quarter: '3 months',
    all: 'All time',
  } as Record<EarningsPeriod, string>,

  net: 'Your earnings',
  netHint: 'After Evently’s commission',
  paidOut: 'Paid out',
  pending: 'Pending',
  gross: 'Total booked',
  commission: (rate: string) => `Commission · ${rate}`,

  monthly: 'Last 6 months',
  monthlyEmpty: 'No earnings recorded yet.',
  mix: 'Where your bookings come from',

  coupons: 'Coupons',
  couponsHint: 'Offer a discount to win more bookings',

  payments: 'Payments',
  paymentsEmpty: 'Nothing in this period',
  paymentsEmptyHint: 'Switch to All time to see earlier bookings.',
  noneTitle: 'No earnings yet',
  noneBody: 'Confirmed bookings and their payouts will show up here.',
  paid: 'Paid',
  pendingChip: 'Pending',
  youGet: (net: string) => `You get ${net}`,
} as const;
