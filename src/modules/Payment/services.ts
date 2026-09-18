import { apiClient } from '../../services/apiClient';
import {
  PAYMENT_CASH_ENDPOINT,
  PAYMENT_ORDER_ENDPOINT,
  PAYMENT_VERIFY_ENDPOINT,
} from './constants';
import type { PaidBookingDTO, PaymentOrderDTO, RazorpayResult } from './types';

/**
 * Starts a payment for an accepted quotation.
 *
 * Only the quotation and, at most, a coupon code go up. What is owed is worked
 * out on the server from the quotation itself, so this app cannot name the
 * amount it is about to be charged.
 */
export async function createPaymentOrder(
  quotationId: string,
  couponCode?: string,
): Promise<PaymentOrderDTO> {
  const { data } = await apiClient.post<PaymentOrderDTO>(PAYMENT_ORDER_ENDPOINT, {
    quotationId,
    ...(couponCode ? { couponCode } : {}),
  });
  return data;
}

/**
 * Confirms the checkout result, and gets back the booking it paid for.
 *
 * The signature is what the server checks; this app is not trusted to report a
 * payment that happened. The booking is created there, in the same call, so
 * there is no moment where the money has moved and no event exists.
 */
/**
 * Books the event with the advance owed to the organizer in cash.
 *
 * No gateway, so there is nothing to verify afterwards — the server writes the
 * booking here and hands it straight back. It still prices the advance itself
 * from the quotation, so this app never names the figure the customer owes.
 */
export async function bookWithCash(
  quotationId: string,
  couponCode?: string,
): Promise<PaidBookingDTO> {
  const { data } = await apiClient.post<PaidBookingDTO>(PAYMENT_CASH_ENDPOINT, {
    quotationId,
    ...(couponCode ? { couponCode } : {}),
  });
  return data;
}

export async function verifyPayment(result: RazorpayResult): Promise<PaidBookingDTO> {
  const { data } = await apiClient.post<PaidBookingDTO>(PAYMENT_VERIFY_ENDPOINT, {
    razorpayOrderId: result.razorpay_order_id,
    razorpayPaymentId: result.razorpay_payment_id,
    razorpaySignature: result.razorpay_signature,
  });
  return data;
}
