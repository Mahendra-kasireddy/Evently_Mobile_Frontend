/*
 * Server shapes (…DTO) as the organizer endpoints return them, then the view
 * models the Home screen draws. Only the fields Home reads are typed.
 */

export type TaskStatus = 'todo' | 'in_progress' | 'done';

/** `GET /booking/organizer/dashboard`. */
export interface DashboardDTO {
  newEnquiries: number;
  activeBookings: number;
  monthEarnings: number;
  monthEarningsChangePercent: number | null;
  avgRating: number;
  todaysTasks: Array<{
    id: string;
    bookingId: string;
    title: string;
    status: TaskStatus;
  }>;
  next7Days: Array<{
    id: string;
    eventDate: string;
    title: string;
    customerName: string;
  }>;
  pendingEnquiries: Array<{ id: string; myQuotation: unknown | null }>;
}

/** `GET /booking/organizer/badges`. */
export interface BadgeStatusDTO {
  currentTier: string;
  events: number;
  avgRating: number;
  nextTier: string | null;
  nextRequirements: { events: number; avgRating: number } | null;
}

export type OnboardingStatusValue =
  | 'pending_review'
  | 'draft'
  | 'in_progress'
  | 'submitted'
  | 'changes_requested'
  | 'approved'
  | 'rejected';

/** `GET /organizer/onboarding-status`. */
export interface OnboardingStatusDTO {
  onboardingStatus: OnboardingStatusValue;
  canEditBank: boolean;
  canSubmit: boolean;
  payoutReady: boolean;
  reviewNote: string;
  steps: Array<{
    id: string;
    title: string;
    complete: boolean;
    requiredForGoLive: boolean;
  }>;
}

/** `GET /booking/organizer/mine` — what Home counts. */
export interface OrganizerBookingDTO {
  id: string;
  status: string;
}

// ---- view models ----

/** What the go-live card shows, or nothing once there is nothing to do. */
export type GoLiveCardModel =
  | {
      kind: 'setup' | 'changes';
      done: number;
      total: number;
      percent: number;
      /** The next unfinished step's id and title, for "Next: …" and the deep link. */
      nextStepId: string | null;
      nextStepTitle: string | null;
      readyToSubmit: boolean;
      note: string;
    }
  | { kind: 'submitted' }
  | { kind: 'payout' }
  | { kind: 'rejected'; note: string }
  | null;

export interface HomeTask {
  id: string;
  bookingId: string;
  title: string;
  done: boolean;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  customerName: string;
  day: string;
  month: string;
  when: string;
}

export interface TierModel {
  tier: string;
  /** "2 more events to Gold", or the top-tier line. */
  line: string;
  /** 0–1 progress to the next tier. */
  progress: number;
}

export interface HomeStats {
  newEnquiries: number;
  activeBookings: number;
  monthEarnings: string;
  /** "+12% vs last month" — '' when there is nothing to compare. */
  earningsChange: string;
  rating: string;
}
