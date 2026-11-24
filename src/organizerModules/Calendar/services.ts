import { apiClient } from '../../services/apiClient';
import { BLOCKED_DATES_ENDPOINT, CALENDAR_ENDPOINT } from './constants';
import type { OrganizerCalendarDTO, SetBlockedBody } from './types';

/** Every booked date (any live booking) and every blocked day. */
export async function getCalendar(): Promise<OrganizerCalendarDTO> {
  const { data } = await apiClient.get<OrganizerCalendarDTO>(CALENDAR_ENDPOINT);
  return {
    bookedDates: data?.bookedDates ?? [],
    blockedDates: data?.blockedDates ?? [],
  };
}

/** Blocks or unblocks one day; the server answers with every blocked day. */
export async function setDateBlocked(body: SetBlockedBody): Promise<string[]> {
  const { data } = await apiClient.post<string[]>(BLOCKED_DATES_ENDPOINT, body);
  return Array.isArray(data) ? data : [];
}

/**
 * Blocks several days, one request each, in order — so the server is never
 * flooded and a failure part-way leaves a coherent state. Resolves with the
 * last blocked list the server sent; rejects on the first failure.
 */
export async function blockDays(days: string[]): Promise<string[]> {
  let latest: string[] = [];
  for (const date of days) {
    latest = await setDateBlocked({ date, blocked: true });
  }
  return latest;
}
