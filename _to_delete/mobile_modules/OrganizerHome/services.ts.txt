import { apiClient } from '../../services/apiClient';
import { BADGES_ENDPOINT, DASHBOARD_ENDPOINT, taskEndpoint } from './constants';
import type { BadgeStatus, BookingTaskStatus, OrganizerDashboard } from './types';

export async function fetchDashboard(): Promise<OrganizerDashboard> {
  const { data } = await apiClient.get<OrganizerDashboard>(DASHBOARD_ENDPOINT);
  return data;
}

export async function fetchBadges(): Promise<BadgeStatus> {
  const { data } = await apiClient.get<BadgeStatus>(BADGES_ENDPOINT);
  return data;
}

export async function updateTaskStatus(bookingId: string, taskId: string, status: BookingTaskStatus): Promise<void> {
  await apiClient.patch(taskEndpoint(bookingId, taskId), { status });
}
