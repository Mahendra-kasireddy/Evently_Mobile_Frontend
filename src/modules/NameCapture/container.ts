import { useCallback, useState } from 'react';
import { NAME_GATE_COPY, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from './constants';
import { useNameStatus, useUpdateName } from './hooks';

export interface NameCaptureContainerResult {
  /** True once we've confirmed (via the real backend record) the user has no name yet. */
  isVisible: boolean;
  name: string;
  setName: (value: string) => void;
  isValid: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  submit: () => void;
}

/**
 * Set once the name has actually been saved in this app launch.
 *
 * Home mounts this sheet in each of its three render branches (loading /
 * error / content), so saving a name — which refetches the feed and flips
 * Home back to its loading branch — unmounts the instance that knows the name
 * was just saved and mounts a fresh one. Without this, the sheet reappeared on
 * top of Home right after "Continue". Module scope, not a ref: it has to
 * outlive the component, and it is per-launch by design — the backend record
 * is still the source of truth on the next cold start.
 */
let savedThisLaunch = false;

/**
 * Drives the mandatory "what should we call you" bottom sheet. Visibility is
 * derived from the real user record (GET /user/getUserDetails), not a local
 * flag — so it reappears on every app open until a name is actually saved,
 * matching the "no skip, never optional" requirement. `onNameSaved` lets the
 * caller (Home) refresh its own feed so the greeting picks up the new name.
 */
export function useNameCaptureContainer(onNameSaved?: () => void): NameCaptureContainerResult {
  const { data, loading, error } = useNameStatus();
  const updateNameCall = useUpdateName();
  const [name, setName] = useState('');
  const [resolved, setResolved] = useState(savedThisLaunch);
  const [attemptedInvalid, setAttemptedInvalid] = useState(false);

  const hasRealName = Boolean(data?.name && data.name.trim().length > 0);
  /*
   * Only a successful read that says "no name" opens the gate. A failed read
   * tells us nothing about the account, and blocking Home behind a mandatory
   * sheet because the network blipped is worse than showing Home and asking
   * on the next open.
   */
  const isVisible = !loading && error === null && !hasRealName && !resolved;

  const trimmed = name.trim();
  const isValid = trimmed.length >= NAME_MIN_LENGTH && trimmed.length <= NAME_MAX_LENGTH;

  const handleSetName = useCallback((value: string) => {
    setName(value);
    setAttemptedInvalid(false);
  }, []);

  const submit = useCallback(() => {
    if (!isValid) {
      setAttemptedInvalid(true);
      return;
    }
    updateNameCall
      .execute(trimmed)
      .then(() => {
        savedThisLaunch = true;
        setResolved(true);
        onNameSaved?.();
      })
      .catch(() => {
        // error is already captured in updateNameCall.error
      });
  }, [isValid, trimmed, updateNameCall, onNameSaved]);

  return {
    isVisible,
    name,
    setName: handleSetName,
    isValid,
    isSubmitting: updateNameCall.loading,
    errorMessage: attemptedInvalid && !isValid ? NAME_GATE_COPY.errorTooShort : (updateNameCall.error?.message ?? null),
    submit,
  };
}
