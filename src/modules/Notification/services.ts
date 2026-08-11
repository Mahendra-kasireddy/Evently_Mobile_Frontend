import { apiClient } from '../../services/apiClient';
import { GET_MY_NOTIFICATIONS_ENDPOINT, MARK_ALL_READ_ENDPOINT, markReadEndpoint } from './constants';
import type { NotificationDTO } from './types';

export async function getMyNotifications(): Promise<NotificationDTO[]> {
  const { data } = await apiClient.get<NotificationDTO[]>(GET_MY_NOTIFICATIONS_ENDPOINT);
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(markReadEndpoint(id));
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch(MARK_ALL_READ_ENDPOINT);
}
