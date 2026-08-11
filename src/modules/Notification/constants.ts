import type { NotificationType } from './types';

export const GET_MY_NOTIFICATIONS_ENDPOINT = '/notification/getMyNotifications';
export const MARK_ALL_READ_ENDPOINT = '/notification/markAllRead';

export function markReadEndpoint(id: string): string {
  return `/notification/markRead/${id}`;
}

export const NOTIFICATION_ICON_NAME: Record<NotificationType, string> = {
  booking: 'calendar-check',
  quote: 'file-document-outline',
  payment: 'cash',
  system: 'bell-outline',
};
