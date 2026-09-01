import { apiClient } from '../../services/apiClient';
import { isNormalizedApiError } from '../../services/errors';
import {
  BOOKING_DETAIL_ENDPOINT,
  IDEA_BOARD_ENDPOINT,
  IDEA_IMAGE_PURPOSE,
  INVITATION_ENDPOINT,
  UPLOAD_ENDPOINT,
} from './constants';
import type {
  BookingDetailDTO,
  DraftPost,
  IdeaBoardDTO,
  IdeaDTO,
  IdeaImage,
  InvitationDTO,
  PickedImage,
} from './types';

/** One booking, with its milestones, tasks and timeline. */
export async function fetchBookingDetail(bookingId: string): Promise<BookingDetailDTO> {
  const { data } = await apiClient.get<BookingDetailDTO>(`${BOOKING_DETAIL_ENDPOINT}/${bookingId}`);
  return data;
}

/** The ideas & planning board for one booking. */
export async function fetchIdeaBoard(bookingId: string): Promise<IdeaBoardDTO> {
  const { data } = await apiClient.get<IdeaBoardDTO>(`${IDEA_BOARD_ENDPOINT}/${bookingId}`);
  return data;
}

/**
 * The customer's guest invitation.
 *
 * Resolves to null while the invitation is still the organizer's draft — the
 * endpoint 404s that case, and it is the normal early state rather than a
 * failure the workspace should report as one.
 */
export async function fetchInvitation(bookingId: string): Promise<InvitationDTO | null> {
  try {
    const { data } = await apiClient.get<InvitationDTO>(`${INVITATION_ENDPOINT}/${bookingId}`);
    return data;
  } catch (error) {
    // The client's interceptor normalizes every failure, so this is a status
    // check rather than a guess at an axios error's shape.
    if (isNormalizedApiError(error) && error.status === 404) return null;
    throw error;
  }
}

/** Post to the board — text, kind, whether it stays private, and any photos. */
export async function createIdea(bookingId: string, draft: DraftPost): Promise<IdeaDTO> {
  const { data } = await apiClient.post<IdeaDTO>(`${IDEA_BOARD_ENDPOINT}/${bookingId}`, {
    text: draft.text,
    type: draft.type,
    confidential: draft.confidential,
    images: draft.images,
  });
  return data;
}

/**
 * Push one reference photo through the shared /upload endpoint and return the
 * metadata a post stores. The board never holds file bytes itself — a post
 * records the stored URL and key, which is what makes an attachment survive a
 * reload. Uploading as the photo is picked means a post is only ever submitted
 * with attachments that already exist on the server.
 */
export async function uploadIdeaImage(file: PickedImage): Promise<IdeaImage> {
  const form = new FormData();
  // React Native's FormData takes this {uri,name,type} shape for file parts.
  form.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
  form.append('purpose', IDEA_IMAGE_PURPOSE);
  const { data } = await apiClient.post<{ url: string; key: string; originalName?: string }>(
    UPLOAD_ENDPOINT,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return { url: data.url, key: data.key, originalName: data.originalName ?? file.name };
}

/** Sign off on a post the organizer flagged as needing the customer's approval. */
export async function approveIdea(ideaId: string): Promise<IdeaDTO> {
  const { data } = await apiClient.post<IdeaDTO>(`${IDEA_BOARD_ENDPOINT}/${ideaId}/approve`);
  return data;
}
