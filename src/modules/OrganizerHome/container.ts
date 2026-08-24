import { useCallback, useState } from 'react';
import { useBadges, useDashboard, useUpdateTaskStatus } from './hooks';
import type { BadgeStatus, DashboardTask, OrganizerDashboard } from './types';

export interface OrganizerHomeResult {
  data: OrganizerDashboard | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  badges: BadgeStatus | undefined;
  toggleTask: (task: DashboardTask) => void;
}

/** Organizer home's business logic — mirrors web's useOrganizerHome hook, same
 * two already-live endpoints (dashboard + badges), plus an optimistic local
 * overlay for task toggling so the checkbox reacts instantly. */
export function useOrganizerHome(): OrganizerHomeResult {
  const dashboardQuery = useDashboard();
  const badgesQuery = useBadges();
  const updateTask = useUpdateTaskStatus();
  const [overrides, setOverrides] = useState<Record<string, DashboardTask['status']>>({});

  const toggleTask = useCallback(
    (task: DashboardTask) => {
      const next = task.status === 'done' ? 'todo' : 'done';
      setOverrides((prev) => ({ ...prev, [task.id]: next }));
      updateTask.execute(task.bookingId, task.id, next).catch(() => {
        setOverrides((prev) => ({ ...prev, [task.id]: task.status }));
      });
    },
    [updateTask],
  );

  const data = dashboardQuery.data
    ? {
        ...dashboardQuery.data,
        todaysTasks: dashboardQuery.data.todaysTasks.map((t) => ({ ...t, status: overrides[t.id] ?? t.status })),
      }
    : undefined;

  return {
    data,
    isLoading: dashboardQuery.loading,
    isError: !!dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    badges: badgesQuery.data ?? undefined,
    toggleTask,
  };
}
