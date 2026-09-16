import { useCallback, useEffect } from 'react';
import { reverseGeocode } from '../services/geocoding';
import { getCurrentLocation, getLocationTrace, LocationServiceError } from '../services/location';
import {
  locationFailed,
  locationRequested,
  locationSucceeded,
  placeResolved,
  selectLocationStatus,
  traceRecorded,
} from '../store/locationSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

/**
 * Fetches the device's current location once (idle -> loading -> success|error)
 * and caches it in the shared locationSlice, so multiple screens (Home's
 * header, the Location screen) never trigger duplicate GPS requests. Call
 * `retry` for an explicit re-fetch (e.g. after the user grants permission).
 *
 * The two reads are not the same read. The automatic first one will take a
 * recent cached fix, because several screens want a location at once and a
 * minute-old one is the same street. An explicit `retry` will not: the whole
 * reason somebody taps Refresh is that they believe the position on screen is
 * stale, and handing them the cached one back answers the wrong question.
 */
export function useEnsureLocation() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectLocationStatus);

  const load = useCallback(
    (fresh: boolean) => {
      dispatch(locationRequested());
      getCurrentLocation({ fresh })
        .then((coordinates) => {
          dispatch(traceRecorded(getLocationTrace()));
          dispatch(locationSucceeded(coordinates));

          /*
           * Not awaited, and its failure is not this read's failure.
           *
           * The position is already in the store and the screens are already
           * showing it; the name is an improvement on that, arriving when the
           * geocoder gets round to it. reverseGeocode resolves null rather
           * than rejecting, so there is nothing here that could turn a working
           * location screen into an error one.
           */
          reverseGeocode(coordinates).then((place) => {
            dispatch(placeResolved(place));
          });
        })
        .catch((error: unknown) => {
          const code = error instanceof LocationServiceError ? error.code : 'unknown';
          const detail = error instanceof LocationServiceError ? error.detail : undefined;
          const message = error instanceof Error ? error.message : 'Could not get your location.';
          dispatch(traceRecorded(getLocationTrace()));
          dispatch(locationFailed({ code, message: detail ? `${message} (${detail})` : message }));
        });
    },
    [dispatch],
  );

  const retry = useCallback(() => load(true), [load]);

  useEffect(() => {
    if (status === 'idle') {
      load(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { retry };
}
