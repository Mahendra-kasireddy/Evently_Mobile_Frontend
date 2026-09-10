export type MessageSender = 'customer' | 'organizer';

/** GET /message/mine — one thread as the inbox lists it. */
export interface ConversationDTO {
  id: string;
  withName: string;
  withInitials: string;
  withAvatarColor: string;
  organizerId: string;
  lastMessageText: string;
  lastMessageAt: string | null;
  unread: number;
  /**
   * The organizer's measured reply time and how many replies it was measured
   * over. `replySamples: 0` means unknown — never "instant".
   */
  replyMedianMinutes?: number;
  replySamples?: number;
}

export interface MessageDTO {
  id: string;
  sender: MessageSender;
  text: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// View models
// ---------------------------------------------------------------------------

export interface ConversationItem {
  id: string;
  withName: string;
  withInitials: string;
  withAvatarColor: string;
  organizerId: string;
  /** '' before anyone has written anything. */
  preview: string;
  /** "5h", "Yesterday", "3 Sep" — how recent decides the format. */
  whenLabel: string;
  unread: number;
  /** "Usually replies in 2h", or '' when there is not enough history to say. */
  replyLabel: string;
}

/** A day's worth of messages, under one heading. */
export interface MessageGroup {
  key: string;
  /** "Today", "Yesterday", "3 September 2026". */
  dayLabel: string;
  items: Array<{
    id: string;
    sender: MessageSender;
    text: string;
    timeLabel: string;
  }>;
}
