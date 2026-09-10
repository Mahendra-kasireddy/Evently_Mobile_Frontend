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
   * Refetched rather than patched locally.
   *
   * Accepting one quote declines the rest and creates a booking, so the whole
   * screen changes state at once. Re-reading it is the only way to be sure the
   * screen shows what the server actually did — guessing at the outcome would
   * risk showing an accepted booking that failed to create.
   */
  const accept = useCallback(
    (quotationId: string) => {
      setAcceptError(null);
      setAcceptingId(quotationId);
      acceptCall
        .execute(quotationId)
        .then(() => refetch())
        .catch((err: { message?: string }) => setAcceptError(err?.message ?? null))
        .finally(() => setAcceptingId(null));
    },
    [acceptCall, refetch],
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
