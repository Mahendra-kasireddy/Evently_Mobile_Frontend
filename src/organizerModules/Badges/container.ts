import { useCallback, useMemo, useState } from 'react';
import { useBadgeStatus } from './hooks';
import type { BadgesModel } from './types';
import { mapBadges } from './utils';

export interface BadgesContainerResult {
  model: BadgesModel | null;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => void;
}

export function useBadgesContainer(): BadgesContainerResult {
  const status = useBadgeStatus();
  const [pulling, setPulling] = useState(false);
  const refetch = status.refetch;
  const refresh = useCallback(() => {
    setPulling(true);
    refetch();
  }, [refetch]);
  if (pulling && !status.loading) setPulling(false);

  return {
    model: useMemo(
      () => (status.data ? mapBadges(status.data) : null),
      [status.data],
    ),
    isLoading: status.loading && !status.data,
    isRefreshing: pulling,
    errorMessage: !status.data && status.error ? status.error.message : null,
    refresh,
  };
}
