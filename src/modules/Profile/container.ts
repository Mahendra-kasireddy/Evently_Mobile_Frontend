import { useCallback, useMemo } from 'react';
import {
  selectCanUseOrganizerView,
  selectIsOrganizerView,
  setActiveView,
  setToken,
} from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
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
  /** True when this account holds the organizer role, so the switch is offered. */
  canUseOrganizerView: boolean;
  /** True while the organizer dashboard is the active view. */
  isOrganizerView: boolean;
  /** Flips between the customer app and the organizer dashboard. */
  toggleView: () => void;
}

export function useProfileContainer(): ProfileContainerResult {
  const dispatch = useAppDispatch();
  const canUseOrganizerView = useAppSelector(selectCanUseOrganizerView);
  const isOrganizerView = useAppSelector(selectIsOrganizerView);
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

  /*
   * The only way into the organizer dashboard. Logging in always lands in the
   * customer app now, so an organizer needs this — and it is a local view
   * switch, not a permission change: the role already has to be on the token
   * for selectIsOrganizerView to agree.
   */
  const toggleView = useCallback(() => {
    dispatch(setActiveView(isOrganizerView ? 'customer' : 'organizer'));
  }, [dispatch, isOrganizerView]);

  return {
    profile,
    canUseOrganizerView,
    isOrganizerView,
    toggleView,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    isLoggingOut: logoutAction.loading,
    logout,
    refetch,
  };
}
