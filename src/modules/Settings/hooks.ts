import { useAsync, type AsyncResult } from '../../hooks/useAsync';
import { useAsyncCallback, type AsyncCallbackResult } from '../../hooks/useAsyncCallback';
import {
  closeAccount,
  getNotificationPrefs,
  getUserDetails,
  updateNotificationPrefs,
  updateProfile,
} from './services';
import type { NotificationPrefs, UpdateProfileBody, UserDetailsDTO } from './types';

export function useUserDetails(): AsyncResult<UserDetailsDTO> {
  return useAsync(getUserDetails, []);
}

export function useUpdateProfile(): AsyncCallbackResult<[UpdateProfileBody], UserDetailsDTO> {
  return useAsyncCallback(updateProfile);
}

export function useNotificationPrefs(): AsyncResult<NotificationPrefs> {
  return useAsync(getNotificationPrefs, []);
}

export function useUpdatePrefs(): AsyncCallbackResult<[Partial<NotificationPrefs>], void> {
  return useAsyncCallback(updateNotificationPrefs);
}

export function useCloseAccount(): AsyncCallbackResult<[], void> {
  return useAsyncCallback(closeAccount);
}
