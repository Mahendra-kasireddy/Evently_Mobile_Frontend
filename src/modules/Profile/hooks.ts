import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { fetchProfileBadges, getUserDetails, logout } from './services';

export function useUserDetails() {
  return useAsync(getUserDetails, []);
}

export function useProfileBadges() {
  return useAsync(fetchProfileBadges, []);
}

export function useLogoutAction() {
  return useAsyncCallback(logout);
}
