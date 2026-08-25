import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { decodeJwtRoles } from '../services/jwt';

/**
 * Which product the signed-in account is currently looking at.
 *
 * One Evently account can hold several roles at once — someone who registered
 * as an organizer keeps their `customer` role too. So "what can this account
 * do" (roles, from the token) and "what is this person doing right now"
 * (this) are different questions, and the app needs both. Deciding the UI
 * from roles alone is what sent every customer login into the organizer
 * dashboard.
 */
export type AppView = 'customer' | 'organizer';

interface AuthState {
  token: string | null;
  /** True once the persisted token has been read from AsyncStorage at startup. */
  isHydrated: boolean;
  /** The view the person chose. Customer unless they explicitly switch. */
  activeView: AppView;
}

const initialState: AuthState = { token: null, isHydrated: false, activeView: 'customer' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      // Signing out drops the chosen view with the session, so the next person
      // on this device doesn't inherit it.
      if (action.payload === null) state.activeView = 'customer';
    },
    setAuthHydrated(state) {
      state.isHydrated = true;
    },
    setActiveView(state, action: PayloadAction<AppView>) {
      state.activeView = action.payload;
    },
  },
});

export const { setToken, setAuthHydrated, setActiveView } = authSlice.actions;

export const selectAuthToken = (state: { auth: AuthState }): string | null => state.auth.token;
export const selectIsAuthHydrated = (state: { auth: AuthState }): boolean => state.auth.isHydrated;

/** Derived from the token itself (not separately persisted) — always reflects whatever token is currently active. */
export const selectAuthRoles = (state: { auth: AuthState }): string[] =>
  state.auth.token ? decodeJwtRoles(state.auth.token) : [];

/** Whether this account is allowed into the organizer dashboard at all. */
export const selectCanUseOrganizerView = (state: { auth: AuthState }): boolean =>
  selectAuthRoles(state).includes('organizer');

export const selectActiveView = (state: { auth: AuthState }): AppView => state.auth.activeView;

/**
 * The one selector the UI should branch on.
 *
 * Both conditions have to hold: the person asked for the organizer view AND
 * the token actually carries the role. Checking the role here means a stale
 * stored preference — say, persisted before switching accounts — can never
 * put someone in a dashboard their account doesn't have.
 */
export const selectIsOrganizerView = (state: { auth: AuthState }): boolean =>
  state.auth.activeView === 'organizer' && selectCanUseOrganizerView(state);

export default authSlice.reducer;
