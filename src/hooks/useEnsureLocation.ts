import { useCallback, useEffect } from 'react';
import { getCurrentLocation, LocationServiceError } from '../services/location';
import { locationFailed, locationRequested, locationSucceeded, selectLocationStatus } from '../store/locationSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

/**
 * Fetches the device's current location once (idle -> loading -> success|error)
 * and caches it in the shared locationSlice, so multiple screens (Home's
 * header, the Location screen) never trigger duplicate GPS requests. Call
 * `retry` for an explicit re-fetch (e.g. after the user grants permission).
 */
export function useEnsureLocation() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectLocationStatus);

  const retry = useCallback(() => {
    dispatch(locationRequested());
    getCurrentLocation()
      .then((coordinates) => {
        dispatch(locationSucceeded(coordinates));
      })
      .catch((error: unknown) => {
        const code = error instanceof LocationServiceError ? error.code : 'unknown';
        const message = error instanceof Error ? error.message : 'Could not get your location.';
        dispatch(locationFailed({ code, message }));
      });
  }, [dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      retry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { retry };
}
