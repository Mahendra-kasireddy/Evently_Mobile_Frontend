import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import { apiClient } from '../../services/apiClient';
import { UPLOAD_ENDPOINT } from '../Shared/upload';
import type { StoredFile } from '../Shared';
import {
  INVITATION_COPY as COPY,
  LIMITS,
  invitationEndpoint,
  memoriesEndpoint,
  resolveEndpoint,
  sendEndpoint,
} from './constants';
import type {
  MemoryGalleryDTO,
  MemoryUploadOutcomeDTO,
  OrganizerInvitationDTO,
  PickedFile,
  UpdateInvitationBody,
} from './types';

/** Ten minutes: large clips on event-venue networks. */
const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000;

/** The organizer's working copy — created by the server on first open. */
export async function getInvitation(
  bookingId: string,
): Promise<OrganizerInvitationDTO> {
  const { data } = await apiClient.get<OrganizerInvitationDTO>(
    invitationEndpoint(bookingId),
  );
  return data;
}

/** Partial update; the API answers with the whole invitation. */
export async function patchInvitation(
  bookingId: string,
  body: UpdateInvitationBody,
): Promise<OrganizerInvitationDTO> {
  const { data } = await apiClient.patch<OrganizerInvitationDTO>(
    invitationEndpoint(bookingId),
    body,
  );
  return data;
}

/** Hands the invitation to the customer; closes their open asks. */
export async function sendInvitation(
  bookingId: string,
): Promise<OrganizerInvitationDTO> {
  const { data } = await apiClient.post<OrganizerInvitationDTO>(
    sendEndpoint(bookingId),
    {},
  );
  return data;
}

export async function resolveChangeRequest(
  bookingId: string,
  requestId: string,
): Promise<OrganizerInvitationDTO> {
  const { data } = await apiClient.post<OrganizerInvitationDTO>(
    resolveEndpoint(bookingId, requestId),
    {},
  );
  return data;
}

export interface MemoryQuery {
  kind?: string;
  subEvent?: string;
  before?: string;
}

/** One page of Shared Memories. 403 when the customer has it switched off. */
export async function getMemories(
  bookingId: string,
  query: MemoryQuery = {},
): Promise<MemoryGalleryDTO> {
  const params: string[] = [`limit=${LIMITS.memoryPage}`];
  if (query.kind && query.kind !== 'all')
    params.push(`kind=${encodeURIComponent(query.kind)}`);
  if (query.subEvent && query.subEvent !== 'all')
    params.push(`subEvent=${encodeURIComponent(query.subEvent)}`);
  if (query.before) params.push(`before=${encodeURIComponent(query.before)}`);
  const { data } = await apiClient.get<MemoryGalleryDTO>(
    `${memoriesEndpoint(bookingId)}?${params.join('&')}`,
  );
  return data;
}

/** Adds the organizer's own photo or clip; answers with the server's sentence. */
export async function uploadMemory(
  bookingId: string,
  file: PickedFile,
  reel: boolean,
): Promise<MemoryUploadOutcomeDTO> {
  const body = new FormData();
  // React Native's FormData takes this {uri,name,type} shape for file parts.
  body.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);
  if (file.type.startsWith('video/')) {
    body.append('durationSec', String(Math.round(file.duration ?? 0)));
    if (reel) body.append('reel', 'true');
  }
  const { data } = await apiClient.post<MemoryUploadOutcomeDTO>(
    memoriesEndpoint(bookingId),
    body,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: UPLOAD_TIMEOUT_MS,
    },
  );
  return data;
}

/**
 * Any picked file through the shared `/upload` endpoint under a purpose.
 *
 * The same request as Shared's `uploadImage`, with a longer timeout: the
 * client's 60s is right for JSON and wrong for a 250MB invitation video.
 */
export async function uploadFile(
  file: PickedFile,
  purpose: string,
): Promise<StoredFile> {
  const form = new FormData();
  form.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);
  form.append('purpose', purpose);
  const { data } = await apiClient.post<StoredFile>(UPLOAD_ENDPOINT, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: UPLOAD_TIMEOUT_MS,
  });
  return { url: data.url, key: data.key, originalName: data.originalName };
}

/* ---- Pickers -------------------------------------------------------------- */

function pickError(result: ImagePickerResponse): Error {
  return new Error(
    result.errorCode === 'camera_unavailable'
      ? 'No camera is available on this device.'
      : result.errorCode === 'permission'
      ? 'Allow photo access in Settings to add photos and videos.'
      : COPY.pickFailed,
  );
}

function toPicked(asset: Asset | undefined): PickedFile | null {
  if (!asset?.uri) return null;
  const isClip =
    (asset.type ?? '').startsWith('video/') || (asset.duration ?? 0) > 0;
  return {
    uri: asset.uri,
    name: asset.fileName ?? (isClip ? `clip-${Date.now()}.mp4` : 'photo.jpg'),
    type: asset.type ?? (isClip ? 'video/mp4' : 'image/jpeg'),
    fileSize: asset.fileSize,
    duration: asset.duration,
  };
}

async function handle(
  run: Promise<ImagePickerResponse>,
): Promise<PickedFile | null> {
  const result = await run;
  if (result.didCancel) return null;
  if (result.errorCode) throw pickError(result);
  return toPicked(result.assets?.[0]);
}

/** One video from the library, with its length and size for the checks. */
export function pickVideo(): Promise<PickedFile | null> {
  return handle(
    launchImageLibrary({
      mediaType: 'video',
      selectionLimit: 1,
      formatAsMp4: true,
    }),
  );
}

/** A photo or a clip from the library, for Shared Memories. */
export function pickMemoryFromLibrary(): Promise<PickedFile | null> {
  return handle(
    launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 1,
      maxWidth: 2560,
      maxHeight: 2560,
      quality: 0.9,
      formatAsMp4: true,
    }),
  );
}

/** The camera: a photo, or a reel capped at the reel length. */
export function captureMemory(
  kind: 'photo' | 'reel',
): Promise<PickedFile | null> {
  return handle(
    kind === 'photo'
      ? launchCamera({
          mediaType: 'photo',
          maxWidth: 2560,
          maxHeight: 2560,
          quality: 0.9,
          saveToPhotos: false,
        })
      : launchCamera({
          mediaType: 'video',
          videoQuality: 'high',
          durationLimit: 60,
          saveToPhotos: false,
        }),
  );
}
