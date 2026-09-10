import { useCallback, useMemo } from 'react';
import { useMarkAllRead, useMarkRead, useNotifications } from './hooks';
import { groupByDay, mapNotifications } from './utils';
import type { NotificationGroup, NotificationItem } from './types';

export interface NotificationContainerResult {
  items: NotificationItem[];
  /** The same items under Today / Earlier, empty groups dropped. */
  groups: NotificationGroup[];
  hasUnread: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isMarkingAllRead: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
  refetch: () => void;
}

export function useNotificationContainer(): NotificationContainerResult {
  const { data, loading, error, refetch } = useNotifications();
  const markReadCall = useMarkRead();
  const markAllReadCall = useMarkAllRead();

  const items = useMemo<NotificationItem[]>(() => (data ? mapNotifications(data) : []), [data]);
  const groups = useMemo(() => groupByDay(items), [items]);

  const markRead = useCallback(
    (id: string) => {
      markReadCall
        .execute(id)
        .then(refetch)
        .catch(() => {
          // error is already captured in markReadCall.error
        });
    },
    [markReadCall, refetch],
  );

  const markAllRead = useCallback(() => {
    markAllReadCall
      .execute()
      .then(refetch)
      .catch(() => {
        // error is already captured in markAllReadCall.error
      });
  }, [markAllReadCall, refetch]);

  return {
    items,
    groups,
    hasUnread: items.some((item) => !item.read),
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    isMarkingAllRead: markAllReadCall.loading,
    markRead,
    markAllRead,
    refetch,
  };
}
