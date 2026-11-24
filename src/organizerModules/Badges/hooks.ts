import { useAsync } from '../../hooks/useAsync';
import { getBadgeStatus } from './services';

export const useBadgeStatus = () => useAsync(getBadgeStatus, []);
