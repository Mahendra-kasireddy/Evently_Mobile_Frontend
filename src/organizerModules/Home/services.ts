import { apiClient } from '../../services/apiClient';
import {
  BADGES_ENDPOINT,
  DASHBOARD_ENDPOINT,
  MY_BOOKINGS_ENDPOINT,
  ONBOARDING_STATUS_ENDPOINT,
  taskEndpoint,
} from './constants';
import type {
  BadgeStatusDTO,
  DashboardDTO,
  OnboardingStatusDTO,
  OrganizerBookingDTO,
  TaskStatus,
} from './types';

export async function getDashboard(): Promise<DashboardDTO> {
  const { data } = await apiClient.get<DashboardDTO>(DASHBOARD_ENDPOINT);
  return data;
}

export async function getBadges(): Promise<BadgeStatusDTO> {
  const { data } = await apiClient.get<BadgeStatusDTO>(BADGES_ENDPOINT);
  return data;
}

export async function getOnboardingStatus(): Promise<OnboardingStatusDTO> {
  const { data } = await apiClient.get<OnboardingStatusDTO>(
    ONBOARDING_STATUS_ENDPOINT,
  );
  return data;
}

export async function getMyBookings(): Promise<OrganizerBookingDTO[]> {
  const { data } = await apiClient.get<OrganizerBookingDTO[]>(
    MY_BOOKINGS_ENDPOINT,
  );
  return data;
}

export async function setTaskStatus(
  bookingId: string,
  taskId: string,
  status: TaskStatus,
): Promise<void> {
  await apiClient.patch(taskEndpoint(bookingId, taskId), { status });
}
