import {
  couponState,
  digitsOnly,
  discountLine,
  emptyForm,
  endOfDayIso,
  errorMessage,
  isFormDirty,
  mapCoupon,
  mapCoupons,
  mapUsage,
  minBookingLine,
  sanitizeCode,
  startOfDayIso,
  summarize,
  toTermsBody,
  usedLine,
  validateForm,
  validityLine,
} from '../src/organizerModules/Coupons/utils';
import type {
  CouponDTO,
  CouponForm,
  RedemptionDTO,
} from '../src/organizerModules/Coupons/types';

const NOW = new Date(2026, 9, 29, 12, 0); // 29 Oct 2026, local noon
const iso = (y: number, m: number, d: number) =>
  new Date(y, m - 1, d, 12, 0).toISOString();

const coupon = (over: Partial<CouponDTO> = {}): CouponDTO => ({
  id: 'c1',
  code: 'DIWALI20',
  title: 'Diwali special',
  description: '',
  discountType: 'percentage',
  discountValue: 20,
  maxDiscount: 5000,
  minBookingAmount: 10000,
  startsAt: null,
  endsAt: null,
  usageLimit: 0,
  perCustomerLimit: 1,
  usedCount: 0,
  status: 'active',
  createdAt: iso(2026, 10, 1),
  ...over,
});

const redemption = (over: Partial<RedemptionDTO> = {}): RedemptionDTO => ({
  id: 'r1',
  code: 'DIWALI20',
  customerName: 'Asha Rao',
  bookingRef: 'BK-1001',
  originalAmount: 50000,
  discountAmount: 5000,
  finalAmount: 45000,
  status: 'redeemed',
  redeemedAt: iso(2026, 10, 20),
  ...over,
});

const form = (over: Partial<CouponForm> = {}): CouponForm => ({
  ...emptyForm(),
  code: 'DIWALI20',
  title: 'Diwali special',
  discountValue: '20',
  ...over,
});

describe('couponState', () => {
  it('is active when on and inside its window', () => {
    expect(couponState(coupon(), NOW)).toBe('active');
    expect(
      couponState(
        coupon({ startsAt: iso(2026, 10, 1), endsAt: iso(2026, 11, 30) }),
        NOW,
      ),
    ).toBe('active');
  });

  it('is paused when switched off', () => {
    expect(couponState(coupon({ status: 'disabled' }), NOW)).toBe('paused');
  });

  it('is scheduled before its start', () => {
    expect(couponState(coupon({ startsAt: iso(2026, 11, 5) }), NOW)).toBe(
      'scheduled',
    );
  });

  it('is expired after its end, even when switched off', () => {
    const ended = { endsAt: iso(2026, 10, 1) };
    expect(couponState(coupon(ended), NOW)).toBe('expired');
    expect(couponState(coupon({ ...ended, status: 'disabled' }), NOW)).toBe(
      'expired',
    );
  });

  it('is used up when the limit is reached', () => {
    expect(couponState(coupon({ usageLimit: 5, usedCount: 5 }), NOW)).toBe(
      'usedUp',
    );
    expect(couponState(coupon({ usageLimit: 5, usedCount: 4 }), NOW)).toBe(
      'active',
    );
  });
});

