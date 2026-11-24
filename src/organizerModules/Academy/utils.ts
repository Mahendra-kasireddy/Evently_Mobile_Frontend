import { ACADEMY_COPY as COPY } from './constants';
import type { AcademyDTO, LessonModel, StageSummary } from './types';

export function mapLessons(a: AcademyDTO): LessonModel[] {
  const lessons = a.stage1.lessons ?? [];
  const nextKey = lessons.find(l => !l.completed)?.key ?? null;
  return lessons.map(l => ({
    key: l.key,
    title: l.title,
    minutes: COPY.minutes(l.minutes),
    done: l.completed,
    next: l.key === nextKey,
  }));
}

export function stageSummaries(a: AcademyDTO): StageSummary[] {
  const workshops = a.stage2.workshops ?? [];
  const items = a.stage3.items ?? [];
  return [
    {
      number: 1,
      ...COPY.stage1,
      unlocked: true,
      done: a.stage1.completedCount,
      total: a.stage1.totalCount,
    },
    {
      number: 2,
      ...COPY.stage2,
      unlocked: a.stage2.unlocked,
      done: workshops.filter(w => w.registered).length,
      total: workshops.length,
    },
    {
      number: 3,
      ...COPY.stage3,
      unlocked: a.stage3.unlocked,
      done: items.filter(i => i.completed).length,
      total: items.length,
    },
  ];
}

/** 0–100, clamped — the ring never overdraws. */
export function overallPercent(a: AcademyDTO): number {
  return Math.max(0, Math.min(100, Math.round(a.overallPercent ?? 0)));
}
