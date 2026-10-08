import { Platform } from 'react-native';

/*
 * ===========================================================================
 *  THE ONE SWITCH.
 *
 *    false → development (your local backend). Normal development/testing.
 *    true  → production (the Render backend). Set before every release
 *            APK/AAB, and back to false afterwards.
 *
 *  Nothing else in the project chooses a backend: every request, upload URL
 *  and WebView page reads `env` below.
 * ===========================================================================
 */
const USE_PRODUCTION = false;

type AppEnv = 'development' | 'qa' | 'production';

interface EnvConfig {
  /** The API, including its `/api` path. No trailing slash. */
  apiBaseUrl: string;
  /** The web app (evently-FrontEnd): the organizer and sub-vendor dashboards. */
  webAppUrl: string;
}

/*
 * Every environment's addresses. Hostnames, not secrets — never put keys here.
 *
 * Android emulators reach the host machine at 10.0.2.2 rather than localhost;
 * the iOS simulator uses localhost. A real phone on development needs your
 * computer's LAN IP in place of these.
 */
const ENVIRONMENTS: Record<AppEnv, EnvConfig> = {
  development: {
    apiBaseUrl: Platform.select({
      android: 'http://10.0.2.2:3000/api',
      default: 'http://localhost:3000/api',
    }),
    webAppUrl: Platform.select({
      android: 'http://10.0.2.2:5173',
      default: 'http://localhost:5173',
    }),
  },
  // Kept for when a QA server exists; not selected by the switch today.
  qa: {
    apiBaseUrl: 'https://qa-api.evently.example.com/api',
    webAppUrl: 'https://qa.evently.example.com',
  },
  production: {
    apiBaseUrl: 'https://evently-backend-ti68.onrender.com/api',
    // Placeholder until the web app is deployed — the dashboards will not
    // open in a production build until this is the real URL.
    webAppUrl: 'https://evently.example.com',
  },
};

const APP_ENV: AppEnv = USE_PRODUCTION ? 'production' : 'development';

const config = ENVIRONMENTS[APP_ENV];

/*
 * A production build must never reach a developer's machine. Checked at
 * start-up, so a wrong edit fails loudly on launch rather than quietly
 * talking to localhost from a phone in somebody's hand.
 */
const LOCAL_HOST = /^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i;
if (APP_ENV === 'production') {
  if (!config.apiBaseUrl.startsWith('https://') || LOCAL_HOST.test(config.apiBaseUrl)) {
    throw new Error(`Production API must be a public https URL, got "${config.apiBaseUrl}".`);
  }
  if (LOCAL_HOST.test(config.webAppUrl)) {
    throw new Error(`Production web app must not be a local address, got "${config.webAppUrl}".`);
  }
}

export const env = Object.freeze({
  apiBaseUrl: config.apiBaseUrl.replace(/\/+$/, ''),
  /** Where the organizer and sub-vendor dashboards are served from. No trailing slash. */
  webAppUrl: config.webAppUrl.replace(/\/+$/, ''),
  appName: 'Evently',
  /** Metro/debug build — about the build, not about which backend it talks to. */
  isDev: __DEV__,
  mode: APP_ENV,
});

export type Env = typeof env;
