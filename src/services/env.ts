import { Platform } from 'react-native';
import {
  API_BASE_URL_DEVELOPMENT,
  API_BASE_URL_QA,
  API_BASE_URL_PRODUCTION,
  APP_NAME,
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

if (!apiBaseUrl) {
  throw new Error(`Missing API base URL for env "${APP_ENV}". Check src/.env.`);
}

export const env = Object.freeze({
  apiBaseUrl,
  appName: APP_NAME || 'Evently',
  isDev: __DEV__,
  mode: APP_ENV,
});

export type Env = typeof env;
