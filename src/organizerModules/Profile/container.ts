import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { saveDefaultRole } from '../../services/defaultRole';
import { clearSession, setActiveView } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { chooseImageSource, pickImage, uploadImage } from '../Shared';
import {
  GALLERY_MAX,
  PROFILE_COPY as COPY,
  PURPOSE_GALLERY,
  PURPOSE_PROFILE_IMAGE,
} from './constants';
import {
  useOrganizerProfile,
  useProfilePreview,
  useServicesConfig,
} from './hooks';
import {
  logoutOnServer,
  patchBasics,
  patchPortfolio,
  patchServices,
} from './services';
import type {
  EditErrors,
  EditForm,
  IdentityModel,
  PortfolioImage,
} from './types';
import {
  changedSections,
  formFrom,
  isDirty,
  mapGallery,
  mapIdentity,
  validate,
} from './utils';

/** Refetch whenever the screen comes back into view; the first focus is the mount. */
function useRefetchOnFocus(refetch: () => void) {
  const seen = useRef(false);
  const ref = useRef(refetch);
  ref.current = refetch;
  useFocusEffect(
    useCallback(() => {
      if (seen.current) ref.current();
      seen.current = true;
    }, []),
  );
}

export interface ProfileContainerResult {
  identity: IdentityModel | null;
  gallery: PortfolioImage[];
  galleryFull: boolean;
  /** 'photo' or 'gallery' while an upload runs. */
  uploading: 'photo' | 'gallery' | null;
  notice: string | null;
  switching: boolean;
  signingOut: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  refresh: () => void;
  changePhoto: () => void;
  addWorkPhoto: () => void;
  removeWorkPhoto: (index: number) => void;
  switchToCustomer: () => void;
  signOut: () => void;
}

/**
 * The organizer's Profile tab: who they are to customers, the photos of their
 * work, and the way to everything about the account. Photo changes save at
 * once — there is nothing to "save" on this screen.
 */
export function useProfileContainer(): ProfileContainerResult {
  const dispatch = useAppDispatch();
  const profile = useOrganizerProfile();
  const preview = useProfilePreview();
  const config = useServicesConfig();
  const [uploading, setUploading] = useState<'photo' | 'gallery' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const refresh = useCallback(() => {
    profile.refetch();
    preview.refetch();
  }, [profile, preview]);
  useRefetchOnFocus(refresh);

  const data = profile.data;

  const changePhoto = useCallback(() => {
    if (uploading) return;
    setNotice(null);
    (async () => {
      const source = await chooseImageSource(COPY.photoTitle);
      if (!source) return;
      try {
        const image = await pickImage(source, 1024);
        if (!image) return;
        setUploading('photo');
        const file = await uploadImage(image, PURPOSE_PROFILE_IMAGE);
        await patchBasics({ profilePhoto: file });
        profile.refetch();
      } catch (error) {
        setNotice((error as Error)?.message || COPY.uploadFailed);
      } finally {
        setUploading(null);
      }
    })().catch(() => undefined);
  }, [uploading, profile]);

  const addWorkPhoto = useCallback(() => {
    if (uploading || !data || (data.gallery ?? []).length >= GALLERY_MAX)
      return;
    setNotice(null);
    (async () => {
      const source = await chooseImageSource(COPY.workPhotoTitle);
      if (!source) return;
      try {
        const image = await pickImage(source);
        if (!image) return;
        setUploading('gallery');
        const file = await uploadImage(image, PURPOSE_GALLERY);
        await patchPortfolio({ gallery: [...(data.gallery ?? []), file] });
        profile.refetch();
      } catch (error) {
        setNotice((error as Error)?.message || COPY.uploadFailed);
      } finally {
        setUploading(null);
      }
    })().catch(() => undefined);
  }, [uploading, data, profile]);

  const removeWorkPhoto = useCallback(
    (index: number) => {
      if (!data) return;
      setNotice(null);
      patchPortfolio({
        gallery: (data.gallery ?? []).filter((_, i) => i !== index),
      })
        .then(() => profile.refetch())
        .catch(() => setNotice(COPY.removeFailed));
    },
    [data, profile],
  );

  const switchToCustomer = useCallback(() => {
    if (switching) return;
    setSwitching(true);
    // Saving the default is best-effort; the switch happens either way.
    saveDefaultRole('customer')
      .catch(() => undefined)
      .finally(() => dispatch(setActiveView('customer')));
  }, [switching, dispatch]);

  const signOut = useCallback(() => {
    if (signingOut) return;
    setSigningOut(true);
    // An unreachable server must not keep anyone signed in.
    logoutOnServer()
      .catch(() => undefined)
      .finally(() => dispatch(clearSession()));
  }, [signingOut, dispatch]);

  const gallery = useMemo(() => (data ? mapGallery(data) : []), [data]);

  return {
    identity: useMemo(
      () => (data ? mapIdentity(data, preview.data, config.data) : null),
      [data, preview.data, config.data],
    ),
    gallery,
    galleryFull: gallery.length >= GALLERY_MAX,
    uploading,
    notice,
    switching,
    signingOut,
    isLoading: profile.loading && !data,
    errorMessage: !data && profile.error ? profile.error.message : null,
    refresh,
    changePhoto,
    addWorkPhoto,
    removeWorkPhoto,
    switchToCustomer,
    signOut,
  };
}

