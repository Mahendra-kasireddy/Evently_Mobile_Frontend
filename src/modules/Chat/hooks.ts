import { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { fetchConversations, fetchMessages, openWithOrganizer, sendMessage } from './services';

export function useConversations(asOrganizer: boolean) {
  const load = useCallback(() => fetchConversations(asOrganizer), [asOrganizer]);
  return useAsync(load, [asOrganizer]);
}

export function useMessages(conversationId: string) {
  const load = useCallback(() => fetchMessages(conversationId), [conversationId]);
  return useAsync(load, [conversationId]);
}

export function useSendMessage() {
  return useAsyncCallback(sendMessage);
}

export function useOpenWithOrganizer() {
  return useAsyncCallback(openWithOrganizer);
}
