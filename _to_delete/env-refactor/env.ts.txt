import { Platform } from 'react-native';
import {
  API_BASE_URL_DEVELOPMENT,
  API_BASE_URL_QA,
  API_BASE_URL_PRODUCTION,
  APP_NAME,
  WEB_APP_URL_DEVELOPMENT,
  WEB_APP_URL_QA,
  WEB_APP_URL_PRODUCTION,
} from '@env';

// Android emulators can't resolve the host machine's `localhost` — 10.0.2.2
// is the documented loopback alias. Real devices/iOS simulator use localhost.
const DEFAULT_DEV_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',
  default: 'http://localhost:3000/api',
});

type AppEnv = 'development' | 'qa' | 'production';

// RN has no Vite-style build "mode" — __DEV__ is all we get for free. QA/prod
// builds must set API_BASE_URL_PRODUCTION in `src/.env` before shipping.
const APP_ENV: AppEnv = __DEV__ ? 'development' : 'production';

const URL_BY_ENV: Record<AppEnv, string | undefined> = {
  development: API_BASE_URL_DEVELOPMENT || DEFAULT_DEV_URL,
  qa: API_BASE_URL_QA,
  production: API_BASE_URL_PRODUCTION,
};

const apiBaseUrl = URL_BY_ENV[APP_ENV] ?? DEFAULT_DEV_URL;

// The web app's Vite dev server, by the same loopback rules as the API.
const DEFAULT_DEV_WEB_URL = Platform.select({
  android: 'http://10.0.2.2:5173',
  default: 'http://localhost:5173',
});

const WEB_URL_BY_ENV: Record<AppEnv, string | undefined> = {
  development: WEB_APP_URL_DEVELOPMENT || DEFAULT_DEV_WEB_URL,
  qa: WEB_APP_URL_QA,
  production: WEB_APP_URL_PRODUCTION,
};

/** Where the organizer and sub-vendor dashboards are served from. No trailing slash. */
const webAppUrl = (WEB_URL_BY_ENV[APP_ENV] ?? DEFAULT_DEV_WEB_URL).replace(/\/+$/, '');

if (!apiBaseUrl) {
  throw new Error(`Missing API base URL for env "${APP_ENV}". Check src/.env.`);
}

export const env = Object.freeze({
  apiBaseUrl,
  webAppUrl,
  appName: APP_NAME || 'Evently',
  isDev: __DEV__,
  mode: APP_ENV,
});

export type Env = typeof env;
