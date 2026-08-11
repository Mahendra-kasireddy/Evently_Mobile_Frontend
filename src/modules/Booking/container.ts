import { useMemo } from 'react';
import { useMyBookings } from './hooks';
import { mapBookings } from './utils';
import type { BookingItem } from './types';

export interface BookingContainerResult {
  items: BookingItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

export function useBookingContainer(): BookingContainerResult {
  const { data, loading, error, refetch } = useMyBookings();

  const items = useMemo<BookingItem[]>(() => (data ? mapBookings(data) : []), [data]);

  return {
    items,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
  };
}
