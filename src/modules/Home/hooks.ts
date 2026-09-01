import { useAsync, type AsyncResult } from '../../hooks/useAsync';
import { useAsyncCallback, type AsyncCallbackResult } from '../../hooks/useAsyncCallback';
import { fetchHomeFeed, fetchOrganizerProfile, requestQuotes } from './services';
import { requestQuoteFromOrganizer } from '../Plan/services';
import type { RequestQuoteFromOrganizerDTO } from '../Plan/types';
import type { HeroDraft, HomeFeedDTO, OrganizerProfileDTO } from './types';

export function useHomeFeed(): AsyncResult<HomeFeedDTO> {
  return useAsync(fetchHomeFeed, []);
}

export function useRequestQuotes(): AsyncCallbackResult<[HeroDraft], void> {
  return useAsyncCallback(requestQuotes);
}

/**
 * "Get quote" on an organizer card. Reuses the Plan module's existing service
 * rather than re-declaring the endpoint — there is one way to raise a quote
 * request against a named organizer, and this is it.
 */
export function useRequestQuoteFromOrganizer(): AsyncCallbackResult<
  [RequestQuoteFromOrganizerDTO],
  { id: string }
> {
  return useAsyncCallback(requestQuoteFromOrganizer);
}

/** "View Profile" — loaded on demand, when the sheet opens. */
export function useOrganizerProfile(): AsyncCallbackResult<[string], OrganizerProfileDTO> {
  return useAsyncCallback(fetchOrganizerProfile);
}
