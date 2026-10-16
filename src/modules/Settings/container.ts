import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { clearSession } from '../../store/authSlice';
import { absoluteFileUrl } from '../../services/urls';
import { pickPhoto, uploadProfilePhoto } from '../NameCapture/services';
import type { PhotoSource } from '../NameCapture/types';
import {
  useCloseAccount,
  useNotificationPrefs,
  useUpdatePrefs,
  useUpdateProfile,
  useUserDetails,
} from './hooks';
import { changedFields, detailsOf, hasChanges, isValidEmail } from './utils';
import type {
  NotificationPrefs,
  ProfileDetails,
  UserDetailsDTO,
} from './types';

export interface EditProfileContainerResult {
  user: UserDetailsDTO | null;
  /** The form's current values. */
  draft: ProfileDetails;
  setField: (key: keyof ProfileDetails, value: string) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
  isSaving: boolean;
  saveErrorMessage: string | null;
  /** True once a save has landed and nothing has been edited since. */
  justSaved: boolean;
  canSave: boolean;
  save: () => void;

  /** The current photo, ready for an <Image>; '' when there is none. */
  photoUrl: string;
  /** Picking, uploading and saving a new photo. */
  photoBusy: boolean;
  photoError: string | null;
  changePhoto: (source: PhotoSource) => void;
}

const EMPTY: ProfileDetails = { name: '', email: '', city: '' };

/**
 * Edit profile's business logic: load the account, hold an edit draft, save
 * only what changed — and change the photo, which saves on its own.
 *
 * The draft is seeded during render rather than from an effect — this codebase
 * forbids setState in effect bodies, and the pattern used elsewhere is to
 * adjust state while rendering when the source data arrives.
 */
export function useEditProfileContainer(): EditProfileContainerResult {
  const { data, loading, error, refetch } = useUserDetails();
  const update = useUpdateProfile();

  const [saved, setSaved] = useState<UserDetailsDTO | null>(null);
  const [draft, setDraft] = useState<ProfileDetails>(EMPTY);
  const [seededFrom, setSeededFrom] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const user = saved ?? data;

  // Seed once per account, and again after a save replaces the source.
  const seed = user
    ? user.id + (user.name ?? '') + (user.email ?? '') + (user.city ?? '')
    : null;
  if (user && seededFrom !== seed) {
    setSeededFrom(seed);
    setDraft(detailsOf(user));
  }

  const setField = useCallback((key: keyof ProfileDetails, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    setJustSaved(false);
    setEmailError(null);
  }, []);

  const base = user ? detailsOf(user) : EMPTY;
  const canSave = !!user && hasChanges(base, draft) && !update.loading;

  const save = useCallback(() => {
    if (!user) return;
    if (!isValidEmail(draft.email)) {
      setEmailError('invalid-email');
      return;
    }
    const body = changedFields(detailsOf(user), draft);
    if (Object.keys(body).length === 0) return;

    update
      .execute(body)
      .then(next => {
        setSaved(next);
        setJustSaved(true);
      })
      .catch(() => {
        // error surfaces through update.error
      });
  }, [draft, update, user]);

  /*
   * A new photo is uploaded and saved straight away — there is nothing to
   * review before it counts, and it should not wait on the text fields. The
   * old photo is cleaned up by the server once this one is saved.
   */
  const changePhoto = useCallback(
    (source: PhotoSource) => {
      if (photoBusy) return;
      setPhotoError(null);
      pickPhoto(source)
        .then(async picked => {
          if (!picked) return;
          setPhotoBusy(true);
          const url = await uploadProfilePhoto(picked);
          const next = await update.execute({ photoUrl: url });
          setSaved(next);
        })
        .catch((err: unknown) => {
          setPhotoError(
            err instanceof Error && err.message
              ? err.message
              : "Your photo didn't save. Please try again.",
          );
        })
        .finally(() => setPhotoBusy(false));
    },
    [photoBusy, update],
  );

  return {
    user,
    draft,
    setField,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
    isSaving: update.loading && !photoBusy,
    saveErrorMessage: emailError
      ? emailError
      : photoBusy
      ? null
      : update.error?.message ?? null,
    justSaved,
    canSave,
    save,
    photoUrl: absoluteFileUrl(user?.photoUrl),
    photoBusy,
    photoError,
    changePhoto,
  };
}

export interface SettingsContainerResult {
  user: UserDetailsDTO | null;
  photoUrl: string;
  /** null until the server answers. */
  prefs: NotificationPrefs | null;
  prefsLoading: boolean;
  prefError: string | null;
  togglePref: (key: keyof NotificationPrefs, value: boolean) => void;
  closing: boolean;
  closeError: string | null;
  closeAccount: () => void;
  refetch: () => void;
}

/**
 * Settings: how the app behaves for this account — what it notifies about,
 * and closing the account. The profile itself is edited on its own screen.
 *
 * A switch moves the moment it is tapped and is put back if the save fails,
 * with a line saying so: a toggle that waits on the network feels broken, and
 * one that silently disagrees with the server is worse.
 */
export function useSettingsContainer(): SettingsContainerResult {
  const dispatch = useAppDispatch();
  const details = useUserDetails();
  const prefsQuery = useNotificationPrefs();
  const updatePrefs = useUpdatePrefs();
  const close = useCloseAccount();

  const [overrides, setOverrides] = useState<Partial<NotificationPrefs>>({});
  const [prefError, setPrefError] = useState<string | null>(null);

  const prefs = prefsQuery.data ? { ...prefsQuery.data, ...overrides } : null;

  const togglePref = useCallback(
    (key: keyof NotificationPrefs, value: boolean) => {
      setPrefError(null);
      setOverrides(prev => ({ ...prev, [key]: value }));
      updatePrefs.execute({ [key]: value }).catch(() => {
        setOverrides(prev => ({ ...prev, [key]: !value }));
        setPrefError('pref');
      });
    },
    [updatePrefs],
  );

  const closeAccount = useCallback(() => {
    close
      .execute()
      .then(() => dispatch(clearSession()))
      .catch(() => {
        // surfaces through close.error
      });
  }, [close, dispatch]);

  const refetch = useCallback(() => {
    details.refetch();
    prefsQuery.refetch();
  }, [details, prefsQuery]);

  return {
    user: details.data,
    photoUrl: absoluteFileUrl(details.data?.photoUrl),
    prefs,
    prefsLoading: prefsQuery.loading,
    prefError,
    togglePref,
    closing: close.loading,
    closeError: close.error ? 'close' : null,
    closeAccount,
    refetch,
  };
}
