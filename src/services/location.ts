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

function getCurrentPosition(): Promise<LocationCoordinates> {
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
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 60_000 },
    );
  });
}

/** Single-shot current position — no background/continuous tracking. */
export async function getCurrentLocation(): Promise<LocationCoordinates> {
  await ensurePermission();
  return getCurrentPosition();
}
