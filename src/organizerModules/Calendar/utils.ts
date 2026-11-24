/*
 * Pure date math for the Calendar. Everything is done in UTC: the server keys
 * bookings and blocked days by their UTC-midnight date, so "the 20th" must be
 * the same day whatever the phone's timezone (local getters would shift IST
 * days back by one).
 */
import { formatInr } from '../Shared';
import { MONTH_NAMES, STATUS_LOOK, WEEKDAY_SHORT } from './constants';
import type {
  CalendarBookedDateDTO,
  CalendarDayCell,
  CalendarIndex,
  DayBooking,
  DayState,
  MonthKey,
  OrganizerCalendarDTO,
  SelectedDay,
  UpcomingRow,
} from './types';

const DAY_MS = 86_400_000;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}/;

/** "2026-11-14" — a Date's UTC calendar day. */
export function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** The UTC day of an ISO date or datetime; null when missing or unreadable. */
export function dayKeyOf(value: string | null | undefined): string | null {
  if (!value) return null;
  if (ISO_DAY.test(value) && value.length === 10) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : toDayKey(date);
}

/** Midnight UTC of a day key, in ms. */
function msOf(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`);
}

export function todayKey(now = new Date()): string {
  return toDayKey(now);
}

export function monthOf(iso: string): MonthKey {
  const d = new Date(msOf(iso));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

export function shiftMonth(m: MonthKey, delta: number): MonthKey {
  const d = new Date(Date.UTC(m.year, m.month + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

export function sameMonth(a: MonthKey, b: MonthKey): boolean {
  return a.year === b.year && a.month === b.month;
}

/** "November 2026". */
export function monthTitle(m: MonthKey): string {
  return `${MONTH_NAMES[m.month]} ${m.year}`;
}

/** "Sat, 14 Nov". */
export function dayTitle(iso: string): string {
  const d = new Date(msOf(iso));
  return `${WEEKDAY_SHORT[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTH_NAMES[
    d.getUTCMonth()
  ].slice(0, 3)}`;
}

/** Bookings grouped by their day, and the blocked days as a set. */
export function indexCalendar(
  dto: OrganizerCalendarDTO | null | undefined,
): CalendarIndex {
  const bookedByDay: Record<string, CalendarBookedDateDTO[]> = {};
  for (const b of dto?.bookedDates ?? []) {
    const key = dayKeyOf(b.date);
    if (!key) continue;
    if (!bookedByDay[key]) bookedByDay[key] = [];
    bookedByDay[key].push(b);
  }
  const blocked = new Set<string>();
  for (const d of dto?.blockedDates ?? []) {
    const key = dayKeyOf(d);
    if (key) blocked.add(key);
  }
  return { bookedByDay, blocked };
}

/** Booked beats blocked beats past; anything else is free. */
export function dayState(
  iso: string,
  index: CalendarIndex,
  today: string,
): DayState {
  if (index.bookedByDay[iso]?.length) return 'booked';
  if (index.blocked.has(iso)) return 'blocked';
  if (iso < today) return 'past';
  return 'free';
}

/**
 * The 6×7 grid for a month, Sunday first: the trailing days of the month
 * before, the month itself, then the leading days of the next.
 */
export function buildMonthGrid(
  m: MonthKey,
  index: CalendarIndex,
  today: string,
): CalendarDayCell[] {
  const first = Date.UTC(m.year, m.month, 1);
  const start = first - new Date(first).getUTCDay() * DAY_MS;
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start + i * DAY_MS);
    const iso = toDayKey(date);
    return {
      iso,
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() === m.month,
      isToday: iso === today,
      isPast: iso < today,
      state: dayState(iso, index, today),
      bookingCount: index.bookedByDay[iso]?.length ?? 0,
    };
  });
}

/** Every day from `from` to `to`, inclusive, whichever order they come in. */
export function expandRange(from: string, to: string): string[] {
  const a = msOf(from);
  const b = msOf(to);
  if (Number.isNaN(a) || Number.isNaN(b)) return [];
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  const out: string[] = [];
  for (let t = lo; t <= hi; t += DAY_MS) out.push(toDayKey(new Date(t)));
  return out;
}

/** A day the organizer can block: today or later, not booked, not blocked. */
export function canBlock(
  iso: string,
  index: CalendarIndex,
  today: string,
): boolean {
  return dayState(iso, index, today) === 'free';
}

/** Adds or takes out one picked day. */
export function togglePick(picked: string[], iso: string): string[] {
  return picked.includes(iso)
    ? picked.filter(d => d !== iso)
    : [...picked, iso].sort();
}

/** Adds every blockable day between `anchor` and `iso` to the picks. */
export function pickRange(
  picked: string[],
  anchor: string,
  iso: string,
  index: CalendarIndex,
  today: string,
): string[] {
  const add = expandRange(anchor, iso).filter(d => canBlock(d, index, today));
  return Array.from(new Set([...picked, ...add])).sort();
}

/** The blocked list with one day set or cleared — the optimistic copy. */
export function withBlocked(
  blocked: string[],
  iso: string,
  on: boolean,
): string[] {
  const rest = blocked.filter(d => dayKeyOf(d) !== iso);
  return on ? [...rest, iso].sort() : rest;
}

export function mapDayBooking(b: CalendarBookedDateDTO): DayBooking {
  const key = dayKeyOf(b.date);
  const d = key ? new Date(msOf(key)) : null;
  return {
    id: b.bookingId,
    title: b.title || 'Event',
    customerName: b.customerName ?? '',
    location: b.location ?? '',
    day: d ? String(d.getUTCDate()) : '',
    month: d ? MONTH_NAMES[d.getUTCMonth()].slice(0, 3).toUpperCase() : '',
    amount: formatInr(b.amount),
    status: STATUS_LOOK[b.status] ?? { label: b.status, tone: 'grey' },
  };
}

export function selectedDay(
  iso: string,
  index: CalendarIndex,
  today: string,
): SelectedDay {
  return {
    iso,
    title: dayTitle(iso),
    state: dayState(iso, index, today),
    isPast: iso < today,
    bookings: (index.bookedByDay[iso] ?? []).map(mapDayBooking),
  };
}

/**
 * The booked days still to come in a month — all of them for a future month,
 * from today on for this one, none for a month already gone.
 */
export function upcomingInMonth(
  m: MonthKey,
  index: CalendarIndex,
  today: string,
): UpcomingRow[] {
  return Object.keys(index.bookedByDay)
    .filter(iso => iso >= today && sameMonth(monthOf(iso), m))
    .sort()
    .map(iso => {
      const list = index.bookedByDay[iso];
      const d = new Date(msOf(iso));
      return {
        iso,
        day: String(d.getUTCDate()),
        weekday: WEEKDAY_SHORT[d.getUTCDay()],
        title: list[0].title || 'Event',
        more: list.length > 1 ? `+${list.length - 1} more` : '',
      };
    });
}
