import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from './env';
import { normalizeError } from './errors';
import { REFRESH_ENDPOINT, refreshSession } from './sessionRefresh';
import { store } from '../store';

/**
 * THE single axios instance for the whole app. No module may create its own
 * axios instance or call `fetch` directly — everything goes through this
 * client so auth, base URL and error shape stay consistent everywhere.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

/** Our own marker, so one request is never refreshed-and-retried twice. */
interface RetriableConfig extends InternalAxiosRequestConfig {
  _hasRetriedAfterRefresh?: boolean;
}

/**
 * Sign-in and token-exchange routes. A 401 from one of these is the answer to
 * the request ("wrong OTP", "refresh token rejected"), not an expired session,
 * so it must never trigger a refresh.
 */
const AUTH_ENDPOINTS = ['/auth/sendOtp', '/auth/verifyOtp', '/auth/loginUser', REFRESH_ENDPOINT];

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const config = axios.isAxiosError(error)
      ? (error.config as RetriableConfig | undefined)
      : undefined;
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;

    /*
     * An expired access token is an ordinary fact of life here — the backend
     * signs them for an hour — so it is NOT a sign-out. Trade the refresh
     * token in for a new one and replay the request. Only a refresh the
     * server actually rejects ends the session (refreshSession clears it),
     * which is what makes "stay signed in until I tap logout" hold.
     */
    if (status === 401 && config && !config._hasRetriedAfterRefresh && !isAuthEndpoint(config.url)) {
      config._hasRetriedAfterRefresh = true;
      const token = await refreshSession();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
        return apiClient.request(config);
      }
    }

    return Promise.reject(normalizeError(error));
  },
);
