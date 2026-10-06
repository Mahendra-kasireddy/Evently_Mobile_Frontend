import type { BusinessRole } from './types';

export const LOGOUT_ENDPOINT = '/auth/logoutUser';

/**
 * Where the web app keeps its access token. Must match STORAGE_KEY in
 * evently-FrontEnd/src/lib/api/token.ts — the app writes it there before the
 * page's own scripts run, so the dashboard opens signed in.
 */
export const WEB_TOKEN_STORAGE_KEY = 'evently.auth.token';

/** Appended to the WebView's user agent, so the web app and its logs can tell it apart. */
export const APP_USER_AGENT = 'EventlyApp';

export const BUSINESS_HOME_PATH: Record<BusinessRole, string> = {
  organizer: '/organizer/home',
  vendor: '/subvendor/home',
};

export const SUBVENDOR_ONBOARDING_PATH = '/onboarding/subvendor';

/**
 * Web pages that belong to the customer product. The dashboard only sends an
 * account there when the token lacks the business role (the web's RequireRole
 * redirect) — so landing on one means "this is a customer now".
 */
export const CUSTOMER_PATHS = ['/home', '/welcome'];

/** The web's sign-in page. Landing here means the page did not see the app's session. */
export const WEB_LOGIN_PATH = '/login';

/**
 * How many times the page may report an expired session in a short window
 * before the app stops reloading it and shows an error instead. Guards a
 * reload loop if the server keeps rejecting freshly issued tokens.
 */
export const MAX_SESSION_RETRIES = 3;
export const SESSION_RETRY_WINDOW_MS = 30_000;

export const BUSINESS_HOME_COPY = {
  loading: 'Opening your dashboard…',
  errorTitle: "We couldn't open your dashboard",
  errorBody: 'Check your connection and try again.',
  retry: 'Try again',
} as const;
