import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { fetchBadges, fetchDashboard, updateTaskStatus } from './services';

export function useDashboard() {
  return useAsync(fetchDashboard);
}

export function useBadges() {
  return useAsync(fetchBadges);
}

export function useUpdateTaskStatus() {
  return useAsyncCallback(updateTaskStatus);
}
