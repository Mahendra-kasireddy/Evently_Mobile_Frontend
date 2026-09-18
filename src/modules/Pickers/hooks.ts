import { useCallback, useEffect, useState } from 'react';
import type { RecentKind } from './constants';
import { fetchRecents, recordRecent, removeRecent } from './services';
import type { RecentSearchDTO } from './types';

export interface RecentsResult {
  recents: RecentSearchDTO[];
  /** Records a pick, and puts it at the top of the list straight away. */
  remember: (label: string, value: string) => void;
  forget: (id: string) => void;
}

/**
 * One picker's recent picks.
 *
 * Every failure here is swallowed on purpose. Recents are a convenience on top
 * of a list that is already on screen: a customer who cannot reach the server
 * should still be able to choose their city, and an error banner over a
 * feature nobody asked for would be the only thing they remember about it.
 */
export function useRecents(kind: RecentKind): RecentsResult {
  const [recents, setRecents] = useState<RecentSearchDTO[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchRecents(kind)
      .then(rows => {
        if (!cancelled) setRecents(rows);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [kind]);

  const remember = useCallback(
    (label: string, value: string) => {
      /*
       * Moved to the top locally before the request settles. The customer is
       * leaving this screen on the same tap, so the only version of this list
       * they will ever see is the one they come back to — and waiting for a
       * round trip to reorder it would mean coming back to the old order.
       */
      setRecents(current => [
        { id: `pending:${value}`, kind, label, value },
        ...current.filter(row => row.value !== value),
      ]);
      recordRecent(kind, label, value).catch(() => undefined);
    },
    [kind],
  );

  const forget = useCallback((id: string) => {
    setRecents(current => current.filter(row => row.id !== id));
    removeRecent(id).catch(() => undefined);
  }, []);

  return { recents, remember, forget };
}
