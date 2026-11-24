import { apiClient } from '../../services/apiClient';
import { UNREAD_COUNT_ENDPOINT } from './constants';

/** How many notifications are unread — the bell's badge. */
export async function getUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<{ count?: number } | number>(
    UNREAD_COUNT_ENDPOINT,
  );
  return typeof data === 'number' ? data : data?.count ?? 0;
}
