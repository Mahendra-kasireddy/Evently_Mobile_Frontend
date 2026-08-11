import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AUTOSAVE_DEBOUNCE_MS } from './constants';
import {
  useCreatePlanCallback,
  useMyDraft,
  useOrganizersCallback,
  usePlanScreenData,
  useRequestQuoteCallback,
  useSaveDraftCallback,
} from './hooks';
import {
  blockReasonFor,
  detailOf,
  draftToUpsert,
  ensureReviewStep,
  isMeaningful,
  locationLabel,
  mapCategories,
  mapOccasions,
  resolveStepIndices,
  todayIsoDate,
  type CategoryOption,
  type OccasionOption,
  type StepIndices,
} from './utils';
import type { NormalizedApiError } from '../../services/errors';
import type { PlanDraft, PlanOrganizerDTO, PlanScreenDTO, RecommendationArgs, SubmitPhase } from './types';

const DEFAULT_DRAFT: PlanDraft = {
  occasionId: 'wedding',
  eventDate: todayIsoDate(),
  city: '',
  area: '',
  guests: '',
  budget: '',
  ideas: '',
  categories: [],
  selectedOrganizerId: '',
  step: 0,
};

function buildInitialDraft(initialOccasionId?: string): PlanDraft {
  return initialOccasionId ? { ...DEFAULT_DRAFT, occasionId: initialOccasionId } : DEFAULT_DRAFT;
}

export interface PlanContainerResult {
  // Screen-level state
  isLoadingScreen: boolean;
  isScreenError: boolean;
  screenErrorMessage: string | null;
  refetchScreen: () => void;

  // Wizard config (resolved view-models)
  occasions: OccasionOption[];
  categories: CategoryOption[];
  screenData: PlanScreenDTO | null;
  currentOccasion: OccasionOption | null;
  steps: PlanScreenDTO['steps'];
  stepIndex: number;
  stepsCount: number;
  stepIndices: StepIndices;

  // Draft + navigation
  draft: PlanDraft;
  selectOccasion: (id: string) => void;
  setField: (field: 'city' | 'area' | 'eventDate' | 'ideas', value: string) => void;
  selectGuests: (value: string) => void;
  selectBudget: (value: string) => void;
  addIdea: (suggestion: string) => void;
  toggleCategory: (id: string) => void;
  goToStep: (index: number) => void;
  goBack: () => void;
  continueStep: () => void;
  canContinue: boolean;
  blockReason: string | undefined;

  // Organizer search (used directly by the FindOrganizers section)
  searchOrganizers: (args: RecommendationArgs) => Promise<PlanOrganizerDTO[]>;
  selectOrganizer: (id: string) => void;

  // Review step's own (unfiltered) organizer resolution
  recommendedOrganizer: PlanOrganizerDTO | null;
  selectedOrganizerDetails: PlanOrganizerDTO | null;
  isLoadingReviewOrganizers: boolean;

  // Submit flow
  submitPhase: SubmitPhase;
  submitError: string | null;
  planSaved: boolean;
  submitSucceeded: boolean;
  canSubmitPlan: boolean;
  submitPlan: () => void;
  startNewPlan: () => void;
}

const EMPTY_SCREEN: PlanScreenDTO = {
  occasions: [],
  steps: [],
  cityOptions: [],
  guestOptions: [],
  budgetOptions: [],
  subtitle: '',
  trust: [],
  whatNext: [],
  ideas: { title: '', subtitle: '', suggestions: [], placeholder: '' },
  budgetBanner: '',
  quoteNote: { title: '', text: '' },
  continueLabel: 'Continue',
  footnote: '',
  categories: [],
  filters: { tiers: [], ratings: [], categories: [], sorts: [] },
};

