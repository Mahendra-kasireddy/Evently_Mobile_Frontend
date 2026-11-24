import { apiClient } from '../../services/apiClient';
import { pickImage, uploadImage, type StoredFile } from '../Shared';
import {
  COVER_PURPOSE,
  EVENTS_ENDPOINT,
  EVENTS_PAGE_SIZE,
  attendeesEndpoint,
  checkInEndpoint,
  dashboardEndpoint,
  eventEndpoint,
  liveStreamEndpoint,
  memoriesEndpoint,
  statusEndpoint,
  ticketTypeEndpoint,
  ticketTypesEndpoint,
} from './constants';
import type {
  AttendeeDTO,
  AttendeeQuery,
  CheckInBody,
  CheckInOutcomeDTO,
  DashboardDTO,
  EventBody,
  ListFilter,
  LiveBody,
  LiveSettingsDTO,
  MemoriesBody,
  MemoriesSettingsDTO,
  Paged,
  PublicEventDTO,
  PublicEventDetailDTO,
  PublicEventSummaryDTO,
  StatusBody,
  TicketTypeBody,
  TicketTypeDTO,
} from './types';

/** A paged answer, tolerant of a bare array from an older server. */
function paged<T>(data: Paged<T> | T[] | null | undefined): Paged<T> {
  if (Array.isArray(data)) {
    return { items: data, total: data.length, page: 0, limit: data.length };
  }
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: data?.total ?? 0,
    page: data?.page ?? 0,
    limit: data?.limit ?? 0,
  };
}

/** One page of this organizer's events, newest start first. */
export async function listEvents(
  filter: ListFilter,
  page: number,
  limit = EVENTS_PAGE_SIZE,
): Promise<Paged<PublicEventSummaryDTO>> {
  const params: Record<string, string | number> = { page, limit };
  if (filter !== 'all') params.status = filter;
  const { data } = await apiClient.get<Paged<PublicEventSummaryDTO>>(
    EVENTS_ENDPOINT,
    { params },
  );
  return paged(data);
}

export async function createEvent(body: EventBody): Promise<PublicEventDTO> {
  const { data } = await apiClient.post<PublicEventDTO>(EVENTS_ENDPOINT, body);
  return data;
}

export async function getEvent(eventId: string): Promise<PublicEventDetailDTO> {
  const { data } = await apiClient.get<PublicEventDetailDTO>(
    eventEndpoint(eventId),
  );
  return data;
}

export async function updateEvent(
  eventId: string,
  body: EventBody,
): Promise<PublicEventDTO> {
  const { data } = await apiClient.patch<PublicEventDTO>(
    eventEndpoint(eventId),
    body,
  );
  return data;
}

/** Publish, back to draft, complete or cancel — returns the event as it now stands. */
export async function changeStatus(
  eventId: string,
  body: StatusBody,
): Promise<PublicEventDTO> {
  const { data } = await apiClient.patch<PublicEventDTO>(
    statusEndpoint(eventId),
    body,
  );
  return data;
}

export async function listTicketTypes(
  eventId: string,
): Promise<TicketTypeDTO[]> {
  const { data } = await apiClient.get<TicketTypeDTO[]>(
    ticketTypesEndpoint(eventId),
  );
  return Array.isArray(data) ? data : [];
}

export async function createTicketType(
  eventId: string,
  body: TicketTypeBody,
): Promise<TicketTypeDTO> {
  const { data } = await apiClient.post<TicketTypeDTO>(
    ticketTypesEndpoint(eventId),
    body,
  );
  return data;
}

export async function updateTicketType(
  eventId: string,
  typeId: string,
  body: TicketTypeBody,
): Promise<TicketTypeDTO> {
  const { data } = await apiClient.patch<TicketTypeDTO>(
    ticketTypeEndpoint(eventId, typeId),
    body,
  );
  return data;
}

export async function archiveTicketType(
  eventId: string,
  typeId: string,
): Promise<{ id: string; archived: boolean }> {
  const { data } = await apiClient.delete<{ id: string; archived: boolean }>(
    ticketTypeEndpoint(eventId, typeId),
  );
  return data;
}

export async function getDashboard(eventId: string): Promise<DashboardDTO> {
  const { data } = await apiClient.get<DashboardDTO>(
    dashboardEndpoint(eventId),
  );
  return data;
}

export async function listAttendees(
  eventId: string,
  query: AttendeeQuery,
): Promise<Paged<AttendeeDTO>> {
  const { data } = await apiClient.get<Paged<AttendeeDTO>>(
    attendeesEndpoint(eventId),
    { params: query },
  );
  return paged(data);
}

/** Admit one ticket. The server decides; this only reports its answer. */
export async function checkIn(
  eventId: string,
  body: CheckInBody,
): Promise<CheckInOutcomeDTO> {
  const { data } = await apiClient.post<CheckInOutcomeDTO>(
    checkInEndpoint(eventId),
    body,
  );
  return data;
}

export async function setMemories(
  eventId: string,
  body: MemoriesBody,
): Promise<MemoriesSettingsDTO> {
  const { data } = await apiClient.patch<MemoriesSettingsDTO>(
    memoriesEndpoint(eventId),
    body,
  );
  return data;
}

export async function setLiveStream(
  eventId: string,
  body: LiveBody,
): Promise<LiveSettingsDTO> {
  const { data } = await apiClient.patch<LiveSettingsDTO>(
    liveStreamEndpoint(eventId),
    body,
  );
  return data;
}

/** Picks a photo and uploads it under the shared cover purpose. */
export async function pickAndUploadCover(
  source: 'camera' | 'library',
): Promise<StoredFile | null> {
  const picked = await pickImage(source);
  if (!picked) return null;
  return uploadImage(picked, COVER_PURPOSE);
}
