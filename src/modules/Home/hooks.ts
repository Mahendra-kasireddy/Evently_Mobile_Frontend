import { useCallback, useMemo, useState } from 'react';
import { fetchSavedPackages } from '../SavedPackages/services';
import { useSaveAction, useUnsaveAction } from '../SavedPackages/hooks';
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

/**
 * Which packages this account has saved, and the tap that changes it.
 *
 * The state is held here rather than read from the feed because saving is not
 * part of the feed: it belongs to the account, and the home response is
 * cached and shared. The heart flips immediately and is put back if the server
 * refuses — a heart that waits for a round trip feels broken, and one that
 * stays filled after a failed save is a lie about what was stored.
 *
 * A failed load leaves every heart empty rather than blocking the carousel;
 * the worst case is a save that turns out to be a no-op, which the next load
 * corrects.
 */
export function useSavedPackageIds() {
  const { data } = useAsync(fetchSavedPackages, []);
  const save = useSaveAction();
  const unsave = useUnsaveAction();

  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const savedPackageIds = useMemo(() => {
    const fromServer = (data ?? []).map((item) => item.id);
    const set = new Set(fromServer);
    Object.entries(overrides).forEach(([id, saved]) => {
      if (saved) set.add(id);
      else set.delete(id);
    });
    return Array.from(set);
  }, [data, overrides]);

  const toggleSavedPackage = useCallback(
    (packageId: string) => {
      const nextSaved = !savedPackageIds.includes(packageId);
      setOverrides((current) => ({ ...current, [packageId]: nextSaved }));

      const call = nextSaved ? save : unsave;
      call.execute(packageId).catch(() => {
        // Put the heart back the way it was; the server did not accept it.
        setOverrides((current) => ({ ...current, [packageId]: !nextSaved }));
      });
    },
    [save, unsave, savedPackageIds],
  );

  return { savedPackageIds, toggleSavedPackage };
}
