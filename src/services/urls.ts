import { env } from './env';

/**
 * The API's origin — scheme and host, without the `/api` path.
 *
 * `env.apiBaseUrl` is "http://10.0.2.2:3000/api"; an uploaded file's URL from
 * the local storage driver is "/api/upload/file/<key>", which already carries
 * that path. Joining them naively would produce "…/api/api/upload/…".
 */
const API_ORIGIN = (/^(https?:\/\/[^/]+)/.exec(env.apiBaseUrl)?.[1] ?? '').replace(/\/+$/, '');

/**
 * An uploaded file's URL, made absolute.
 *
 * The backend's local storage driver returns a root-relative path
 * ("/api/upload/file/<key>") whenever `UPLOAD_PUBLIC_BASE_URL` is unset, which
 * is the default in development. A browser resolves that against the page it
 * is on; React Native's `Image` has no such context and simply fails — which
 * is what put a broken-image glyph where an organizer's portfolio should be.
 *
 * The S3 driver already returns absolute URLs, and those pass through
 * untouched, so this is safe to apply to every stored file regardless of how
 * the server is configured.
 */
export function absoluteFileUrl(url: string | null | undefined): string {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return '';
  // Already absolute, or a data/blob URI the app made itself.
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  if (!trimmed.startsWith('/')) return trimmed;
  return `${API_ORIGIN}${trimmed}`;
}
