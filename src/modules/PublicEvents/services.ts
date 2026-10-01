import { apiClient } from '../../services/apiClient';
import {
  BOOKINGS_ENDPOINT,
  BROWSE_ENDPOINT,
  MY_TICKETS_ENDPOINT,
} from './constants';
import type {
  BrowseQuery,
  ConfirmedBooking,
  CustomerContact,
  EventMemoriesPage,
  EventMemory,
  EventMemoryKind,
  MemoryUploadInput,
  DigitalTicket,
  EventCard,
  EventDetail,
  MyTicket,
  Paged,
  StartedBooking,
} from './types';

/**
 * The customer's half of public events.
 *
 * Every path here is the customer prefix. None of them accepts a status, a
 * price or anybody's id but the caller's own session — the catalogue decides
 * what is visible and the server decides what things cost, which is why none
 * of these functions has a parameter for either.
 */

/** The catalogue. Published events only; there is no argument that widens it. */
export async function browseEvents(
  query: BrowseQuery = {},
): Promise<EventCard[]> {
  const { data } = await apiClient.get<Paged<EventCard>>(BROWSE_ENDPOINT, {
    params: query,
  });
  return data.items ?? [];
}

/** One event. Reads the session when there is one, for the permissions on it. */
export async function fetchEventDetail(eventId: string): Promise<EventDetail> {
  const { data } = await apiClient.get<EventDetail>(
    `${BROWSE_ENDPOINT}/${eventId}`,
  );
  return data;
}

/**
 * Hold the seats and open a payment.
 *
 * Sends a ticket type and a count, and nothing else: the price, the total and
 * the per-customer ceiling are all the server's, so what this screen displayed
 * can never be what the customer is charged.
 */
export async function startBooking(
  eventId: string,
  ticketTypeId: string,
  quantity: number,
): Promise<StartedBooking> {
  const { data } = await apiClient.post<StartedBooking>(
    `${BROWSE_ENDPOINT}/${eventId}/book`,
    {
      ticketTypeId,
      quantity,
    },
  );
  return data;
}

/** Hand Razorpay's answer back for the server to verify. */
export async function confirmBooking(
  bookingId: string,
  payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
): Promise<ConfirmedBooking> {
  const { data } = await apiClient.post<ConfirmedBooking>(
    `${BOOKINGS_ENDPOINT}/${bookingId}/confirm`,
    payload,
  );
  return data;
}

export async function fetchMyTickets(status?: string): Promise<MyTicket[]> {
  const { data } = await apiClient.get<Paged<MyTicket>>(MY_TICKETS_ENDPOINT, {
    params: status && status !== 'all' ? { status } : {},
  });
  return data.items ?? [];
}

/** One ticket and its QR — the server draws the code, so no token travels. */
export async function fetchTicket(ticketId: string): Promise<DigitalTicket> {
  const { data } = await apiClient.get<DigitalTicket>(
    `${MY_TICKETS_ENDPOINT}/${ticketId}`,
  );
  return data;
}

/** The event's shared gallery. The server decides whether you may see it. */
export async function fetchMemories(
  eventId: string,
  kind?: EventMemoryKind,
): Promise<EventMemoriesPage> {
  const { data } = await apiClient.get<EventMemoriesPage>(
    `${BROWSE_ENDPOINT}/${eventId}/memories`,
    { params: kind ? { kind } : {} },
  );
  return { items: data.items ?? [], canUpload: data.canUpload === true };
}

/** Add a photo or clip. Refused by the server unless the event's rules allow it. */
export async function uploadMemory(
  eventId: string,
  input: MemoryUploadInput,
): Promise<EventMemory> {
  const body = new FormData();
  body.append('file', {
    uri: input.uri,
    name: input.fileName,
    type: input.mimeType,
  } as unknown as Blob);
  const { data } = await apiClient.post<EventMemory>(
    `${BROWSE_ENDPOINT}/${eventId}/memories`,
    body,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

/** The signed-in customer, for the checkout's contact card. */
export async function fetchCustomerContact(): Promise<CustomerContact> {
  const { data } = await apiClient.get<CustomerContact>('/user/getUserDetails');
  return { name: data?.name, email: data?.email, phone: data?.phone };
}
