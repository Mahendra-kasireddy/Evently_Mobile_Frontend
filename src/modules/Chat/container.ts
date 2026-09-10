import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { selectIsOrganizerView } from '../../store/authSlice';
import { useAppSelector } from '../../store/hooks';
import { useConversations, useMessages, useSendMessage } from './hooks';
import { groupMessages, mapConversations, showDayLabels, suggestionsFor } from './utils';
import type { ConversationItem, MessageDTO, MessageGroup } from './types';

export interface InboxContainerResult {
  items: ConversationItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

export function useInboxContainer(): InboxContainerResult {
  // The same account in its organizer view sees the threads it owns as an
  // organizer, not the ones it started as a customer.
  const asOrganizer = useAppSelector(selectIsOrganizerView);
  const { data, loading, error, refetch } = useConversations(asOrganizer);

  /*
   * Re-read on focus.
   *
   * The tab navigator keeps this screen mounted, so the on-mount fetch never
   * runs again on its own — and an inbox that still shows yesterday's unread
   * count is worse than one that takes a moment to load.
   */
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const items = useMemo(() => (data ? mapConversations(data) : []), [data]);

  return {
    items,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
  };
}

/**
 * Who the thread is with.
 *
 * Read from the inbox the app already has an endpoint for rather than a second
 * route that returns one conversation: a thread opened from a notification
 * link carries nothing but an id, and this way that route works too.
 */
export function useConversationSummary(conversationId: string): ConversationItem | null {
  const asOrganizer = useAppSelector(selectIsOrganizerView);
  const { data } = useConversations(asOrganizer);

  return useMemo(
    () => mapConversations(data ?? []).find((item) => item.id === conversationId) ?? null,
    [data, conversationId],
  );
}

export interface ThreadContainerResult {
  groups: MessageGroup[];
  /** False while the whole thread is one day — see `showDayLabels`. */
  showDays: boolean;
  /** One-tap questions, chosen by whether anyone has written yet. */
  suggestions: string[];
  /** Puts a suggestion in the box. It is not sent until the customer sends it. */
  useSuggestion: (text: string) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  draft: string;
  setDraft: (value: string) => void;
  isSending: boolean;
  sendError: boolean;
  send: () => void;
  refetch: () => void;
}

export function useThreadContainer(conversationId: string): ThreadContainerResult {
  const { data, loading, error, refetch } = useMessages(conversationId);
  const sendCall = useSendMessage();
  const [draft, setDraft] = useState('');
  /*
   * Sent messages are appended locally rather than refetched.
   *
   * A round trip before the message appears makes the thread feel broken. The
   * server's own copy is what the next load reads, so the two converge on the
   * next open — and a failed send is not appended at all, so nothing is ever
   * shown as delivered that was not.
   */
  const [sent, setSent] = useState<MessageDTO[]>([]);
  const [sendError, setSendError] = useState(false);

  const groups = useMemo(
    () => groupMessages([...(data ?? []), ...sent]),
    [data, sent],
  );

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text || sendCall.loading) return;
    setSendError(false);
    setDraft('');

    sendCall
      .execute(conversationId, text)
      .then((message) => setSent((current) => [...current, message]))
      .catch(() => {
        // Put the words back in the box: losing what someone typed is worse
        // than making them press send again.
        setDraft(text);
        setSendError(true);
      });
  }, [conversationId, draft, sendCall]);

  return {
    groups,
    showDays: showDayLabels(groups),
    suggestions: suggestionsFor(groups.length > 0),
    useSuggestion: setDraft,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    draft,
    setDraft,
    isSending: sendCall.loading,
    sendError,
    send,
    refetch,
  };
}
