import { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { bookWithCash, createPaymentOrder, verifyPayment } from './services';

/**
 * The order is created on mount.
 *
 * Deliberately: the screen cannot state what is owed until the server has
 * priced it, and pricing it is also what proves the quotation is still
 * payable — accepted, unexpired, and the customer's own.
 */
export function usePaymentOrder(quotationId: string, couponCode?: string) {
  const load = useCallback(
    () => createPaymentOrder(quotationId, couponCode),
    [quotationId, couponCode],
  );
  return useAsync(load, [quotationId, couponCode]);
}

export function useVerifyPayment() {
  return useAsyncCallback(verifyPayment);
}

export function useBookWithCash() {
  return useAsyncCallback(bookWithCash);
}
