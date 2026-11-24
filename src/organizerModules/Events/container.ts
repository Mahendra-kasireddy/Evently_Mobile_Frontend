import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useMyBookings } from './hooks';
import type { EventsSections, EventsView } from './types';
import { groupEvents } from './utils';

export interface EventsContainerResult extends EventsSections {
  view: EventsView;
  setView: (view: EventsView) => void;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => void;
}

/** The organizer's bookings, grouped; fetched again whenever the tab comes back. */
export function useEventsContainer(): EventsContainerResult {
  const bookings = useMyBookings();
  const [view, setView] = useState<EventsView>('upcoming');
  const [pulling, setPulling] = useState(false);

  const sections = useMemo(() => groupEvents(bookings.data), [bookings.data]);

  const seen = useRef(false);
  const refetch = bookings.refetch;
  useFocusEffect(
    useCallback(() => {
      if (seen.current) refetch();
      seen.current = true;
    }, [refetch]),
  );

  const refresh = useCallback(() => {
    setPulling(true);
    refetch();
  }, [refetch]);
  if (pulling && !bookings.loading) setPulling(false);

  return {
    ...sections,
    view,
    setView,
    isLoading: bookings.loading && !bookings.data,
    isRefreshing: pulling,
    errorMessage:
      !bookings.data && bookings.error ? bookings.error.message : null,
    refresh,
  };
}
