import {
  buildMonthGrid,
  canBlock,
  dayKeyOf,
  dayState,
  dayTitle,
  expandRange,
  indexCalendar,
  mapDayBooking,
  monthOf,
  monthTitle,
  pickRange,
  selectedDay,
  shiftMonth,
  togglePick,
  upcomingInMonth,
  withBlocked,
} from '../src/organizerModules/Calendar/utils';
import type {
  CalendarBookedDateDTO,
  OrganizerCalendarDTO,
} from '../src/organizerModules/Calendar/types';

const TODAY = '2026-11-10';

const booking = (
  over: Partial<CalendarBookedDateDTO> = {},
): CalendarBookedDateDTO => ({
  date: '2026-11-14T00:00:00.000Z',
  bookingId: 'b1',
  title: 'Priya & Arjun Wedding',
  customerName: 'Priya Reddy',
  location: 'Hyderabad',
  amount: 450000,
  status: 'confirmed',
  ...over,
});

const dto: OrganizerCalendarDTO = {
  bookedDates: [
    booking(),
    booking({
      bookingId: 'b2',
      title: 'Sangeet',
      date: '2026-11-14T00:00:00.000Z',
    }),
    booking({
      bookingId: 'b3',
      title: 'Birthday',
      date: '2026-11-03T00:00:00.000Z',
    }),
    booking({
      bookingId: 'b4',
      title: 'Reception',
      date: '2026-11-28T00:00:00.000Z',
    }),
    booking({ bookingId: 'b5', title: 'Undated', date: null }),
    booking({
      bookingId: 'b6',
      title: 'Next month',
      date: '2026-12-02T00:00:00.000Z',
    }),
  ],
  blockedDates: ['2026-11-20T00:00:00.000Z', '2026-11-05', '2026-11-25'],
};

const index = indexCalendar(dto);

describe('day keys', () => {
  it('reads dates and datetimes as their UTC day', () => {
    expect(dayKeyOf('2026-11-14')).toBe('2026-11-14');
    expect(dayKeyOf('2026-11-14T00:00:00.000Z')).toBe('2026-11-14');
    expect(dayKeyOf('2026-11-13T20:00:00.000-05:00')).toBe('2026-11-14');
    expect(dayKeyOf(null)).toBeNull();
    expect(dayKeyOf('not a date')).toBeNull();
  });

  it('names months and days in UTC', () => {
    expect(monthTitle({ year: 2026, month: 10 })).toBe('November 2026');
    expect(dayTitle('2026-11-14')).toBe('Sat, 14 Nov');
    expect(monthOf('2026-02-28')).toEqual({ year: 2026, month: 1 });
    expect(shiftMonth({ year: 2026, month: 11 }, 1)).toEqual({
      year: 2027,
      month: 0,
    });
    expect(shiftMonth({ year: 2026, month: 0 }, -1)).toEqual({
      year: 2025,
      month: 11,
    });
  });
});

describe('indexCalendar', () => {
  it('groups bookings by day and skips undated ones', () => {
    expect(index.bookedByDay['2026-11-14'].map(b => b.bookingId)).toEqual([
      'b1',
      'b2',
    ]);
    expect(Object.values(index.bookedByDay).flat()).toHaveLength(5);
  });

  it('normalises blocked days', () => {
    expect([...index.blocked].sort()).toEqual([
      '2026-11-05',
      '2026-11-20',
      '2026-11-25',
    ]);
  });
});

describe('buildMonthGrid', () => {
  const grid = buildMonthGrid({ year: 2026, month: 10 }, index, TODAY);

  it('is 6 weeks of 7 days starting on a Sunday', () => {
    expect(grid).toHaveLength(42);
    // 1 Nov 2026 is a Sunday, so the grid opens on it with no leading days.
    expect(grid[0]).toMatchObject({ iso: '2026-11-01', day: 1, inMonth: true });
    expect(grid[29]).toMatchObject({ iso: '2026-11-30', inMonth: true });
    expect(grid[30]).toMatchObject({
      iso: '2026-12-01',
      day: 1,
      inMonth: false,
    });
    expect(grid[41].iso).toBe('2026-12-12');
  });

  it('fills leading days from the month before', () => {
    // 1 Oct 2026 is a Thursday: Sun 27 Sep .. Wed 30 Sep lead in.
    const oct = buildMonthGrid({ year: 2026, month: 9 }, index, TODAY);
    expect(oct.slice(0, 4).map(c => c.iso)).toEqual([
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
    ]);
    expect(oct.slice(0, 4).every(c => !c.inMonth)).toBe(true);
    expect(oct[4]).toMatchObject({ iso: '2026-10-01', inMonth: true });
    expect(oct[41]).toMatchObject({ iso: '2026-11-07', inMonth: false });
  });

  it('handles a February that starts on a Sunday and the year boundary', () => {
    const feb = buildMonthGrid({ year: 2026, month: 1 }, index, TODAY);
    expect(feb[0].iso).toBe('2026-02-01');
    expect(feb[27].iso).toBe('2026-02-28');
    expect(feb[28]).toMatchObject({ iso: '2026-03-01', inMonth: false });
    const jan = buildMonthGrid({ year: 2027, month: 0 }, index, TODAY);
    expect(jan[0].iso).toBe('2026-12-27');
    expect(jan[5]).toMatchObject({ iso: '2027-01-01', inMonth: true });
  });

  it('marks each day booked, blocked, past or free, and today', () => {
    const at = (iso: string) => grid.find(c => c.iso === iso)!;
    expect(at('2026-11-14')).toMatchObject({
      state: 'booked',
      bookingCount: 2,
    });
    expect(at('2026-11-03')).toMatchObject({ state: 'booked', isPast: true });
    expect(at('2026-11-20').state).toBe('blocked');
    expect(at('2026-11-05')).toMatchObject({ state: 'blocked', isPast: true });
    expect(at('2026-11-09')).toMatchObject({ state: 'past', isPast: true });
    expect(at('2026-11-10')).toMatchObject({
      state: 'free',
      isToday: true,
      isPast: false,
    });
    expect(at('2026-11-11')).toMatchObject({ state: 'free', isToday: false });
    expect(at('2026-12-02').state).toBe('booked');
  });
});

