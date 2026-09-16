/**
 * @format
 *
 * Reading the device's location.
 *
 * Two things are worth pinning down here, because both have silently failed
 * before: the library must not run its own permission prompt alongside
 * react-native-permissions, and a Refresh the customer asked for must not be
 * answered with a cached fix.
 */

import Geolocation from '@react-native-community/geolocation';
import { RESULTS, check, request } from 'react-native-permissions';
import { LocationServiceError, getCurrentLocation } from '../src/services/location';

/*
 * Captured at import time, because the service configures the library once on
 * module load — and `clearAllMocks` below would otherwise wipe the record of
 * the only call it ever makes.
 */
const rnConfig = (Geolocation.setRNConfiguration as unknown as jest.Mock).mock.calls[0]?.[0];

const geo = Geolocation as unknown as {
  setRNConfiguration: jest.Mock;
  getCurrentPosition: jest.Mock;
};
const permissions = { check: check as jest.Mock, request: request as jest.Mock };

/** A successful native read, at the coordinates given. */
function fixes(latitude: number, longitude: number) {
  geo.getCurrentPosition.mockImplementation((success: (p: unknown) => void) =>
    success({ coords: { latitude, longitude }, timestamp: 0 }),
  );
}

/** A native failure with one of the W3C error codes. */
function failsWith(code: number) {
  geo.getCurrentPosition.mockImplementation(
    (_success: unknown, error: (e: unknown) => void) =>
      error({ code, message: 'nope', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 }),
  );
}

/** The options the service asked the native module for, on the last call. */
function lastOptions(): Record<string, unknown> {
  const calls = geo.getCurrentPosition.mock.calls;
  return calls[calls.length - 1][2];
}

beforeEach(() => {
  jest.clearAllMocks();
  permissions.check.mockResolvedValue(RESULTS.GRANTED);
  fixes(17.385, 78.4867);
});

describe('permission ownership', () => {
  it('tells the geolocation library not to ask for permission itself', () => {
    // Two libraries asking iOS for the same permission is how a first fix goes
    // missing: the second request supersedes the first, and nothing answers.
    expect(rnConfig).toMatchObject({
      skipPermissionRequests: true,
      // Info.plist describes only when-in-use; asking for "always" against it
      // is refused by iOS without an error anyone can see.
      authorizationLevel: 'whenInUse',
    });
  });

  it('asks only when the permission has not been decided', async () => {
    await getCurrentLocation();
    expect(permissions.request).not.toHaveBeenCalled();
  });

  it('asks once when it has not been decided, and reads on a grant', async () => {
    permissions.check.mockResolvedValue(RESULTS.DENIED);
    permissions.request.mockResolvedValue(RESULTS.GRANTED);

    await expect(getCurrentLocation()).resolves.toEqual({
      latitude: 17.385,
      longitude: 78.4867,
    });
    expect(permissions.request).toHaveBeenCalledTimes(1);
  });

  it('does not re-ask for a permission the customer turned off in Settings', async () => {
    // Blocked means the OS will not show the prompt again; asking anyway
    // returns blocked and the screen would just sit there.
    permissions.check.mockResolvedValue(RESULTS.BLOCKED);

    await expect(getCurrentLocation()).rejects.toMatchObject({ code: 'permission_blocked' });
    expect(permissions.request).not.toHaveBeenCalled();
    expect(geo.getCurrentPosition).not.toHaveBeenCalled();
  });
});

describe('freshness', () => {
  it('will take a recent fix for a read nobody asked for', async () => {
    await getCurrentLocation();
    expect(lastOptions().maximumAge).toBeGreaterThan(0);
  });

  it('demands a new fix when the customer asked for one', async () => {
    // A Refresh that can hand back a minute-old position is a Refresh that
    // does not refresh — which reads as the app not seeing location at all.
    await getCurrentLocation({ fresh: true });
    expect(lastOptions().maximumAge).toBe(0);
  });
});

describe('failures', () => {
  it('names a timeout as a timeout', async () => {
    failsWith(3);
    await expect(getCurrentLocation()).rejects.toMatchObject({ code: 'timeout' });
  });

  it('reads an unavailable position as location services being off', async () => {
    failsWith(2);
    await expect(getCurrentLocation()).rejects.toMatchObject({ code: 'position_unavailable' });
  });

  it('reports anything else without pretending to know what it was', async () => {
    failsWith(99);
    const error = await getCurrentLocation().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(LocationServiceError);
    expect((error as LocationServiceError).code).toBe('unknown');
  });
});

/*
 * The Android Play Services path in @react-native-community/geolocation neither
 * applies the `timeout` option nor attaches a failure listener to its
 * getLastLocation() call. A read that goes wrong there invokes no callback at
 * all, so nothing on the native side can end the wait — which reaches the
 * customer as a spinner that runs until they close the screen.
 */
describe('a native read that never calls back', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /** The native module accepting the call and then doing nothing, forever. */
  function neverAnswers() {
    geo.getCurrentPosition.mockImplementation(() => {});
  }

  it('gives up rather than hanging', async () => {
    neverAnswers();

    const reading = getCurrentLocation({ fresh: true });
    const settled = jest.fn();
    reading.catch(settled);

    await jest.advanceTimersByTimeAsync(120_000);

    expect(settled).toHaveBeenCalled();
    await expect(reading).rejects.toBeInstanceOf(LocationServiceError);
  });

  it('tries the other provider before giving up', async () => {
    neverAnswers();

    getCurrentLocation({ fresh: true }).catch(() => {});
    await jest.advanceTimersByTimeAsync(120_000);

    const providers = geo.setRNConfiguration.mock.calls.map(
      (call) => (call[0] as { locationProvider: string }).locationProvider,
    );
    expect(providers).toContain('android');
  });

  it('falls through to a provider that can answer', async () => {
    let call = 0;
    geo.getCurrentPosition.mockImplementation((success: (p: unknown) => void) => {
      call += 1;
      // The fused provider hangs; the legacy one answers.
      if (call < 3) return;
      success({ coords: { latitude: 17.385, longitude: 78.4867 }, timestamp: 0 });
    });

    const reading = getCurrentLocation({ fresh: true });
    await jest.advanceTimersByTimeAsync(120_000);

    await expect(reading).resolves.toEqual({ latitude: 17.385, longitude: 78.4867 });
  });
});
