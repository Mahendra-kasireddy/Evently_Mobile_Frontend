import { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { getBoard } from './services';

export const useIdeaBoard = (bookingId: string) => {
  const fetch = useCallback(() => getBoard(bookingId), [bookingId]);
  return useAsync(fetch, [fetch]);
};
