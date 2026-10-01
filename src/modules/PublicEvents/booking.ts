import { useCallback, useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import { useConfirmBooking, useStartBooking } from './hooks';
import type { ConfirmedBooking } from './types';

/** Razorpay's own shape for a cancelled or failed checkout. */
interface CheckoutError {
  code?: number;
  description?: string;
}

interface RazorpayResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Buying a ticket, end to end.
 *
 * Three steps, and the middle one is not ours — exactly like the advance
 * payment this app already takes. The server prices the sale and holds the
 * seats, Razorpay's sheet takes the money, and the server verifies the
 * signature and mints the tickets.
 *
 * Nothing here decides what is owed and nothing here decides a payment
 * succeeded. The checkout runs on the order id the server opened, and the only
 * thing handed back is Razorpay's signed answer, which the server checks
 * against its own HMAC before a single ticket exists.
 *
 * Reuses `react-native-razorpay`, already in this app for the private booking
 * flow. No second gateway, no second checkout screen.
 */
export function useTicketPurchase() {
  const start = useStartBooking();
  const confirm = useConfirmBooking();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buy = useCallback(
    async (
      eventId: string,
      ticketTypeId: string,
      quantity: number,
      eventTitle: string,
    ): Promise<ConfirmedBooking | null> => {
      if (busy) return null;
      setBusy(true);
      setError(null);

      try {
        const held = await start.execute(eventId, ticketTypeId, quantity);

        /*
         * Nothing to collect — a free ticket, or the server's payments test
         * mode — so it is already confirmed and already has its tickets.
         * Sending somebody to a payment sheet then is a dead end with a
         * gateway at the bottom of it.
         */
        if (!held.payment) {
          return {
            bookingId: held.bookingId,
            reference: held.reference,
            status: held.status,
            paymentStatus: 'paid',
            amount: held.amount ?? 0,
            quantity,
            ticketIds: held.ticketIds,
          };
        }

        const result = (await RazorpayCheckout.open({
          key: held.payment.keyId,
          order_id: held.payment.orderId,
          amount: held.amountInPaise ?? Math.round(held.amount * 100),
          currency: held.payment.currency,
          name: 'Evently',
          description: `${quantity} × ticket · ${eventTitle}`,
          theme: { color: '#e8633a' },
        })) as RazorpayResult;

        return await confirm.execute(held.bookingId, {
          razorpayOrderId: result.razorpay_order_id,
          razorpayPaymentId: result.razorpay_payment_id,
          razorpaySignature: result.razorpay_signature,
        });
      } catch (cause) {
        const e = cause as CheckoutError & { message?: string };
        /* Razorpay uses code 0 (and 2) for a customer who closed the sheet.
           That is not a failure and must not read like one. */
        const dismissed = e?.code === 0 || e?.code === 2;
        setError(
          dismissed
            ? 'Payment cancelled. Your seats were released.'
            : e?.description ??
                e?.message ??
                'That payment could not be completed. Nothing has been charged.',
        );
        return null;
      } finally {
        setBusy(false);
      }
    },
    [busy, confirm, start],
  );

  return {
    buy,
    busy: busy || start.loading || confirm.loading,
    error,
    clearError: () => setError(null),
  };
}
