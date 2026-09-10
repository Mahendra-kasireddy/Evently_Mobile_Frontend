import { apiClient } from '../../services/apiClient';
import {
  CONVERSATIONS_ENDPOINT,
  MESSAGE_ENDPOINT,
  OPEN_WITH_ORGANIZER_ENDPOINT,
  ORGANIZER_CONVERSATIONS_ENDPOINT,
  UNREAD_COUNT_ENDPOINT,
} from './constants';
import type { ConversationDTO, MessageDTO } from './types';

export async function fetchConversations(asOrganizer = false): Promise<ConversationDTO[]> {
  const { data } = await apiClient.get<ConversationDTO[]>(
    asOrganizer ? ORGANIZER_CONVERSATIONS_ENDPOINT : CONVERSATIONS_ENDPOINT,
  );
  return Array.isArray(data) ? data : [];
}

/**
 * The thread with one organizer, created on first contact.
 *
 * A POST because it can create the thread. Idempotent server-side, so a second
 * tap returns the same conversation rather than a second one.
 */
export async function openWithOrganizer(organizerId: string): Promise<ConversationDTO> {
  const { data } = await apiClient.post<ConversationDTO>(
    `${OPEN_WITH_ORGANIZER_ENDPOINT}/${organizerId}`,
  );
  return data;
}

export async function fetchMessages(conversationId: string): Promise<MessageDTO[]> {
  const { data } = await apiClient.get<MessageDTO[]>(`${MESSAGE_ENDPOINT}/${conversationId}`);
  return Array.isArray(data) ? data : [];
}

export async function sendMessage(conversationId: string, text: string): Promise<MessageDTO> {
  const { data } = await apiClient.post<MessageDTO>(`${MESSAGE_ENDPOINT}/${conversationId}`, {
    text,
  });
  return data;
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<{ unread: number }>(UNREAD_COUNT_ENDPOINT);
  return data?.unread ?? 0;
}
