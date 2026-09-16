import { useCallback } from 'react';
import { openSettings as rnOpenSettings } from 'react-native-permissions';
import { useEnsureLocation } from '../../hooks/useEnsureLocation';
import {
  selectLocationCoordinates,
  selectLocationErrorCode,
  selectLocationErrorMessage,
  selectLocationPlace,
  selectLocationStatus,
} from '../../store/locationSlice';
import { useAppSelector } from '../../store/hooks';
import type { Place } from '../../services/geocoding';
import type { LocationCoordinates, LocationErrorCode, LocationStatus } from './types';

export interface LocationContainerResult {
  status: LocationStatus;
  coordinates: LocationCoordinates | null;
  place: Place | null;
  errorCode: LocationErrorCode | null;
  errorMessage: string | null;
  retry: () => void;
  openSettings: () => void;
}

/**
 * The Location screen's view of the shared location state.
 *
 * Reading and re-reading is useEnsureLocation's job, not this screen's — it
 * re-checks on focus and on the app returning to the foreground for whichever
 * screens mount it, so this container holds no lifecycle of its own. It used
 * to own an AppState listener that retried on error; that listener only
 * existed while this screen was mounted and only fired for one status, and
 * duplicating it here would now mean two reads for every return to the app.
 */
export function useLocationContainer(): LocationContainerResult {
  const status = useAppSelector(selectLocationStatus);
  const coordinates = useAppSelector(selectLocationCoordinates);
  const place = useAppSelector(selectLocationPlace);
  const errorCode = useAppSelector(selectLocationErrorCode);
  const errorMessage = useAppSelector(selectLocationErrorMessage);
  const { retry } = useEnsureLocation();

  /**
   * Opens the OS settings page for this app.
   *
   * Offered only for `permission_blocked`, where the OS will no longer show a
   * prompt and Settings is the sole way back. Returning from it re-checks on
   * its own: useEnsureLocation treats a foreground transition as the one event
   * that can have changed a permission, and reads again even from a refusal.
   */
  const openSettings = useCallback(() => {
    rnOpenSettings().catch(() => {
      // Settings app couldn't be opened — nothing actionable to do here.
    });
  }, []);

  return { status, coordinates, place, errorCode, errorMessage, retry, openSettings };
}
