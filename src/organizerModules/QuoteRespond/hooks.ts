import { useAsync } from '../../hooks/useAsync';
import { getIncomingRequests } from './services';

export const useIncomingRequests = () => useAsync(getIncomingRequests, []);
