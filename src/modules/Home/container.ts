import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useEnsureLocation } from '../../hooks/useEnsureLocation';
import { selectLocationStatus } from '../../store/locationSlice';
import { useAppSelector } from '../../store/hooks';
import { useHomeFeed, useOrganizerProfile, useRequestQuotes, useRequestQuoteFromOrganizer } from './hooks';
import { mapHomeFeed } from './utils';
import type { HeroDraft, HomeHeaderViewModel, HomeViewModel, OrganizerProfileDTO } from './types';

const EMPTY_VIEW_MODEL: HomeViewModel = {
  banner: null,
  bookedEvent: null,
  currentEvent: null,
  categories: null,
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
  heroDraft: HeroDraft | null;
  setHeroField: (field: keyof HeroDraft, value: string) => void;
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
  /** The profile sheet: which organizer, its data, and its load state. */
  openOrganizerProfile: (organizerId: string) => void;
  closeOrganizerProfile: () => void;
  organizerProfileId: string | null;
  organizerProfile: OrganizerProfileDTO | null;
  isLoadingOrganizerProfile: boolean;
  organizerProfileError: string | null;
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
  const locationStatus = useAppSelector(selectLocationStatus);

  const viewModel = useMemo<HomeViewModel>(() => (data ? mapHomeFeed(data) : EMPTY_VIEW_MODEL), [data]);

  // Hero "your event so far" draft — client-side only until "Get quotes" is
  // submitted, seeded once from the backend's defaultDraft.
  const [heroDraft, setHeroDraft] = useState<HeroDraft | null>(null);
  const [quotesRequested, setQuotesRequested] = useState(false);
  const requestQuotesCall = useRequestQuotes();

  useEffect(() => {
    if (viewModel.banner && !heroDraft) {
      setHeroDraft(viewModel.banner.defaultDraft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewModel.banner]);

  const setHeroField = useCallback((field: keyof HeroDraft, value: string) => {
    setHeroDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
    setQuotesRequested(false);
  }, []);

  const submitHeroDraft = useCallback(() => {
    if (!heroDraft) return;
    requestQuotesCall
      .execute(heroDraft)
      .then(() => setQuotesRequested(true))
      .catch(() => {
        // error already captured in requestQuotesCall.error
      });
  }, [heroDraft, requestQuotesCall]);

  const resetQuotesRequest = useCallback(() => setQuotesRequested(false), []);

  // --- organizer section --------------------------------------------------
  const organizerQuoteCall = useRequestQuoteFromOrganizer();
  const [organizerRequestedIds, setOrganizerRequestedIds] = useState<string[]>([]);
  const [organizerRequestingId, setOrganizerRequestingId] = useState<string | null>(null);

  /*
   * Sends the customer's current draft to one named organizer. The draft is
   * what they have actually chosen in the hero; nothing is defaulted in here,
   * so an organizer never receives an occasion the customer did not pick.
   */
  const requestQuoteFrom = useCallback(
    (organizerId: string) => {
      if (!heroDraft || organizerRequestingId) return;
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
          setOrganizerRequestedIds((prev) => (prev.includes(organizerId) ? prev : [...prev, organizerId]));
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

  const organizerProfileCall = useOrganizerProfile();
  const [organizerProfileId, setOrganizerProfileId] = useState<string | null>(null);
  const [organizerProfile, setOrganizerProfile] = useState<OrganizerProfileDTO | null>(null);

  const openOrganizerProfile = useCallback(
    (organizerId: string) => {
      setOrganizerProfileId(organizerId);
      // Cleared first, so the sheet never shows the previous organizer's
      // details under this organizer's name while the fetch is in flight.
      setOrganizerProfile(null);
      organizerProfileCall
        .execute(organizerId)
        .then(setOrganizerProfile)
        .catch(() => {
          // error surfaces through organizerProfileCall.error
        });
    },
    [organizerProfileCall],
  );

  const closeOrganizerProfile = useCallback(() => setOrganizerProfileId(null), []);

  const header = useMemo<HomeHeaderViewModel>(
    () => ({
      unreadCount: data?.unreadCount ?? 0,
      locationLabel: locationStatus === 'error' ? 'Location unavailable' : 'Current location',
    }),
    [data, locationStatus],
  );

  return {
    ...viewModel,
    header,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
    heroDraft,
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
    openOrganizerProfile,
    closeOrganizerProfile,
    organizerProfileId,
    organizerProfile,
    isLoadingOrganizerProfile: organizerProfileCall.loading,
    organizerProfileError: organizerProfileCall.error?.message ?? null,
  };
}
