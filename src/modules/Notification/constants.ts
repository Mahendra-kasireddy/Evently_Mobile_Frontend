import type { NotificationType } from './types';

export const MY_NOTIFICATIONS_ENDPOINT = '/notification/getMyNotifications';
export const MARK_READ_ENDPOINT = '/notification/markRead';
export const MARK_ALL_READ_ENDPOINT = '/notification/markAllRead';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const NOTIF_ACCENT = '#e8633a';
export const NOTIF_NAVY = '#1a2e5a';
export const NOTIF_CANVAS = '#faf8f7';
export const NOTIF_HAIRLINE = '#efe9e5';

/**
 * The icon and its wash, per kind of notification.
 *
 * Colour carries the category so the list can be scanned without reading it:
 * money is green, a conversation is violet, and anything about a quote or a
 * booking is the app's own accent. `system` stays neutral — a platform notice
 * is not an event in the customer's plan.
 */
export const NOTIFICATION_LOOK: Record<
  NotificationType,
  { icon: string; fg: string; bg: string }
> = {
  quote: { icon: 'file-document-outline', fg: '#e8633a', bg: '#fdeee7' },
  booking: { icon: 'calendar-check-outline', fg: '#e8633a', bg: '#fdeee7' },
  payment: { icon: 'credit-card-outline', fg: '#1d9e75', bg: '#e8f6ef' },
  message: { icon: 'chat-outline', fg: '#6d5bd0', bg: '#eeebfb' },
  system: { icon: 'bell-outline', fg: '#5b6470', bg: '#f0ecea' },
};

export const NOTIFICATION_COPY = {
  title: 'Notifications',
  markAllRead: 'Mark all read',
  today: 'Today',
  earlier: 'Earlier',

  loading: 'Loading notifications…',
  errorTitle: "We couldn't load your notifications",
  retry: 'Try again',
  emptyTitle: 'Nothing yet',
  emptyBody:
    'Quotes, booking updates and messages land here. We will only send what you asked for in Settings.',
};
