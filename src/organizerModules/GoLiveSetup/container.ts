import { useCallback, useEffect, useMemo, useState } from 'react';
import { chooseImageSource, pickImage, uploadImage } from '../Shared';
import {
  FIELD_LABEL,
  FILE_PURPOSE,
  LIMITS,
  SETUP_COPY as COPY,
  STEP_META,
} from './constants';
import {
  useCompleteOnboarding,
  useOnboardingConfig,
  useServicesConfig,
  useSetupProfile,
  useSetupStatus,
} from './hooks';
import { patchStep } from './services';
import type {
  FileKey,
  FormErrors,
  HubModel,
  ListKey,
  SetField,
  SetupForm,
  SetupProfileDTO,
  StepId,
  StepOptions,
} from './types';
import {
  buildPatch,
  canEditStep,
  firstErrorPart,
  formFrom,
  isStepDirty,
  mapHub,
  mergeOptions,
  validateStep,
} from './utils';

export interface SetupContainerResult {
  // Hub
  hub: HubModel | null;
  /** The OTP-verified mobile, shown read-only on Basic info. */
  mobile: string;
  isLoading: boolean;
  errorMessage: string | null;
  refreshing: boolean;
  refresh: () => void;
  /** A one-line confirmation after a step saves. */
  notice: string | null;
  submitting: boolean;
  submitError: string | null;
  /** True once this session submitted — the screen shows its success state. */
  justSubmitted: boolean;
  submit: () => void;

  // Step view
  step: StepId | null;
  /** Opened straight at a step: its back leaves the screen, not to the hub. */
  backLeavesScreen: boolean;
  openStep: (id: StepId) => void;
  closeStep: () => void;
  readOnly: boolean;
  form: SetupForm | null;
  baseline: SetupForm | null;
  errors: FormErrors;
  part: number;
  setPart: (index: number) => void;
  dirty: boolean;
  saving: boolean;
  saveError: string | null;
  uploading: FileKey | null;
  options: StepOptions;
  optionsLoading: boolean;
  optionsFailed: boolean;
  retryOptions: () => void;
  setField: SetField;
  toggle: (key: ListKey, value: string) => void;
  upload: (key: FileKey) => void;
  removeFile: (key: FileKey, index?: number) => void;
  /** Saves only what changed; resolves true once saved (or nothing to save). */
  save: () => Promise<boolean>;
}

/**
 * The go-live checklist and each of its steps, on one route. The hub reads
 * `onboarding-status`; a step edits a copy of the profile and saves only the
 * fields it changed to its own endpoint, then returns to a refreshed hub.
 */
