import { mapLessons, overallPercent, stageSummaries } from '../src/organizerModules/Academy/utils';
import { nativeScreenForPath } from '../src/organizerModules/Navigation/constants';
import type { AcademyDTO } from '../src/organizerModules/Academy/types';

const academy = (over: Partial<AcademyDTO> = {}): AcademyDTO => ({
  trainingStage: 0,
  overallPercent: 33.4,
  stage1: {
    completedCount: 1,
    totalCount: 3,
    lessons: [
      { key: 'welcome', title: 'Welcome to Evently', minutes: 5, completed: true },
      { key: 'quotes', title: 'Writing great quotes', minutes: 8, completed: false },
      { key: 'payments', title: 'How payments work', minutes: 6, completed: false },
    ],
  },
  stage2: {
    unlocked: false,
    workshops: [{ key: 'w1', title: 'Hospitality basics', when: 'Sat, 10 AM', registered: false }],
  },
  stage3: { unlocked: false, items: [{ key: 'm1', title: 'Luxury weddings', completed: false }] },
  ...over,
});

describe('academy', () => {
  it('marks the first unfinished lesson as next', () => {
    expect(mapLessons(academy()).map(l => [l.key, l.done, l.next, l.minutes])).toEqual([
      ['welcome', true, false, '5 min'],
      ['quotes', false, true, '8 min'],
      ['payments', false, false, '6 min'],
    ]);
  });

  it('has no next lesson once all are done', () => {
    const done = academy();
    done.stage1.lessons = done.stage1.lessons.map(l => ({ ...l, completed: true }));
    expect(mapLessons(done).some(l => l.next)).toBe(false);
  });

  it('summarises each stage with its lock state and progress', () => {
    expect(
      stageSummaries(
        academy({
          stage2: {
            unlocked: true,
            workshops: [
              { key: 'w1', title: 'A', when: '', registered: true },
              { key: 'w2', title: 'B', when: '', registered: false },
            ],
          },
        }),
      ).map(s => [s.number, s.unlocked, s.done, s.total, s.tag]),
    ).toEqual([
      [1, true, 1, 3, 'Mandatory'],
      [2, true, 1, 2, 'Mandatory'],
      [3, false, 0, 1, 'Optional'],
    ]);
  });

  it('rounds and clamps the overall percentage', () => {
    expect(overallPercent(academy())).toBe(33);
    expect(overallPercent(academy({ overallPercent: 140 }))).toBe(100);
  });

  it('opens Academy links natively', () => {
    expect(nativeScreenForPath('/organizer/academy')).toBe('OrganizerAcademy');
  });
});