export interface EditProfileContainerResult {
  form: EditForm;
  errors: EditErrors;
  categories: Array<{ key: string; label: string }>;
  dirty: boolean;
  saving: boolean;
  saveError: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  setField: <K extends keyof EditForm>(key: K, value: EditForm[K]) => void;
  toggleCategory: (key: string) => void;
  /** Saves only what changed; resolves true once everything is saved. */
  save: () => Promise<boolean>;
  retry: () => void;
}

const EMPTY: EditForm = {
  businessName: '',
  displayName: '',
  tagline: '',
  businessDescription: '',
  secondaryCategories: [],
};

/** The Edit business profile form: names, tagline, about, and services. */
export function useEditProfileContainer(): EditProfileContainerResult {
  const profile = useOrganizerProfile();
  const config = useServicesConfig();
  const [baseline, setBaseline] = useState<EditForm>(EMPTY);
  const [form, setForm] = useState<EditForm>(EMPTY);
  const [errors, setErrors] = useState<EditErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const hydrated = useRef(false);

  // Fill the form once, so a later refetch never overwrites what is being typed.
  useEffect(() => {
    if (!profile.data || hydrated.current) return;
    hydrated.current = true;
    const next = formFrom(profile.data);
    setBaseline(next);
    setForm(next);
  }, [profile.data]);

  const setField = useCallback(
    <K extends keyof EditForm>(key: K, value: EditForm[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
      setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev));
      setSaveError(null);
    },
    [],
  );

  const toggleCategory = useCallback((key: string) => {
    setForm(prev => ({
      ...prev,
      secondaryCategories: prev.secondaryCategories.includes(key)
        ? prev.secondaryCategories.filter(k => k !== key)
        : [...prev.secondaryCategories, key],
    }));
    setSaveError(null);
  }, []);

  const save = useCallback(async () => {
    const found = validate(form);
    if (Object.keys(found).length) {
      setErrors(found);
      setSaveError(COPY.fixFields);
      return false;
    }
    const changes = changedSections(baseline, form);
    setSaving(true);
    setSaveError(null);
    try {
      if (changes.basics) await patchBasics(changes.basics);
      if (changes.portfolio) await patchPortfolio(changes.portfolio);
      if (changes.services) await patchServices(changes.services);
      setBaseline(form);
      return true;
    } catch (error) {
      setSaveError((error as Error)?.message || COPY.saveFailed);
      return false;
    } finally {
      setSaving(false);
    }
  }, [form, baseline]);

  return {
    form,
    errors,
    categories: config.data?.categories ?? [],
    dirty: isDirty(baseline, form),
    saving,
    saveError,
    isLoading: profile.loading && !profile.data,
    errorMessage: !profile.data && profile.error ? profile.error.message : null,
    setField,
    toggleCategory,
    save,
    retry: profile.refetch,
  };
}
