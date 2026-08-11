import { useCallback, useEffect, useRef, useState } from 'react';
import { isNormalizedApiError, normalizeError, type NormalizedApiError } from '../services/errors';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: NormalizedApiError | null;
}

export interface AsyncResult<T> extends AsyncState<T> {
  refetch: () => void;
}

/** Generic async-fetch state: runs `fn` on mount and on every `refetch()`. */
export function useAsync<T>(fn: () => Promise<T>, deps: ReadonlyArray<unknown> = []): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const isMounted = useRef(true);

  const run = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    fn()
      .then((data) => {
        if (isMounted.current) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        const normalized = isNormalizedApiError(error) ? error : normalizeError(error);
        if (isMounted.current) setState({ data: null, loading: false, error: normalized });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    isMounted.current = true;
    run();
    return () => {
      isMounted.current = false;
    };
  }, [run]);

  return { ...state, refetch: run };
}
