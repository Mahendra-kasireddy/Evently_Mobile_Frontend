import { useCallback, useState } from 'react';
import { useUpdateProfile, useUserDetails } from './hooks';
import { changedFields, detailsOf, hasChanges, isValidEmail } from './utils';
import type { ProfileDetails, UserDetailsDTO } from './types';

export interface SettingsContainerResult {
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
}

const EMPTY: ProfileDetails = { name: '', email: '', city: '' };

/**
 * Settings' business logic: load the account, hold an edit draft, and save
 * only what changed.
 *
 * The draft is seeded during render rather than from an effect — this codebase
 * forbids setState in effect bodies, and the pattern used elsewhere is to
 * adjust state while rendering when the source data arrives.
 */
export function useSettingsContainer(): SettingsContainerResult {
  const { data, loading, error, refetch } = useUserDetails();
  const update = useUpdateProfile();

  const [saved, setSaved] = useState<UserDetailsDTO | null>(null);
  const [draft, setDraft] = useState<ProfileDetails>(EMPTY);
  const [seededFrom, setSeededFrom] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const user = saved ?? data;

  // Seed once per account, and again after a save replaces the source.
  if (user && seededFrom !== user.id + (user.name ?? '') + (user.email ?? '') + (user.city ?? '')) {
    setSeededFrom(user.id + (user.name ?? '') + (user.email ?? '') + (user.city ?? ''));
    setDraft(detailsOf(user));
  }

  const setField = useCallback((key: keyof ProfileDetails, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
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
      .then((next) => {
        setSaved(next);
        setJustSaved(true);
      })
      .catch(() => {
        // error surfaces through update.error
      });
  }, [draft, update, user]);

  return {
    user,
    draft,
    setField,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
    isSaving: update.loading,
    saveErrorMessage: emailError ? emailError : (update.error?.message ?? null),
    justSaved,
    canSave,
    save,
  };
}
