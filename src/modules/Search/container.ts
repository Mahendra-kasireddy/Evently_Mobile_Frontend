import { useCallback, useMemo, useRef, useState } from 'react';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { useAsync } from '../../hooks/useAsync';
import { BUDGET_CEILINGS, NO_FILTERS } from './constants';
import { fetchCities, fetchOccasions, search } from './services';
import type { SearchFilters, SearchKind, SearchResultsDTO } from './types';

const EMPTY: SearchResultsDTO = { packages: [], organizers: [], total: 0 };

export interface SearchContainerResult {
  query: string;
  setQuery: (value: string) => void;
  kind: SearchKind;
  setKind: (kind: SearchKind) => void;
  filters: SearchFilters;
  setFilter: (key: keyof SearchFilters, value: string) => void;
  clearFilters: () => void;
  /** How many filters are set — the badge on the filter button. */
  activeFilterCount: number;
  results: SearchResultsDTO;
  /** True until the customer has actually run a search. */
  isIdle: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  runSearch: () => void;
  occasions: Array<{ id: string; label: string }>;
  cities: string[];
}

export function useSearchContainer(initialKind: SearchKind): SearchContainerResult {
  const [query, setQuery] = useState('');
  const [kind, setKindState] = useState<SearchKind>(initialKind);
  const [filters, setFilters] = useState<SearchFilters>(NO_FILTERS);
  const [results, setResults] = useState<SearchResultsDTO>(EMPTY);
  const [isIdle, setIsIdle] = useState(true);

  const call = useAsyncCallback(search);
  const occasions = useAsync(fetchOccasions, []);
  const cities = useAsync(fetchCities, []);

  /*
   * The latest request wins.
   *
   * Typing fires searches faster than they come back, and without this a slow
   * early response can land after a fast later one and overwrite the results
   * for what the customer is actually looking at.
   */
  const runId = useRef(0);

  const run = useCallback(
    (next: { query: string; kind: SearchKind; filters: SearchFilters }) => {
      const ceiling = BUDGET_CEILINGS.find((b) => b.key === next.filters.maxBudget);
      const id = ++runId.current;
      setIsIdle(false);

      call
        .execute({
          q: next.query,
          occasion: next.filters.occasion,
          city: next.filters.city,
          maxBudget: ceiling?.value ?? null,
          kind: next.kind,
        })
        .then((data) => {
          if (id === runId.current) setResults(data);
        })
        .catch(() => {
          if (id === runId.current) setResults(EMPTY);
        });
    },
    [call],
  );

  const runSearch = useCallback(() => run({ query, kind, filters }), [run, query, kind, filters]);

  // Changing a facet re-runs immediately: a filter the customer has to confirm
  // separately reads as though it did not take.
  const setKind = useCallback(
    (nextKind: SearchKind) => {
      setKindState(nextKind);
      if (!isIdle) run({ query, kind: nextKind, filters });
    },
    [isIdle, run, query, filters],
  );

  const setFilter = useCallback(
    (key: keyof SearchFilters, value: string) => {
      // Tapping the chosen option again clears it, so a filter is never a trap.
      const next = { ...filters, [key]: filters[key] === value ? '' : value };
      setFilters(next);
      if (!isIdle) run({ query, kind, filters: next });
    },
    [filters, isIdle, run, query, kind],
  );

  const clearFilters = useCallback(() => {
    setFilters(NO_FILTERS);
    if (!isIdle) run({ query, kind, filters: NO_FILTERS });
  }, [isIdle, run, query, kind]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters],
  );

  return {
    query,
    setQuery,
    kind,
    setKind,
    filters,
    setFilter,
    clearFilters,
    activeFilterCount,
    results,
    isIdle,
    isLoading: call.loading,
    errorMessage: call.error?.message ?? null,
    runSearch,
    occasions: occasions.data ?? [],
    cities: cities.data ?? [],
  };
}