export function usePlanContainer(initialOccasionId?: string): PlanContainerResult {
  const { data: screenDataRaw, loading: screenLoading, error: screenError, refetch: refetchScreen } = usePlanScreenData();
  const { data: myDraft } = useMyDraft();

  const [draft, setDraft] = useState<PlanDraft>(() => buildInitialDraft(initialOccasionId));
  const hydratedRef = useRef(false);

  // Resume a previously saved draft once it arrives — only patch fields the
  // server actually has a value for (mirrors web's usePlan.ts hydration).
  useEffect(() => {
    if (hydratedRef.current || !myDraft) return;
    hydratedRef.current = true;
    const patch: Partial<PlanDraft> = {};
    if (myDraft.occasion) patch.occasionId = myDraft.occasion;
    if (myDraft.eventDate) patch.eventDate = myDraft.eventDate.slice(0, 10);
    if (myDraft.city) patch.city = myDraft.city;
    if (myDraft.area) patch.area = myDraft.area;
    if (myDraft.guests) patch.guests = myDraft.guests;
    if (myDraft.budget) patch.budget = myDraft.budget;
    if (myDraft.ideas) patch.ideas = myDraft.ideas;
    if (myDraft.categories?.length) patch.categories = myDraft.categories;
    if (Object.keys(patch).length > 0) setDraft((prev) => ({ ...prev, ...patch }));
  }, [myDraft]);

  const saveDraftCall = useSaveDraftCallback();
  useEffect(() => {
    if (!isMeaningful(draft)) return undefined;
    const id = setTimeout(() => {
      saveDraftCall.execute(draftToUpsert(draft)).catch(() => undefined);
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const screenData = screenDataRaw ?? EMPTY_SCREEN;
  const occasions = useMemo(() => mapOccasions(screenData.occasions ?? []), [screenData.occasions]);
  const categories = useMemo(() => mapCategories(screenData.categories ?? []), [screenData.categories]);
  const steps = useMemo(() => ensureReviewStep(screenData.steps ?? []), [screenData.steps]);
  const stepIndices = useMemo(() => resolveStepIndices(steps), [steps]);
  const currentOccasion = useMemo(
    () => occasions.find((o) => o.id === draft.occasionId) ?? occasions[0] ?? null,
    [occasions, draft.occasionId],
  );

  const blockReason = blockReasonFor(draft.step, stepIndices, draft);
  const canContinue = !blockReason;

  const selectOccasion = useCallback((id: string) => setDraft((prev) => ({ ...prev, occasionId: id })), []);
  const setField = useCallback(
    (field: 'city' | 'area' | 'eventDate' | 'ideas', value: string) => setDraft((prev) => ({ ...prev, [field]: value })),
    [],
  );
  const selectGuests = useCallback((value: string) => setDraft((prev) => ({ ...prev, guests: value })), []);
  const selectBudget = useCallback(
    (value: string) => setDraft((prev) => ({ ...prev, budget: value === prev.budget ? '' : value })),
    [],
  );
  const addIdea = useCallback(
    (suggestion: string) => setDraft((prev) => ({ ...prev, ideas: prev.ideas ? `${prev.ideas}, ${suggestion}` : suggestion })),
    [],
  );
  const toggleCategory = useCallback(
    (id: string) =>
      setDraft((prev) => ({
        ...prev,
        categories: prev.categories.includes(id) ? prev.categories.filter((c) => c !== id) : [...prev.categories, id],
      })),
    [],
  );

  const goToStep = useCallback((index: number) => setDraft((prev) => ({ ...prev, step: index })), []);
  const goBack = useCallback(() => setDraft((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) })), []);
  const continueStep = useCallback(() => {
    if (!canContinue) return;
    setDraft((prev) => ({ ...prev, step: Math.min(prev.step + 1, steps.length - 1) }));
  }, [canContinue, steps.length]);

  const organizersCallback = useOrganizersCallback();
  const searchOrganizers = useCallback(
    (args: RecommendationArgs) => organizersCallback.execute(args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const selectOrganizer = useCallback(
    (id: string) => setDraft((prev) => ({ ...prev, selectedOrganizerId: id, step: stepIndices.reviewIndex })),
    [stepIndices.reviewIndex],
  );

  // Review step resolves the recommended (top match) + selected organizer
  // from an UNFILTERED/unsorted lookup — matches web's ReviewStep, which
  // queries with only the base plan context, not the Organizers step's
  // tier/rating/category filters or sort order.
  const reviewOrganizersCallback = useOrganizersCallback();
  const [reviewOrganizers, setReviewOrganizers] = useState<PlanOrganizerDTO[]>([]);
  useEffect(() => {
    if (draft.step !== stepIndices.reviewIndex) return;
    reviewOrganizersCallback
      .execute({
        categories: draft.categories,
        occasion: draft.occasionId,
        guests: draft.guests,
        city: draft.city,
        budget: draft.budget,
      })
      .then(setReviewOrganizers)
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.step, stepIndices.reviewIndex, draft.categories, draft.occasionId, draft.guests, draft.city, draft.budget]);

  const recommendedOrganizer = reviewOrganizers[0] ?? null;
  const selectedOrganizerDetails = reviewOrganizers.find((o) => o.id === draft.selectedOrganizerId) ?? null;

  // ----- Submit: two-phase (save plan, then request quote), retry-safe -----
  const createPlanCall = useCreatePlanCallback();
  const requestQuoteCall = useRequestQuoteCallback();
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);

  const submitPlan = useCallback(() => {
    if (!selectedOrganizerDetails) return;
    setSubmitError(null);

    const runQuoteRequest = async () => {
      setSubmitPhase('quoting');
      try {
        await requestQuoteCall.execute({
          organizerId: draft.selectedOrganizerId,
          occasion: currentOccasion?.label ?? draft.occasionId,
          when: draft.eventDate || undefined,
          where: locationLabel(draft.area, draft.city, '') || undefined,
          guests: draft.guests || undefined,
        });
        setSubmitPhase('idle');
        setSubmitSucceeded(true);
      } catch (err) {
        setSubmitPhase('idle');
        const detail = detailOf(err as NormalizedApiError);
        setSubmitError(
          detail
            ? `Your plan is saved, but the quote request failed: ${detail}. You can retry.`
            : "Your plan is saved, but the quote request didn't go through. You can retry without losing anything.",
        );
      }
    };

    if (savedPlanId) {
      runQuoteRequest().catch(() => undefined);
      return;
    }

    setSubmitPhase('saving');
    createPlanCall
      .execute(draftToUpsert(draft))
      .then((plan) => {
        setSavedPlanId(plan.id);
        return runQuoteRequest();
      })
      .catch((err: unknown) => {
        setSubmitPhase('idle');
        const detail = detailOf(err as NormalizedApiError);
        setSubmitError(
          detail
            ? `Couldn't save your plan: ${detail}. Nothing was submitted.`
            : "We couldn't save your plan. Nothing was submitted — please try again.",
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrganizerDetails, savedPlanId, draft, currentOccasion]);

  const startNewPlan = useCallback(() => {
    hydratedRef.current = true; // don't re-hydrate the old saved draft
    setDraft(buildInitialDraft());
    setSavedPlanId(null);
    setSubmitPhase('idle');
    setSubmitError(null);
    setSubmitSucceeded(false);
    setReviewOrganizers([]);
  }, []);

  return {
    isLoadingScreen: screenLoading && !screenDataRaw,
    isScreenError: screenError !== null && !screenDataRaw,
    screenErrorMessage: screenError?.message ?? null,
    refetchScreen,

    occasions,
    categories,
    screenData: screenDataRaw,
    currentOccasion,
    steps,
    stepIndex: draft.step,
    stepsCount: steps.length,
    stepIndices,

    draft,
    selectOccasion,
    setField,
    selectGuests,
    selectBudget,
    addIdea,
    toggleCategory,
    goToStep,
    goBack,
    continueStep,
    canContinue,
    blockReason,

    searchOrganizers,
    selectOrganizer,

    recommendedOrganizer,
    selectedOrganizerDetails,
    isLoadingReviewOrganizers: reviewOrganizersCallback.loading,

    submitPhase,
    submitError,
    planSaved: savedPlanId !== null,
    submitSucceeded,
    canSubmitPlan: submitPhase === 'idle' && selectedOrganizerDetails !== null,
    submitPlan,
    startNewPlan,
  };
}
