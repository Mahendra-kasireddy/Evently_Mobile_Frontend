import { useCallback, useMemo, useState } from 'react';
import { saveDefaultRole } from '../../services/defaultRole';
import { clearSession, setActiveView } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { useLogoutAction, useProfileBadges, useUserDetails } from './hooks';
import { groupsFor, mapProfile } from './utils';
import type { BusinessView, ProfileBadges, ProfileGroupSpec, ProfileViewModel } from './types';

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
  /** The dashboard being opened, while its default is saved. */
  switchingTo: BusinessView | null;
  /** Opens a business dashboard and makes it the account's default. */
  switchTo: (view: BusinessView) => void;
  refetch: () => void;
}

export function useProfileContainer(): ProfileContainerResult {
  const dispatch = useAppDispatch();
  const { data, loading, error, refetch } = useUserDetails();
  const badges = useProfileBadges();
  const logoutAction = useLogoutAction();

  const profile = useMemo<ProfileViewModel | null>(() => (data ? mapProfile(data) : null), [data]);
  const businessViews = profile?.businessViews;
  const groups = useMemo(() => groupsFor(businessViews ?? []), [businessViews]);
  const [switchingTo, setSwitchingTo] = useState<BusinessView | null>(null);

  const switchTo = useCallback(
    (view: BusinessView) => {
      setSwitchingTo(view);
      // The server default decides where the next sign-in lands; saving it is
      // best-effort. The switch itself is local and happens either way — a
      // flaky connection should not keep someone out of their dashboard.
      saveDefaultRole(view)
        .catch(() => undefined)
        .finally(() => {
          setSwitchingTo(null);
          dispatch(setActiveView(view));
        });
    },
    [dispatch],
  );

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
    switchingTo,
    switchTo,
    refetch,
  };
}
