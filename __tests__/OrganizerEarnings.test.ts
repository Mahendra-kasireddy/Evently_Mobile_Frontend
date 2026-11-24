import {
  mixSlices,
  monthBars,
  paymentItems,
  summarize,
  transactionsFor,
} from '../src/organizerModules/Earnings/utils';
import type { EarningsDTO } from '../src/organizerModules/Earnings/types';

const NOW = new Date(2026, 9, 29, 12, 0); // 29 Oct 2026

const txn = (
  id: string,
  eventDate: string,
  amount: number,
  payoutStatus: 'paid' | 'pending',
): EarningsDTO['transactions'][number] => ({
  id,
  ref: `EVT-${id}`,
  customerName: `Customer ${id}`,
  eventDate,
  amount,
  commission: amount * 0.1,
  net: amount * 0.9,
  payoutStatus,
});

const data: EarningsDTO = {
  totalEarned: 0,
  commission: 0,
  netPayout: 0,
  pendingPayout: 0,
  commissionRate: 0.1,
  monthlyEarnings: [
    { label: 'May', amount: 0 },
    { label: 'Jun', amount: 50000 },
    { label: 'Jul', amount: 0 },
    { label: 'Aug', amount: 100000 },
    { label: 'Sep', amount: 100000 },
    { label: 'Oct', amount: 200000 },
  ],
  eventMix: [
    { occasion: 'Birthday', percent: 25 },
    { occasion: 'Wedding', percent: 75 },
    { occasion: 'Other', percent: 0 },
  ],
  transactions: [
    txn('a', '2026-10-05T00:00:00.000Z', 100000, 'paid'),
    txn('b', '2026-10-20T00:00:00.000Z', 100000, 'pending'),
    txn('c', '2026-09-10T00:00:00.000Z', 100000, 'paid'),
    txn('d', '2026-08-01T00:00:00.000Z', 100000, 'paid'),
    txn('e', '2026-03-01T00:00:00.000Z', 100000, 'paid'),
  ],
};

describe('periods', () => {
  it('picks this month, the last three months, or everything', () => {
    expect(transactionsFor(data, 'month', NOW).map(t => t.id)).toEqual(['a', 'b']);
    expect(transactionsFor(data, 'quarter', NOW).map(t => t.id)).toEqual(['a', 'b', 'c', 'd']);
    expect(transactionsFor(data, 'all', NOW)).toHaveLength(5);
  });
});

describe('summary', () => {
  it('adds up the period and splits paid from pending', () => {
    expect(summarize(data, 'month', NOW)).toMatchObject({
      net: '₹1,80,000',
      paid: '₹90,000',
      pending: '₹90,000',
      gross: '₹2,00,000',
      commission: '₹20,000',
      rate: '10%',
    });
  });

  it('compares with the month before', () => {
    // October net 1,80,000 against September 90,000.
    expect(summarize(data, 'month', NOW)).toMatchObject({
      change: '+100% vs last month',
      changeUp: true,
    });
  });

  it('has no comparison for All time', () => {
    expect(summarize(data, 'all', NOW).change).toBe('');
  });
});

describe('charts', () => {
  it('scales the bars to the best month and marks this month', () => {
    const bars = monthBars(data);
    expect(bars.map(b => b.height)).toEqual([0, 0.25, 0, 0.5, 0.5, 1]);
    expect(bars[5]).toMatchObject({ current: true, short: '₹2L' });
    expect(bars[0].current).toBe(false);
  });

  it('orders the event mix biggest first and drops empty slices', () => {
    expect(mixSlices(data).map(s => [s.occasion, s.percent])).toEqual([
      ['Wedding', 75],
      ['Birthday', 25],
    ]);
  });
});

describe('payments', () => {
  it('says what the organizer gets and whether it is paid out', () => {
    expect(paymentItems([data.transactions[1]])[0]).toMatchObject({
      customerName: 'Customer b',
      ref: 'EVT-b',
      amount: '₹1,00,000',
      net: 'You get ₹90,000',
      paid: false,
    });
  });
});
