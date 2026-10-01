import { useCallback } from 'react';
import { useAsync, type AsyncResult } from '../../hooks/useAsync';
import {
  useAsyncCallback,
  type AsyncCallbackResult,
} from '../../hooks/useAsyncCallback';
import {
  browseEvents,
  confirmBooking,
  fetchCustomerContact,
  fetchMemories,
  fetchEventDetail,
  fetchMyTickets,
  fetchTicket,
  startBooking,
} from './services';
import type {
  BrowseQuery,
  ConfirmedBooking,
  CustomerContact,
  EventMemoriesPage,
  EventMemoryKind,
  DigitalTicket,
  EventCard,
  EventDetail,
  MyTicket,
  StartedBooking,
} from './types';

export function usePublicEvents(
  query: BrowseQuery = {},
): AsyncResult<EventCard[]> {
  const key = JSON.stringify(query);
  const load = useCallback(() => browseEvents(query), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return useAsync(load, [key]);
}

export function useEventDetail(eventId: string): AsyncResult<EventDetail> {
  const load = useCallback(() => fetchEventDetail(eventId), [eventId]);
  return useAsync(load, [eventId]);
}

export function useMyTickets(status?: string): AsyncResult<MyTicket[]> {
  const load = useCallback(() => fetchMyTickets(status), [status]);
  return useAsync(load, [status]);
}

export function useDigitalTicket(ticketId: string): AsyncResult<DigitalTicket> {
  const load = useCallback(() => fetchTicket(ticketId), [ticketId]);
  return useAsync(load, [ticketId]);
}

export function useStartBooking(): AsyncCallbackResult<
  [string, string, number],
  StartedBooking
> {
  return useAsyncCallback(startBooking);
}

export function useConfirmBooking(): AsyncCallbackResult<
  [
    string,
    {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    },
  ],
  ConfirmedBooking
> {
  return useAsyncCallback(confirmBooking);
}

export function useEventMemories(
  eventId: string,
  kind?: EventMemoryKind,
): AsyncResult<EventMemoriesPage> {
  const load = useCallback(() => fetchMemories(eventId, kind), [eventId, kind]);
  return useAsync(load, [eventId, kind]);
}

export function useCustomerContact(): AsyncResult<CustomerContact> {
  return useAsync(fetchCustomerContact, []);
}
