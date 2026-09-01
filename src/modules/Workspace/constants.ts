import { colors } from '../../theme';
import type {
  BoardFilter,
  IdeaApproval,
  IdeaPlanStatus,
  IdeaType,
  PaymentStatus,
  TaskStatus,
  WorkspaceStatus,
} from './types';

export const BOOKING_DETAIL_ENDPOINT = '/booking';
export const IDEA_BOARD_ENDPOINT = '/idea/mine';
export const INVITATION_ENDPOINT = '/invitation/mine';
export const UPLOAD_ENDPOINT = '/upload';

/**
 * A booking awaiting the organizer's acceptance still reads as booked to the
 * customer — they have chosen an organizer and paid. What is outstanding is
 * the organizer's confirmation, which the label says outright.
 */
export const WORKSPACE_STATUS_LABEL: Record<WorkspaceStatus, string> = {
  pending: 'Booking placed',
  awaiting_organizer: 'Awaiting organizer confirmation',
  confirmed: 'Confirmed',
  in_progress: 'Event in progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Declined by organizer',
  expired: 'Expired — organizer did not respond',
};

export const WORKSPACE_STATUS_COLOR: Record<WorkspaceStatus, string> = {
  pending: colors.textMuted,
  awaiting_organizer: colors.accent,
  confirmed: colors.success,
  in_progress: colors.success,
  completed: colors.success,
  cancelled: colors.danger,
  rejected: colors.danger,
  expired: colors.danger,
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: 'Nothing paid yet',
  advance_paid: 'Advance paid',
  paid_in_full: 'Paid in full',
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  pending: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
  blocked: 'Blocked',
};

export const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  pending: colors.textMuted,
  in_progress: colors.accent,
  done: colors.success,
  blocked: colors.danger,
};

// Web's tokens, scoped to this screen — matching the rest of the ported Home
// sections rather than the app's bright indigo primary.
export const WORKSPACE_ACCENT = '#e8633a';
export const WORKSPACE_NAVY = '#1a2e5a';
export const WORKSPACE_NAVY_DEEP = '#0e1a33';
export const WORKSPACE_ACCENT_SOFT = '#fdeee7';
export const WORKSPACE_RING_TRACK = 'rgba(255,255,255,0.18)';

/** Ring geometry for the hero: a 78px ring inside the navy header. */
export const RING_SIZE = 78;
export const RING_STROKE = 9;
export const RING_RADIUS = (RING_SIZE - RING_STROKE - 2) / 2;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const WORKSPACE_COPY = {
  /** Used when the booking carries no occasion to name the workspace after. */
  fallbackName: 'Your event workspace',
  milestones: 'Milestones',
  details: 'Event details',
  payment: 'Payment',
  vendors: 'Vendors & tasks',
  timeline: 'Activity',
  noTasks: 'Your organizer has not added any vendor tasks yet.',
  ideas: 'Ideas & planning board',
  invitation: 'Guest invitation',
  noTimeline: 'Nothing has happened on this booking yet.',
  loading: 'Opening your workspace…',
  retry: 'Try again',
};

// ---------------------------------------------------------------------------
// Ideas & planning board.
// ---------------------------------------------------------------------------

/**
 * Post type → its chip. Colours are scoped to the board so the five kinds are
 * distinguishable at a glance rather than five identical grey pills.
 */
export const IDEA_TYPE_META: Record<IdeaType, { label: string; icon: string; color: string; bg: string }> = {
  idea: { label: 'Idea', icon: 'lightbulb-on-outline', color: '#b8541f', bg: '#fdeee7' },
  inspiration: { label: 'Inspiration', icon: 'image-outline', color: '#2b5aa8', bg: '#e8effa' },
  question: { label: 'Question', icon: 'help-circle-outline', color: '#7a4bb8', bg: '#f0eafb' },
  surprise: { label: 'Surprise', icon: 'gift-outline', color: '#a63a63', bg: '#fbe9f0' },
  update: { label: 'Update', icon: 'bullhorn-outline', color: '#1a2e5a', bg: '#e9edf5' },
};

export const IDEA_PLAN_STATUS_LABEL: Record<IdeaPlanStatus, string> = {
  planned: 'Planned',
  in_progress: 'In progress',
  done: 'Done',
};

export const IDEA_PLAN_STATUS_COLOR: Record<IdeaPlanStatus, string> = {
  planned: colors.accent,
  in_progress: colors.accent,
  done: colors.success,
};

