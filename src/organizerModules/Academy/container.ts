import { useCallback, useMemo, useState } from 'react';
import { ACADEMY_COPY as COPY } from './constants';
import { useAcademy, useAcademyAction } from './hooks';
import type {
  AcademyAction,
  AcademyDTO,
  LessonModel,
  StageSummary,
} from './types';
import { mapLessons, overallPercent, stageSummaries } from './utils';

export interface AcademyContainerResult {
  data: AcademyDTO | null;
  percent: number;
  lessons: LessonModel[];
  stages: StageSummary[];
  /** The item being saved, `${action}:${key}`. */
  busy: string | null;
  notice: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => void;
  act: (action: AcademyAction, key: string) => void;
}

/**
 * The Academy. Every action returns the whole Academy back, so the screen
 * takes that as the new state at once — no second request, and the next stage
 * unlocks the moment the last lesson of this one is done.
 */
export function useAcademyContainer(): AcademyContainerResult {
  const academy = useAcademy();
  const action = useAcademyAction();
  const [latest, setLatest] = useState<AcademyDTO | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);

  // A fresh fetch supersedes whatever an action handed back.
  const [latestFor, setLatestFor] = useState(academy.data);
  if (latestFor !== academy.data) {
    setLatestFor(academy.data);
    setLatest(null);
  }
  const data = latest ?? academy.data;

  const refetch = academy.refetch;
  const refresh = useCallback(() => {
    setPulling(true);
    refetch();
  }, [refetch]);
  if (pulling && !academy.loading) setPulling(false);

  const act = useCallback(
    (kind: AcademyAction, key: string) => {
      if (busy) return;
      setBusy(`${kind}:${key}`);
      setNotice(null);
      action
        .execute(kind, key)
        .then(next => setLatest(next))
        .catch(() => setNotice(COPY.actionFailed))
        .finally(() => setBusy(null));
    },
    [busy, action],
  );

  return {
    data,
    percent: data ? overallPercent(data) : 0,
    lessons: useMemo(() => (data ? mapLessons(data) : []), [data]),
    stages: useMemo(() => (data ? stageSummaries(data) : []), [data]),
    busy,
    notice,
    isLoading: academy.loading && !data,
    isRefreshing: pulling,
    errorMessage: !data && academy.error ? academy.error.message : null,
    refresh,
    act,
  };
}
