import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { decodeJwtRoles } from '../services/jwt';

interface AuthState {
  token: string | null;
  /** True once the persisted token has been read from AsyncStorage at startup. */
  isHydrated: boolean;
}

const initialState: AuthState = { token: null, isHydrated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setAuthHydrated(state) {
      state.isHydrated = true;
    },
  },
});

export const { setToken, setAuthHydrated } = authSlice.actions;
export const selectAuthToken = (state: { auth: AuthState }): string | null => state.auth.token;
export const selectIsAuthHydrated = (state: { auth: AuthState }): boolean => state.auth.isHydrated;
/** Derived from the token itself (not separately persisted) — always reflects whatever token is currently active. */
export const selectAuthRoles = (state: { auth: AuthState }): string[] =>
  state.auth.token ? decodeJwtRoles(state.auth.token) : [];
export default authSlice.reducer;
