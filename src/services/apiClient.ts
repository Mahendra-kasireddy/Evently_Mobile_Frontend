import axios, { type AxiosInstance } from 'axios';
import { env } from './env';
import { normalizeError } from './errors';
import { store } from '../store';
import { setToken } from '../store/authSlice';

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

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const normalized = normalizeError(error);

    // Token rejected/expired: drop it so the app falls back to unauthenticated.
    if (normalized.status === 401) {
      store.dispatch(setToken(null));
    }

    return Promise.reject(normalized);
  },
);
