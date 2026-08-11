export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';

export interface BookingOrganizerDTO {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: string;
  rating: number;
}

export interface BookingDTO {
  id: string;
  ref: string;
  title: string;
  occasion: string;
  location: string;
  eventDate: string;
  daysToGo: number;
  amount: number;
  progress: number;
  status: BookingStatus;
  organizer: BookingOrganizerDTO | null;
  createdAt: string;
}

export interface BookingItem {
  id: string;
  ref: string;
  title: string;
  statusLabel: string;
  statusColor: 'primary' | 'success' | 'muted' | 'danger';
  progress: number;
  daysToGo: number;
  organizerName: string | null;
  eventDateLabel: string;
}
