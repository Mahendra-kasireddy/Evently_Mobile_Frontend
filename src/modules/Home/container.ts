import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useEnsureLocation } from '../../hooks/useEnsureLocation';
import {
  selectLocationPlace,
  selectLocationStatus,
} from '../../store/locationSlice';
import {
  seedHeroDraft,
  selectHeroDraft,
  setHeroDraftField,
  setShareBudget,
  type HeroDraftTextField,
} from '../../store/heroDraftSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { todayIso } from '../../Components';
import { DEFAULT_GUESTS } from '../Pickers/constants';
import { useSavedPackageIds } from './hooks';
import {
  useHomeFeed,
  useRequestQuotes,
  useRequestQuoteFromOrganizer,
} from './hooks';
import { mapHomeFeed } from './utils';
import type { HeroDraft, HomeHeaderViewModel, HomeViewModel } from './types';

const EMPTY_VIEW_MODEL: HomeViewModel = {
  banner: null,
  bookedEvent: null,
  currentEvent: null,
  otherEvents: [],
  categories: null,
  occasions: null,
  offers: null,
  packages: null,
  topOrganizers: null,
  howItWorks: null,
  tools: null,
};

export interface HomeContainerResult extends HomeViewModel {
  header: HomeHeaderViewModel;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
  heroDraft: HeroDraft;
  /** The range the customer picked, '' while sharing is off. */
  budget: string;
  shareBudget: boolean;
  toggleShareBudget: (enabled: boolean) => void;
  setHeroField: (field: HeroDraftTextField, value: string) => void;
  submitHeroDraft: () => void;
  isRequestingQuotes: boolean;
  quotesRequested: boolean;
  quotesErrorMessage: string | null;
  resetQuotesRequest: () => void;

  // --- organizer section ---
  /** Organizers a quote request has gone to this session. */
  organizerRequestedIds: string[];
  /** The organizer a request is in flight for, if any. */
  organizerRequestingId: string | null;
  organizerRequestError: string | null;
  requestQuoteFrom: (organizerId: string) => void;

  // --- saved packages ---
  /** Ids of the packages this account has kept, so the heart shows its state. */
  savedPackageIds: string[];
  /** Saves or unsaves one, whichever it currently is not. */
  toggleSavedPackage: (packageId: string) => void;
}

/**
 * Home's business logic: fetch the feed, transform it into section view
 * models, and expose a single result for HomeScreen to render. HomeScreen
 * itself does no fetching or mapping — it only reacts to what this returns.
 */
