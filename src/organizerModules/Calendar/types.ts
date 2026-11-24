/*
 * `GET /booking/organizer/calendar` as the organizer receives it, then the
 * view models the Calendar screen draws. Every date is compared as its UTC
 * calendar day ("YYYY-MM-DD"), the way the server stores them.
 */

export type BookingStatus =
  | 'pending'
  | 'awaiting_organizer'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'expired';

export interface CalendarBookedDateDTO {
  /** The event's UTC-midnight date; missing while the date is still open. */
  date: string | null;
  bookingId: string;
  title: string;
  customerName: string;
  location: string;
  amount: number;
  status: BookingStatus;
}

export interface OrganizerCalendarDTO {
  bookedDates: CalendarBookedDateDTO[];
  /** Days the organizer has blocked off — ISO dates or datetimes. */
  blockedDates: string[];
}

/** `POST /booking/organizer/blocked-dates` body. */
export interface SetBlockedBody {
  date: string;
  blocked: boolean;
}

/** A calendar month, `month` 0–11. */
export interface MonthKey {
  year: number;
  month: number;
}

export type DayState = 'booked' | 'blocked' | 'free' | 'past';
export type StatusTone = 'amber' | 'green' | 'blue' | 'grey' | 'red';

/** The calendar data, keyed by UTC day. */
export interface CalendarIndex {
  bookedByDay: Record<string, CalendarBookedDateDTO[]>;
  blocked: Set<string>;
}

export interface CalendarDayCell {
  /** "2026-11-14". */
  iso: string;
  /** 1–31. */
  day: number;
  /** False for the leading/trailing days of the neighbouring months. */
  inMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  state: DayState;
  bookingCount: number;
}

export interface DayBooking {
  id: string;
  title: string;
  customerName: string;
  location: string;
  /** Date tile: '14' / 'NOV'. */
  day: string;
  month: string;
  amount: string;
  status: { label: string; tone: StatusTone };
}

export interface SelectedDay {
  iso: string;
  /** "Sat, 14 Nov". */
  title: string;
  state: DayState;
  isPast: boolean;
  bookings: DayBooking[];
}

export interface UpcomingRow {
  iso: string;
  day: string;
  weekday: string;
  title: string;
  /** "+1 more" when two bookings share the day, '' otherwise. */
  more: string;
}
