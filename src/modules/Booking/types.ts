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
 * One milestone on a booking. `/booking/my-bookings` has always returned these
 * — the list simply never declared them, which is why the card had nothing to
 * say about what happens next.
 */
export interface BookingStepDTO {
  label: string;
  done: boolean;
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
  advanceAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  progress: number;
  status: BookingStatus;
  steps: BookingStepDTO[];
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
  /** The same label, as the card's pill wears it. */
  statusPill: string;
  statusTone: 'primary' | 'success' | 'muted' | 'danger' | 'warning';
  progress: number;
  /** null when the booking has no usable date, rather than a misleading 0. */
  daysToGo: number | null;
  /** The countdown as the card shows it beside the bar — '' when there is none. */
  daysLabel: string;
  eventDateLabel: string;
  organizerName: string | null;
  organizerInitials: string;
  organizerColor: string;
  /** '' when nothing has been agreed, so the row drops the line entirely. */
  paidLabel: string;
  paymentLabel: string;
  paymentStatus: PaymentStatus;
  amount: number;
  amountPaid: number;
  balanceAmount: number;
  /**
   * The next milestone the booking is waiting on, phrased for the card —
   * '' when every step is done, or when the booking carries no steps at all.
   */
  nextStep: string;
  tab: BookingTab;
}

// ---------------------------------------------------------------------------
// "Jump to" — the four places one event can be worked on.
// ---------------------------------------------------------------------------

/** What the invitation tile counts, when there is a published invitation. */
export interface GuestReach {
  /** People the invitation has been shared with. */
  shared: number;
  /** How many of them have actually opened it. */
  opened: number;
}

/**
 * The two counts the grid needs that the bookings list does not carry.
 *
 * Both are optional by nature rather than by failure: a booking whose
 * invitation is still the organizer's draft has no guest list to count, and
 * a board nobody has posted to has no ideas. Each resolves to null in that
 * case and the tile says so in words instead of showing a zero.
 */
export interface EventExtras {
  ideas: { shared: number; planned: number; awaitingApproval: number } | null;
  guests: GuestReach | null;
}

export type JumpKey = 'payments' | 'invitation' | 'budget' | 'ideas';

export interface JumpTile {
  key: JumpKey;
  title: string;
  subtitle: string;
  icon: string;
  /** Which of the four tile colours this one wears. */
  tone: 'coral' | 'violet' | 'green';
}