export function useHomeContainer(): HomeContainerResult {
  const { data, loading, error, refetch } = useHomeFeed();

  // The bottom-tab navigator keeps Home mounted when the user switches tabs,
  // so useHomeFeed's on-mount fetch never re-runs on its own. Without this,
  // the "current event" card (and everything else) goes stale the moment the
  // user does something elsewhere — e.g. submits a Plan — and comes back.
  // Skip the very first focus since useHomeFeed already fetched on mount.
  const hasFocusedOnceRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return;
      }
      refetch();
    }, [refetch]),
  );

  // Shared with the Location screen — fetched at most once per session, not
  // re-requested on every Home render.
  useEnsureLocation();
  const dispatch = useAppDispatch();
  const locationStatus = useAppSelector(selectLocationStatus);
  const locationPlace = useAppSelector(selectLocationPlace);

  const viewModel = useMemo<HomeViewModel>(
    () => (data ? mapHomeFeed(data) : EMPTY_VIEW_MODEL),
    [data],
  );

  // Hero "your event so far" draft — client-side only until "Get quotes" is
  /*
   * The draft lives in the store, not here.
   *
   * Two of its four fields are edited on their own screens — occasion and area
   * each open a search screen — and a picker that had to hand its answer back
   * through navigation params would need to know which screen pushed it.
   */
  const storedDraft = useAppSelector(selectHeroDraft);
  const [quotesRequested, setQuotesRequested] = useState(false);
  const requestQuotesCall = useRequestQuotes();

  /*
   * Seeded once, from the feed where it has one and from the app's own
   * defaults where it does not: today's date and a hundred guests, so the card
   * opens answerable rather than blank. `seedHeroDraft` ignores a second call,
   * so a refetch never resets what the customer has since chosen.
   */
  useEffect(() => {
    dispatch(
      seedHeroDraft({
        ...(viewModel.banner?.defaultDraft ?? {}),
        when: todayIso(),
        guests: DEFAULT_GUESTS,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewModel.banner]);

  /* Memoised because it is a dependency of the two submit callbacks, and a
     fresh object each render would rebuild both on every keystroke elsewhere
     on the screen. */
  const heroDraft: HeroDraft = useMemo(
    () => ({
      occasion: storedDraft.occasion,
      when: storedDraft.when,
      where: storedDraft.where,
      guests: storedDraft.guests,
    }),
    [
      storedDraft.occasion,
      storedDraft.when,
      storedDraft.where,
      storedDraft.guests,
    ],
  );

  const setHeroField = useCallback(
    (field: HeroDraftTextField, value: string) => {
      dispatch(setHeroDraftField({ field, value }));
      setQuotesRequested(false);
    },
    [dispatch],
  );

  const toggleShareBudget = useCallback(
    (enabled: boolean) => {
      dispatch(setShareBudget(enabled));
      setQuotesRequested(false);
    },
    [dispatch],
  );

  const submitHeroDraft = useCallback(() => {
    requestQuotesCall
      /* The budget rides along only while sharing is on — the slice clears it
         when the switch goes off, so this cannot send a withdrawn value. */
      .execute({ ...heroDraft, budget: storedDraft.budget || undefined })
      .then(() => {
        setQuotesRequested(true);
        /*
         * Re-read the feed, so the brief the customer just sent replaces the
         * hero they sent it from.
         *
         * Without this the request exists on the server and nothing on screen
         * says so until Home happens to lose and regain focus — which, since
         * Home is the tab they are already on, may not happen for a long time.
         * The single-organizer path below has always done this; the broadcast
         * path had not, which is why a brief sent from the hero appeared to
         * vanish.
         */
        refetch();
      })
      .catch(() => {
        // error already captured in requestQuotesCall.error
      });
  }, [heroDraft, storedDraft.budget, refetch, requestQuotesCall]);

  const resetQuotesRequest = useCallback(() => setQuotesRequested(false), []);

  // --- organizer section --------------------------------------------------
  const organizerQuoteCall = useRequestQuoteFromOrganizer();
  const [organizerRequestedIds, setOrganizerRequestedIds] = useState<string[]>(
    [],
  );
  const [organizerRequestingId, setOrganizerRequestingId] = useState<
    string | null
  >(null);

  /*
   * Sends the customer's current draft to one named organizer. The draft is
   * what they have actually chosen in the hero; nothing is defaulted in here,
   * so an organizer never receives an occasion the customer did not pick.
   */
  const requestQuoteFrom = useCallback(
    (organizerId: string) => {
      if (organizerRequestingId) return;
      setOrganizerRequestingId(organizerId);
      organizerQuoteCall
        .execute({
          organizerId,
          occasion: heroDraft.occasion,
          when: heroDraft.when,
          where: heroDraft.where,
          guests: heroDraft.guests,
        })
        .then(() => {
          setOrganizerRequestedIds(prev =>
            prev.includes(organizerId) ? prev : [...prev, organizerId],
          );
          // The feed's current-event card should reflect the new request.
          refetch();
        })
        .catch(() => {
          // error surfaces through organizerQuoteCall.error
        })
        .finally(() => setOrganizerRequestingId(null));
    },
    [heroDraft, organizerRequestingId, organizerQuoteCall, refetch],
  );

  const { savedPackageIds, toggleSavedPackage } = useSavedPackageIds();

  const header = useMemo<HomeHeaderViewModel>(
    () => ({
      unreadCount: data?.unreadCount ?? 0,
      savedCount: data?.savedPackageCount ?? 0,
      /*
       * The account's own city first, the detected one second.
       *
       * Both name a city, but they answer different questions. The account's
       * city is a decision the customer made about where they want events —
       * somebody planning a wedding back home browses from another state and
       * still means home. The detected city is only where the phone is right
       * now. So travelling never silently repoints the feed; detection fills
       * the gap for an account that has not set a city yet, which is the case
       * where the alternative was the unhelpful 'Set your city'.
       */
      locationLabel:
        data?.user?.location?.trim() ||
        locationPlace?.locality ||
        locationPlace?.label ||
        (locationStatus === 'error' ? 'Location unavailable' : 'Set your city'),
    }),
    [data, locationStatus, locationPlace],
  );

  return {
    ...viewModel,
    header,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
    heroDraft,
    budget: storedDraft.budget,
    shareBudget: storedDraft.shareBudget,
    toggleShareBudget,
    setHeroField,
    submitHeroDraft,
    isRequestingQuotes: requestQuotesCall.loading,
    quotesRequested,
    quotesErrorMessage: requestQuotesCall.error?.message ?? null,
    resetQuotesRequest,
    organizerRequestedIds,
    organizerRequestingId,
    organizerRequestError: organizerQuoteCall.error?.message ?? null,
    requestQuoteFrom,
    savedPackageIds,
    toggleSavedPackage,
  };
}
