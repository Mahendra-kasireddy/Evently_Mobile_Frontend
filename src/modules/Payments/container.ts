import { useMemo } from 'react';
import { useMyBookings } from '../Booking/hooks';
import { mapPayments, summarise } from './utils';
import type { PaymentItem, PaymentsSummary } from './types';

export interface PaymentsContainerResult {
  items: PaymentItem[];
  summary: PaymentsSummary;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

/** Reuses the bookings fetch — this screen is a second reading of that list. */
export function usePaymentsContainer(): PaymentsContainerResult {
  const { data, loading, error, refetch } = useMyBookings();

  const items = useMemo<PaymentItem[]>(() => (data ? mapPayments(data) : []), [data]);
  const summary = useMemo(() => summarise(items), [items]);

  return {
    items,
    summary,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
  };
}
