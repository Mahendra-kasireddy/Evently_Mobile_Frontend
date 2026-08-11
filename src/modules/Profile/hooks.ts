import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { getUserDetails, logout } from './services';

export function useUserDetails() {
  return useAsync(getUserDetails, []);
}

export function useLogoutAction() {
  return useAsyncCallback(logout);
}
