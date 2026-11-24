import { apiClient } from '../../services/apiClient';
import { pickImage, uploadImage, type PickedImage } from '../Shared';
import {
  PROOF_PURPOSE,
  SUBVENDORS_ENDPOINT,
  bookingEndpoint,
  ideasEndpoint,
  statusEndpoint,
  taskEndpoint,
  tasksEndpoint,
} from './constants';
import type {
  BookingDTO,
  CreateTaskBody,
  IdeaBoardDTO,
  StatusBody,
  StoredFileDTO,
  SubVendorLinkDTO,
  UpdateTaskBody,
} from './types';

/** One booking with its tasks. The server checks it is this organizer's. */
export async function getBooking(bookingId: string): Promise<BookingDTO> {
  const { data } = await apiClient.get<BookingDTO>(bookingEndpoint(bookingId));
  return data;
}

/** Accept, decline or complete — returns the booking as it now stands. */
export async function updateStatus(
  bookingId: string,
  body: StatusBody,
): Promise<BookingDTO> {
  const { data } = await apiClient.patch<BookingDTO>(
    statusEndpoint(bookingId),
    body,
  );
  return data;
}

export async function createTask(
  bookingId: string,
  body: CreateTaskBody,
): Promise<BookingDTO> {
  const { data } = await apiClient.post<BookingDTO>(
    tasksEndpoint(bookingId),
    body,
  );
  return data;
}

export async function updateTask(
  bookingId: string,
  taskId: string,
  body: UpdateTaskBody,
): Promise<BookingDTO> {
  const { data } = await apiClient.patch<BookingDTO>(
    taskEndpoint(bookingId, taskId),
    body,
  );
  return data;
}

export async function deleteTask(
  bookingId: string,
  taskId: string,
): Promise<BookingDTO> {
  const { data } = await apiClient.delete<BookingDTO>(
    taskEndpoint(bookingId, taskId),
  );
  return data;
}

/** The organizer's roster, for the assign picker. */
export async function getSubVendors(): Promise<SubVendorLinkDTO[]> {
  const { data } = await apiClient.get<SubVendorLinkDTO[]>(SUBVENDORS_ENDPOINT);
  return Array.isArray(data) ? data : [];
}

/** The ideas board for this booking — only its counts are used here. */
export async function getIdeaBoard(bookingId: string): Promise<IdeaBoardDTO> {
  const { data } = await apiClient.get<IdeaBoardDTO>(ideasEndpoint(bookingId));
  return data;
}

/** Picks a photo from the camera or library and uploads it as task proof. */
export async function pickAndUploadProof(
  source: 'camera' | 'library',
): Promise<StoredFileDTO | null> {
  const picked: PickedImage | null = await pickImage(source);
  if (!picked) return null;
  return uploadImage(picked, PROOF_PURPOSE);
}
