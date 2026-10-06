import { useCallback, useEffect, useRef, useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import {
  selectAuthRoles,
  selectAuthToken,
  setActiveView,
  setSession,
} from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { REGISTER_COPY } from './constants';
import { fetchOnboardingConfig, registerOrganizer } from './services';
import type { OnboardingConfigDTO, OrganizerSignupDetails } from './types';

export interface OrganizerSignupResult {
  /** True for a new organizer, who fills the sign-up form first. */
  needsDetails: boolean;
  config: OnboardingConfigDTO | null;
  configLoading: boolean;
  configError: boolean;
  retryConfig: () => void;
  submitting: boolean;
  error: string | null;
  /** Registers with the sign-up details, or — with none — resumes an existing registration. */
  submit: (details?: OrganizerSignupDetails) => void;
  /** Registered: the dashboard can open. */
  done: boolean;
}

/**
 * Organizer sign-up once the number is verified.
 *
 * A new organizer gives the basic details and is registered with them; an
 * account that is already an organizer is simply resumed — no form, straight
 * to the dashboard. Either way registering makes organizer the account's
 * default, here and on the server.
 */
export function useOrganizerSignup(enabled: boolean): OrganizerSignupResult {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);
  const roles = useAppSelector(selectAuthRoles);
  /*
   * Whether the number was already an organizer, read once, when the session
   * first appears — the screen often mounts signed out, before the OTP. Read
   * live it would flip to true the moment this sign-up's own register call
   * added the role.
   */
  const [alreadyOrganizer, setAlreadyOrganizer] = useState<boolean | null>(null);
  useEffect(() => {
    if (token && alreadyOrganizer === null) setAlreadyOrganizer(roles.includes('organizer'));
  }, [token, roles, alreadyOrganizer]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Public, cached config; only an organizer sign-up needs it.
  const configQuery = useAsync(
    () => (enabled ? fetchOnboardingConfig() : Promise.resolve(null)),
    [enabled],
  );

  const register = useCallback(
    (details?: OrganizerSignupDetails) => {
      setSubmitting(true);
      setError(null);
      registerOrganizer(details)
        .then(res => {
          dispatch(setSession({ token: res.token, refreshToken: res.refreshToken ?? null }));
          dispatch(setActiveView('organizer'));
          setDone(true);
        })
        .catch((err: unknown) => {
          setError((err as { message?: string })?.message ?? REGISTER_COPY.registerFailed);
        })
        .finally(() => setSubmitting(false));
    },
    [dispatch],
  );

  // A returning organizer has nothing to fill in.
  const resumed = useRef(false);
  useEffect(() => {
    if (!enabled || !token || alreadyOrganizer !== true || resumed.current) return;
    resumed.current = true;
    register();
  }, [enabled, token, alreadyOrganizer, register]);

  return {
    needsDetails: alreadyOrganizer === false,
    config: configQuery.data,
    configLoading: configQuery.loading,
    configError: configQuery.error !== null,
    retryConfig: configQuery.refetch,
    submitting,
    error,
    submit: register,
    done,
  };
}
