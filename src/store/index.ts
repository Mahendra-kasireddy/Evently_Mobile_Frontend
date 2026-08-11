import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setAuthHydrated, setToken } from './authSlice';
import locationReducer from './locationSlice';
import onboardingReducer, { setHasSeenOnboarding, setOnboardingHydrated } from './onboardingSlice';

const AUTH_TOKEN_KEY = 'evently.auth.token';
const ONBOARDING_SEEN_KEY = 'evently.onboarding.seen';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    onboarding: onboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Redux is the single source of truth for the auth token (the http client
// reads it directly from the store). This subscription is only responsible
// for mirroring it to disk so it survives an app restart.
let lastPersistedToken: string | null = null;
store.subscribe(() => {
  const token = store.getState().auth.token;
  if (token === lastPersistedToken) return;
  lastPersistedToken = token;
  if (token === null) {
    AsyncStorage.removeItem(AUTH_TOKEN_KEY).catch(() => undefined);
  } else {
    AsyncStorage.setItem(AUTH_TOKEN_KEY, token).catch(() => undefined);
  }
});

// Same mirror-to-disk pattern as the auth token, for the one-time onboarding flag.
let lastPersistedOnboardingSeen = false;
store.subscribe(() => {
  const seen = store.getState().onboarding.hasSeenOnboarding;
  if (seen === lastPersistedOnboardingSeen) return;
  lastPersistedOnboardingSeen = seen;
  if (seen) {
    AsyncStorage.setItem(ONBOARDING_SEEN_KEY, '1').catch(() => undefined);
  }
});

/** Restores the persisted token into the store. Runs once, at import time. */
async function hydrateAuth(): Promise<void> {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      lastPersistedToken = token;
      store.dispatch(setToken(token));
    }
  } catch {
    // Storage unavailable — app proceeds unauthenticated.
  } finally {
    store.dispatch(setAuthHydrated());
  }
}

/** Restores the persisted "has seen onboarding" flag. Runs once, at import time. */
async function hydrateOnboarding(): Promise<void> {
  try {
    const seen = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
    if (seen) {
      lastPersistedOnboardingSeen = true;
      store.dispatch(setHasSeenOnboarding());
    }
  } catch {
    // Storage unavailable — onboarding will simply show again.
  } finally {
    store.dispatch(setOnboardingHydrated());
  }
}

hydrateAuth();
hydrateOnboarding();
