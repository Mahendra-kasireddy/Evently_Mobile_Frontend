import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from './services';

export function useNotifications() {
  return useAsync(getMyNotifications, []);
}

export function useMarkRead() {
  return useAsyncCallback(markNotificationRead);
}

export function useMarkAllRead() {
  return useAsyncCallback(markAllNotificationsRead);
}
