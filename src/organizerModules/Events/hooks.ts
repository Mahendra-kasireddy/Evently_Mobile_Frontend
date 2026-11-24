import { useAsync } from '../../hooks/useAsync';
import { getMyBookings } from './services';

export const useMyBookings = () => useAsync(getMyBookings, []);
