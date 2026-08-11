import type { BookingStatus, BookingItem } from './types';

export const MY_BOOKINGS_ENDPOINT = '/booking/my-bookings';

export const BOOKING_STATUS_COPY: Record<BookingStatus, { label: string; color: BookingItem['statusColor'] }> = {
  pending: { label: 'Pending confirmation', color: 'muted' },
  confirmed: { label: 'Confirmed', color: 'primary' },
  in_progress: { label: 'In progress', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'danger' },
  rejected: { label: 'Rejected', color: 'danger' },
};
