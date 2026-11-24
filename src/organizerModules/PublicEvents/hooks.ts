import { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { getDashboard, getEvent, listTicketTypes } from './services';

export const usePublicEvent = (eventId: string) => {
  const fetch = useCallback(() => getEvent(eventId), [eventId]);
  return useAsync(fetch, [fetch]);
};

export const useEventDashboard = (eventId: string) => {
  const fetch = useCallback(() => getDashboard(eventId), [eventId]);
  return useAsync(fetch, [fetch]);
};

export const useTicketTypes = (eventId: string) => {
  const fetch = useCallback(() => listTicketTypes(eventId), [eventId]);
  return useAsync(fetch, [fetch]);
};
