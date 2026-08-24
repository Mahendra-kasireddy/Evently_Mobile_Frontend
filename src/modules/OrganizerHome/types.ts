export type BookingTaskStatus = 'todo' | 'done';

export interface DashboardTask {
  id: string;
  bookingId: string;
  title: string;
  status: BookingTaskStatus;
}

export interface DashboardScheduleItem {
  id: string;
  eventDate: string;
  title: string;
  customerName: string;
}

export type QuoteRequestStatus = 'open' | 'quoted' | 'accepted' | 'declined' | 'expired' | string;

export interface ApiIncomingRequest {
  id: string;
  customerName: string;
  occasion: string;
  when: string;
  where: string;
  guests: string;
  budget: string;
  categories: string[];
  ideas: string;
  status: QuoteRequestStatus;
  createdAt?: string;
}

export interface OrganizerDashboard {
  newEnquiries: number;
  activeBookings: number;
  monthEarnings: number;
  monthEarningsChangePercent: number | null;
  avgRating: number;
  todaysTasks: DashboardTask[];
  next7Days: DashboardScheduleItem[];
  pendingEnquiries: ApiIncomingRequest[];
}

export interface TierLadderEntry {
  tier: string;
  commissionRate: number;
}

export interface TierRequirements {
  events: number;
  avgRating: number;
  trainingStage: number;
  maxComplaints: number;
}

export interface BadgeStatus {
  currentTier: string;
  commissionRate: number;
  events: number;
  avgRating: number;
  trainingStage: number;
  complaintsCount: number;
  nextTier: string | null;
  nextRequirements: TierRequirements | null;
  tierLadder: TierLadderEntry[];
}
