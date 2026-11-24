import { launchImageLibrary } from 'react-native-image-picker';
import { apiClient } from '../../services/apiClient';
import { pickImage, uploadImage, type PickedImage } from '../Shared';
import {
  IDEA_IMAGE_PURPOSE,
  boardEndpoint,
  replyEndpoint,
  visionEndpoint,
} from './constants';
import type {
  IdeaBoardDTO,
  IdeaDTO,
  IdeaImageDTO,
  OrganizerPostBody,
  ReplyBody,
  VisionBody,
} from './types';
import { normalizeBoard, toIdeaImage } from './utils';

/** The board for one booking. The server checks it is this organizer's. */
export async function getBoard(bookingId: string): Promise<IdeaBoardDTO> {
  const { data } = await apiClient.get<IdeaBoardDTO>(boardEndpoint(bookingId));
  return normalizeBoard(data);
}

/** An update or a question onto the feed — returns the new post. */
export async function postIdea(
  bookingId: string,
  body: OrganizerPostBody,
): Promise<IdeaDTO> {
  const { data } = await apiClient.post<IdeaDTO>(
    boardEndpoint(bookingId),
    body,
  );
  return { ...data, images: data.images ?? [] };
}

/** The organizer's reply on a post — returns the post as it now stands. */
export async function replyToIdea(
  ideaId: string,
  body: ReplyBody,
): Promise<IdeaDTO> {
  const { data } = await apiClient.post<IdeaDTO>(replyEndpoint(ideaId), body);
  return { ...data, images: data.images ?? [] };
}

/** The event vision — returns the whole board. */
export async function updateVision(
  bookingId: string,
  body: VisionBody,
): Promise<IdeaBoardDTO> {
  const { data } = await apiClient.patch<IdeaBoardDTO>(
    visionEndpoint(bookingId),
    body,
  );
  return normalizeBoard(data);
}

/**
 * Photos from the camera (one) or the library (up to `limit`), sized like
 * Shared/pickImage. An empty list when the organizer backs out.
 */
export async function pickPhotos(
  source: 'camera' | 'library',
  limit: number,
): Promise<PickedImage[]> {
  if (limit <= 0) return [];
  if (source === 'camera') {
    const one = await pickImage('camera');
    return one ? [one] : [];
  }
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1600,
    maxHeight: 1600,
    selectionLimit: limit,
  });
  if (result.didCancel) return [];
  if (result.errorCode) {
    throw new Error(
      result.errorCode === 'permission'
        ? 'Allow photo access in Settings to add photos.'
        : 'Could not open your photos. Please try again.',
    );
  }
  return (result.assets ?? [])
    .filter(a => !!a.uri)
    .slice(0, limit)
    .map((a, i) => ({
      uri: a.uri as string,
      name: a.fileName ?? `idea-${Date.now()}-${i}.jpg`,
      type: a.type ?? 'image/jpeg',
    }));
}

/** One picked photo through POST /upload, as a post stores it. */
export async function uploadIdeaPhoto(
  picked: PickedImage,
): Promise<IdeaImageDTO> {
  const stored = await uploadImage(picked, IDEA_IMAGE_PURPOSE);
  return toIdeaImage(stored, picked.name);
}
