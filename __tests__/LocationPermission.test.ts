/**
 * @format
 *
 * Asking for permission, on a first run.
 *
 * This is the step that decides whether a fresh install ever shows a location,
 * and it is the one step in the whole flow that waits on a person rather than
 * on hardware. The dialog stays up until they answer it; nothing here may
 * measure that wait, and nothing may ask a second time while it is up.
 */
import Geolocation from '@react-native-community/geolocation';
import { RESULTS, check, request } from 'react-native-permissions';
import { getCurrentLocation } from '../src/services/location';

const geo = Geolocation as unknown as {
  setRNConfiguration: jest.Mock;
  getCurrentPosition: jest.Mock;
};
const permissions = { check: check as jest.Mock, request: request as jest.Mock };

const HERE = { latitude: 17.4469, longitude: 78.3808 };

beforeEach(() => {
  jest.clearAllMocks();
  geo.getCurrentPosition.mockImplementation((success: (p: unknown) => void) =>
    success({ coords: HERE, timestamp: 0 }),
  );
});

describe('a dialog the customer takes their time over', () => {
  it('is waited for, however long it takes', async () => {
    jest.useFakeTimers();

    // Not yet asked, then a person who reads the dialog before deciding.
    permissions.check.mockResolvedValue(RESULTS.DENIED);
    let grant: (value: string) => void = () => {};
    permissions.request.mockReturnValue(
      new Promise<string>((resolve) => {
        grant = resolve;
      }),
    );

    const reading = getCurrentLocation();

    // Far longer than any budget in the read itself. The permission exchange
    // must not be on a clock: a deadline here records a failure and then the
    // customer grants permission into a screen that has already given up.
    await jest.advanceTimersByTimeAsync(60_000);

    grant(RESULTS.GRANTED);
    jest.useRealTimers();

    await expect(reading).resolves.toEqual(HERE);
  });
});

describe('two screens reaching the permission check at once', () => {
  it('raises exactly one dialog', async () => {
    permissions.check.mockResolvedValue(RESULTS.DENIED);
    permissions.request.mockResolvedValue(RESULTS.GRANTED);

    // Home's header and the Location screen mount in the same commit.
    await Promise.all([getCurrentLocation(), getCurrentLocation()]);

    /*
     * request() is not reentrant: Android answers through one Activity
     * callback, so a second dialog raised over the first is resolved with the
     * wrong result or not at all.
     */
    expect(permissions.request).toHaveBeenCalledTimes(1);
  });

  it('gives both callers the same answer', async () => {
    permissions.check.mockResolvedValue(RESULTS.DENIED);
    permissions.request.mockResolvedValue(RESULTS.GRANTED);

    const [a, b] = await Promise.all([getCurrentLocation(), getCurrentLocation()]);

    expect(a).toEqual(HERE);
    expect(b).toEqual(HERE);
  });
});

describe('a permission already granted', () => {
  it('reads without raising a dialog at all', async () => {
    permissions.check.mockResolvedValue(RESULTS.GRANTED);

    await expect(getCurrentLocation()).resolves.toEqual(HERE);
    expect(permissions.request).not.toHaveBeenCalled();
  });
});

describe('a permission the customer turned off in Settings', () => {
  it('is reported rather than re-requested', async () => {
    // The OS answers a re-request for a blocked permission without showing the
    // customer anything, so asking again produces nothing but a delay.
    permissions.check.mockResolvedValue(RESULTS.BLOCKED);

    await expect(getCurrentLocation()).rejects.toMatchObject({ code: 'permission_blocked' });
    expect(permissions.request).not.toHaveBeenCalled();
  });
});
