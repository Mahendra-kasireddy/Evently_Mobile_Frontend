import { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { fetchEventExtras, fetchMyBookings } from './services';
import type { EventExtras } from './types';

export function useMyBookings() {
  return useAsync(fetchMyBookings, []);
}

/**
 * The counts behind the "Jump to" tiles, for whichever event the grid is
 * pointed at. Re-runs when that event changes, and resolves to empty counts
 * while there is no event to ask about.
 */
export function useEventExtras(bookingId: string | null) {
  const load = useCallback(() => fetchEventExtras(bookingId), [bookingId]);
  return useAsync<EventExtras>(load, [bookingId]);
}
