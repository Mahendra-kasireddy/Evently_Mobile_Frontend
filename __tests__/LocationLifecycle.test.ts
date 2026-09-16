/**
 * @format
 *
 * When the app is allowed to read the device's location by itself.
 *
 * This policy is the whole defence against a read loop. Every trigger that
 * calls it — a screen mounting, a screen regaining focus, the app returning to
 * the foreground — can fire more than once in quick succession, and a read that
 * lands re-renders the screens that triggered it. A gap that any caller can
 * step around is not a gap, which is exactly how a build shipped that cycled
 * between Refresh and Updating… forever.
 */
import { __resetReadInFlight, __shouldAttempt } from '../src/hooks/useEnsureLocation';

const GAP_MS = 10_000;
const NOW = 1_700_000_000_000;

function attempt(overrides: Partial<Parameters<typeof __shouldAttempt>[0]> = {}) {
  return __shouldAttempt({
    status: 'idle',
    errorCode: null,
    lastAttemptAt: null,
    fromForeground: false,
    now: NOW,
    ...overrides,
  });
}

beforeEach(() => {
  __resetReadInFlight();
});

describe('the first read', () => {
  it('starts as soon as something wants a location', () => {
    expect(attempt()).toBe(true);
  });
});

describe('the pacing floor', () => {
  it('refuses a second read inside the gap', () => {
    expect(attempt({ status: 'error', lastAttemptAt: NOW - 1_000 })).toBe(false);
  });

  it('allows one once the gap has passed', () => {
    expect(attempt({ status: 'error', lastAttemptAt: NOW - GAP_MS - 1 })).toBe(true);
  });

  /*
   * The regression. Returning to the foreground is allowed past a refusal and
   * past a success, but not past the clock — otherwise every AppState event
   * starts a read, each read jitters the position, and the render re-arms the
   * trigger.
   */
  it('binds a foreground check too', () => {
    expect(attempt({ status: 'success', fromForeground: true, lastAttemptAt: NOW - 1_000 })).toBe(
      false,
    );
  });

  it('still lets a foreground check through once the gap has passed', () => {
    expect(
      attempt({ status: 'success', fromForeground: true, lastAttemptAt: NOW - GAP_MS - 1 }),
    ).toBe(true);
  });
});

describe('a read already running', () => {
  it('is never joined by a second one', () => {
    expect(attempt({ status: 'loading' })).toBe(false);
    expect(attempt({ status: 'loading', fromForeground: true })).toBe(false);
  });
});

describe('a position we already have', () => {
  it('is not re-read just because a screen was opened', () => {
    expect(attempt({ status: 'success', lastAttemptAt: NOW - 60_000 })).toBe(false);
  });

  it('is re-checked on returning to the app, in case permission was revoked', () => {
    expect(
      attempt({ status: 'success', fromForeground: true, lastAttemptAt: NOW - 60_000 }),
    ).toBe(true);
  });
});

describe('a permission the customer refused', () => {
  it.each(['permission_denied', 'permission_blocked'])(
    'is not re-requested on focus alone (%s)',
    (errorCode) => {
      // The OS answers a re-request for a blocked permission without showing
      // anything, so asking again costs battery and shows the customer nothing.
      expect(attempt({ status: 'error', errorCode, lastAttemptAt: NOW - 60_000 })).toBe(false);
    },
  );

  it.each(['permission_denied', 'permission_blocked'])(
    'is re-checked on returning from Settings (%s)',
    (errorCode) => {
      // The one moment it can legitimately have changed. Without this,
      // "enable it in Settings" is advice the app then ignores.
      expect(
        attempt({
          status: 'error',
          errorCode,
          fromForeground: true,
          lastAttemptAt: NOW - 60_000,
        }),
      ).toBe(true);
    },
  );
});

describe('a read that failed for a reason worth retrying', () => {
  it.each(['position_unavailable', 'timeout', 'unknown'])(
    'is retried when a screen is opened again (%s)',
    (errorCode) => {
      // The original bug: a read could only start from 'idle', so a first
      // failure was permanent for the life of the process.
      expect(attempt({ status: 'error', errorCode, lastAttemptAt: NOW - 60_000 })).toBe(true);
    },
  );
});
