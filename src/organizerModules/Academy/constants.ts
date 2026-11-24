export const ACADEMY_ENDPOINT = '/organizer/academy';
export const COMPLETE_LESSON_ENDPOINT = '/organizer/academy/complete-lesson';
export const REGISTER_WORKSHOP_ENDPOINT =
  '/organizer/academy/register-workshop';
export const COMPLETE_STAGE3_ENDPOINT = '/organizer/academy/complete-stage3';

export const ACADEMY_COPY = {
  title: 'Evently Academy',
  loading: 'Loading your training…',
  error: 'We couldn’t load the Academy.',
  retry: 'Try again',
  actionFailed: 'That didn’t save. Please try again.',

  heroTag: 'Get certified',
  heroTitle: 'Evently Academy',
  heroBody:
    'Finish training to unlock badges, higher search ranking and lower commission.',
  heroStage: (stage: number) =>
    stage > 0 ? `Stage ${stage} of 3 done` : 'Not started yet',
  complete: 'complete',

  stage1: {
    title: 'Onboarding basics',
    subtitle: 'Short lessons on how Evently works',
    tag: 'Mandatory',
  },
  stage2: {
    title: 'Professional standards',
    subtitle: 'Workshops and live sessions',
    tag: 'Mandatory',
  },
  stage3: {
    title: 'Master class',
    subtitle: 'Optional · opens the path to Platinum',
    tag: 'Optional',
  },
  stageLabel: (n: number) => `Stage ${n}`,
  progress: (done: number, total: number) => `${done} of ${total} done`,
  lockedHint: (n: number) => `Finish Stage ${n - 1} to unlock`,

  minutes: (m: number) => `${m} min`,
  start: 'Start',
  watch: 'Watch',
  done: 'Done',
  register: 'Register',
  registered: 'Registered',
  markDone: 'Mark done',

  noLessons: 'Your lessons will appear here as soon as they are published.',
  noWorkshops: 'No sessions scheduled right now.',
  noItems: 'Master class milestones are on their way.',

  helpTitle: 'Evently Mitra helpline',
  helpBody: 'Questions about training? We’re here Mon–Sat, 9 AM–9 PM.',
  helpCta: 'Get help',
} as const;
