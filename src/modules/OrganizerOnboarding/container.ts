import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { selectAuthToken, setToken } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  EMPTY_FILES,
  EMPTY_FORM,
  FIELD_MSG,
  FIELD_RE,
  NUMBER_FIELDS,
  ONBOARDING_STEPS,
  STEP_REQUIRED,
  STEP_REQUIRED_FILES,
} from './constants';
import { completeOnboarding, patchSection, registerOrganizer, uploadFile } from './services';
import { FIELD_SECTION, FILE_PURPOSE } from './types';
import type {
  MultiFileField,
  OnboardingStep,
  OrganizerProfile,
  PickedFile,
  ProfileFiles,
  ProfileForm,
  SaveState,
  ScalarField,
  SectionPatch,
  SingleFileField,
  StepId,
} from './types';

const AUTOSAVE_MS = 800;

function isStepComplete(id: StepId, values: ProfileForm, files: ProfileFiles): boolean {
  for (const field of STEP_REQUIRED[id]) {
    const val = values[field];
    if (Array.isArray(val)) {
      if (val.length === 0) return false;
    } else if (NUMBER_FIELDS.has(field)) {
      if (!String(val).trim() || Number(val) <= 0) return false;
    } else if (!String(val).trim()) {
      return false;
    }
  }
  for (const ff of STEP_REQUIRED_FILES[id]) {
    const val = files[ff];
    if (Array.isArray(val)) {
      if (val.length === 0) return false;
    } else if (!val) {
      return false;
    }
  }
  return true;
}

export interface OrganizerOnboardingResult {
  ready: boolean;
  bootstrapping: boolean;
  bootstrapError: string | null;
  retryBootstrap: () => void;
  steps: OnboardingStep[];
  currentId: StepId;
  goToStep: (id: StepId) => void;
  goNext: () => void;
  goBack: () => void;
  values: ProfileForm;
  files: ProfileFiles;
  mobile: string;
  fieldErrors: Partial<Record<ScalarField, string>>;
  formError: string | null;
  saveState: Record<StepId, SaveState>;
  setField: (field: ScalarField, value: string | boolean) => void;
  toggleArray: (field: ScalarField, key: string) => void;
  uploadingField: string | null;
  pickAndUpload: (field: SingleFileField | MultiFileField, file: PickedFile) => void;
  removeFile: (field: SingleFileField | MultiFileField, index?: number) => void;
  profileCompletion: number;
  submitted: boolean;
  isSubmitting: boolean;
  submit: () => void;
}

/**
 * Organizer onboarding's business logic — mirrors web's useOnboarding hook
 * (evently-FrontEnd/src/features/onboarding/organizer/hooks/useOnboarding.ts)
 * field-for-field, calling the exact same already-live backend endpoints.
 */
