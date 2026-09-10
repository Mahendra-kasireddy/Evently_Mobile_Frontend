import { apiClient } from '../../services/apiClient';
import { MARK_ALL_READ_ENDPOINT, MARK_READ_ENDPOINT, MY_NOTIFICATIONS_ENDPOINT } from './constants';
import type { NotificationDTO } from './types';

export async function getMyNotifications(): Promise<NotificationDTO[]> {
  const { data } = await apiClient.get<NotificationDTO[]>(MY_NOTIFICATIONS_ENDPOINT);
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`${MARK_READ_ENDPOINT}/${id}`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch(MARK_ALL_READ_ENDPOINT);
}
