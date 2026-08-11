import { apiClient } from '../../services/apiClient';
import { MY_BOOKINGS_ENDPOINT } from './constants';
import type { BookingDTO } from './types';

export async function fetchMyBookings(): Promise<BookingDTO[]> {
  const { data } = await apiClient.get<BookingDTO[]>(MY_BOOKINGS_ENDPOINT);
  return data;
}
