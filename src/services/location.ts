import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

export type LocationErrorCode =
  | 'permission_denied'
  | 'permission_blocked'
  | 'services_disabled'
  | 'unavailable'
  | 'timeout'
  | 'unknown';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export class LocationServiceError extends Error {
  code: LocationErrorCode;

  constructor(code: LocationErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

/*
 * react-native-permissions owns the prompt; the geolocation library must not.
 *
 * Left unconfigured, @react-native-community/geolocation runs its own
 * CLLocationManager authorization request the first time a position is asked
 * for — so two libraries ask iOS for the same permission, and the fix that
 * should have answered the first request never arrives. `skipPermissionRequests`
 * makes it a reader only, and `ensurePermission` below stays the single place
 * permission is decided.
 *
 * `whenInUse` is stated rather than left to `auto` because that is the only
 * usage description in Info.plist — asking for `always` against a plist that
 * does not describe it is refused by iOS without an error anyone can see.
 *
 * Configured at module load so it is set before the first read, whichever
 * screen gets there first.
 */
Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  authorizationLevel: 'whenInUse',
  locationProvider: 'auto',
});

const LOCATION_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  default: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
});

async function ensurePermission(): Promise<void> {
  const status = await check(LOCATION_PERMISSION);

  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return;

  if (status === RESULTS.BLOCKED) {
    throw new LocationServiceError('permission_blocked', 'Location permission is permanently denied.');
  }

  if (status === RESULTS.UNAVAILABLE) {
    throw new LocationServiceError('unavailable', 'Location is not available on this device.');
  }

  // DENIED — not yet asked, or previously denied but still re-askable.
  const requested = await request(LOCATION_PERMISSION);
  if (requested === RESULTS.GRANTED || requested === RESULTS.LIMITED) return;
  if (requested === RESULTS.BLOCKED) {
    throw new LocationServiceError('permission_blocked', 'Location permission is permanently denied.');
  }
  throw new LocationServiceError('permission_denied', 'Location permission was denied.');
}

/**
 * How old a cached fix may be, for a read the customer did not ask for.
 *
 * Worth having on the passive first read: several screens want the location at
 * once, and a minute-old fix is the same street. Worth nothing on a Refresh —
 * see `fresh` below.
 */
const CACHE_MAX_AGE_MS = 60_000;

function getCurrentPosition(fresh: boolean): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      },
      (error) => {
        if (error.code === error.TIMEOUT) {
          reject(new LocationServiceError('timeout', 'Getting your location timed out.'));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          // Most commonly: device location services are turned off.
          reject(new LocationServiceError('services_disabled', 'Location services appear to be turned off.'));
        } else {
          reject(new LocationServiceError('unknown', error.message || 'Could not get your location.'));
        }
      },
      {
        /*
         * High accuracy only when the customer asked.
         *
         * `maximumAge: 0` forbids the cached fix, so the platform has to go and
         * acquire a new one. At balanced accuracy on Android that means the
         * network provider, which indoors frequently never returns at all — the
         * request just sits until the timeout. So a read that refuses the cache
         * must also ask for the provider that can actually satisfy it (GPS /
         * fused), and must be given long enough to get a first fix from cold.
         * The passive read keeps the cheap settings: it is allowed the cached
         * fix, so it is answered immediately and costs no radio.
         */
        enableHighAccuracy: fresh,
        timeout: fresh ? 30_000 : 15_000,
        maximumAge: fresh ? 0 : CACHE_MAX_AGE_MS,
      },
    );
  });
}

/**
 * Single-shot current position — no background or continuous tracking.
 *
 * `fresh` decides whether a recent cached fix will do. Pass it for anything
 * the customer initiated.
 */
export async function getCurrentLocation(
  { fresh = false }: { fresh?: boolean } = {},
): Promise<LocationCoordinates> {
  await ensurePermission();

  if (!fresh) return getCurrentPosition(false);

  /*
   * A cold GPS fix is not always obtainable — indoors, in a lift, under cloud
   * with no recent almanac. Rather than leave Refresh reporting a bare timeout
   * and no position at all, fall back to the cheap read, which may still be
   * answered from a cached fix. The customer gets the position they can have
   * instead of an error screen; only a genuine failure of both reads surfaces.
   */
  try {
    return await getCurrentPosition(true);
  } catch (error) {
    if (error instanceof LocationServiceError && error.code === 'timeout') {
      return getCurrentPosition(false);
    }
    throw error;
  }
}
