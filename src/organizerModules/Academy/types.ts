/** `GET /organizer/academy` (and every Academy POST, which returns the same). */

export interface AcademyDTO {
  trainingStage: number;
  overallPercent: number;
  stage1: {
    completedCount: number;
    totalCount: number;
    lessons: Array<{
      key: string;
      title: string;
      minutes: number;
      completed: boolean;
    }>;
  };
  stage2: {
    unlocked: boolean;
    workshops: Array<{
      key: string;
      title: string;
      when: string;
      registered: boolean;
    }>;
  };
  stage3: {
    unlocked: boolean;
    items: Array<{ key: string; title: string; completed: boolean }>;
  };
}

export type AcademyAction = 'lesson' | 'workshop' | 'stage3';

export interface LessonModel {
  key: string;
  title: string;
  minutes: string;
  done: boolean;
  /** The first unfinished lesson — the one to do next. */
  next: boolean;
}

export interface StageSummary {
  number: 1 | 2 | 3;
  title: string;
  subtitle: string;
  unlocked: boolean;
  done: number;
  total: number;
  /** 'Mandatory' / 'Optional'. */
  tag: string;
}
