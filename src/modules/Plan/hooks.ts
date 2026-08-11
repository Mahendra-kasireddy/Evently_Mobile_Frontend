import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { createPlan, fetchMyDraft, fetchOrganizers, fetchPlanScreen, requestQuoteFromOrganizer, saveDraft } from './services';

export function usePlanScreenData() {
  return useAsync(fetchPlanScreen, []);
}

/** Resume the customer's live draft — fetched once on mount, every user is authenticated by the time they reach this screen. */
export function useMyDraft() {
  return useAsync(fetchMyDraft, []);
}

export function useOrganizersCallback() {
  return useAsyncCallback(fetchOrganizers);
}

export function useSaveDraftCallback() {
  return useAsyncCallback(saveDraft);
}

export function useCreatePlanCallback() {
  return useAsyncCallback(createPlan);
}

export function useRequestQuoteCallback() {
  return useAsyncCallback(requestQuoteFromOrganizer);
}
