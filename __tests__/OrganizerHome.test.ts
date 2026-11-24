import {
  countToConfirm,
  countToQuote,
  mapGoLive,
  mapStats,
  mapTier,
  mapWeek,
} from '../src/organizerModules/Home/utils';
import type {
  DashboardDTO,
  OnboardingStatusDTO,
} from '../src/organizerModules/Home/types';

const status = (
  over: Partial<OnboardingStatusDTO> = {},
): OnboardingStatusDTO => ({
  onboardingStatus: 'in_progress',
  canEditBank: true,
  canSubmit: false,
  payoutReady: false,
  reviewNote: '',
  steps: [
    {
      id: 'basic',
      title: 'Basic information',
      complete: true,
      requiredForGoLive: true,
    },
    {
      id: 'services',
      title: 'Services',
      complete: false,
      requiredForGoLive: true,
    },
    {
      id: 'portfolio',
      title: 'Profile & portfolio',
      complete: false,
      requiredForGoLive: true,
    },
    {
      id: 'verification',
      title: 'Verification',
      complete: false,
      requiredForGoLive: true,
    },
    {
      id: 'bank',
      title: 'Bank details',
      complete: false,
      requiredForGoLive: false,
    },
  ],
  ...over,
});

const dashboard = (over: Partial<DashboardDTO> = {}): DashboardDTO => ({
  newEnquiries: 3,
  activeBookings: 2,
  monthEarnings: 125000,
  monthEarningsChangePercent: 12.4,
  avgRating: 4.62,
  todaysTasks: [],
  next7Days: [],
  pendingEnquiries: [],
  ...over,
});

describe('go-live card', () => {
  it('shows the checklist with the next go-live step, ignoring bank details', () => {
    const card = mapGoLive(status());
    expect(card).toMatchObject({
      kind: 'setup',
      done: 1,
      total: 4,
      percent: 25,
      nextStepId: 'services',
      nextStepTitle: 'Services',
    });
  });

  it('says changes are needed, with the reviewer note', () => {
    const card = mapGoLive(
      status({ onboardingStatus: 'changes_requested', reviewNote: 'Add GST' }),
    );
    expect(card).toMatchObject({ kind: 'changes', note: 'Add GST' });
  });

  it('waits quietly while under review', () => {
    expect(mapGoLive(status({ onboardingStatus: 'submitted' }))).toEqual({
      kind: 'submitted',
    });
  });

  it('nudges for bank details once live without them', () => {
    expect(mapGoLive(status({ onboardingStatus: 'approved' }))).toEqual({
      kind: 'payout',
    });
  });

  it('disappears once live with bank details on file', () => {
    expect(
      mapGoLive(status({ onboardingStatus: 'approved', payoutReady: true })),
    ).toBeNull();
  });

  it('is absent while the status has not loaded', () => {
    expect(mapGoLive(null)).toBeNull();
  });
});

describe('needs you now', () => {
  it('counts only enquiries this organizer has not quoted', () => {
    expect(
      countToQuote(
        dashboard({
          pendingEnquiries: [
            { id: 'a', myQuotation: null },
            { id: 'b', myQuotation: { id: 'q' } },
          ],
        }),
      ),
    ).toBe(1);
  });

  it('counts bookings waiting on the organizer', () => {
    expect(
      countToConfirm([
        { id: '1', status: 'pending' },
        { id: '2', status: 'awaiting_organizer' },
        { id: '3', status: 'confirmed' },
      ]),
    ).toBe(2);
    expect(countToConfirm(null)).toBe(0);
  });
});

describe('stats', () => {
  it('formats earnings compactly with the month-on-month change', () => {
    expect(mapStats(dashboard())).toMatchObject({
      monthEarnings: '₹1.3L',
      earningsChange: '+12% vs last month',
      rating: '4.6',
    });
  });

  it('shows a dash with no reviews and no change line without a comparison', () => {
    expect(
      mapStats(dashboard({ avgRating: 0, monthEarningsChangePercent: null })),
    ).toMatchObject({
      rating: '—',
      earningsChange: '',
    });
  });
});

describe('tier', () => {
  it('says how many events to the next tier', () => {
    expect(
      mapTier({
        currentTier: 'Silver',
        events: 3,
        avgRating: 4.5,
        nextTier: 'Gold',
        nextRequirements: { events: 5, avgRating: 4.5 },
      }),
    ).toEqual({ tier: 'Silver', line: '2 more events to Gold', progress: 0.6 });
  });

  it('marks the top tier', () => {
    expect(
      mapTier({
        currentTier: 'Platinum',
        events: 40,
        avgRating: 4.9,
        nextTier: null,
        nextRequirements: null,
      }),
    ).toMatchObject({ tier: 'Platinum', progress: 1 });
  });
});

describe('week', () => {
  it('labels the week ahead and drops undated items', () => {
    const now = new Date(2026, 9, 29, 10);
    const week = mapWeek(
      dashboard({
        next7Days: [
          {
            id: 'b1',
            eventDate: new Date(2026, 9, 30).toISOString(),
            title: 'Wedding',
            customerName: 'Priya R.',
          },
          {
            id: 'b2',
            eventDate: 'not a date',
            title: 'Broken',
            customerName: '',
          },
        ],
      }),
      now,
    );
    expect(week).toHaveLength(1);
    expect(week[0]).toMatchObject({ id: 'b1', when: 'Tomorrow', day: '30' });
  });
});
