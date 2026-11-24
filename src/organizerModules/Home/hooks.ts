import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import {
  getBadges,
  getDashboard,
  getMyBookings,
  getOnboardingStatus,
  setTaskStatus,
} from './services';

export const useDashboard = () => useAsync(getDashboard, []);
export const useBadges = () => useAsync(getBadges, []);
export const useOnboardingStatus = () => useAsync(getOnboardingStatus, []);
export const useMyBookings = () => useAsync(getMyBookings, []);
export const useSetTaskStatus = () => useAsyncCallback(setTaskStatus);
