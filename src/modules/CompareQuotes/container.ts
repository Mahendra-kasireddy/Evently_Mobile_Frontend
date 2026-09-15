import { useCallback, useMemo, useState } from 'react';
import { useAcceptQuotation, useQuoteRequest } from './hooks';
import { mapCompare } from './utils';
import type { CompareViewModel } from './types';

export interface CompareContainerResult {
  model: CompareViewModel | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  /** The quote currently being accepted, if any. */
  acceptingId: string | null;
  acceptError: string | null;
  accept: (quotationId: string) => void;
  refetch: () => void;
}

export function useCompareContainer(
  requestId: string,
  fallbackTitle: string,
  /** Called once a quote is accepted, so the screen can send them to pay. */
  onAccepted?: (quotationId: string) => void,
): CompareContainerResult {
  const { data, loading, error, refetch } = useQuoteRequest(requestId);
  const acceptCall = useAcceptQuotation();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  const model = useMemo<CompareViewModel | null>(
    () => (data ? mapCompare(data, fallbackTitle) : null),
    [data, fallbackTitle],
  );

  /*
   * Refetched rather than patched locally, and the caller is told.
   *
   * Accepting one quote declines the rest, so the whole screen changes state
   * at once and re-reading it is the only way to be sure it shows what the
   * server actually did. It does not create a booking: nothing is booked until
   * the advance is paid, which is where `onAccepted` sends the customer.
   */
  const accept = useCallback(
    (quotationId: string) => {
      setAcceptError(null);
      setAcceptingId(quotationId);
      acceptCall
        .execute(quotationId)
        .then(() => {
          refetch();
          onAccepted?.(quotationId);
        })
        .catch((err: { message?: string }) => setAcceptError(err?.message ?? null))
        .finally(() => setAcceptingId(null));
    },
    [acceptCall, onAccepted, refetch],
  );

  return {
    model,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    acceptingId,
    acceptError,
    accept,
    refetch,
  };
}
