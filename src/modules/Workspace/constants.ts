import { colors } from '../../theme';
import type { OccasionArtKey } from '../../Components';
import type {
  BoardFilter,
  IdeaApproval,
  IdeaPlanStatus,
  IdeaType,
  PaymentStatus,
  TaskStatus,
  WorkspaceStatus,
} from './types';
import type { WorkspaceTabItem } from './types';

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
/* The cream the workspace artwork is painted on, sampled from it. The block
   carries this behind the picture so a booking whose lines run past the foot
   of the artwork does not show a band of white under it. */
export const WORKSPACE_CREAM = '#fdf6f1';
/*
 * Three tints, one per figure on the strip under the title, and reused by the
 * cards that belong to each: coral for time (how long is left), green for
 * progress (how much is done), violet for money (what has been paid).
 *
 * A workspace opened six months before an event is mostly waiting, and a page
 * of white cards with one orange button gave the customer nothing to read at
 * a glance. Colour here is doing a job — each figure is findable by its own
 * colour before the words are read — rather than decorating.
 */
export const WORKSPACE_GREEN = '#1d9e75';
export const WORKSPACE_GREEN_SOFT = '#e8f6ef';
export const WORKSPACE_VIOLET = '#5b46c9';
export const WORKSPACE_VIOLET_SOFT = '#eeeaff';
export const WORKSPACE_RING_TRACK = 'rgba(255,255,255,0.18)';

/** Ring geometry for the hero: a 78px ring inside the navy header. */
export const RING_SIZE = 78;
export const RING_STROKE = 9;
export const RING_RADIUS = (RING_SIZE - RING_STROKE - 2) / 2;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const WORKSPACE_COPY = {
  /** Used when the booking carries no occasion to name the workspace after. */
  fallbackName: 'Your event workspace',
  /** On the banner, beside the way back. */
  screenTitle: 'Workspace',
  milestones: 'Milestones',
  /*
   * Three tabs.
   *
   * Ideas and the invitation used to be two buttons on a bar pinned to the
   * foot of the screen — a bar that covered the last of whatever tab was
   * open. They are tabs now, and the bar is gone.
   *
   * Plan and Payment are not tabs. Everything a booking says about itself —
   * where it has got to, what is owed, who is doing what, what has happened
   * — is one account of one booking, and splitting it three ways meant the
   * customer had to guess which third held the thing they came for. It is
   * all under Details, in one scroll. What is left beside it are the two
   * places you go to do something rather than to read something.
   */
  tabDetails: 'Details',
  tabIdeas: 'Ideas & planning',
  tabInvitation: 'Guest invitation',
  details: 'Event details',
  payment: 'Payment',
  vendors: 'Vendors & tasks',
  timeline: 'Activity',
  noTasks: 'Your organizer has not added any vendor tasks yet.',
  ideas: 'Ideas & Planning',
  ideasBlurb: 'Explore ideas, themes and tips to make your event even more special.',
  ideasOpen: 'Explore',
  ideasStart: 'Start',
  invitation: 'Guest invitation',
  noTimeline: 'Nothing has happened on this booking yet.',
  loading: 'Opening your workspace…',
  retry: 'Try again',
};

/**
 * The workspace's destinations, in the order they are offered.
 *
 * Declared once here rather than built in the screen, so the preview and the
 * screen cannot end up offering different rows.
 */
export const WORKSPACE_TABS: WorkspaceTabItem[] = [
  { key: 'details', label: WORKSPACE_COPY.tabDetails, icon: 'information-outline' },
  { key: 'ideas', label: WORKSPACE_COPY.tabIdeas, icon: 'lightbulb-on-outline' },
  { key: 'invitation', label: WORKSPACE_COPY.tabInvitation, icon: 'email-outline' },
];

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
  heroTitle: 'Plan your day, together',
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

// ---------------------------------------------------------------------------
// The workspace's look, per occasion.
// ---------------------------------------------------------------------------

/**
 * Each occasion's poster colours: the hero's sweep, deep at the corner where
 * the words sit, warm where the light comes in. A birthday should not open on
 * a wedding's blush, and neither should open on an office's navy.
 */