describe('dayState', () => {
  it('puts a booking ahead of a block on the same day', () => {
    const both = indexCalendar({
      bookedDates: [booking({ date: '2026-11-20' })],
      blockedDates: ['2026-11-20'],
    });
    expect(dayState('2026-11-20', both, TODAY)).toBe('booked');
  });
});

describe('range expansion and picking', () => {
  it('expands a range inclusively, either way round, across months', () => {
    expect(expandRange('2026-11-29', '2026-12-02')).toEqual([
      '2026-11-29',
      '2026-11-30',
      '2026-12-01',
      '2026-12-02',
    ]);
    expect(expandRange('2026-12-02', '2026-11-30')).toEqual([
      '2026-11-30',
      '2026-12-01',
      '2026-12-02',
    ]);
    expect(expandRange('2026-11-14', '2026-11-14')).toEqual(['2026-11-14']);
    expect(expandRange('x', '2026-11-14')).toEqual([]);
  });

  it('only lets free days from today on be blocked', () => {
    expect(canBlock('2026-11-11', index, TODAY)).toBe(true);
    expect(canBlock('2026-11-10', index, TODAY)).toBe(true);
    expect(canBlock('2026-11-09', index, TODAY)).toBe(false);
    expect(canBlock('2026-11-14', index, TODAY)).toBe(false);
    expect(canBlock('2026-11-20', index, TODAY)).toBe(false);
  });

  it('toggles single picks and fills a range with blockable days only', () => {
    expect(togglePick(['2026-11-12'], '2026-11-11')).toEqual([
      '2026-11-11',
      '2026-11-12',
    ]);
    expect(togglePick(['2026-11-12'], '2026-11-12')).toEqual([]);
    expect(
      pickRange(['2026-11-11'], '2026-11-12', '2026-11-16', index, TODAY),
    ).toEqual([
      '2026-11-11',
      '2026-11-12',
      '2026-11-13',
      '2026-11-15',
      '2026-11-16',
    ]);
  });

  it('sets and clears a blocked day for the optimistic copy', () => {
    expect(withBlocked(['2026-11-20'], '2026-11-12', true)).toEqual([
      '2026-11-12',
      '2026-11-20',
    ]);
    expect(
      withBlocked(
        ['2026-11-20T00:00:00.000Z', '2026-11-25'],
        '2026-11-20',
        false,
      ),
    ).toEqual(['2026-11-25']);
  });
});

describe('day panel and upcoming list', () => {
  it('maps a booked day to its bookings', () => {
    const day = selectedDay('2026-11-14', index, TODAY);
    expect(day).toMatchObject({
      title: 'Sat, 14 Nov',
      state: 'booked',
      isPast: false,
    });
    expect(day.bookings.map(b => b.title)).toEqual([
      'Priya & Arjun Wedding',
      'Sangeet',
    ]);
    expect(mapDayBooking(booking())).toMatchObject({
      id: 'b1',
      day: '14',
      month: 'NOV',
      amount: '₹4,50,000',
      status: { label: 'Confirmed', tone: 'green' },
    });
  });

  it('lists the booked days still ahead in the month shown', () => {
    const rows = upcomingInMonth({ year: 2026, month: 10 }, index, TODAY);
    expect(rows.map(r => r.iso)).toEqual(['2026-11-14', '2026-11-28']);
    expect(rows[0]).toMatchObject({
      day: '14',
      weekday: 'Sat',
      more: '+1 more',
    });
    expect(upcomingInMonth({ year: 2026, month: 9 }, index, TODAY)).toEqual([]);
    expect(
      upcomingInMonth({ year: 2026, month: 11 }, index, TODAY),
    ).toHaveLength(1);
  });
});