export function useSetupContainer(
  entryStep: StepId | null,
): SetupContainerResult {
  const status = useSetupStatus();
  const profile = useSetupProfile();
  const onboardingConfig = useOnboardingConfig();
  const servicesConfig = useServicesConfig();
  const completion = useCompleteOnboarding();

  // The freshest profile: the last fetch, or the last save's answer.
  const [latest, setLatest] = useState<SetupProfileDTO | null>(null);
  useEffect(() => {
    if (profile.data) setLatest(profile.data);
  }, [profile.data]);

  const [step, setStep] = useState<StepId | null>(entryStep);
  const [fromHub, setFromHub] = useState(false);
  const [hydratedFor, setHydratedFor] = useState<StepId | null>(null);
  const [baseline, setBaseline] = useState<SetupForm | null>(null);
  const [form, setForm] = useState<SetupForm | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [part, setPart] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<FileKey | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fill the step's form once per opening, so a background refetch never
  // overwrites what is being typed.
  useEffect(() => {
    if (!step || !latest || hydratedFor === step) return;
    const next = formFrom(latest);
    setBaseline(next);
    setForm(next);
    setErrors({});
    setPart(0);
    setSaveError(null);
    setHydratedFor(step);
  }, [step, latest, hydratedFor]);

  const openStep = useCallback((id: StepId) => {
    setNotice(null);
    setFromHub(true);
    setHydratedFor(null);
    setStep(id);
  }, []);

  const closeStep = useCallback(() => {
    setStep(null);
    setHydratedFor(null);
    setForm(null);
    setBaseline(null);
    setErrors({});
    setSaveError(null);
  }, []);

  const setField = useCallback<SetField>((key, value) => {
    setForm(prev => (prev ? { ...prev, [key]: value } : prev));
    setErrors(prev => {
      if (!prev[key] && !(key === 'accountNumber' && prev.confirmAccountNumber))
        return prev;
      const next = { ...prev };
      delete next[key];
      if (key === 'accountNumber') delete next.confirmAccountNumber;
      return next;
    });
    setSaveError(null);
  }, []);

  const toggle = useCallback((key: ListKey, value: string) => {
    setForm(prev => {
      if (!prev) return prev;
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter(v => v !== value)
          : [...list, value],
      };
    });
    setSaveError(null);
  }, []);

  const upload = useCallback(
    (key: FileKey) => {
      if (uploading || !form) return;
      if (key === 'gallery' && form.gallery.length >= LIMITS.gallery) return;
      setSaveError(null);
      (async () => {
        const source = await chooseImageSource(FIELD_LABEL[key]);
        if (!source) return;
        try {
          const image = await pickImage(
            source,
            key === 'profilePhoto' ? 1024 : 1600,
          );
          if (!image) return;
          setUploading(key);
          const file = await uploadImage(image, FILE_PURPOSE[key]);
          setForm(prev => {
            if (!prev) return prev;
            return key === 'gallery'
              ? { ...prev, gallery: [...prev.gallery, file] }
              : { ...prev, [key]: file };
          });
        } catch (error) {
          setSaveError((error as Error)?.message || COPY.uploadFailed);
        } finally {
          setUploading(null);
        }
      })().catch(() => undefined);
    },
    [uploading, form],
  );

  const removeFile = useCallback((key: FileKey, index?: number) => {
    setForm(prev => {
      if (!prev) return prev;
      return key === 'gallery'
        ? { ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }
        : { ...prev, [key]: null };
    });
  }, []);

  const refetchStatus = status.refetch;
  const save = useCallback(async () => {
    if (!step || !form || !baseline) return false;
    const found = validateStep(step, form, baseline);
    const errorPart = firstErrorPart(step, found);
    if (errorPart !== null) {
      setErrors(found);
      setPart(errorPart);
      setSaveError(COPY.fixFields);
      return false;
    }
    const body = buildPatch(step, baseline, form);
    if (!Object.keys(body).length) {
      closeStep();
      return true;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await patchStep(step, body);
      setLatest(updated);
      refetchStatus();
      setNotice(COPY.saved(STEP_META[step].title));
      closeStep();
      // Back on the hub now, whichever way the step was opened.
      setFromHub(false);
      return true;
    } catch (error) {
      setSaveError((error as Error)?.message || COPY.saveFailed);
      return false;
    } finally {
      setSaving(false);
    }
  }, [step, form, baseline, closeStep, refetchStatus]);

  const { execute: complete, loading: submitting } = completion;
  const submit = useCallback(() => {
    if (submitting || !status.data?.canSubmit) return;
    setSubmitError(null);
    complete()
      .then(updated => {
        setLatest(updated);
        setJustSubmitted(true);
        refetchStatus();
      })
      .catch(error =>
        setSubmitError((error as Error)?.message || COPY.submitFailed),
      );
  }, [submitting, status.data, complete, refetchStatus]);

  const refreshProfile = profile.refetch;
  const refetchOnboarding = onboardingConfig.refetch;
  const refetchServices = servicesConfig.refetch;
  const retryOptions = useCallback(() => {
    if (!onboardingConfig.data) refetchOnboarding();
    if (!servicesConfig.data) refetchServices();
  }, [
    onboardingConfig.data,
    servicesConfig.data,
    refetchOnboarding,
    refetchServices,
  ]);

  const refresh = useCallback(() => {
    setNotice(null);
    refetchStatus();
    refreshProfile();
    retryOptions();
  }, [refetchStatus, refreshProfile, retryOptions]);

  const hub = useMemo(
    () => (status.data ? mapHub(status.data) : null),
    [status.data],
  );
  const options = useMemo(
    () => mergeOptions(onboardingConfig.data, servicesConfig.data),
    [onboardingConfig.data, servicesConfig.data],
  );

  const readOnly =
    !!step && (status.data ? !canEditStep(step, status.data) : true);
  const ready = !!status.data && !!latest;

  return {
    hub,
    mobile: latest?.mobile ?? '',
    isLoading: !ready && (status.loading || profile.loading),
    errorMessage: ready
      ? null
      : status.error?.message ||
        profile.error?.message ||
        (status.loading || profile.loading ? null : COPY.error),
    refreshing: ready && (status.loading || profile.loading),
    refresh,
    notice,
    submitting,
    submitError,
    justSubmitted,
    submit,

    step,
    backLeavesScreen: !!step && !fromHub,
    openStep,
    closeStep,
    readOnly,
    form,
    baseline,
    errors,
    part,
    setPart,
    dirty:
      !readOnly && !!step && !!form && !!baseline
        ? isStepDirty(step, baseline, form)
        : false,
    saving,
    saveError,
    uploading,
    options,
    optionsLoading:
      (onboardingConfig.loading && !onboardingConfig.data) ||
      (servicesConfig.loading && !servicesConfig.data),
    optionsFailed:
      (!!onboardingConfig.error && !onboardingConfig.data) ||
      (!!servicesConfig.error && !servicesConfig.data),
    retryOptions,
    setField,
    toggle,
    upload,
    removeFile,
    save,
  };
}
