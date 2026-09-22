import { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { addGuest, addGuests, fetchGuests, updateGuest } from './services';

export function useGuests(bookingId: string) {
  const load = useCallback(() => fetchGuests(bookingId), [bookingId]);
  return useAsync(load, [bookingId]);
}

export function useAddGuest() {
  return useAsyncCallback(addGuest);
}

export function useUpdateGuest() {
  return useAsyncCallback(updateGuest);
}

export function useAddGuests() {
  return useAsyncCallback(addGuests);
}
