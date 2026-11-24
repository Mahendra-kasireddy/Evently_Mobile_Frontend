import { Alert } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import { apiClient } from '../../services/apiClient';

export const UPLOAD_ENDPOINT = '/upload';

/** What the server stores for an uploaded file — sent back as-is in PATCHes. */
export interface StoredFile {
  url: string;
  key: string;
  originalName?: string;
}

export interface PickedImage {
  uri: string;
  name: string;
  type: string;
}

type Source = 'camera' | 'library';

/** Asks Camera or Photo library; null if the organizer cancels. */
export function chooseImageSource(title: string): Promise<Source | null> {
  return new Promise(resolve => {
    Alert.alert(
      title,
      undefined,
      [
        { text: 'Take photo', onPress: () => resolve('camera') },
        { text: 'Choose from library', onPress: () => resolve('library') },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}

/**
 * One photo from the camera or the library, sized for the web too (the server
 * refuses anything over 4096px or 5MB). Null when the organizer backs out.
 */
export async function pickImage(
  source: Source,
  maxSize = 1600,
): Promise<PickedImage | null> {
  const options = {
    mediaType: 'photo' as const,
    quality: 0.8 as const,
    maxWidth: maxSize,
    maxHeight: maxSize,
    selectionLimit: 1,
  };
  const result: ImagePickerResponse =
    source === 'camera'
      ? await launchCamera({ ...options, saveToPhotos: false })
      : await launchImageLibrary(options);
  if (result.didCancel) return null;
  if (result.errorCode) {
    throw new Error(
      result.errorCode === 'camera_unavailable'
        ? 'No camera is available on this device.'
        : result.errorCode === 'permission'
        ? 'Allow photo access in Settings to add photos.'
        : 'Could not open your photos. Please try again.',
    );
  }
  const asset = result.assets?.[0];
  if (!asset?.uri) return null;
  return {
    uri: asset.uri,
    name: asset.fileName ?? `photo-${Date.now()}.jpg`,
    type: asset.type ?? 'image/jpeg',
  };
}

/** Uploads one picked image under an upload purpose ('profileImage', 'gallery', …). */
export async function uploadImage(
  image: PickedImage,
  purpose: string,
): Promise<StoredFile> {
  const form = new FormData();
  // React Native's FormData takes this {uri,name,type} shape for file parts.
  form.append('file', {
    uri: image.uri,
    name: image.name,
    type: image.type,
  } as unknown as Blob);
  form.append('purpose', purpose);
  const { data } = await apiClient.post<StoredFile>(UPLOAD_ENDPOINT, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return { url: data.url, key: data.key, originalName: data.originalName };
}