export const OCCASION_THEME: Record<
  OccasionArtKey,
  { from: string; via: string; to: string; glow: string; emoji: string }
> = {
  wedding: { from: '#3b0f3f', via: '#a3285b', to: '#f2795a', glow: '#ffb48a', emoji: '💍' },
  birthday: { from: '#2a1460', via: '#8a2bd1', to: '#ff5fa2', glow: '#ffc35c', emoji: '🎂' },
  housewarming: { from: '#0f3b3a', via: '#1f8a6d', to: '#f2b045', glow: '#ffe08a', emoji: '🏡' },
  naming: { from: '#1b2a6b', via: '#4c6fe0', to: '#f59ac2', glow: '#ffd6e8', emoji: '👶' },
  anniversary: { from: '#3d0b1f', via: '#b0204a', to: '#ff8a7a', glow: '#ffc1b3', emoji: '💞' },
  corporate: { from: '#0b1736', via: '#1f3fa0', to: '#29b6c9', glow: '#9be7ff', emoji: '🏢' },
};

/** Ring colours for the three stats. */
export const STAT_RING = {
  ready: ['#3cc9a1', '#0e8a68'] as [string, string],
  paid: ['#a084ff', '#5a35e0'] as [string, string],
  tasks: ['#ffb547', '#f0791a'] as [string, string],
};

/** The active tab, the done milestones, the primary actions. */
export const WORKSPACE_ACTION_GRADIENT: [string, string] = ['#f47b4d', '#e2477a'];

export const WORKSPACE_PREMIUM_COPY = {
  daysToGo: (n: number) => (n === 1 ? 'day to go' : 'days to go'),
  today: 'It’s today!',
  past: 'Event day has passed',
  ready: 'Ready',
  paid: 'Paid',
  tasks: 'Tasks',
  noTasksShort: 'None yet',
  message: 'Message',
  journey: 'Your journey',
  now: 'Now',
  paidOf: (total: string) => `paid of ${total}`,
  advance: 'Advance',
  balance: 'Balance',
  advancePaid: 'Paid',
  advanceCashDue: 'Due in cash',
  advanceDue: 'Due now',
  balanceDue: 'Before the event',
  stillDue: (amount: string) => `${amount} still to pay`,
  allPaid: 'All paid — nothing left to settle',
  activity: 'Activity',
};

/** The Guest invitation tab (sections/InvitationTab). */
export const INVITE_TAB_COPY = {
  eyebrow: 'You are invited',
  yourOrganizer: 'Your organizer',
  video: 'Video',
  openPoster: 'Open your guest invitation',
  draftTitle: 'Being designed',
  draftBody: (organizer: string) =>
    `${organizer} is crafting your invitation. You’ll review and approve it here before any guest sees it.`,
  reviewTitle: 'Ready for your review',
  reviewBody: (organizer: string) => `${organizer} has shared it. Look it over and approve it — or ask for changes.`,
  liveTitle: 'Approved & live',
  liveBody: 'Your guest link is live. Share it with everyone on your list.',
  liveGuests: (sent: number, total: number) =>
    sent >= total
      ? `Sent to all ${total} ${total === 1 ? 'guest' : 'guests'} on your list.`
      : `Sent to ${sent} of ${total} guests — share it with the rest.`,
  guestsTitle: 'Guests',
  openRate: (pct: number) => `${pct}% opened`,
  invited: 'Invited',
  sent: 'Sent',
  viewed: 'Opened',
  notSentYet: (n: number) => `${n} ${n === 1 ? 'guest hasn’t' : 'guests haven’t'} been sent it yet.`,
  sendAfterApproval: 'You can send it to your guests once you approve it.',
  noGuests: 'No guests yet. Start your list now — the invitation can go out the moment it’s approved.',
  reviewAction: 'Review invitation',
  reviewActionBody: 'Approve it or ask for changes',
  viewTitle: 'View & share',
  viewBody: 'Open it and send it to guests',
  manageGuests: 'Guest list',
  manageGuestsBody: 'Add, group and invite guests',
  startGuests: 'Start guest list',
  startGuestsBody: 'Add the people you’re inviting',
  programme: 'The programme',
};
