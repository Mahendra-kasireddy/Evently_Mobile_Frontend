import type { CouponState } from './types';

export const COUPONS_MINE_ENDPOINT = '/coupon/organizer/mine';
export const COUPONS_USAGE_ENDPOINT = '/coupon/organizer/usage';
export const COUPONS_CREATE_ENDPOINT = '/coupon/organizer';
/** Its own route on the server, so an edit can never quietly re-enable a coupon. */
export const couponStatusEndpoint = (id: string) =>
  `/coupon/organizer/${encodeURIComponent(id)}/status`;

/* `CouponTermsDto`'s limits, checked before anything is sent. */
export const CODE_MIN = 4;
export const CODE_MAX = 20;
export const TITLE_MIN = 3;
export const TITLE_MAX = 80;
export const DESCRIPTION_MAX = 300;
export const VALUE_MAX = 1_000_000;
export const PERCENT_MAX = 100;
export const AMOUNT_MAX = 10_000_000;

/** Usage rows shown before the list stops; the newest come first. */
export const USAGE_LIMIT = 20;

export const COUPONS_COPY = {
  title: 'Coupons',
  loading: 'Loading your coupons…',
  error: 'We couldn’t load your coupons.',
  retry: 'Try again',

  create: 'Create coupon',
  liveNote: 'Coupons go live as soon as you create them.',

  summaryActive: 'Active',
  summaryUsed: 'Times used',
  summaryGiven: 'Discount given',

  listTitle: 'Your coupons',
  emptyTitle: 'No coupons yet',
  emptyBody:
    'Create one to win more bookings — customers apply it at checkout.',

  states: {
    active: 'Active',
    scheduled: 'Scheduled',
    paused: 'Paused',
    usedUp: 'Used up',
    expired: 'Expired',
  } as Record<CouponState, string>,
  switchLabel: 'Customers can use it',
  switchOff: 'Turned off',
  toggleFailed: 'We couldn’t change that coupon. Please try again.',

  percentOff: (value: number) => `${value}% off`,
  upTo: (cap: string) => `up to ${cap}`,
  amountOff: (amount: string) => `${amount} off`,
  minBooking: (amount: string) => `Bookings over ${amount}`,
  anyBooking: 'Any booking',
  endsOn: (date: string) => `Ends ${date}`,
  startsOn: (date: string) => `Starts ${date}`,
  endedOn: (date: string) => `Ended ${date}`,
  noEnd: 'No end date',
  notUsed: 'Not used yet',
  usedTimes: (n: number) => `Used ${n} ${n === 1 ? 'time' : 'times'}`,
  usedOf: (n: number, limit: number) => `Used ${n} of ${limit}`,

  usageTitle: 'Usage',
  reversed: 'Reversed',
  saved: (amount: string) => `${amount} off`,

  // The create form.
  formTitle: 'New coupon',
  close: 'Close',
  code: 'Coupon code',
  codePh: 'e.g. DIWALI20',
  codeHint: 'Letters and numbers only. Customers type this at checkout.',
  name: 'Title',
  namePh: 'e.g. Diwali special',
  description: 'Description (optional)',
  descriptionPh: 'Anything customers should know',
  discountType: 'Discount type',
  typePercent: '% off',
  typeFixed: '₹ off',
  valuePercent: 'Percent off',
  valuePercentPh: 'e.g. 10',
  valueFixed: 'Amount off (₹)',
  valueFixedPh: 'e.g. 2000',
  maxDiscount: 'Maximum discount (₹)',
  maxDiscountPh: 'No limit',
  maxDiscountHint: 'Caps the discount on big bookings. Leave blank for no cap.',
  minBookingField: 'Minimum booking amount (₹)',
  minBookingPh: 'No minimum',
  startsField: 'Starts',
  startsBlank: 'Right away',
  endsField: 'Ends',
  endsBlank: 'No end date',
  pickStart: 'Coupon starts on',
  pickEnd: 'Coupon ends on',
  clearDate: 'Clear date',
  saving: 'Creating…',
  saveFailed: 'We couldn’t create the coupon. Please try again.',
  fixFields: 'Please fix the highlighted fields.',
  discardTitle: 'Discard this coupon?',
  discardBody: 'What you’ve entered will be lost.',
  keepEditing: 'Keep editing',
  discard: 'Discard',
  count: (n: number, max: number) => `${n}/${max}`,

  // Validation.
  codeShort: `Use at least ${CODE_MIN} characters.`,
  codeLong: `Use at most ${CODE_MAX} characters.`,
  codeChars: 'Use letters and numbers only.',
  titleShort: `Use at least ${TITLE_MIN} characters.`,
  tooLong: (max: number) => `Keep it under ${max} characters.`,
  valueRequired: 'Enter the discount.',
  valueMin: 'The discount must be at least 1.',
  percentMax: `A percentage can’t be more than ${PERCENT_MAX}.`,
  amountMax: (max: string) => `Must be ${max} or less.`,
  endBeforeStart: 'The end date must be on or after the start date.',
} as const;
