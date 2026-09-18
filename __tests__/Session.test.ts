/**
 * @format
 *
 * Staying signed in.
 *
 * The backend signs access tokens for an hour and refresh tokens for a week,
 * so an expired access token is an ordinary event, not a logout. The rule
 * these tests hold the client to is the one the product promises: nothing
 * short of tapping "Log out" — or a refresh token the server itself rejects —
 * ends a session. A 401 on a Tuesday morning, or a dead connection in a
 * tunnel, must not put someone back on the login screen.
 */

import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError, AxiosHeaders } from 'axios';

import { apiClient } from '../src/services/apiClient';
import { refreshClient } from '../src/services/sessionRefresh';
import { store } from '../src/store';
import { clearSession, setSession } from '../src/store/authSlice';

function ok(config: InternalAxiosRequestConfig, data: unknown = {}): AxiosResponse {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config,
  };
}

function httpError(config: InternalAxiosRequestConfig, status: number): AxiosError {
  return new AxiosError('Request failed', String(status), config, {}, {
    data: {},
    status,
    statusText: 'Error',
    headers: new AxiosHeaders(),
    config,
  } as AxiosResponse);
}

function networkError(config: InternalAxiosRequestConfig): AxiosError {
  return new AxiosError('Network Error', 'ECONNABORTED', config, {});
}

/** The Authorization header the request interceptor put on a call. */
function authHeaderOf(config: InternalAxiosRequestConfig): string | undefined {
  const value = config.headers?.get?.('Authorization');
  return typeof value === 'string' ? value : undefined;
}

const originalApiAdapter = apiClient.defaults.adapter;
const originalRefreshAdapter = refreshClient.defaults.adapter;

afterEach(() => {
  apiClient.defaults.adapter = originalApiAdapter;
  refreshClient.defaults.adapter = originalRefreshAdapter;
  store.dispatch(clearSession());
});

function signedIn(): void {
  store.dispatch(setSession({ token: 'access-1', refreshToken: 'refresh-1' }));
}

describe('an expired access token', () => {
  it('is renewed silently and the original request is replayed', async () => {
    signedIn();
    const sent: string[] = [];

    const apiAdapter: AxiosAdapter = async (config) => {
      sent.push(authHeaderOf(config) ?? '');
      if (sent.length === 1) throw httpError(config, 401);
      return ok(config, { ok: true });
    };
    apiClient.defaults.adapter = apiAdapter;
    refreshClient.defaults.adapter = async (config) =>
      ok(config, { accessToken: 'access-2', refreshToken: 'refresh-2' });

    const { data } = await apiClient.get('/home/feed');

    expect(data).toEqual({ ok: true });
    // The replay carries the NEW token, not the one that just 401'd.
    expect(sent).toEqual(['Bearer access-1', 'Bearer access-2']);
    expect(store.getState().auth.token).toBe('access-2');
    // The backend rotates on every refresh; the client has to keep the new one
    // or the following refresh is rejected as a reused token.
    expect(store.getState().auth.refreshToken).toBe('refresh-2');
  });

  it('never signs the person out on its own', async () => {
    signedIn();
    apiClient.defaults.adapter = async (config) => {
      if (authHeaderOf(config) === 'Bearer access-1') throw httpError(config, 401);
      return ok(config);
    };
    refreshClient.defaults.adapter = async (config) => ok(config, { accessToken: 'access-2' });

    await apiClient.get('/user/getUserDetails');

    expect(store.getState().auth.token).not.toBeNull();
  });

  it('is refreshed once, not once per request, when several calls expire together', async () => {
    signedIn();
    let refreshes = 0;

    apiClient.defaults.adapter = async (config) => {
      if (authHeaderOf(config) === 'Bearer access-1') throw httpError(config, 401);
      return ok(config, { url: config.url });
    };
    refreshClient.defaults.adapter = async (config) => {
      refreshes += 1;
      return ok(config, { accessToken: 'access-2', refreshToken: 'refresh-2' });
    };

    await Promise.all([
      apiClient.get('/home/feed'),
      apiClient.get('/user/getUserDetails'),
      apiClient.get('/booking/list'),
    ]);

    /*
     * Home fires several calls the moment it mounts. One refresh token spent
     * three times means two rejections — and a rejected refresh reads as
     * token theft to the backend, which drops the session outright.
     */
    expect(refreshes).toBe(1);
  });
});

describe('the session ends', () => {
  it('when the server rejects the refresh token', async () => {
    signedIn();
    apiClient.defaults.adapter = async (config) => {
      throw httpError(config, 401);
    };
    refreshClient.defaults.adapter = async (config) => {
      throw httpError(config, 401);
    };

    await expect(apiClient.get('/home/feed')).rejects.toMatchObject({ status: 401 });

    expect(store.getState().auth.token).toBeNull();
    expect(store.getState().auth.refreshToken).toBeNull();
  });

  it('when there is no refresh token to renew with', async () => {
    store.dispatch(setSession({ token: 'access-1', refreshToken: null }));
    apiClient.defaults.adapter = async (config) => {
      throw httpError(config, 401);
    };

    await expect(apiClient.get('/home/feed')).rejects.toMatchObject({ status: 401 });

    expect(store.getState().auth.token).toBeNull();
  });
});

describe('the session survives', () => {
  it('a refresh that could not reach the server', async () => {
    signedIn();
    apiClient.defaults.adapter = async (config) => {
      throw httpError(config, 401);
    };
    refreshClient.defaults.adapter = async (config) => {
      throw networkError(config);
    };

    await expect(apiClient.get('/home/feed')).rejects.toBeDefined();

    // No answer from the server is not an answer. Losing signal must not
    // spend the session.
    expect(store.getState().auth.refreshToken).toBe('refresh-1');
    expect(store.getState().auth.token).toBe('access-1');
  });

  it('a 401 that is the answer to a sign-in request, not an expiry', async () => {
    signedIn();
    let refreshes = 0;
    apiClient.defaults.adapter = async (config) => {
      throw httpError(config, 401);
    };
    refreshClient.defaults.adapter = async (config) => {
      refreshes += 1;
      return ok(config, { accessToken: 'access-2' });
    };

    // A wrong OTP answers 401. Trading the refresh token in for that would be
    // spending a session to re-ask a question the user got wrong.
    await expect(apiClient.post('/auth/verifyOtp', {})).rejects.toBeDefined();

    expect(refreshes).toBe(0);
    expect(store.getState().auth.token).toBe('access-1');
  });
});
