import { NOTIFICATION_COPY as COPY } from './constants';
import type {
  NotificationDTO,
  NotificationGroup,
  NotificationItem,
  NotificationRoute,
  NotificationType,
} from './types';

const TYPES: NotificationType[] = ['booking', 'quote', 'payment', 'message', 'system'];
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * How old a notification is decides how its age is written.
 *
 * Minutes and hours while it is still today, a word for yesterday, a date
 * beyond that. "2h ago" on something from last month would be wrong, and
 * "34 days ago" is arithmetic the reader should not have to do.
 */
export function relativeTime(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const elapsed = now.getTime() - date.getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY);

  if (days <= 0) {
    if (elapsed < MINUTE) return 'Just now';
    if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
    return `${Math.max(1, Math.floor(elapsed / HOUR))}h ago`;
  }
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function mapNotifications(dtos: NotificationDTO[], now = new Date()): NotificationItem[] {
  return (dtos ?? []).map((dto) => ({
    id: dto.id,
    // An unknown type from a newer backend renders as a plain notice rather
    // than indexing the look-up map to undefined and crashing the row.
    type: TYPES.includes(dto.type) ? dto.type : 'system',
    title: dto.title ?? '',
    body: dto.body ?? '',
    read: dto.read === true,
    relativeTime: relativeTime(dto.createdAt, now),
    link: dto.link ?? '',
  }));
}

/**
 * Today, and everything before it.
 *
 * Two groups rather than one heading per calendar day: what arrived today is
 * what the customer is here for, and a list of six single-item date headings
 * is harder to read than the notifications themselves. An empty group is not
 * rendered at all.
 *
 * Takes no clock of its own: it reads the label the mapper already produced, so
 * grouping and wording cannot disagree about where today ends.
 */
export function groupByDay(items: NotificationItem[]): NotificationGroup[] {
  const today: NotificationItem[] = [];
  const earlier: NotificationItem[] = [];

  for (const item of items) {
    // Read off the label the mapper already produced, so the grouping and the
    // wording can never disagree about what "today" means.
    if (item.relativeTime.endsWith('ago') || item.relativeTime === 'Just now') today.push(item);
    else earlier.push(item);
  }

  return [
    { key: 'today' as const, label: COPY.today, items: today },
    { key: 'earlier' as const, label: COPY.earlier, items: earlier },
  ].filter((group) => group.items.length > 0);
}

/**
 * Where a notification leads.
 *
 * The server's links are web paths — "/organizer/quotes" is a page in the
 * admin console, not a screen here. Only the shapes this app can honour are
 * translated; everything else returns null and the notification is simply
 * marked read. Sending someone to a screen that is not what the notification
 * was about is worse than sending them nowhere.
 */
export function routeFor(link: string): NotificationRoute {
  const match = /^\/chat\/([a-f0-9]{24})$/i.exec((link ?? '').trim());
  return match ? { screen: 'Conversation', conversationId: match[1] } : null;
}
