import axios from 'axios';
import { env } from './env';
import { store } from '../store';
import { clearSession, setSession } from '../store/authSlice';

/**
 * Silent session renewal.
 *
 * The backend signs access tokens for an hour (jwt.accessExpiresIn) and
 * refresh tokens for a week, and rotates the refresh token on every use. The
 * app therefore has to trade the refresh token in whenever an access token
 * expires — otherwise someone who signed in yesterday is bounced back to the
 * login screen on their next tap, which is not a logout they asked for.
 *
 * This deliberately uses a BARE axios instance: apiClient's own response
 * interceptor is what calls in here, so routing the refresh through apiClient
 * would recurse the first time a refresh itself 401s.
 */

export const REFRESH_ENDPOINT = '/auth/refreshToken';

interface RefreshResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
}

/**
 * Exported only so tests can install an adapter on it; nothing in the app
 * should issue requests through it directly.
 */
export const refreshClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * In-flight refresh, shared by every request that 401s at the same time.
 * Home alone fires several calls on mount; without this they would each spend
 * the refresh token, and rotation means only the first would succeed — the
 * rest would come back "Refresh token rejected" and drop the session.
 */
let inFlight: Promise<string | null> | null = null;

async function requestNewSession(refreshToken: string): Promise<string | null> {
  try {
    const { data } = await refreshClient.post<RefreshResponse>(
      REFRESH_ENDPOINT,
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    );
    const token = data.accessToken ?? data.token ?? null;
    if (!token) {
      store.dispatch(clearSession());
      return null;
    }
    store.dispatch(setSession({ token, refreshToken: data.refreshToken ?? refreshToken }));
    return token;
  } catch (error) {
    /*
     * Only a definite answer from the server ends the session. A timeout or a
     * dead connection means we simply don't know yet, and signing someone out
     * because their train went into a tunnel is the bug this whole module
     * exists to fix — the stored refresh token stays put and the next attempt
     * tries again.
     */
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status === 401 || status === 403) {
      store.dispatch(clearSession());
    }
    return null;
  }
}

/**
 * Returns a fresh access token, or null when the session genuinely cannot be
 * renewed. Concurrent callers share one network round-trip.
 */
export function refreshSession(): Promise<string | null> {
  if (inFlight) return inFlight;

  const refreshToken = store.getState().auth.refreshToken;
  if (!refreshToken) {
    // Nothing to renew with (e.g. a session stored by an older build). The
    // access token in hand is already rejected, so the session is over.
    store.dispatch(clearSession());
    return Promise.resolve(null);
  }

  inFlight = requestNewSession(refreshToken).finally(() => {
    inFlight = null;
  });
  return inFlight;
}
