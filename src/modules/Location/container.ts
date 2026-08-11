import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { openSettings as rnOpenSettings } from 'react-native-permissions';
import { useEnsureLocation } from '../../hooks/useEnsureLocation';
import {
  selectLocationCoordinates,
  selectLocationErrorCode,
  selectLocationErrorMessage,
  selectLocationStatus,
} from '../../store/locationSlice';
import { useAppSelector } from '../../store/hooks';
import type { LocationCoordinates, LocationErrorCode, LocationStatus } from './types';

export interface LocationContainerResult {
  status: LocationStatus;
  coordinates: LocationCoordinates | null;
  errorCode: LocationErrorCode | null;
  errorMessage: string | null;
  retry: () => void;
  openSettings: () => void;
}

/**
 * Owns the Location screen's lifecycle on top of the shared location state:
 * re-checks when the app returns to the foreground (e.g. after the user
 * grants permission in Settings) so the screen self-heals without a manual tap.
 */
export function useLocationContainer(): LocationContainerResult {
  const status = useAppSelector(selectLocationStatus);
  const coordinates = useAppSelector(selectLocationCoordinates);
  const errorCode = useAppSelector(selectLocationErrorCode);
  const errorMessage = useAppSelector(selectLocationErrorMessage);
  const { retry } = useEnsureLocation();

  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active' && statusRef.current === 'error') {
        retry();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [retry]);

  const openSettings = useCallback(() => {
    rnOpenSettings().catch(() => {
      // Settings app couldn't be opened — nothing actionable to do here.
    });
  }, []);

  return { status, coordinates, errorCode, errorMessage, retry, openSettings };
}
