import { useAsync, type AsyncResult } from '../../hooks/useAsync';
import { useAsyncCallback, type AsyncCallbackResult } from '../../hooks/useAsyncCallback';
import { fetchHomeFeed, requestQuotes } from './services';
import type { HeroDraft, HomeFeedDTO } from './types';

export function useHomeFeed(): AsyncResult<HomeFeedDTO> {
  return useAsync(fetchHomeFeed, []);
}

export function useRequestQuotes(): AsyncCallbackResult<[HeroDraft], void> {
  return useAsyncCallback(requestQuotes);
}
