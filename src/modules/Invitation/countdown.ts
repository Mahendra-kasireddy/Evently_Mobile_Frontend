/**
 * Countdown maths for the customer's review of the invitation.
 *
 * The server resolves the event's wall-clock date, time and zone into one
 * absolute instant and sends that; everything here does is subtract. So this
 * file knows nothing about timezones, and a phone set to the wrong zone — or
 * to another country — still shows the same figures as every guest.
 */

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the event moment is in the past. */
  passed: boolean;
}

const ZERO: CountdownParts = { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };

/**
 * The gap between now and the target, split into days/hours/minutes/seconds.
 *
 * Derived from two absolute instants every time rather than by decrementing a
 * stored counter: a backgrounded app has its timers throttled, and a counter
 * drifts while this is correct the moment it wakes. Never negative — past the
 * moment it is zero, and the screen shows the organizer's message instead.
 */
export function countdownFrom(targetMs: number | null, nowMs: number): CountdownParts {
  if (targetMs === null) return { ...ZERO, passed: false };
  const remainingMs = targetMs - nowMs;
  if (remainingMs <= 0) return ZERO;

  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    passed: false,
  };
}

/** Whether the runtime knows this zone. An unknown one falls back to UTC. */
function isKnownZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(0);
    return true;
  } catch {
    return false;
  }
}

/**
 * The date and the time of an instant, printed in the event's own zone.
 *
 * Not the phone's zone: a guest in London reading about a ceremony in
 * Hyderabad needs the time it starts there, which is the time printed on the
 * card and the time everyone else will say out loud.
 */
export function dateInZone(iso: string | null, timeZone: string): string {
  const ms = iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(ms)) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: isKnownZone(timeZone) ? timeZone : 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(ms);
}

export function timeInZone(iso: string | null, timeZone: string): string {
  const ms = iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(ms)) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: isKnownZone(timeZone) ? timeZone : 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  }).format(ms);
}

/** Two digits, for the hour/minute/second boxes. */
export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}
