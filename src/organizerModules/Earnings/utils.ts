import { formatInr, formatInrCompact } from '../Shared';
import { EARNINGS_COPY as COPY, MIX_COLORS } from './constants';
import type {
  EarningsDTO,
  EarningsPeriod,
  EarningsSummary,
  MixSlice,
  MonthBar,
  PaymentItem,
} from './types';

type Txn = EarningsDTO['transactions'][number];

/** First day of the month `back` months before now (0 = this month), as YYYY-MM-DD. */
function monthStart(now: Date, back: number): string {
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - back, 1));
  return d.toISOString().slice(0, 10);
}

/** [from, to) day bounds of a period, `shift` periods back; null for All time. */
function bounds(
  period: EarningsPeriod,
  now: Date,
  shift = 0,
): [string, string] | null {
  if (period === 'all') return null;
  const span = period === 'month' ? 1 : 3;
  return [
    monthStart(now, span * (shift + 1) - 1),
    monthStart(now, span * shift - 1),
  ];
}

function inRange(t: Txn, range: [string, string] | null): boolean {
  if (!range) return true;
  const day = (t.eventDate ?? '').slice(0, 10);
  return day >= range[0] && day < range[1];
}

export function transactionsFor(
  data: EarningsDTO,
  period: EarningsPeriod,
  now = new Date(),
): Txn[] {
  const range = bounds(period, now);
  return (data.transactions ?? []).filter(t => inRange(t, range));
}

/**
 * The headline numbers for the period, worked out from the bookings on screen
 * so they always add up to the list beneath them — and the change against the
 * period just before.
 */
export function summarize(
  data: EarningsDTO,
  period: EarningsPeriod,
  now = new Date(),
): EarningsSummary {
  const txns = transactionsFor(data, period, now);
  const sum = (list: Txn[], key: 'amount' | 'commission' | 'net') =>
    list.reduce((total, t) => total + (t[key] ?? 0), 0);
  const net = sum(txns, 'net');
  const pending = sum(
    txns.filter(t => t.payoutStatus !== 'paid'),
    'net',
  );

  let change = '';
  let changeUp = true;
  const prevRange = bounds(period, now, 1);
  if (prevRange) {
    const before = sum(
      (data.transactions ?? []).filter(t => inRange(t, prevRange)),
      'net',
    );
    if (before > 0) {
      const pct = Math.round(((net - before) / before) * 100);
      changeUp = pct >= 0;
      change = `${pct >= 0 ? '+' : ''}${pct}% vs last ${
        period === 'month' ? 'month' : '3 months'
      }`;
    }
  }

  return {
    net: formatInr(net),
    paid: formatInr(net - pending),
    pending: formatInr(pending),
    gross: formatInr(sum(txns, 'amount')),
    commission: formatInr(sum(txns, 'commission')),
    rate: `${Math.round((data.commissionRate ?? 0) * 100)}%`,
    change,
    changeUp,
  };
}

export function monthBars(data: EarningsDTO): MonthBar[] {
  const months = data.monthlyEarnings ?? [];
  const max = Math.max(0, ...months.map(m => m.amount));
  return months.map((m, i) => ({
    label: m.label,
    amount: m.amount,
    short: m.amount > 0 ? formatInrCompact(m.amount) : '',
    height: max > 0 ? m.amount / max : 0,
    current: i === months.length - 1,
  }));
}

export function mixSlices(data: EarningsDTO): MixSlice[] {
  return [...(data.eventMix ?? [])]
    .filter(s => s.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .map((s, i) => ({
      occasion: s.occasion,
      percent: s.percent,
      color: MIX_COLORS[i % MIX_COLORS.length],
    }));
}

export function paymentItems(txns: Txn[]): PaymentItem[] {
  return txns.map(t => {
    const date = t.eventDate ? new Date(t.eventDate) : null;
    return {
      id: t.id,
      customerName: t.customerName || 'Customer',
      ref: t.ref,
      date:
        date && !Number.isNaN(date.getTime())
          ? date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '',
      amount: formatInr(t.amount),
      net: COPY.youGet(formatInr(t.net)),
      paid: t.payoutStatus === 'paid',
    };
  });
}