describe('labels', () => {
  it('reads a percentage with and without its cap', () => {
    expect(discountLine(coupon())).toBe('20% off · up to ₹5,000');
    expect(discountLine(coupon({ maxDiscount: 0 }))).toBe('20% off');
  });

  it('reads a flat discount in rupees', () => {
    expect(
      discountLine(coupon({ discountType: 'fixed', discountValue: 1500 })),
    ).toBe('₹1,500 off');
  });

  it('reads the minimum booking', () => {
    expect(minBookingLine(coupon())).toBe('Bookings over ₹10,000');
    expect(minBookingLine(coupon({ minBookingAmount: 0 }))).toBe('Any booking');
  });

  it('says the date that matters', () => {
    expect(validityLine(coupon({ endsAt: iso(2026, 12, 12) }), NOW)).toBe(
      'Ends 12 Dec',
    );
    expect(validityLine(coupon({ startsAt: iso(2026, 11, 3) }), NOW)).toBe(
      'Starts 3 Nov',
    );
    expect(validityLine(coupon({ endsAt: iso(2026, 10, 3) }), NOW)).toBe(
      'Ended 3 Oct',
    );
    expect(validityLine(coupon({ endsAt: iso(2027, 1, 5) }), NOW)).toBe(
      'Ends 5 Jan 2027',
    );
    expect(validityLine(coupon(), NOW)).toBe('No end date');
  });

  it('counts uses without inventing a limit', () => {
    expect(usedLine(coupon())).toBe('Not used yet');
    expect(usedLine(coupon({ usedCount: 1 }))).toBe('Used 1 time');
    expect(usedLine(coupon({ usedCount: 3 }))).toBe('Used 3 times');
    expect(usedLine(coupon({ usedCount: 3, usageLimit: 50 }))).toBe(
      'Used 3 of 50',
    );
  });
});

describe('mapping', () => {
  it('maps a coupon to its card', () => {
    expect(mapCoupon(coupon({ status: 'disabled' }), NOW)).toEqual({
      id: 'c1',
      code: 'DIWALI20',
      title: 'Diwali special',
      discount: '20% off · up to ₹5,000',
      minBooking: 'Bookings over ₹10,000',
      validity: 'No end date',
      used: 'Not used yet',
      state: 'paused',
      enabled: false,
    });
  });

  it('puts live coupons first and keeps server order within a state', () => {
    const cards = mapCoupons(
      [
        coupon({ id: 'expired', endsAt: iso(2026, 10, 1) }),
        coupon({ id: 'a1' }),
        coupon({ id: 'paused', status: 'disabled' }),
        coupon({ id: 'a2' }),
      ],
      NOW,
    );
    expect(cards.map(c => c.id)).toEqual(['a1', 'a2', 'paused', 'expired']);
  });

  it('maps usage newest first, marking reversed ones', () => {
    const rows = mapUsage(
      [
        redemption({ id: 'old', redeemedAt: iso(2026, 9, 1) }),
        redemption({ id: 'new', status: 'reversed', customerName: '' }),
      ],
      NOW,
    );
    expect(rows.map(r => r.id)).toEqual(['new', 'old']);
    expect(rows[0]).toMatchObject({
      customer: 'Customer',
      discount: '₹5,000 off',
      date: '20 Oct',
      reversed: true,
    });
  });

  it('summarizes active coupons, uses and the discount that stood', () => {
    const summary = summarize(
      [
        coupon({ usedCount: 2 }),
        coupon({ id: 'c2', status: 'disabled', usedCount: 1 }),
      ],
      [
        redemption(),
        redemption({ id: 'r2', discountAmount: 7500 }),
        redemption({ id: 'r3', status: 'reversed', discountAmount: 9000 }),
      ],
      NOW,
    );
    expect(summary).toEqual({
      active: 1,
      timesUsed: 3,
      discountGiven: '₹13K',
    });
  });
});

