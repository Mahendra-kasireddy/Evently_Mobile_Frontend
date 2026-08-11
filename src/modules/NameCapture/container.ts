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
 * Drives the mandatory "what should we call you" bottom sheet. Visibility is
 * derived from the real user record (GET /user/getUserDetails), not a local
 * flag — so it reappears on every app open until a name is actually saved,
 * matching the "no skip, never optional" requirement. `onNameSaved` lets the
 * caller (Home) refresh its own feed so the greeting picks up the new name.
 */
export function useNameCaptureContainer(onNameSaved?: () => void): NameCaptureContainerResult {
  const { data, loading } = useNameStatus();
  const updateNameCall = useUpdateName();
  const [name, setName] = useState('');
  const [resolved, setResolved] = useState(false);
  const [attemptedInvalid, setAttemptedInvalid] = useState(false);

  const hasRealName = Boolean(data?.name && data.name.trim().length > 0);
  const isVisible = !loading && !hasRealName && !resolved;

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
