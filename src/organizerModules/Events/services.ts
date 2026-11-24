import { apiClient } from '../../services/apiClient';
import { MY_BOOKINGS_ENDPOINT } from './constants';
import type { OrganizerBookingDTO } from './types';

/** Every booking this organizer has, any status. */
export async function getMyBookings(): Promise<OrganizerBookingDTO[]> {
  const { data } = await apiClient.get<OrganizerBookingDTO[]>(
    MY_BOOKINGS_ENDPOINT,
  );
  return data;
}
