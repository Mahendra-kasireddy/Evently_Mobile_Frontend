import { formatDateSpan } from '../src/modules/PublicEvents/constants';
import { isNotEnded } from '../src/modules/PublicEvents/sections/FeaturedEvents';
import type { EventCard } from '../src/modules/PublicEvents/types';

describe('the featured banner date pill', () => {
  const tz = 'Asia/Kolkata';

  it('shows one day for a one-day event', () => {
    expect(formatDateSpan('2026-10-25T13:30:00Z', '2026-10-25T17:30:00Z', tz)).toBe('Oct 25');
    expect(formatDateSpan('2026-10-25T13:30:00Z', null, tz)).toBe('Oct 25');
  });

  it('shows a span within a month without repeating the month', () => {
    expect(formatDateSpan('2026-10-25T05:00:00Z', '2026-10-27T15:00:00Z', tz)).toBe('Oct 25 – 27');
  });

  it('names both months when the span crosses one', () => {
    expect(formatDateSpan('2026-10-31T05:00:00Z', '2026-11-02T15:00:00Z', tz)).toBe('Oct 31 – Nov 2');
  });

  it('reads the date in the event’s own zone', () => {
    // 20:00 UTC on the 24th is already the 25th in India.
    expect(formatDateSpan('2026-10-24T20:00:00Z', null, tz)).toBe('Oct 25');
  });

  it('says nothing for a missing or broken date', () => {
    expect(formatDateSpan(null, null, tz)).toBe('');
    expect(formatDateSpan('not a date', null, tz)).toBe('');
  });
});

describe('the featured banner never shows an expired event', () => {
  const now = Date.parse('2026-10-06T12:00:00Z');
  const event = (fields: Partial<EventCard>): EventCard =>
    ({
      id: 'e1',
      title: 'Music Fest',
      category: 'Concert',
      coverUrl: '',
      startDateTime: '2026-10-25T13:00:00Z',
      endDateTime: null,
      timezone: 'Asia/Kolkata',
      venueName: '',
      city: '',
      startingPrice: 0,
      soldOut: false,
      status: 'published',
      liveEnabled: false,
      liveState: 'upcoming',
      ...fields,
    }) as EventCard;

  it('keeps upcoming events', () => {
    expect(isNotEnded(event({}), now)).toBe(true);
  });

  it('keeps an event that has started but not ended', () => {
    expect(
      isNotEnded(event({ startDateTime: '2026-10-05T10:00:00Z', endDateTime: '2026-10-07T10:00:00Z', liveState: 'live' }), now),
    ).toBe(true);
  });

  it('drops an event whose end has passed, even if still marked published', () => {
    expect(
      isNotEnded(event({ startDateTime: '2026-09-20T10:00:00Z', endDateTime: '2026-09-21T10:00:00Z' }), now),
    ).toBe(false);
  });

  it('drops an event with no end once its start has passed', () => {
    expect(isNotEnded(event({ startDateTime: '2026-10-01T10:00:00Z' }), now)).toBe(false);
  });

  it('drops one the server already calls ended', () => {
    expect(isNotEnded(event({ liveState: 'ended' }), now)).toBe(false);
  });
});
