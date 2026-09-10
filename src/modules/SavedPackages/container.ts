import { useCallback, useMemo, useState } from 'react';
import { useSavedPackages, useUnsaveAction } from './hooks';
import type { SavedPackageDTO } from './types';

export interface SavedPackagesContainerResult {
  items: SavedPackageDTO[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  /** Set when a removal failed and the card came back. */
  actionError: string | null;
  remove: (packageId: string) => void;
  refetch: () => void;
}

export function useSavedPackagesContainer(): SavedPackagesContainerResult {
  const { data, loading, error, refetch } = useSavedPackages();
  const unsave = useUnsaveAction();
  /*
   * Removed optimistically and put back if the server refuses.
   *
   * Removing something you saved should feel instant, and the failure case is
   * rare — but it does happen offline, and a card that silently stayed gone
   * while the server still held it would leave the two disagreeing until the
   * next fetch.
   */
  const [removed, setRemoved] = useState<string[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const items = useMemo(
    () => (data ?? []).filter((item) => !removed.includes(item.id)),
    [data, removed],
  );

  const remove = useCallback(
    (packageId: string) => {
      setActionError(null);
      setRemoved((current) => (current.includes(packageId) ? current : [...current, packageId]));
      unsave.execute(packageId).catch((err: { message?: string }) => {
        setRemoved((current) => current.filter((id) => id !== packageId));
        setActionError(err?.message ?? null);
      });
    },
    [unsave],
  );

  return {
    items,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    actionError,
    remove,
    refetch,
  };
}
