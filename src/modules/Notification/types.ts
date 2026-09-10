export type NotificationType = 'booking' | 'quote' | 'payment' | 'message' | 'system';

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  /** "2h ago", "Yesterday", "29 Aug" — how old it is decides the wording. */
  relativeTime: string;
  /** The server's deep link, or '' — see `routeFor` for what is honoured. */
  link: string;
}

/** One day's notifications, under one heading. */
export interface NotificationGroup {
  key: 'today' | 'earlier';
  label: string;
  items: NotificationItem[];
}

/** Where a notification leads, when the app has somewhere to send it. */
export type NotificationRoute = { screen: 'Conversation'; conversationId: string } | null;
