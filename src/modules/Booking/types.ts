/**
 * Every status a booking can hold. `awaiting_organizer` and `expired` were
 * missing here while the backend has always emitted them — the list fell
 * through to a generic label, so an expired booking read as a neutral
 * "Expired" rather than as the failure it is.
 */
export type BookingStatus =
  | 'pending'
  | 'awaiting_organizer'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'expired';

export type PaymentStatus = 'unpaid' | 'advance_paid' | 'paid_in_full';

export interface BookingOrganizerDTO {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: string;
  rating: number;
}

/**
 * GET /booking/my-bookings. The endpoint returns each booking's full detail;
 * declared here is what the list actually renders.
 */
export interface BookingDTO {
  id: string;
  ref: string;
  title: string;
  occasion: string;
  location: string;
  eventDate: string;
  daysToGo: number;
  amount: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  progress: number;
  status: BookingStatus;
  organizer: BookingOrganizerDTO | null;
  createdAt: string;
}

/** How a booking reads: still happening, or already history. */
export type BookingTab = 'active' | 'past';

export interface BookingItem {
  id: string;
  ref: string;
  title: string;
  occasion: string;
  location: string;
  status: BookingStatus;
  statusLabel: string;
  statusTone: 'primary' | 'success' | 'muted' | 'danger' | 'warning';
  progress: number;
  /** null when the booking has no usable date, rather than a misleading 0. */
  daysToGo: number | null;
  eventDateLabel: string;
  organizerName: string | null;
  organizerInitials: string;
  organizerColor: string;
  /** '' when nothing has been agreed, so the row drops the line entirely. */
  paidLabel: string;
  paymentLabel: string;
  tab: BookingTab;
}
