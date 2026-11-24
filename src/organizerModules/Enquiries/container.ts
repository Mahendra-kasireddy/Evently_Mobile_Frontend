import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useIncomingRequests } from './hooks';
import type { EnquiryFilter, EnquiryItem, FilterChip } from './types';
import { applyFilter, defaultFilter, filterChips, mapEnquiries } from './utils';

export interface EnquiriesContainerResult {
  items: EnquiryItem[];
  chips: FilterChip[];
  filter: EnquiryFilter;
  setFilter: (filter: EnquiryFilter) => void;
  query: string;
  setQuery: (query: string) => void;
  /** True when there are enquiries at all, so an empty list is a filter's doing. */
  hasAny: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => void;
}

/**
 * The enquiry inbox: one request, filtered and searched on the phone.
 * Fetched again whenever the tab comes back into view — after writing a quote,
 * the enquiry should already have moved to Drafts or Sent.
 */
export function useEnquiriesContainer(): EnquiriesContainerResult {
  const incoming = useIncomingRequests();
  const [chosenFilter, setFilter] = useState<EnquiryFilter | null>(null);
  const [query, setQuery] = useState('');
  const [pulling, setPulling] = useState(false);

  const all = useMemo(() => mapEnquiries(incoming.data), [incoming.data]);
  // Until the organizer picks a chip, open where the work is.
  const filter = chosenFilter ?? defaultFilter(all);

  const seen = useRef(false);
  const refetch = incoming.refetch;
  useFocusEffect(
    useCallback(() => {
      if (seen.current) refetch();
      seen.current = true;
    }, [refetch]),
  );

  const refresh = useCallback(() => {
    setPulling(true);
    refetch();
  }, [refetch]);
  if (pulling && !incoming.loading) setPulling(false);

  return {
    items: useMemo(() => applyFilter(all, filter, query), [all, filter, query]),
    chips: useMemo(() => filterChips(all), [all]),
    filter,
    setFilter,
    query,
    setQuery,
    hasAny: all.length > 0,
    isLoading: incoming.loading && !incoming.data,
    isRefreshing: pulling,
    errorMessage:
      !incoming.data && incoming.error ? incoming.error.message : null,
    refresh,
  };
}
