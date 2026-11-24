import { formatInr, formatInrCompact } from '../Shared';
import {
  AMOUNT_MAX,
  CODE_MAX,
  CODE_MIN,
  COUPONS_COPY as COPY,
  DESCRIPTION_MAX,
  PERCENT_MAX,
  TITLE_MAX,
  TITLE_MIN,
  USAGE_LIMIT,
  VALUE_MAX,
} from './constants';
import type {
  CouponCardModel,
  CouponDTO,
  CouponForm,
  CouponFormErrors,
  CouponState,
  CouponsSummary,
  CouponTermsBody,
  RedemptionDTO,
  UsageRowModel,
} from './types';

const time = (iso: string | null | undefined): number | null => {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? null : t;
};

/**
 * What the chip says. The server stores only on/off; whether a coupon is over,
 * not yet open or spent is read from its dates and counter, so the chip
 * matches what a customer at checkout would actually find.
 */
export function couponState(c: CouponDTO, now = new Date()): CouponState {
  const at = now.getTime();
  const ends = time(c.endsAt);
  const starts = time(c.startsAt);
  if (ends !== null && ends < at) return 'expired';
  if (c.usageLimit > 0 && c.usedCount >= c.usageLimit) return 'usedUp';
  if (c.status === 'disabled') return 'paused';
  if (starts !== null && starts > at) return 'scheduled';
  return 'active';
}

/** "12 Dec", with the year only when it is not this one. */
export function shortDate(
  iso: string | null | undefined,
  now = new Date(),
): string {
  const t = time(iso);
  if (t === null) return '';
  const date = new Date(t);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' }),
  });
}

/** "20% off · up to ₹5,000" or "₹500 off". */
export function discountLine(
  c: Pick<CouponDTO, 'discountType' | 'discountValue' | 'maxDiscount'>,
): string {
  if (c.discountType === 'fixed')
    return COPY.amountOff(formatInr(c.discountValue));
  const base = COPY.percentOff(c.discountValue);
  return c.maxDiscount > 0
    ? `${base} · ${COPY.upTo(formatInr(c.maxDiscount))}`
    : base;
}

export function minBookingLine(c: Pick<CouponDTO, 'minBookingAmount'>): string {
  return c.minBookingAmount > 0
    ? COPY.minBooking(formatInr(c.minBookingAmount))
    : COPY.anyBooking;
}

/** The one date that matters right now: when it opens, ends, or ended. */
export function validityLine(
  c: Pick<CouponDTO, 'startsAt' | 'endsAt'>,
  now = new Date(),
): string {
  const at = now.getTime();
  const starts = time(c.startsAt);
  const ends = time(c.endsAt);
  if (starts !== null && starts > at)
    return COPY.startsOn(shortDate(c.startsAt, now));
  if (ends !== null) {
    return ends < at
      ? COPY.endedOn(shortDate(c.endsAt, now))
      : COPY.endsOn(shortDate(c.endsAt, now));
  }
  return COPY.noEnd;
}

/** An unlimited coupon reports a count rather than inventing a denominator. */
export function usedLine(
  c: Pick<CouponDTO, 'usedCount' | 'usageLimit'>,
): string {
  if (c.usageLimit > 0) return COPY.usedOf(c.usedCount, c.usageLimit);
  return c.usedCount > 0 ? COPY.usedTimes(c.usedCount) : COPY.notUsed;
}

/** Live coupons first, finished ones last; the server's newest-first within each. */
const STATE_RANK: Record<CouponState, number> = {
  active: 0,
  scheduled: 1,
  paused: 2,
  usedUp: 3,
  expired: 4,
};

export function mapCoupon(c: CouponDTO, now = new Date()): CouponCardModel {
  return {
    id: c.id,
    code: c.code,
    title: c.title,
    discount: discountLine(c),
    minBooking: minBookingLine(c),
    validity: validityLine(c, now),
    used: usedLine(c),
    state: couponState(c, now),
    enabled: c.status === 'active',
  };
}

export function mapCoupons(
  list: CouponDTO[],
  now = new Date(),
): CouponCardModel[] {
  return list
    .map((c, index) => ({ card: mapCoupon(c, now), index }))
    .sort(
      (a, b) =>
        STATE_RANK[a.card.state] - STATE_RANK[b.card.state] ||
        a.index - b.index,
    )
    .map(x => x.card);
}

/** Newest first, capped, so the section stays a glance rather than a ledger. */
export function mapUsage(
  list: RedemptionDTO[],
  now = new Date(),
): UsageRowModel[] {
  return [...list]
    .sort((a, b) => (time(b.redeemedAt) ?? 0) - (time(a.redeemedAt) ?? 0))
    .slice(0, USAGE_LIMIT)
    .map(r => ({
      id: r.id,
      customer: r.customerName?.trim() || 'Customer',
      booking: r.bookingRef ?? '',
      code: r.code,
      discount: COPY.saved(formatInr(r.discountAmount)),
      date: shortDate(r.redeemedAt, now),
      reversed: r.status === 'reversed',
    }));
}

