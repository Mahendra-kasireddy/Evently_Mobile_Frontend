import type { LocationErrorCode, LocationStatusCopy } from './types';

export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export function getStatusCopy(errorCode: LocationErrorCode | null): LocationStatusCopy {
  switch (errorCode) {
    case 'permission_denied':
      return {
        title: 'Location permission needed',
        message: 'Allow location access to see your current location.',
        actionLabel: 'Allow location',
        action: 'retry',
      };
    case 'permission_blocked':
      return {
        title: 'Location permission denied',
        message: 'Location access is turned off for Evently. Enable it in Settings to continue.',
        actionLabel: 'Open Settings',
        action: 'openSettings',
      };
    case 'services_disabled':
      return {
        title: 'Location services are off',
        message: 'Turn on location services on your device to see your current location.',
        actionLabel: 'Try again',
        action: 'retry',
      };
    case 'timeout':
      return {
        title: "Couldn't get your location",
        message: 'That took too long. Check your connection and try again.',
        actionLabel: 'Try again',
        action: 'retry',
      };
    case 'unavailable':
      return {
        title: 'Location unavailable',
        message: "Your device doesn't support location services.",
        actionLabel: 'Try again',
        action: 'retry',
      };
    default:
      return {
        title: 'Something went wrong',
        message: 'Could not get your location. Please try again.',
        actionLabel: 'Try again',
        action: 'retry',
      };
  }
}