export const IDEA_APPROVAL_LABEL: Record<IdeaApproval, string> = {
  none: '',
  pending: 'Needs your approval',
  approved: 'Approved by you',
};

/**
 * What the customer may post. The remaining type — `update` — is the
 * organizer's status note, and the API rewrites it to `idea` if a customer
 * sends it, so offering it here would be offering something that does not
 * happen.
 */
export const CUSTOMER_IDEA_TYPES: IdeaType[] = ['idea', 'inspiration', 'question', 'surprise'];

export const BOARD_FILTERS: Array<{ value: BoardFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'ideas', label: 'Ideas' },
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'surprises', label: 'Surprises' },
  { value: 'awaiting', label: 'Awaiting you' },
];

/** The four vision slots, in the order the design shows them. */
export const VISION_SLOTS: Array<{ key: 'theme' | 'vibe' | 'surprise' | 'food'; label: string; icon: string }> = [
  { key: 'theme', label: 'Theme', icon: 'palette-outline' },
  { key: 'vibe', label: 'Vibe', icon: 'heart-outline' },
  { key: 'surprise', label: 'Surprise', icon: 'gift-outline' },
  { key: 'food', label: 'Food', icon: 'silverware-fork-knife' },
];

/** Server-side purpose for a board photo; governs its size and type rules. */
export const IDEA_IMAGE_PURPOSE = 'ideaImage';
export const IDEA_IMAGE_MAX = 4;
export const IDEA_TEXT_MAX = 4000;

export const IDEAS_COPY = {
  title: 'Ideas & planning board',
  heroPill: 'IDEAS BOARD',
  heroTitle: 'Plan your day, together',
  heroSubtitle: (organizer: string) =>
    `Share how you imagine your day. ${organizer} turns each idea into a real plan — you just review and approve.`,
  statShared: 'shared',
  statPlanned: 'Planned',
  statAwaiting: 'Awaiting you',
  emptyTitle: 'Nothing here yet',
  emptyBody: (organizer: string) =>
    `Share the first one — a theme, a must-have, a photo you love. ${organizer} will turn it into a plan and reply here.`,
  filterEmptyTitle: 'Nothing in this filter',
  filterEmptyBody: 'Try another filter, or post something new.',
  placeholder: (organizer: string) => `Share how you imagine your day with ${organizer}…`,
  placeholderSurprise: 'Something you want planned without it showing up anywhere you share…',
  post: 'Post idea',
  posting: 'Posting…',
  photo: 'Photo',
  uploading: 'Uploading…',
  photoError: "That photo couldn't be uploaded. Try a JPG, PNG or WebP under 8MB.",
  photoLimit: (max: number) => `You can attach up to ${max} photos.`,
  pickError: 'Could not open your photo library.',
  confidentialNote: (organizer: string) => `Only you and ${organizer} will see this`,
  confidential: 'Kept private',
  approve: 'Approve',
  approved: 'Approved by you',
  plan: 'Turned into a plan',
  you: 'You',
  visionTitle: 'Your event vision',
  visionSubtitle: (organizer: string) => `What ${organizer} captured from your ideas.`,
  visionEmpty: (organizer: string) =>
    `${organizer} hasn't summarised your event yet. It will appear here as they work through your ideas.`,
  visionSlotEmpty: 'Not captured yet',
  loading: 'Opening the planning board…',
  retry: 'Try again',
  loadError: "We couldn't load the planning board.",
};

/** Does this post belong in the given filter? */
export function matchesBoardFilter(idea: { type: IdeaType; approval: IdeaApproval }, filter: BoardFilter): boolean {
  switch (filter) {
    case 'ideas':
      return idea.type === 'idea';
    case 'inspiration':
      return idea.type === 'inspiration';
    case 'surprises':
      return idea.type === 'surprise';
    case 'awaiting':
      return idea.approval === 'pending';
    default:
      return true;
  }
}

/** Relative age of a post, in the design's shorthand. */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return '';
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

/** Two-letter monogram, from whatever name we actually have. */
export function initials(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '·';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

/**
 * Share of the customer's ideas the organizer has turned into a plan. Zero
 * ideas means zero percent, not a division by zero.
 */
export function plannedPercent(planned: number, shared: number): number {
  if (shared <= 0) return 0;
  return Math.min(100, Math.round((planned / shared) * 100));
}
