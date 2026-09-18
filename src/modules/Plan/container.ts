import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AUTOSAVE_DEBOUNCE_MS, MAX_ORGANIZERS } from './constants';
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
import type {
  PlanDraft,
  PlanOrganizerDTO,
  PlanScreenDTO,
  RecommendationArgs,
  SubmitPhase,
} from './types';

const DEFAULT_DRAFT: PlanDraft = {
  occasionId: 'wedding',
  eventDate: todayIsoDate(),
  city: '',
  area: '',
  guests: '',
  budget: '',
  ideas: '',
  categories: [],
  selectedOrganizerIds: [],
  step: 0,
};

/**
 * The draft a fresh wizard starts from.
 *
 * Both seeds are optional and independent: Home's occasion tiles pass an
 * occasion, an organizer's profile passes an organizer, and the package cards
 * pass an occasion. Seeding the organizer here rather than jumping straight to
 * the review step is deliberate — the organizer still needs the brief, and a
 * quote request with no occasion is one they cannot price.
 */
function buildInitialDraft(
  initialOccasionId?: string,
  initialOrganizerId?: string,
  initialEventDate?: string,
): PlanDraft {
  return {
    ...DEFAULT_DRAFT,
    ...(initialOccasionId ? { occasionId: initialOccasionId } : {}),
    ...(initialOrganizerId ? { selectedOrganizerIds: [initialOrganizerId] } : {}),
    // "Hold date" on an organizer's profile arrives here: the date they are
    // free, already in the brief, so the customer is not asked to re-enter
    // the one thing they just tapped.
    ...(initialEventDate ? { eventDate: initialEventDate } : {}),
  };
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
  setField: (
    field: 'city' | 'area' | 'eventDate' | 'ideas',
    value: string,
  ) => void;
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
  /** Adds or removes one organizer from the shortlist. Stays on the step. */
  toggleOrganizer: (id: string) => void;
  /** Done choosing — moves on to the review. */
  reviewShortlist: () => void;
  /** False once the shortlist is full, so the UI can say why. */
  canAddOrganizer: boolean;

  // Review step's own (unfiltered) organizer resolution
  recommendedOrganizer: PlanOrganizerDTO | null;
  /** Every shortlisted organizer, resolved. Empty until the lookup returns. */
  selectedOrganizers: PlanOrganizerDTO[];
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

export function usePlanContainer(
  initialOccasionId?: string,
  initialOrganizerId?: string,
  initialEventDate?: string,
): PlanContainerResult {
  const {
    data: screenDataRaw,
    loading: screenLoading,
    error: screenError,
    refetch: refetchScreen,
  } = usePlanScreenData();
  const { data: myDraft } = useMyDraft();

  const [draft, setDraft] = useState<PlanDraft>(() =>
    buildInitialDraft(initialOccasionId, initialOrganizerId, initialEventDate),
  );
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
    if (Object.keys(patch).length > 0)
      setDraft(prev => ({ ...prev, ...patch }));
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
  const occasions = useMemo(
    () => mapOccasions(screenData.occasions ?? []),
    [screenData.occasions],
  );
  const categories = useMemo(
    () => mapCategories(screenData.categories ?? []),
    [screenData.categories],
  );
  const steps = useMemo(
    () => ensureReviewStep(screenData.steps ?? []),
    [screenData.steps],
  );
  const stepIndices = useMemo(() => resolveStepIndices(steps), [steps]);
  const currentOccasion = useMemo(
    () =>
      occasions.find(o => o.id === draft.occasionId) ?? occasions[0] ?? null,
    [occasions, draft.occasionId],
  );

  const blockReason = blockReasonFor(draft.step, stepIndices, draft);
  const canContinue = !blockReason;

  const selectOccasion = useCallback(
    (id: string) => setDraft(prev => ({ ...prev, occasionId: id })),
    [],
  );
  const setField = useCallback(
    (field: 'city' | 'area' | 'eventDate' | 'ideas', value: string) =>
      setDraft(prev => ({ ...prev, [field]: value })),
    [],
  );
  const selectGuests = useCallback(
    (value: string) => setDraft(prev => ({ ...prev, guests: value })),
    [],
  );
  const selectBudget = useCallback(
    (value: string) =>
      setDraft(prev => ({
        ...prev,
        budget: value === prev.budget ? '' : value,
      })),
    [],
  );
  const addIdea = useCallback(
    (suggestion: string) =>
      setDraft(prev => ({
        ...prev,
        ideas: prev.ideas ? `${prev.ideas}, ${suggestion}` : suggestion,
      })),
    [],
  );
  const toggleCategory = useCallback(
    (id: string) =>
      setDraft(prev => ({
        ...prev,
        categories: prev.categories.includes(id)
          ? prev.categories.filter(c => c !== id)
          : [...prev.categories, id],
      })),
    [],
  );

  const goToStep = useCallback(
    (index: number) => setDraft(prev => ({ ...prev, step: index })),
    [],
  );
  const goBack = useCallback(
    () => setDraft(prev => ({ ...prev, step: Math.max(prev.step - 1, 0) })),
    [],
  );
  const continueStep = useCallback(() => {
    if (!canContinue) return;
    setDraft(prev => ({
      ...prev,
      step: Math.min(prev.step + 1, steps.length - 1),
    }));
  }, [canContinue, steps.length]);

  const organizersCallback = useOrganizersCallback();
  const searchOrganizers = useCallback(
    (args: RecommendationArgs) => organizersCallback.execute(args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /*
   * Ticking an organizer no longer leaves the step.
   *
   * Choosing one used to jump straight to the review, which is right when a
   * brief goes to exactly one person and wrong the moment it can go to
   * several — the customer was thrown off the list before they could pick a
   * second. Moving on is now its own button.
   */
  const toggleOrganizer = useCallback((id: string) => {
    setDraft(prev => {
      const chosen = prev.selectedOrganizerIds;
      if (chosen.includes(id)) {
        return { ...prev, selectedOrganizerIds: chosen.filter(x => x !== id) };
      }
      if (chosen.length >= MAX_ORGANIZERS) return prev;
      return { ...prev, selectedOrganizerIds: [...chosen, id] };
    });
  }, []);

  const reviewShortlist = useCallback(
    () => setDraft(prev => ({ ...prev, step: stepIndices.reviewIndex })),
    [stepIndices.reviewIndex],
  );

  // Review step resolves the recommended (top match) + selected organizer
  // from an UNFILTERED/unsorted lookup — matches web's ReviewStep, which
  // queries with only the base plan context, not the Organizers step's
  // tier/rating/category filters or sort order.
  const reviewOrganizersCallback = useOrganizersCallback();
  const [reviewOrganizers, setReviewOrganizers] = useState<PlanOrganizerDTO[]>(
    [],
  );
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
  }, [
    draft.step,
    stepIndices.reviewIndex,
    draft.categories,
    draft.occasionId,
    draft.guests,
    draft.city,
    draft.budget,
  ]);

  const recommendedOrganizer = reviewOrganizers[0] ?? null;
  /*
   * Kept in the order the customer ticked them, not the order the recommender
   * returned. The review is a read-back of a decision they made, and
   * re-ranking it there reads as the app having changed their mind.
   */
  const selectedOrganizers = useMemo(
    () =>
      draft.selectedOrganizerIds
        .map(id => reviewOrganizers.find(o => o.id === id))
        .filter((o): o is PlanOrganizerDTO => Boolean(o)),
    [draft.selectedOrganizerIds, reviewOrganizers],
  );

  // ----- Submit: two-phase (save plan, then request quote), retry-safe -----
  const createPlanCall = useCreatePlanCallback();
  const requestQuoteCall = useRequestQuoteCallback();
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);

  const submitPlan = useCallback(() => {
    if (draft.selectedOrganizerIds.length === 0) return;
    setSubmitError(null);

    /*
     * The plan id is a parameter rather than read from state: on a first
     * submission this runs inside the `createPlan` promise, and `savedPlanId`
     * has not re-rendered yet — reading it there would send `null` and quietly
     * leave the brief unlinked from the plan it came from.
     */
    const runQuoteRequest = async (planId: string | null) => {
      setSubmitPhase('quoting');
      try {
        await requestQuoteCall.execute({
          organizerIds: draft.selectedOrganizerIds,
          occasion: currentOccasion?.label ?? draft.occasionId,
          when: draft.eventDate || undefined,
          where: locationLabel(draft.area, draft.city, '') || undefined,
          guests: draft.guests || undefined,
          /*
           * The rest of the brief. It used to stop at the headcount, so an
           * organizer received a request with no services on it and no idea
           * what they were being asked to price — the categories the customer
           * picked in step 2 never left the phone.
           *
           * `planId` matters for a different reason: without it the plan and
           * the request it produced are two unrelated records, and the
           * customer's single event is listed twice.
           */
          planId: planId ?? undefined,
          budget: draft.budget || undefined,
          categories: draft.categories.length ? draft.categories : undefined,
          ideas: draft.ideas.trim() || undefined,
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
      runQuoteRequest(savedPlanId).catch(() => undefined);
      return;
    }

    setSubmitPhase('saving');
    createPlanCall
      .execute(draftToUpsert(draft))
      .then(plan => {
        setSavedPlanId(plan.id);
        return runQuoteRequest(plan.id);
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
  }, [savedPlanId, draft, currentOccasion]);

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
    toggleOrganizer,
    reviewShortlist,
    canAddOrganizer: draft.selectedOrganizerIds.length < MAX_ORGANIZERS,

    recommendedOrganizer,
    selectedOrganizers,
    isLoadingReviewOrganizers: reviewOrganizersCallback.loading,

    submitPhase,
    submitError,
    planSaved: savedPlanId !== null,
    submitSucceeded,
    canSubmitPlan: submitPhase === 'idle' && draft.selectedOrganizerIds.length > 0,
    submitPlan,
    startNewPlan,
  };
}
