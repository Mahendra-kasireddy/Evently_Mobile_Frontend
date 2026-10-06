import { launchCamera, launchImageLibrary, type ImagePickerResponse } from 'react-native-image-picker';
import { apiClient } from '../../services/apiClient';
import {
  GET_USER_DETAILS_ENDPOINT,
  PROFILE_PHOTO_PURPOSE,
  UPDATE_PROFILE_ENDPOINT,
  UPLOAD_ENDPOINT,
} from './constants';
import type {
  PhotoSource,
  PickedPhoto,
  ProfileBasics,
  UpdateNameResponseDTO,
  UserNameStatusDTO,
} from './types';

export async function fetchNameStatus(): Promise<UserNameStatusDTO> {
  const { data } = await apiClient.get<UserNameStatusDTO>(GET_USER_DETAILS_ENDPOINT);
  return data;
}

/** Saves the name and photo together — the step is done only when both are. */
export async function updateProfileBasics(basics: ProfileBasics): Promise<UpdateNameResponseDTO> {
  const { data } = await apiClient.patch<UpdateNameResponseDTO>(UPDATE_PROFILE_ENDPOINT, basics);
  return data;
}

/**
 * Opens the camera or the photo library for one photo. Null when the person
 * backs out. Square-ish and modest in size: it is an avatar, and the server
 * refuses anything over 4096px or 5MB.
 */
export async function pickPhoto(source: PhotoSource): Promise<PickedPhoto | null> {
  const options = {
    mediaType: 'photo' as const,
    quality: 0.8 as const,
    maxWidth: 1024,
    maxHeight: 1024,
    selectionLimit: 1,
  };
  const result: ImagePickerResponse =
    source === 'camera'
      ? await launchCamera({ ...options, cameraType: 'front', saveToPhotos: false })
      : await launchImageLibrary(options);
  if (result.didCancel) return null;
  if (result.errorCode) {
    throw new Error(
      result.errorCode === 'camera_unavailable'
        ? 'No camera is available on this device.'
        : result.errorCode === 'permission'
          ? 'Allow photo access in Settings to add a profile photo.'
          : 'Could not open your photos. Please try again.',
    );
  }
  const asset = result.assets?.[0];
  if (!asset?.uri) return null;
  return {
    uri: asset.uri,
    name: asset.fileName ?? `profile-${Date.now()}.jpg`,
    type: asset.type ?? 'image/jpeg',
  };
}

/** Uploads the picked photo; returns the URL the server stored it at. */
export async function uploadProfilePhoto(photo: PickedPhoto): Promise<string> {
  const form = new FormData();
  // React Native's FormData takes this {uri,name,type} shape for file parts.
  form.append('file', { uri: photo.uri, name: photo.name, type: photo.type } as unknown as Blob);
  form.append('purpose', PROFILE_PHOTO_PURPOSE);
  const { data } = await apiClient.post<{ url: string }>(UPLOAD_ENDPOINT, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
}