export function useOrganizerOnboarding(): OrganizerOnboardingResult {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);

  const [ready, setReady] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<StepId>('basic');
  const [values, setValues] = useState<ProfileForm>(EMPTY_FORM);
  const [files, setFiles] = useState<ProfileFiles>(EMPTY_FILES);
  const [mobile, setMobile] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ScalarField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<Record<StepId, SaveState>>({
    basic: 'idle', verification: 'idle', bank: 'idle', services: 'idle', portfolio: 'idle',
  });
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const valuesRef = useRef(values);
  const filesRef = useRef(files);
  useEffect(() => { valuesRef.current = values; }, [values]);
  useEffect(() => { filesRef.current = files; }, [files]);
  const timers = useRef<Partial<Record<StepId, ReturnType<typeof setTimeout>>>>({});
  const didRegister = useRef(false);

  const hydrate = useCallback((p: OrganizerProfile) => {
    setValues({
      firstName: p.firstName, lastName: p.lastName, contactEmail: p.contactEmail,
      businessName: p.businessName, displayName: p.displayName, businessType: p.businessType,
      primaryCategory: p.primaryCategory, city: p.city,
      aadhaarNumber: p.aadhaarNumber, panNumber: p.panNumber, gstNumber: p.gstNumber,
      businessRegNumber: p.businessRegNumber, governmentIdType: p.governmentIdType,
      accountHolderName: p.accountHolderName, bankName: p.bankName, branchName: p.branchName,
      accountNumber: p.accountNumber, confirmAccountNumber: p.accountNumber, ifsc: p.ifsc, upiId: p.upiId,
      experience: p.experience, teamSize: p.teamSize, languages: p.languages,
      secondaryCategories: p.secondaryCategories, occasions: p.occasions,
      serviceRadius: p.serviceRadius ? String(p.serviceRadius) : '', travelOption: p.travelOption,
      workingDays: p.workingDays,
      minBudget: p.minBudget ? String(p.minBudget) : '', maxBudget: p.maxBudget ? String(p.maxBudget) : '',
      tagline: p.tagline, businessDescription: p.businessDescription,
      yearsOfExperience: p.yearsOfExperience ? String(p.yearsOfExperience) : '',
    });
    setFiles({
      profilePhoto: p.profilePhoto, governmentIdFile: p.governmentIdFile, panFile: p.panFile,
      gstFile: p.gstFile, businessRegFile: p.businessRegFile, cancelledChequeFile: p.cancelledChequeFile,
      coverPhoto: p.coverPhoto, gallery: p.gallery,
    });
    setMobile(p.mobile);
    setProfileCompletion(p.profileCompletion);
    setSubmitted(p.onboardingStatus === 'submitted' || p.onboardingStatus === 'approved');
  }, []);

  const bootstrap = useCallback(() => {
    setBootstrapping(true);
    setBootstrapError(null);
    registerOrganizer()
      .then((res) => {
        if (res.token) dispatch(setToken(res.token));
        hydrate(res.profile);
        setReady(true);
      })
      .catch((err: unknown) => {
        const message = (err as { message?: string })?.message ?? 'Could not start onboarding';
        setBootstrapError(message);
      })
      .finally(() => setBootstrapping(false));
  }, [dispatch, hydrate]);

  useEffect(() => {
    if (!token || didRegister.current) return;
    didRegister.current = true;
    bootstrap();
  }, [token, bootstrap]);

  useEffect(() => () => {
    Object.values(timers.current).forEach((t) => t && clearTimeout(t));
  }, []);

  const buildPayload = useCallback((section: StepId): SectionPatch => {
    const v = valuesRef.current;
    const f = filesRef.current;
    const body: SectionPatch = {};
    (Object.keys(FIELD_SECTION) as ScalarField[]).forEach((field) => {
      if (FIELD_SECTION[field] !== section) return;
      if (field in f) return; // files handled below
      if (field === 'confirmAccountNumber') return; // client-only
      const raw = v[field];
      if (NUMBER_FIELDS.has(field)) {
        const t = String(raw).trim();
        if (t !== '' && Number.isFinite(Number(t))) body[field] = Math.round(Number(t));
      } else if (Array.isArray(raw)) {
        body[field] = raw;
      } else {
        const t = String(raw).trim();
        const re = FIELD_RE[field];
        if (t !== '' && (!re || re.test(t))) body[field] = t;
      }
    });
    (Object.keys(FILE_PURPOSE) as Array<SingleFileField | MultiFileField>).forEach((field) => {
      if (FIELD_SECTION[field] !== section) return;
      const val = f[field];
      if (Array.isArray(val)) body[field] = val;
      else if (val) body[field] = val;
    });
    return body;
  }, []);

  const scheduleSave = useCallback(
    (section: StepId) => {
      const existing = timers.current[section];
      if (existing) clearTimeout(existing);
      setSaveState((s) => ({ ...s, [section]: 'saving' }));
      timers.current[section] = setTimeout(() => {
        patchSection(section, buildPayload(section))
          .then((p) => {
            setProfileCompletion(p.profileCompletion);
            setSaveState((s) => ({ ...s, [section]: 'saved' }));
          })
          .catch((err: unknown) => {
            setSaveState((s) => ({ ...s, [section]: 'error' }));
            const message = (err as { message?: string })?.message ?? 'Could not save changes';
            setFormError(message);
          });
      }, AUTOSAVE_MS);
    },
    [buildPayload],
  );

  const validateField = useCallback((field: ScalarField, value: string) => {
    const re = FIELD_RE[field];
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (value.trim() && re && !re.test(value.trim())) next[field] = FIELD_MSG[field] ?? 'Invalid value';
      else delete next[field];
      return next;
    });
  }, []);

  const setField = useCallback(
    (field: ScalarField, value: string | boolean) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setFormError(null);
      if (typeof value === 'string') validateField(field, value);
      const section = FIELD_SECTION[field];
      if (section) scheduleSave(section);
    },
    [scheduleSave, validateField],
  );

  const toggleArray = useCallback(
    (field: ScalarField, key: string) => {
      setValues((prev) => {
        const arr = (prev[field] as string[]) ?? [];
        const next = arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key];
        return { ...prev, [field]: next };
      });
      setFormError(null);
      const section = FIELD_SECTION[field];
      if (section) scheduleSave(section);
    },
    [scheduleSave],
  );

  const pickAndUpload = useCallback(
    (field: SingleFileField | MultiFileField, file: PickedFile) => {
      setFormError(null);
      setUploadingField(field);
      uploadFile(file, FILE_PURPOSE[field])
        .then((meta) => {
          const ref = { url: meta.url, key: meta.key, originalName: meta.originalName };
          setFiles((prev) => {
            const cur = prev[field];
            return Array.isArray(cur) ? { ...prev, [field]: [...cur, ref] } : { ...prev, [field]: ref };
          });
          const section = FIELD_SECTION[field];
          if (section) scheduleSave(section);
        })
        .catch((err: unknown) => {
          const message = (err as { message?: string })?.message ?? 'Upload failed';
          setFormError(message);
        })
        .finally(() => setUploadingField(null));
    },
    [scheduleSave],
  );

  const removeFile = useCallback(
    (field: SingleFileField | MultiFileField, index?: number) => {
      setFiles((prev) => {
        const cur = prev[field];
        if (Array.isArray(cur)) return { ...prev, [field]: cur.filter((_, i) => i !== index) };
        return { ...prev, [field]: null };
      });
      const section = FIELD_SECTION[field];
      if (section) scheduleSave(section);
    },
    [scheduleSave],
  );

  const submit = useCallback(() => {
    setFormError(null);
    setIsSubmitting(true);
    Object.values(timers.current).forEach((t) => t && clearTimeout(t));
    const sections: StepId[] = ['basic', 'verification', 'bank', 'services', 'portfolio'];
    Promise.all(sections.map((s) => patchSection(s, buildPayload(s))))
      .then(() => completeOnboarding())
      .then((p) => {
        setSubmitted(true);
        setProfileCompletion(p.profileCompletion);
      })
      .catch((err: unknown) => {
        const message = (err as { message?: string })?.message ?? 'Submission failed';
        setFormError(message);
      })
      .finally(() => setIsSubmitting(false));
  }, [buildPayload]);

  const stepOrder = ONBOARDING_STEPS.map((s) => s.id);
  const goNext = useCallback(() => {
    const idx = stepOrder.indexOf(currentId);
    if (idx < stepOrder.length - 1) setCurrentId(stepOrder[idx + 1]);
  }, [currentId, stepOrder]);
  const goBack = useCallback(() => {
    const idx = stepOrder.indexOf(currentId);
    if (idx > 0) setCurrentId(stepOrder[idx - 1]);
  }, [currentId, stepOrder]);

  const steps = useMemo<OnboardingStep[]>(
    () =>
      ONBOARDING_STEPS.map((s) => ({
        id: s.id,
        order: s.order,
        title: s.title,
        status:
          submitted || (ready && isStepComplete(s.id, values, files))
            ? 'completed'
            : s.id === currentId
              ? 'current'
              : 'pending',
      })),
    [currentId, submitted, ready, values, files],
  );

  return {
    ready,
    bootstrapping,
    bootstrapError,
    retryBootstrap: bootstrap,
    steps,
    currentId,
    goToStep: setCurrentId,
    goNext,
    goBack,
    values,
    files,
    mobile,
    fieldErrors,
    formError,
    saveState,
    setField,
    toggleArray,
    uploadingField,
    pickAndUpload,
    removeFile,
    profileCompletion,
    submitted,
    isSubmitting,
    submit,
  };
}
