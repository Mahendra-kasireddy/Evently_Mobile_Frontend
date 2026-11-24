/*
 * `GET /booking/organizer/mine` as the organizer receives it, then the view
 * models the Events screen draws. Only the fields this screen reads are typed.
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

export interface OrganizerBookingDTO {
  id: string;
  title: string;
  occasion: string;
  location: string;
  eventDate?: string;
  daysToGo: number;
  amount: number;
  advanceAmount: number;
  paymentStatus: PaymentStatus;
  /** Deadline to accept or decline; null once answered. */
  organizerRespondBy: string | null;
  status: BookingStatus;
  tasks: Array<{ id: string; status: 'todo' | 'in_progress' | 'done' }>;
  customer: { id: string; name: string } | null;
}

export type EventsView = 'upcoming' | 'past';
export type StatusTone = 'amber' | 'green' | 'blue' | 'grey' | 'red';

export interface EventItem {
  id: string;
  title: string;
  customerName: string;
  location: string;
  /** Date tile: '14' / 'NOV' — '' when the booking has no date yet. */
  day: string;
  month: string;
  /** "Today", "Tomorrow", "In 12 days", "3 days ago". */
  when: string;
  status: { label: string; tone: StatusTone };
  amount: string;
  /** "Advance paid" / "Paid in full" — '' when nothing has been paid. */
  paid: string;
  tasksDone: number;
  tasksTotal: number;
  /** Waiting on this organizer to accept or decline. */
  awaiting: boolean;
  /** "Respond within 6h" — only while awaiting, '' otherwise. */
  respondBy: string;
  respondUrgent: boolean;
  /** Finished, cancelled, declined or expired — the Past list. */
  past: boolean;
  sortKey: number;
}

export interface EventsSections {
  awaiting: EventItem[];
  upcoming: EventItem[];
  past: EventItem[];
}
