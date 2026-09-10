import { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { acceptQuotation, fetchQuoteRequest } from './services';

export function useQuoteRequest(requestId: string) {
  const load = useCallback(() => fetchQuoteRequest(requestId), [requestId]);
  return useAsync(load, [requestId]);
}

export function useAcceptQuotation() {
  return useAsyncCallback(acceptQuotation);
}