/**
 * The strip at the top. "Times used" is the coupons' own counters, so it agrees
 * with the cards; the money is the ledger's, counting only redemptions that
 * still stand.
 */
export function summarize(
  coupons: CouponDTO[],
  usage: RedemptionDTO[],
  now = new Date(),
): CouponsSummary {
  return {
    active: coupons.filter(c => couponState(c, now) === 'active').length,
    timesUsed: coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0),
    discountGiven: formatInrCompact(
      usage
        .filter(r => r.status !== 'reversed')
        .reduce((sum, r) => sum + (r.discountAmount || 0), 0),
    ),
  };
}

// ---------------------------------------------------------------------------
// The create form
// ---------------------------------------------------------------------------

export function emptyForm(): CouponForm {
  return {
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscount: '',
    minBookingAmount: '',
    startsOn: '',
    endsOn: '',
  };
}

/** Codes are stored upper-cased and are letters and digits only, so type them that way. */
export function sanitizeCode(text: string): string {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, CODE_MAX);
}

/** Whole rupees / percent only — the server takes integers. */
export function digitsOnly(text: string): string {
  return text.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
}

export function isFormDirty(form: CouponForm): boolean {
  const blank = emptyForm();
  return (Object.keys(blank) as Array<keyof CouponForm>).some(
    key => key !== 'discountType' && form[key] !== blank[key],
  );
}

/** `CouponTermsDto`'s rules, plus the service's percentage and date checks. */
export function validateForm(form: CouponForm): CouponFormErrors {
  const errors: CouponFormErrors = {};
  const code = form.code.trim();
  if (!/^[A-Za-z0-9]*$/.test(code)) errors.code = COPY.codeChars;
  else if (code.length < CODE_MIN) errors.code = COPY.codeShort;
  else if (code.length > CODE_MAX) errors.code = COPY.codeLong;

  const title = form.title.trim();
  if (title.length < TITLE_MIN) errors.title = COPY.titleShort;
  else if (title.length > TITLE_MAX) errors.title = COPY.tooLong(TITLE_MAX);

  if (form.description.trim().length > DESCRIPTION_MAX)
    errors.description = COPY.tooLong(DESCRIPTION_MAX);

  const value = form.discountValue.trim();
  const n = Number(value);
  if (!value) errors.discountValue = COPY.valueRequired;
  else if (!Number.isInteger(n) || n < 1) errors.discountValue = COPY.valueMin;
  else if (form.discountType === 'percentage' && n > PERCENT_MAX)
    errors.discountValue = COPY.percentMax;
  else if (n > VALUE_MAX)
    errors.discountValue = COPY.amountMax(formatInr(VALUE_MAX));

  const tooBig = (s: string) => s.trim() !== '' && Number(s) > AMOUNT_MAX;
  if (form.discountType === 'percentage' && tooBig(form.maxDiscount))
    errors.maxDiscount = COPY.amountMax(formatInr(AMOUNT_MAX));
  if (tooBig(form.minBookingAmount))
    errors.minBookingAmount = COPY.amountMax(formatInr(AMOUNT_MAX));

  if (form.startsOn && form.endsOn && form.endsOn < form.startsOn)
    errors.endsOn = COPY.endBeforeStart;
  return errors;
}

/** `YYYY-MM-DD` at local midnight, as an ISO instant. */
export function startOfDayIso(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
}

/** `YYYY-MM-DD` at the last moment of the local day, so "ends 12 Dec" includes the 12th. */
export function endOfDayIso(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
}

/** The POST body. Blank optionals are left out so the server's defaults apply. */
export function toTermsBody(form: CouponForm): CouponTermsBody {
  const body: CouponTermsBody = {
    code: form.code.trim().toUpperCase(),
    title: form.title.trim(),
    discountType: form.discountType,
    discountValue: Number(form.discountValue),
  };
  const description = form.description.trim();
  if (description) body.description = description;
  if (form.discountType === 'percentage' && form.maxDiscount.trim())
    body.maxDiscount = Number(form.maxDiscount);
  if (form.minBookingAmount.trim())
    body.minBookingAmount = Number(form.minBookingAmount);
  if (form.startsOn) body.startsAt = startOfDayIso(form.startsOn);
  if (form.endsOn) body.endsAt = endOfDayIso(form.endsOn);
  return body;
}

/** "Sat, 12 Dec 2026" for a picked `YYYY-MM-DD`. */
export function pickedDateLabel(day: string): string {
  if (!day) return '';
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * The server's own words for a failure. Nest's validation answers with a list
 * of messages; the first is enough to act on.
 */
export function errorMessage(error: unknown, fallback: string): string {
  const message = (error as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) {
    const first = message.find(m => typeof m === 'string' && m.trim());
    return typeof first === 'string' ? first : fallback;
  }
  return typeof message === 'string' && message.trim() ? message : fallback;
}
