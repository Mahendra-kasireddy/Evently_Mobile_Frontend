import { useAsync } from '../../hooks/useAsync';
import { getEarnings } from './services';

export const useEarnings = () => useAsync(getEarnings, []);
