import { BOOKING_STATUS_COPY } from './constants';
import type { BookingDTO, BookingItem } from './types';

function titleizeStatus(status: string): string {
  return status
    .split('_')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function mapBookings(dtos: BookingDTO[]): BookingItem[] {
  return dtos.map((b) => {
    const statusCopy = BOOKING_STATUS_COPY[b.status] ?? {
      label: titleizeStatus(b.status ?? 'Unknown'),
      color: 'muted' as const,
    };
    return {
      id: b.id,
      ref: b.ref,
      title: b.title,
      statusLabel: statusCopy.label,
      statusColor: statusCopy.color,
      progress: b.progress,
      daysToGo: b.daysToGo,
      organizerName: b.organizer?.name ?? null,
      eventDateLabel: new Date(b.eventDate).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
  });
}
