import { useCallback, useEffect, useState } from 'react';
import { absoluteFileUrl } from '../../services/urls';
import { NAME_GATE_COPY, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from './constants';
import { useNameStatus, useUpdateProfileBasics } from './hooks';
import { pickPhoto, uploadProfilePhoto } from './services';
import type { PhotoSource } from './types';

export interface NameCaptureContainerResult {
  /** True once the real backend record says the account still lacks a name or a photo. */
  isVisible: boolean;
  name: string;
  setName: (value: string) => void;
  /** What the avatar shows: the photo just picked, or the one on file. Null for none. */
  photoPreview: string | null;
  isUploadingPhoto: boolean;
  choosePhoto: (source: PhotoSource) => void;
  /** Both a valid name and an uploaded photo — Continue is live only then. */
  isValid: boolean;
  hasPhoto: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  submit: () => void;
}

/**
 * The account whose profile basics were saved in this app launch, if any.
 *
 * Home mounts this page in each of its render branches, so saving — which
 * refetches the feed and remounts Home — would otherwise mount a fresh copy
 * that still believed the step was undone. Keyed by account, not a boolean:
 * signing out and in with a new number in the same launch is a different
 * person, and a boolean set by the first kept the page from opening for the
 * second. Per-launch by design — the backend record is the source of truth
 * on the next cold start.
 */
let savedForUserId: string | null = null;

/**
 * Drives the mandatory first-sign-in step: a photo and a name, both required.
 *
 * Visibility comes from the real user record (GET /user/getUserDetails), not
 * a local flag, so it reappears on every app open until both are saved. An
 * account that already has one of the two is asked only for what is missing
 * — its name is prefilled and its photo shown. The photo uploads the moment
 * it is picked, so Continue only ever sends a file that already exists.
 */
export function useNameCaptureContainer(onNameSaved?: () => void): NameCaptureContainerResult {
  const { data, loading, error } = useNameStatus();
  const saveCall = useUpdateProfileBasics();
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [savedNow, setSavedNow] = useState(false);
  const [attemptedInvalid, setAttemptedInvalid] = useState(false);

  // Start from what the account already has.
  useEffect(() => {
    if (!data) return;
    setName(prev => (prev ? prev : (data.name ?? '').trim()));
    setPhotoUrl(prev => (prev ? prev : (data.photoUrl ?? '').trim()));
  }, [data]);

  const hasRealName = Boolean(data?.name?.trim());
  const hasRealPhoto = Boolean(data?.photoUrl?.trim());
  const resolved = savedNow || (data?.id != null && data.id === savedForUserId);
  /*
   * Only a successful read that says something is missing opens the page. A
   * failed read tells us nothing about the account, and blocking Home behind
   * a mandatory page because the network blipped is worse than asking on the
   * next open.
   */
  const isVisible = !loading && error === null && !(hasRealName && hasRealPhoto) && !resolved;

  const trimmed = name.trim();
  const nameOk = trimmed.length >= NAME_MIN_LENGTH && trimmed.length <= NAME_MAX_LENGTH;
  const hasPhoto = photoUrl !== '';
  const isValid = nameOk && hasPhoto && !isUploadingPhoto;

  const handleSetName = useCallback((value: string) => {
    setName(value);
    setAttemptedInvalid(false);
  }, []);

  const choosePhoto = useCallback((source: PhotoSource) => {
    setPhotoError(null);
    pickPhoto(source)
      .then(picked => {
        if (!picked) return undefined;
        setLocalPreview(picked.uri);
        setIsUploadingPhoto(true);
        return uploadProfilePhoto(picked).then(url => setPhotoUrl(url));
      })
      .catch((err: unknown) => {
        setLocalPreview(null);
        setPhotoError((err as { message?: string })?.message || NAME_GATE_COPY.uploadFailed);
      })
      .finally(() => setIsUploadingPhoto(false));
  }, []);

  const submit = useCallback(() => {
    if (!isValid) {
      setAttemptedInvalid(true);
      return;
    }
    saveCall
      .execute({ name: trimmed, photoUrl })
      .then(() => {
        savedForUserId = data?.id ?? null;
        setSavedNow(true);
        onNameSaved?.();
      })
      .catch(() => {
        // error is already captured in saveCall.error
      });
  }, [isValid, trimmed, photoUrl, saveCall, onNameSaved, data?.id]);

  const validationMessage = !attemptedInvalid
    ? null
    : !hasPhoto
      ? NAME_GATE_COPY.needPhoto
      : !nameOk
        ? NAME_GATE_COPY.errorTooShort
        : null;

  return {
    isVisible,
    name,
    setName: handleSetName,
    photoPreview: localPreview ?? (photoUrl ? absoluteFileUrl(photoUrl) : null),
    isUploadingPhoto,
    choosePhoto,
    isValid,
    hasPhoto,
    isSubmitting: saveCall.loading,
    errorMessage: photoError ?? validationMessage ?? saveCall.error?.message ?? null,
    submit,
  };
}
