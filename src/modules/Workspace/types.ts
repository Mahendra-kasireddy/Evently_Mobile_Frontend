// ---------------------------------------------------------------------------
// GET /booking/:id — the booking behind a workspace. Only the fields this
// screen renders are declared; the endpoint returns more.
// ---------------------------------------------------------------------------

export type WorkspaceStatus =
  | 'pending'
  | 'awaiting_organizer'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'expired';

export type PaymentStatus = 'unpaid' | 'advance_paid' | 'paid_in_full';

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'blocked';

export interface WorkspaceOrganizerDTO {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: string;
  rating: number;
}

export interface WorkspaceTaskDTO {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeName: string;
  amount: number;
  dueDate: string | null;
}

export interface WorkspaceTimelineDTO {
  status: string;
  label: string;
  note: string;
  at: string;
}

export interface WorkspaceStepDTO {
  label: string;
  done: boolean;
}

export interface BookingDetailDTO {
  id: string;
  ref: string;
  title: string;
  description: string;
  occasion: string;
  location: string;
  eventDate: string | null;
  daysToGo: number;
  amount: number;
  advanceAmount: number;
  advancePercentage: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  progress: number;
  status: WorkspaceStatus;
  steps: WorkspaceStepDTO[];
  tasks: WorkspaceTaskDTO[];
  timeline: WorkspaceTimelineDTO[];
  organizer: WorkspaceOrganizerDTO | null;
  /** The booking's own customer — used for the board composer's monogram. */
  customer: { id: string; name: string } | null;
}

// ---------------------------------------------------------------------------
// View model — what the screen renders.
// ---------------------------------------------------------------------------

export interface WorkspaceFact {
  icon: string;
  label: string;
  value: string;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  status: TaskStatus;
  statusLabel: string;
  assigneeName: string;
  amountLabel: string;
  dueLabel: string;
}

export interface WorkspaceTimelineEntry {
  id: string;
  label: string;
  note: string;
  atLabel: string;
}

export interface WorkspaceViewModel {
  id: string;
  ref: string;
  /** The screen's own name, shown in the header — "Your wedding workspace". */
  workspaceName: string;
  title: string;
  status: WorkspaceStatus;
  statusLabel: string;
  progress: number;
  /** null when the booking has no date, rather than a misleading 0. */
  daysToGo: number | null;
  steps: WorkspaceStepDTO[];
  facts: WorkspaceFact[];
  payment: {
    totalLabel: string;
    paidLabel: string;
    dueLabel: string;
    statusLabel: string;
    /** Share of the total already paid, for the bar. */
    paidPercent: number;
  };
  tasks: WorkspaceTask[];
  timeline: WorkspaceTimelineEntry[];
  organizerName: string | null;
  customerName: string | null;
}

// ---------------------------------------------------------------------------
// GET /idea/mine/:bookingId — the ideas & planning board for one booking.
// ---------------------------------------------------------------------------

export type IdeaType = 'idea' | 'surprise' | 'question' | 'inspiration' | 'update';
export type IdeaAuthorRole = 'customer' | 'organizer';
export type IdeaPlanStatus = 'planned' | 'in_progress' | 'done';
export type IdeaApproval = 'none' | 'pending' | 'approved';

export interface IdeaReplyDTO {
  status: IdeaPlanStatus;
  text: string;
  at: string | null;
}

/** A reference photo, as the shared /upload endpoint returns it. */
export interface IdeaImage {
  url: string;
  key: string;
  originalName: string;
}

export interface IdeaDTO {
  id: string;
  authorRole: IdeaAuthorRole;
  authorName: string;
  type: IdeaType;
  text: string;
  images: IdeaImage[];
  confidential: boolean;
  reply: IdeaReplyDTO | null;
  approval: IdeaApproval;
  approvalLabel: string;
  createdAt: string;
}

export interface IdeaCounts {
  shared: number;
  planned: number;
  awaitingApproval: number;
}

/**
 * The organizer's short summary of the event, read back by the customer —
 * which is the whole point of it: it is how they see whether they were heard.
 */
export interface BoardVision {
  theme: string;
  vibe: string;
  surprise: string;
  food: string;
  surpriseConfidential: boolean;
  /** False until the organizer has filled in at least one slot. */
  captured: boolean;
}

export interface IdeaBoardDTO {
  items: IdeaDTO[];
  counts: IdeaCounts;
  vision: BoardVision;
}

/** Which slice of the feed is showing. */
export type BoardFilter = 'all' | 'ideas' | 'inspiration' | 'surprises' | 'awaiting';

/** What the composer submits. */
export interface DraftPost {
  text: string;
  type: IdeaType;
  confidential: boolean;
  images: IdeaImage[];
}

/** A photo chosen from the device, before it has been uploaded. */
export interface PickedImage {
  uri: string;
  name: string;
  type: string;
}

// ---------------------------------------------------------------------------
// GET /invitation/mine/:bookingId — 404s while it is still the organizer's
// draft, which is the normal early state rather than a failure.
// ---------------------------------------------------------------------------

export type InvitationStatus = 'draft' | 'sent' | 'approved';

export interface InvitationDTO {
  id: string;
  bookingId: string;
  bookingTitle: string;
  status: InvitationStatus;
  sentAt: string | null;
  approvedAt: string | null;
  details: {
    eyebrow: string;
    hostOne: string;
    hostTwo: string;
    joiner: string;
    eventDate: string;
    eventTime: string;
    venueName: string;
    venueAddress: string;
  };
  subEvents: Array<{ id: string; name: string; eventDate: string; venueName: string }>;
}
