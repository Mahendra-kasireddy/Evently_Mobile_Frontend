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
  /**
   * The long-lived half of the session.
   *
   * The access token is deliberately short-lived (the backend signs it for an
   * hour), so it is NOT what keeps someone signed in — this is. Storing only
   * the access token is what used to sign people out roughly an hour after
   * login: the next request 401'd and there was nothing left to recover with.
   */
  refreshToken: string | null;
  /** True once the persisted session has been read from AsyncStorage at startup. */
  isHydrated: boolean;
  /** The view the person chose. Customer unless they explicitly switch. */
  activeView: AppView;
}

export interface SessionTokens {
  token: string;
  refreshToken?: string | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  isHydrated: false,
  activeView: 'customer',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Records a whole session at once. Every sign-in path must use this rather
     * than `setToken`, or the refresh token is lost and the session dies with
     * the access token.
     */
    setSession(state, action: PayloadAction<SessionTokens>) {
      state.token = action.payload.token;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    /** Replaces only the access token — used after a silent refresh. */
    setAccessToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    /**
     * Ends the session. This is the ONLY thing that signs someone out, and it
     * should only ever be reached from an explicit logout or from a refresh
     * token the server has rejected.
     */
    clearSession(state) {
      state.token = null;
      state.refreshToken = null;
      // Signing out drops the chosen view with the session, so the next person
      // on this device doesn't inherit it.
      state.activeView = 'customer';
    },
    setAuthHydrated(state) {
      state.isHydrated = true;
    },
    setActiveView(state, action: PayloadAction<AppView>) {
      state.activeView = action.payload;
    },
  },
});

export const { setSession, setAccessToken, clearSession, setAuthHydrated, setActiveView } =
  authSlice.actions;

export const selectAuthToken = (state: { auth: AuthState }): string | null => state.auth.token;
export const selectRefreshToken = (state: { auth: AuthState }): string | null =>
  state.auth.refreshToken;
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
