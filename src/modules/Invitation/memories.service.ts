import { apiClient } from '../../services/apiClient';
import { MY_INVITATIONS_ENDPOINT } from './constants';
import type {
  MemoryGalleryDTO,
  MemorySettingsDTO,
  MemoryUploadOutcomeDTO,
  UploadMemoryInput,
} from './types';

/**
 * Shared Memories, over the API the web already uses.
 *
 * No mobile-specific model, endpoint or rule: the same routes, the same
 * server-side separation, duplicate detection, quality checks and moderation.
 * This app signs in as the customer, so it reaches the `mine/:bookingId`
 * prefix — the guest prefix takes a share token, and a guest has no app.
 */

const base = (bookingId: string) =>
  `${MY_INVITATIONS_ENDPOINT}/${encodeURIComponent(bookingId)}/memories`;

/** Whether the gallery exists at all, and who may do what with it. */
export async function fetchMemorySettings(
  bookingId: string,
): Promise<MemorySettingsDTO> {
  const { data } = await apiClient.get<MemorySettingsDTO>(
    `${base(bookingId)}/settings`,
  );
  return data;
}

/**
 * Turning the gallery on, or changing who may do what with it.
 *
 * The customer's own route — they own the celebration, so they own this. A
 * partial patch rather than the whole object, so two screens open on the same
 * event cannot write back a stale copy of each other's settings.
 */
export async function saveMemorySettings(
  bookingId: string,
  patch: Partial<Omit<MemorySettingsDTO, 'window'>>,
): Promise<MemorySettingsDTO> {
  const { data } = await apiClient.patch<MemorySettingsDTO>(
    `${base(bookingId)}/settings`,
    patch,
  );
  return data;
}

export interface GalleryQuery {
  kind?: string;
  subEvent?: string;
  /** The `createdAt` of the last item on the previous page. */
  before?: string;
}

export async function fetchMemories(
  bookingId: string,
  query: GalleryQuery = {},
): Promise<MemoryGalleryDTO> {
  const params = new URLSearchParams();
  if (query.kind && query.kind !== 'all') params.set('kind', query.kind);
  if (query.subEvent && query.subEvent !== 'all')
    params.set('subEvent', query.subEvent);
  if (query.before) params.set('before', query.before);
  const suffix = params.toString();
  const { data } = await apiClient.get<MemoryGalleryDTO>(
    `${base(bookingId)}${suffix ? `?${suffix}` : ''}`,
  );
  return data;
}

/**
 * Adding one, as multipart through the shared client.
 *
 * The clip's length is measured on the device because the server has no
 * decoder; it is a claim, the server clamps it, and the worst a wrong one does
 * is put the clip in the other tab. Everything that matters — what kind it is,
 * which celebration, whether it is a duplicate, whether it is usable — is
 * decided on the server.
 */
export async function uploadMemory(
  bookingId: string,
  input: UploadMemoryInput,
  onProgress?: (fraction: number) => void,
): Promise<MemoryUploadOutcomeDTO> {
  const body = new FormData();
  body.append('file', {
    uri: input.uri,
    name: input.fileName,
    type: input.mimeType,
  } as unknown as Blob);
  if (input.subEventId) body.append('subEventId', input.subEventId);
  if (input.caption) body.append('caption', input.caption);
  if (input.durationSec !== undefined)
    body.append('durationSec', String(input.durationSec));
  if (input.reel) body.append('reel', 'true');

  const { data } = await apiClient.post<MemoryUploadOutcomeDTO>(
    base(bookingId),
    body,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: event => {
        if (!onProgress || !event.total) return;
        onProgress(Math.min(1, event.loaded / event.total));
      },
    },
  );
  return data;
}
