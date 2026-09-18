import { useCallback, useEffect, useMemo, useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import { PAYMENT_COPY as COPY } from './constants';
import { useBookWithCash, usePaymentOrder, useVerifyPayment } from './hooks';
import { mapPayment } from './utils';
import type {
  GatewayMethod,
  PaidBookingDTO,
  PayMethod,
  PaymentViewModel,
  RazorpayResult,
} from './types';

export interface PaymentContainerResult {
  model: PaymentViewModel | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;

  method: PayMethod;
  setMethod: (method: PayMethod) => void;

  /** True from tapping Pay until the booking comes back or the sheet closes. */
  isPaying: boolean;
  payError: string | null;
  pay: () => void;
  /** True when the chosen method moves no money through Evently. */
  isCash: boolean;
  /** False when no gateway is configured — the online rows are then inert. */
  gatewayAvailable: boolean;
  /** The words on the button — they differ, because the action differs. */
  ctaLabel: string;
  /** The organizer this quote is from, for the "message first" path. */
  organizerName: string;
}

/** Razorpay's own shape for a cancelled or failed checkout. */
interface CheckoutError {
  code?: number;
  description?: string;
}

/**
 * Paying the advance.
 *
 * Three steps, and the middle one is not ours: the server prices the order,
 * Razorpay's sheet takes the money, and the server verifies the signature and
 * writes the booking. This holds the state between them.
 *
 * Nothing here decides what is owed and nothing here decides that a payment
 * succeeded — a client that could do either could book a wedding for nothing.
 */
export function usePaymentContainer(
  quotationId: string,
  couponCode: string | undefined,
  onPaid: (booking: PaidBookingDTO, inCash: boolean) => void,
): PaymentContainerResult {
  const { data, loading, error, refetch } = usePaymentOrder(quotationId, couponCode);
  const verify = useVerifyPayment();
  const cashBooking = useBookWithCash();

  const [method, setMethod] = useState<PayMethod>('upi');
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const model = useMemo(() => (data ? mapPayment(data) : null), [data]);
  /*
   * Absent means available: an older server that does not send the flag is one
   * with a gateway, because it could not have priced the order otherwise.
   */
  const gatewayAvailable = data ? data.gatewayAvailable !== false : true;
  const isCash = method === 'cash';

  /*
   * With no gateway there is one method, so the screen picks it rather than
   * leaving the customer on a UPI row that cannot do anything. Done as an
   * effect on the loaded order — not as initial state — because the order
   * arrives after the first render.
   */
  useEffect(() => {
    if (!gatewayAvailable) setMethod('cash');
  }, [gatewayAvailable]);

  /*
   * Cash never opens the sheet. The server writes the booking with the advance
   * recorded as owed, and the customer settles it with the organizer in
   * person — so there is no payment to verify and nothing for Razorpay to do.
   */
  const payInCash = useCallback(() => {
    if (isPaying) return;
    setIsPaying(true);
    setPayError(null);
    cashBooking
      .execute(quotationId, couponCode)
      .then((booking) => onPaid(booking, true))
      .catch((cause: { message?: string }) => setPayError(cause?.message ?? COPY.cashFailed))
      .finally(() => setIsPaying(false));
  }, [cashBooking, couponCode, isPaying, onPaid, quotationId]);

  const pay = useCallback(() => {
    if (!data || isPaying) return;
    if (isCash) return payInCash();
    if (!gatewayAvailable) return setPayError(COPY.gatewayOff);
    setIsPaying(true);
    setPayError(null);

    RazorpayCheckout.open({
      key: data.keyId,
      order_id: data.orderId,
      amount: data.amountInPaise,
      currency: data.currency,
      name: 'Evently',
      description: `Advance for your event with ${data.organizerName}`,
      /* The method chosen on our screen is what the sheet opens on, so the
         customer is not asked the same question twice. */
      prefill: { method: method as GatewayMethod },
      theme: { color: '#e8633a' },
    })
      .then((result: RazorpayResult) =>
        /*
         * The server is the one that decides this payment happened. It checks
         * the signature, then writes the booking and hands it back — so the
         * screen never navigates on the strength of the sheet's word alone.
         */
        verify.execute(result).then((booking) => onPaid(booking, false)),
      )
      .catch((cause: CheckoutError) => {
        /* Razorpay uses code 0 (and 2) for a customer who closed the sheet.
           That is not a failure and must not read like one. */
        const dismissed = cause?.code === 0 || cause?.code === 2;
        setPayError(dismissed ? COPY.cancelled : (cause?.description ?? COPY.failed));
      })
      .finally(() => setIsPaying(false));
  }, [data, gatewayAvailable, isCash, isPaying, method, onPaid, payInCash, verify]);

  return {
    model,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
    method,
    setMethod,
    isPaying: isPaying || verify.loading || cashBooking.loading,
    payError,
    pay,
    isCash,
    gatewayAvailable,
    ctaLabel: isCash ? (model?.cashCtaLabel ?? '') : (model?.ctaLabel ?? ''),
    organizerName: data?.organizerName ?? '',
  };
}
