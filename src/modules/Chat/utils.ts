import { FOLLOW_UP_SUGGESTIONS, MIN_REPLY_SAMPLES, OPENING_SUGGESTIONS } from './constants';
import type { ConversationDTO, ConversationItem, MessageDTO, MessageGroup } from './types';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * How recent a thread is decides how its age is written.
 *
 * Minutes and hours while it is still today, a word for yesterday, a date
 * beyond that. A clock time in the inbox ("14:32") answers a question nobody
 * asked — scanning the list is about how long ago, not about when.
 */
export function whenLabel(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const elapsed = now.getTime() - date.getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY);

  if (days <= 0) {
    if (elapsed < MINUTE) return 'Now';
    if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`;
    return `${Math.max(1, Math.floor(elapsed / HOUR))}h`;
  }
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** The heading over a day's messages. */
export function dayLabel(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * "Usually replies in 2h" — or nothing at all.
 *
 * The server measures this from the gaps between a customer's message and the
 * organizer's next one, and says how many replies it measured. Below a handful
 * of them the median is one or two conversations rather than a habit, so the
 * claim is not made: an empty label renders no line, and the header simply
 * shows the organizer's name.
 */
export function replyLabel(medianMinutes = 0, samples = 0): string {
  if (samples < MIN_REPLY_SAMPLES) return '';

  const minutes = Math.max(1, Math.round(medianMinutes));
  if (minutes < 60) return `Usually replies in ${minutes}m`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Usually replies in ${hours}h`;

  const days = Math.round(hours / 24);
  return days <= 1 ? 'Usually replies in a day' : `Usually replies in ${days} days`;
}

/**
 * Two letters from the name, for a thread whose record carries no monogram.
 *
 * An organizer row created before the field existed sent '' and the inbox
 * drew a coloured tile with nothing on it — which reads as an avatar that
 * failed to load rather than as a business.
 */
export function initialsOf(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '·';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function mapConversations(dtos: ConversationDTO[], now = new Date()): ConversationItem[] {
  return (dtos ?? []).map((dto) => ({
    id: dto.id,
    withName: dto.withName,
    withInitials: dto.withInitials?.trim() || initialsOf(dto.withName),
    withAvatarColor: dto.withAvatarColor || '#1a2e5a',
    organizerId: dto.organizerId,
    preview: dto.lastMessageText ?? '',
    whenLabel: whenLabel(dto.lastMessageAt, now),
    unread: dto.unread ?? 0,
    replyLabel: replyLabel(dto.replyMedianMinutes, dto.replySamples),
  }));
}

/**
 * Messages, grouped by the day they were sent.
 *
 * Grouped rather than stamped one by one: a thread where every bubble carries
 * a full date is unreadable, and a day heading answers "when was this" once
 * for everything under it. A thread that is all one day gets no heading at
 * all — see `showDayLabels`.
 */
export function groupMessages(dtos: MessageDTO[], now = new Date()): MessageGroup[] {
  const groups: MessageGroup[] = [];

  for (const dto of dtos ?? []) {
    const date = new Date(dto.createdAt);
    const key = Number.isNaN(date.getTime()) ? 'unknown' : String(startOfDay(date));
    const last = groups[groups.length - 1];

    const item = {
      id: dto.id,
      sender: dto.sender,
      text: dto.text,
      // "9:41 AM" — the way a time is spoken here, not a 24-hour stamp.
      timeLabel: Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    if (last && last.key === key) last.items.push(item);
    else groups.push({ key, dayLabel: dayLabel(dto.createdAt, now), items: [item] });
  }

  return groups;
}

/**
 * Whether the day headings are worth the space.
 *
 * One day's worth of messages needs no heading — everything under it happened
 * today, which the reader already knows. The moment a thread spans two days,
 * every group needs one, including the first.
 */
export function showDayLabels(groups: MessageGroup[]): boolean {
  return groups.length > 1;
}

/**
 * The questions worth offering, given where the thread is.
 *
 * An empty thread needs an opener; a thread already running needs the things
 * customers forget to pin down before they commit. Tapping one fills the box
 * rather than sending it — a message goes out in the customer's name, so the
 * customer presses send.
 */
export function suggestionsFor(hasMessages: boolean): string[] {
  return hasMessages ? FOLLOW_UP_SUGGESTIONS : OPENING_SUGGESTIONS;
}
