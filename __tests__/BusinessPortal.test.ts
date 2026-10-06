/**
 * The pieces that decide which side of Evently an account sees, and the
 * message bridge between the app and the web dashboard it embeds.
 */
import { env } from '../src/services/env';
import { decodeJwtExp, isJwtFresh } from '../src/services/jwt';
import {
  selectEffectiveView,
  selectIsBusinessView,
  toAppView,
  type AppView,
} from '../src/store/authSlice';
import {
  buildInjectedScript,
  isWebAppUrl,
  parseAppMessage,
  webPathOf,
  webUrl,
} from '../src/modules/BusinessHome/utils';
import { WEB_TOKEN_STORAGE_KEY } from '../src/modules/BusinessHome/constants';

// Jest runs on Node, which has Buffer; the app's tsconfig only loads RN + Jest types.
declare const Buffer: { from(input: string): { toString(encoding: 'base64'): string } };

/** An unsigned JWT with the given payload — the app only ever reads, never verifies. */
function jwt(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${b64({ alg: 'HS256' })}.${b64(payload)}.sig`;
}

function authState(activeView: AppView, roles: string[]) {
  return {
    auth: {
      token: jwt({ sub: 'u1', roles }),
      refreshToken: 'r',
      isHydrated: true,
      activeView,
    },
  };
}

describe('which side the account sees', () => {
  it('maps the server default role, and anything unknown to customer', () => {
    expect(toAppView('organizer')).toBe('organizer');
    expect(toAppView('vendor')).toBe('vendor');
    expect(toAppView('customer')).toBe('customer');
    expect(toAppView('admin')).toBe('customer');
    expect(toAppView(undefined)).toBe('customer');
  });

  it('opens a business portal only when the token carries that role', () => {
    expect(selectEffectiveView(authState('organizer', ['customer', 'organizer']))).toBe('organizer');
    expect(selectEffectiveView(authState('vendor', ['customer', 'vendor']))).toBe('vendor');
    // A stale stored view never opens a portal the server would refuse.
    expect(selectEffectiveView(authState('organizer', ['customer']))).toBe('customer');
    expect(selectIsBusinessView(authState('vendor', ['customer']))).toBe(false);
    expect(selectIsBusinessView(authState('organizer', ['organizer']))).toBe(true);
  });
});

describe('token freshness', () => {
  it('reads the expiry, and judges it with a margin', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(decodeJwtExp(jwt({ exp: 123 }))).toBe(123);
    expect(decodeJwtExp('not-a-token')).toBeNull();
    expect(isJwtFresh(jwt({ exp: now + 3600 }))).toBe(true);
    expect(isJwtFresh(jwt({ exp: now + 30 }))).toBe(false);
    expect(isJwtFresh(jwt({ exp: now - 10 }))).toBe(false);
  });
});

describe('the web dashboard bridge', () => {
  it('builds web-app URLs and recognises only its own pages', () => {
    expect(webUrl('/organizer/home')).toBe(`${env.webAppUrl}/organizer/home`);
    expect(webUrl('https://elsewhere.test/x')).toBe('https://elsewhere.test/x');
    expect(isWebAppUrl(`${env.webAppUrl}/subvendor/home`)).toBe(true);
    expect(isWebAppUrl('https://wa.me/919800000000')).toBe(false);
    // A look-alike host that merely starts with the same characters.
    expect(isWebAppUrl(`${env.webAppUrl}.evil.test/`)).toBe(false);
  });

  it('reads the path of a dashboard page', () => {
    expect(webPathOf(`${env.webAppUrl}/organizer/home?tab=1#top`)).toBe('/organizer/home');
    expect(webPathOf(`${env.webAppUrl}/login/`)).toBe('/login');
    expect(webPathOf(env.webAppUrl)).toBe('/');
    expect(webPathOf('https://elsewhere.test/login')).toBe('');
  });

  it('accepts only well-formed messages', () => {
    expect(parseAppMessage('{"type":"logout"}')).toEqual({ type: 'logout' });
    expect(parseAppMessage('{"type":"sessionExpired"}')).toEqual({ type: 'sessionExpired' });
    expect(parseAppMessage('{"type":"switchRole","role":"customer"}')).toEqual({
      type: 'switchRole',
      role: 'customer',
    });
    expect(parseAppMessage('{"type":"session","token":"a","refreshToken":"b"}')).toEqual({
      type: 'session',
      token: 'a',
      refreshToken: 'b',
    });
    expect(parseAppMessage('{"type":"switchRole","role":"admin"}')).toBeNull();
    expect(parseAppMessage('{"type":"session","token":"a"}')).toBeNull();
    expect(parseAppMessage('{"type":"somethingElse"}')).toBeNull();
    expect(parseAppMessage('not json')).toBeNull();
    expect(parseAppMessage('null')).toBeNull();
  });

  it('hands the page its token through storage, never the URL', () => {
    const token = jwt({ sub: 'u1', roles: ['organizer'] });
    const script = buildInjectedScript(token, 'ios');
    expect(script).toContain(JSON.stringify(WEB_TOKEN_STORAGE_KEY));
    expect(script).toContain(JSON.stringify(token));
    expect(script).toContain('__EVENTLY_APP__');
    // The page's own boot must still run: the script ends by returning true.
    expect(script.trim().endsWith('true;')).toBe(true);
  });
});
