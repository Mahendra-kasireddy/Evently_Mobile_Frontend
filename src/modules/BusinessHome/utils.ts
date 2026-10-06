import { env } from '../../services/env';
import { WEB_TOKEN_STORAGE_KEY } from './constants';
import type { AppMessage } from './types';

/** The web app's address for a path, or the URL itself if it is already absolute. */
export function webUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${env.webAppUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/** True for a URL served by the web app itself — the only pages the WebView keeps. */
export function isWebAppUrl(url: string): boolean {
  return url === env.webAppUrl || url.startsWith(`${env.webAppUrl}/`) || url.startsWith(`${env.webAppUrl}?`);
}

/** The path of a web-app URL ("/organizer/home"), or '' for anything else. */
export function webPathOf(url: string): string {
  if (!isWebAppUrl(url)) return '';
  const rest = url.slice(env.webAppUrl.length);
  const path = rest.split(/[?#]/)[0] ?? '';
  return path === '' ? '/' : path.replace(/\/+$/, '') || '/';
}

/**
 * The script that runs in the page before its own bundle.
 *
 * It marks the page as embedded (the web's `isInApp()` reads this) and writes
 * the access token where the web app looks for it, so the dashboard boots
 * signed in. The token never goes in the URL — it would land in history,
 * server logs and any referrer.
 */
export function buildInjectedScript(token: string, platform: string): string {
  return `(function(){try{window.__EVENTLY_APP__={platform:${JSON.stringify(platform)}};window.localStorage.setItem(${JSON.stringify(
    WEB_TOKEN_STORAGE_KEY,
  )},${JSON.stringify(token)});}catch(e){}})();true;`;
}

/** Reads a message from the page, or null for anything that is not one of ours. */
export function parseAppMessage(raw: string): AppMessage | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object') return null;
  const msg = data as Record<string, unknown>;
  switch (msg.type) {
    case 'logout':
    case 'sessionExpired':
      return { type: msg.type };
    case 'session':
      return typeof msg.token === 'string' && typeof msg.refreshToken === 'string'
        ? { type: 'session', token: msg.token, refreshToken: msg.refreshToken }
        : null;
    case 'switchRole':
      return msg.role === 'customer' || msg.role === 'organizer' || msg.role === 'vendor'
        ? { type: 'switchRole', role: msg.role }
        : null;
    default:
      return null;
  }
}
