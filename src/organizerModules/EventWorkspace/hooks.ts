import { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { getBooking, getIdeaBoard, getSubVendors } from './services';

export const useBooking = (bookingId: string) => {
  const fetch = useCallback(() => getBooking(bookingId), [bookingId]);
  return useAsync(fetch, [fetch]);
};

export const useIdeaBoard = (bookingId: string) => {
  const fetch = useCallback(() => getIdeaBoard(bookingId), [bookingId]);
  return useAsync(fetch, [fetch]);
};

export const useSubVendors = () => useAsync(getSubVendors, []);
