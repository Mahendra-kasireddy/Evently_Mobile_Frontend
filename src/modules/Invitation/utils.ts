import { INVITATION_COPY, INVITATION_STATUS_LABEL } from './constants';
import type { InvitationListItem, InvitationSummaryDTO } from './types';

function dateLabel(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * The customer's invitations, in the order that answers the question they
 * opened the list to ask: which of these is waiting on me?
 *
 * Ones needing approval come first; the rest fall back to event date so the
 * soonest event leads. A booking with no title still gets a name, because a
 * row reading nothing at all is worse than a generic one.
 */
export function mapInvitationList(dtos: InvitationSummaryDTO[]): InvitationListItem[] {
  /*
   * Sorted on the raw timestamp, before the label is built: parsing "5 Sept
   * 2026" back into a Date is unreliable, and a comparator that silently
   * returns NaN leaves the list in whatever order it arrived.
   */
  const ordered = [...(dtos ?? [])].sort((a, b) => {
    const aNeeds = a.status === 'sent';
    const bNeeds = b.status === 'sent';
    if (aNeeds !== bNeeds) return aNeeds ? -1 : 1;
    const aAt = a.eventDate ? new Date(a.eventDate).getTime() : Number.POSITIVE_INFINITY;
    const bAt = b.eventDate ? new Date(b.eventDate).getTime() : Number.POSITIVE_INFINITY;
    if (Number.isNaN(aAt) || Number.isNaN(bAt)) return 0;
    return aAt - bAt;
  });

  return ordered
    .map((dto) => ({
      bookingId: dto.bookingId,
      status: dto.status,
      title: dto.bookingTitle || INVITATION_COPY.untitledEvent,
      ref: dto.bookingRef ?? '',
      occasion: (dto.occasion ?? '').toLowerCase(),
      dateLabel: dateLabel(dto.eventDate),
      statusLabel: INVITATION_STATUS_LABEL[dto.status] ?? dto.status,
      needsYou: dto.status === 'sent',
    }));
}
