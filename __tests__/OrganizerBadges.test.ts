import {
  mapBadges,
  mapLadder,
  mapRequirements,
  ratePercent,
} from '../src/organizerModules/Badges/utils';
import {
  nativeRouteForPath,
  nativeScreenForPath,
} from '../src/organizerModules/Navigation/constants';
import type { BadgeStatusDTO } from '../src/organizerModules/Badges/types';

const LADDER = [
  { tier: 'Silver', commissionRate: 0.12 },
  { tier: 'Gold', commissionRate: 0.08 },
  { tier: 'Platinum', commissionRate: 0.06 },
];

const silver = (over: Partial<BadgeStatusDTO> = {}): BadgeStatusDTO => ({
  currentTier: 'Silver',
  commissionRate: 0.12,
  events: 7,
  avgRating: 4.6,
  trainingStage: 1,
  complaintsCount: 0,
  nextTier: 'Gold',
  nextRequirements: {
    events: 10,
    avgRating: 4.0,
    trainingStage: 2,
    maxComplaints: 0,
  },
  tierLadder: LADDER,
  ...over,
});

describe('badges', () => {
  it('writes rates as percentages', () => {
    expect(ratePercent(0.08)).toBe('8%');
  });

  it('says how far the organizer is from the next tier', () => {
    const model = mapBadges(silver());
    expect(model.hero).toEqual({
      tier: 'Silver',
      title: 'Silver organizer',
      subtitle: '7 of 10 events to Gold · 4.6★ rating',
      rate: 'You pay 12% commission',
    });
    expect(model.metCount).toBe(2);
  });

  it('ticks what is met and measures what is not', () => {
    const reqs = mapRequirements(silver());
    expect(reqs.map(r => [r.key, r.met, r.value])).toEqual([
      ['events', false, '7/10'],
      ['rating', true, '4.6 ✓'],
      ['training', false, 'Stage 1 of 2'],
      ['complaints', true, '0 ✓'],
    ]);
    expect(reqs[0].progress).toBeCloseTo(0.7);
  });

  it('marks the path: reached, current, ahead', () => {
    expect(
      mapLadder(silver({ currentTier: 'Gold' })).map(s => [
        s.tier,
        s.state,
        s.rate,
      ]),
    ).toEqual([
      ['Silver', 'done', '12%'],
      ['Gold', 'current', '8%'],
      ['Platinum', 'ahead', '6%'],
    ]);
  });

  it('fills the next tier’s commission into its perks', () => {
    expect(mapBadges(silver()).perks.map(p => p.label)).toContain(
      'Lower 8% commission',
    );
  });

  it('has nothing left to reach at the top tier', () => {
    const model = mapBadges(
      silver({
        currentTier: 'Platinum',
        nextTier: null,
        nextRequirements: null,
        events: 40,
      }),
    );
    expect(model.nextTier).toBeNull();
    expect(model.requirements).toEqual([]);
    expect(model.perks).toEqual([]);
    expect(model.hero.subtitle).toBe('40 events completed · 4.6★ rating');
  });
});

describe('native screens for web links', () => {
  it('maps the newer native screens, quote links with their id', () => {
    expect(nativeRouteForPath('/organizer/coupons')).toEqual({
      name: 'OrganizerCoupons',
    });
    expect(nativeRouteForPath('/organizer/subvendors')).toEqual({
      name: 'OrganizerSubVendors',
    });
    expect(nativeRouteForPath('/organizer/calendar')).toEqual({
      name: 'OrganizerCalendar',
    });
    expect(nativeRouteForPath('/organizer/respond/abc123?x=1')).toEqual({
      name: 'OrganizerQuote',
      params: { requestId: 'abc123' },
    });
  });

  it('opens badges natively, with or without a query', () => {
    expect(nativeScreenForPath('/organizer/badges')).toBe('OrganizerBadges');
    expect(nativeScreenForPath('/organizer/badges/?x=1')).toBe(
      'OrganizerBadges',
    );
    expect(nativeScreenForPath('/organizer/unknown-page')).toBeNull();
  });
});

describe('setup links', () => {
  it('opens Go-live setup natively, at the step the link names', () => {
    expect(nativeRouteForPath('/organizer/setup?step=bank')).toEqual({
      name: 'OrganizerSetup',
      params: { step: 'bank' },
    });
    expect(nativeRouteForPath('/organizer/setup')).toEqual({
      name: 'OrganizerSetup',
    });
  });
});

describe('event links', () => {
  it('opens an event workspace and its ideas board natively', () => {
    expect(nativeRouteForPath('/organizer/events/b1')).toEqual({
      name: 'OrganizerEvent',
      params: { bookingId: 'b1' },
    });
    expect(nativeRouteForPath('/organizer/events/b1/ideas')).toEqual({
      name: 'OrganizerIdeas',
      params: { bookingId: 'b1' },
    });
  });
});

describe('public event links', () => {
  it('opens the list and one event natively', () => {
    expect(nativeRouteForPath('/organizer/public-events')).toEqual({
      name: 'OrganizerPublicEvents',
    });
    expect(nativeRouteForPath('/organizer/public-events/e9')).toEqual({
      name: 'OrganizerPublicEvent',
      params: { eventId: 'e9' },
    });
  });
});

describe('invitation links', () => {
  it('opens the guest invitation editor natively', () => {
    expect(nativeRouteForPath('/organizer/invitation/b1')).toEqual({
      name: 'OrganizerInvitation',
      params: { bookingId: 'b1' },
    });
  });
});
