import { useCallback, useMemo } from 'react';
import { clearSession } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { useLogoutAction, useProfileBadges, useUserDetails } from './hooks';
import { groupsFor, mapProfile } from './utils';
import type { ProfileBadges, ProfileGroupSpec, ProfileViewModel } from './types';

const NO_BADGES: ProfileBadges = { savedPackages: 0, invitationsToApprove: 0 };

export interface ProfileContainerResult {
  profile: ProfileViewModel | null;
  /** The menu for this account — one row differs for an organizer. */
  groups: ProfileGroupSpec[];
  badges: ProfileBadges;
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
  const badges = useProfileBadges();
  const logoutAction = useLogoutAction();

  const profile = useMemo<ProfileViewModel | null>(() => (data ? mapProfile(data) : null), [data]);
  const groups = useMemo(() => groupsFor(profile?.isOrganizer ?? false), [profile?.isOrganizer]);

  const logout = useCallback(() => {
    // Clear the local session regardless of whether the backend call
    // succeeds — an unreachable server shouldn't trap the user signed in.
    logoutAction
      .execute()
      .catch(() => {
        // Backend unreachable/failed — still proceed to clear the local session below.
      })
      .finally(() => {
        dispatch(clearSession());
      });
  }, [logoutAction, dispatch]);

  return {
    profile,
    groups,
    badges: badges.data ?? NO_BADGES,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    isLoggingOut: logoutAction.loading,
    logout,
    refetch,
  };
}
