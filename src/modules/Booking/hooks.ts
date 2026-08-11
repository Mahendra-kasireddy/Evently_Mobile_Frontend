import { useAsync } from '../../hooks/useAsync';
import { fetchMyBookings } from './services';

export function useMyBookings() {
  return useAsync(fetchMyBookings, []);
}
