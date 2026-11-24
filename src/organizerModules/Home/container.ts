import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  useBadges,
  useDashboard,
  useMyBookings,
  useOnboardingStatus,
  useSetTaskStatus,
} from './hooks';
import type {
  GoLiveCardModel,
  HomeStats,
  HomeTask,
  TierModel,
  UpcomingEvent,
} from './types';
import {
  countToConfirm,
  countToQuote,
  mapGoLive,
  mapStats,
  mapTasks,
  mapTier,
  mapWeek,
} from './utils';

export interface OrganizerHomeContainerResult {
  goLive: GoLiveCardModel;
  toQuote: number;
  toConfirm: number;
  stats: HomeStats | null;
  tasks: HomeTask[];
  week: UpcomingEvent[];
  tier: TierModel | null;
  isLoading: boolean;
  isRefreshing: boolean;
  /** Only when the dashboard itself failed — the other cards just stay hidden. */
  errorMessage: string | null;
  refresh: () => void;
  toggleTask: (task: HomeTask) => void;
}

/**
 * The organizer's Home: four small requests in parallel, mapped to the cards.
 *
 * The dashboard is the one that matters — without it there is no Home, so it
 * alone decides loading and error. The others (go-live, tier, bookings
 * to confirm) fill their own cards when they arrive and simply stay hidden if
 * they fail. Everything is fetched again whenever Home comes back into view.
 */
export function useOrganizerHomeContainer(): OrganizerHomeContainerResult {
  const dashboard = useDashboard();
  const badges = useBadges();
  const onboarding = useOnboardingStatus();
  const bookings = useMyBookings();
  const setTask = useSetTaskStatus();

  /** Ticks the organizer just made, shown before the server confirms them. */
  const [taskOverrides, setTaskOverrides] = useState<Record<string, boolean>>(
    {},
  );
  const [pullRefreshing, setPullRefreshing] = useState(false);

  const refetchAll = useCallback(() => {
    dashboard.refetch();
    badges.refetch();
    onboarding.refetch();
    bookings.refetch();
  }, [dashboard, badges, onboarding, bookings]);

  // Back in view (after a quote, a booking or setup): fresh numbers. The first
  // focus is the mount, which already fetched.
  const seen = useRef(false);
  const refetchRef = useRef(refetchAll);
  refetchRef.current = refetchAll;
  useFocusEffect(
    useCallback(() => {
      if (seen.current) refetchRef.current();
      seen.current = true;
    }, []),
  );

  const refresh = useCallback(() => {
    setPullRefreshing(true);
    refetchAll();
  }, [refetchAll]);
  if (pullRefreshing && !dashboard.loading) setPullRefreshing(false);

  const toggleTask = useCallback(
    (task: HomeTask) => {
      const done = !task.done;
      setTaskOverrides(prev => ({ ...prev, [task.id]: done }));
      setTask
        .execute(task.bookingId, task.id, done ? 'done' : 'todo')
        .catch(() =>
          // Didn't save: put the tick back where the server has it.
          setTaskOverrides(prev => {
            const next = { ...prev };
            delete next[task.id];
            return next;
          }),
        );
    },
    [setTask],
  );

  const data = dashboard.data;
  // A fresh dashboard already carries the saved ticks; drop the local ones.
  const [overridesFor, setOverridesFor] = useState(data);
  if (overridesFor !== data) {
    setOverridesFor(data);
    if (Object.keys(taskOverrides).length) setTaskOverrides({});
  }
  const tasks = useMemo(
    () =>
      data
        ? mapTasks(data).map(task =>
            task.id in taskOverrides
              ? { ...task, done: taskOverrides[task.id] }
              : task,
          )
        : [],
    [data, taskOverrides],
  );

  return {
    goLive: useMemo(() => mapGoLive(onboarding.data), [onboarding.data]),
    toQuote: data ? countToQuote(data) : 0,
    toConfirm: countToConfirm(bookings.data),
    stats: useMemo(() => (data ? mapStats(data) : null), [data]),
    tasks,
    week: useMemo(() => (data ? mapWeek(data) : []), [data]),
    tier: useMemo(() => mapTier(badges.data), [badges.data]),
    isLoading: dashboard.loading && !data,
    isRefreshing: pullRefreshing,
    errorMessage: !data && dashboard.error ? dashboard.error.message : null,
    refresh,
    toggleTask,
  };
}
