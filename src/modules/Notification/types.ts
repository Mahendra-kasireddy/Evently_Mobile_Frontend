export type NotificationType = 'booking' | 'quote' | 'payment' | 'system';

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
  relativeTime: string;
}
