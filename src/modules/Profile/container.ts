import { useCallback, useMemo } from 'react';
import { setToken } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { useLogoutAction, useUserDetails } from './hooks';
import { mapProfile } from './utils';
import type { ProfileViewModel } from './types';

export interface ProfileContainerResult {
  profile: ProfileViewModel | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isLoggingOut: boolean;
  logout: () => void;
  refetch: () => void;
}

export function useProfileContainer(): ProfileContainerResult {
  const dispatch = useAppDispatch();
  const { data, loading, error, refetch } = useUserDetails();
  const logoutAction = useLogoutAction();

  const profile = useMemo<ProfileViewModel | null>(() => (data ? mapProfile(data) : null), [data]);

  const logout = useCallback(() => {
    // Clear the local session regardless of whether the backend call
    // succeeds — an unreachable server shouldn't trap the user signed in.
    logoutAction
      .execute()
      .catch(() => {
        // Backend unreachable/failed — still proceed to clear the local session below.
      })
      .finally(() => {
        dispatch(setToken(null));
      });
  }, [logoutAction, dispatch]);

  return {
    profile,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    isLoggingOut: logoutAction.loading,
    logout,
    refetch,
  };
}
