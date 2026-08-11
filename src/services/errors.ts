import { AxiosError } from 'axios';

/**
 * Normalized error shape every consumer (hooks, UI) can rely on, regardless
 * of whether the failure came from the network, the server, or a thrown
 * client exception.
 */
export interface NormalizedApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}

interface ServerErrorBody {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

const STATUS_CODE: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION',
  429: 'RATE_LIMITED',
  500: 'SERVER_ERROR',
};

export function normalizeError(error: unknown): NormalizedApiError {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const body = error.response.data as ServerErrorBody | undefined;
      return {
        status,
        code: body?.code ?? STATUS_CODE[status] ?? 'HTTP_ERROR',
        message: body?.message ?? error.message ?? 'The request failed unexpectedly.',
        details: body,
      };
    }
    return {
      status: 0,
      code: error.code === 'ECONNABORTED' ? 'TIMEOUT' : 'NETWORK',
      message: 'Could not reach the server. Check your connection and retry.',
    };
  }

  if (error instanceof Error) {
    return { status: 0, code: 'CLIENT', message: error.message };
  }

  return { status: 0, code: 'UNKNOWN', message: 'An unknown error occurred.' };
}

/**
 * True when `error` is already a `NormalizedApiError` — e.g. one rejected by
 * apiClient's response interceptor. Lets consumers avoid re-normalizing an
 * already-normalized error, which would otherwise fall through to the
 * generic UNKNOWN case and lose the real status/code/message.
 */
export function isNormalizedApiError(error: unknown): error is NormalizedApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'code' in error &&
    'message' in error
  );
}