describe('the create form', () => {
  it('types codes the way they are stored', () => {
    expect(sanitizeCode('diwali-20 off!')).toBe('DIWALI20OFF');
    expect(sanitizeCode('a'.repeat(30))).toHaveLength(20);
  });

  it('keeps amounts to whole numbers', () => {
    expect(digitsOnly('₹1,500.50')).toBe('150050');
    expect(digitsOnly('007')).toBe('7');
    expect(digitsOnly('0')).toBe('0');
  });

  it('accepts a valid coupon', () => {
    expect(validateForm(form())).toEqual({});
  });

  it('checks the code, title and description limits', () => {
    expect(validateForm(form({ code: 'AB1' })).code).toBeDefined();
    expect(validateForm(form({ code: 'AB-12' })).code).toBeDefined();
    expect(validateForm(form({ code: 'A'.repeat(21) })).code).toBeDefined();
    expect(validateForm(form({ title: 'Hi' })).title).toBeDefined();
    expect(validateForm(form({ title: 'x'.repeat(81) })).title).toBeDefined();
    expect(
      validateForm(form({ description: 'x'.repeat(301) })).description,
    ).toBeDefined();
  });

  it('checks the discount value against its type', () => {
    expect(validateForm(form({ discountValue: '' })).discountValue).toBe(
      'Enter the discount.',
    );
    expect(validateForm(form({ discountValue: '0' })).discountValue).toBe(
      'The discount must be at least 1.',
    );
    expect(validateForm(form({ discountValue: '101' })).discountValue).toBe(
      'A percentage can’t be more than 100.',
    );
    expect(
      validateForm(form({ discountType: 'fixed', discountValue: '101' })),
    ).toEqual({});
    expect(
      validateForm(form({ discountType: 'fixed', discountValue: '1000001' }))
        .discountValue,
    ).toBeDefined();
  });

  it('checks the cap, minimum and dates', () => {
    expect(
      validateForm(form({ maxDiscount: '10000001' })).maxDiscount,
    ).toBeDefined();
    expect(
      validateForm(form({ minBookingAmount: '10000001' })).minBookingAmount,
    ).toBeDefined();
    expect(
      validateForm(form({ startsOn: '2026-11-10', endsOn: '2026-11-09' }))
        .endsOn,
    ).toBeDefined();
    expect(
      validateForm(form({ startsOn: '2026-11-10', endsOn: '2026-11-10' })),
    ).toEqual({});
  });

  it('builds the body, leaving blank optionals out', () => {
    expect(toTermsBody(form({ code: 'diwali20 ', title: ' Diwali ' }))).toEqual(
      {
        code: 'DIWALI20',
        title: 'Diwali',
        discountType: 'percentage',
        discountValue: 20,
      },
    );
  });

  it('sends a cap only with a percentage, and whole days for dates', () => {
    const body = toTermsBody(
      form({
        discountType: 'fixed',
        discountValue: '500',
        maxDiscount: '3000',
        minBookingAmount: '2000',
        description: ' For new customers ',
        startsOn: '2026-11-01',
        endsOn: '2026-11-30',
      }),
    );
    expect(body).toEqual({
      code: 'DIWALI20',
      title: 'Diwali special',
      description: 'For new customers',
      discountType: 'fixed',
      discountValue: 500,
      minBookingAmount: 2000,
      startsAt: startOfDayIso('2026-11-01'),
      endsAt: endOfDayIso('2026-11-30'),
    });
    const start = new Date(body.startsAt as string);
    const end = new Date(body.endsAt as string);
    expect([start.getDate(), start.getHours()]).toEqual([1, 0]);
    expect([end.getDate(), end.getHours(), end.getMinutes()]).toEqual([
      30, 23, 59,
    ]);
    expect(toTermsBody(form({ maxDiscount: '3000' })).maxDiscount).toBe(3000);
  });

  it('knows when something was typed', () => {
    expect(isFormDirty(emptyForm())).toBe(false);
    expect(isFormDirty({ ...emptyForm(), discountType: 'fixed' })).toBe(false);
    expect(isFormDirty({ ...emptyForm(), title: 'x' })).toBe(true);
  });
});

describe('errorMessage', () => {
  it('reads Nest’s message, whether one or a list', () => {
    expect(
      errorMessage({ message: 'That coupon code is already in use.' }, 'x'),
    ).toBe('That coupon code is already in use.');
    expect(
      errorMessage(
        { message: ['code must contain only letters and numbers'] },
        'x',
      ),
    ).toBe('code must contain only letters and numbers');
    expect(errorMessage({ message: [] }, 'fallback')).toBe('fallback');
    expect(errorMessage(null, 'fallback')).toBe('fallback');
  });
});
