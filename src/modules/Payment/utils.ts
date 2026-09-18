import { formatINR } from '../Home/utils';
import type { PaymentOrderDTO, PaymentViewModel } from './types';

/**
 * The money, as the screen states it.
 *
 * Every figure is the server's. Nothing here multiplies a percentage by a
 * total — the advance, the balance and the discount all arrived computed, so
 * the number on the button is the number Razorpay is asked for.
 */
export function mapPayment(order: PaymentOrderDTO): PaymentViewModel {
  return {
    eyebrow: `ADVANCE DUE NOW · ${order.advancePercentage}%`,
    advanceLabel: formatINR(order.advanceAmount),
    totalLine:
      order.balanceAmount > 0
        ? `of ${formatINR(order.totalAmount)} total · ${formatINR(order.balanceAmount)} balance before your event`
        : `of ${formatINR(order.totalAmount)} total`,
    /* Named, so a total lower than the quote the customer accepted explains
       itself rather than looking like a mistake. */
    couponLine:
      order.couponCode && order.couponDiscount > 0
        ? `${order.couponCode} saved ${formatINR(order.couponDiscount)}`
        : '',
    ctaLabel: `Pay ${formatINR(order.advanceAmount)} advance`,
    /* Says "book", not "pay": tapping it moves no money, it commits the
       customer to handing over that amount in person. */
    cashCtaLabel: `Book with ${formatINR(order.advanceAmount)} in cash`,
    organizerName: order.organizerName || 'your organizer',
  };
}
