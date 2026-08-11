import { useCallback, useState } from 'react';
import { isNormalizedApiError, normalizeError, type NormalizedApiError } from '../services/errors';

interface AsyncCallbackState {
  loading: boolean;
  error: NormalizedApiError | null;
}

export interface AsyncCallbackResult<Args extends unknown[], R> extends AsyncCallbackState {
  execute: (...args: Args) => Promise<R>;
}

/** Generic on-demand async action (e.g. a POST triggered by a button), as opposed to useAsync's on-mount fetch. */
export function useAsyncCallback<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
): AsyncCallbackResult<Args, R> {
  const [state, setState] = useState<AsyncCallbackState>({ loading: false, error: null });

  const execute = useCallback(
    async (...args: Args): Promise<R> => {
      setState({ loading: true, error: null });
      try {
        const result = await fn(...args);
        setState({ loading: false, error: null });
        return result;
      } catch (error: unknown) {
        const normalized = isNormalizedApiError(error) ? error : normalizeError(error);
        setState({ loading: false, error: normalized });
        throw normalized;
      }
    },
    [fn],
  );

  return { ...state, execute };
}
