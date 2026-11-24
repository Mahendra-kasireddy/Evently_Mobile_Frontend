// ---------------------------------------------------------------------------
// GET /idea/organizer/:bookingId — the same board the customer reads, from the
// organizer's side. Shapes mirror IdeaService.view / visionView / counts.
// ---------------------------------------------------------------------------

export type IdeaType =
  | 'idea'
  | 'surprise'
  | 'question'
  | 'inspiration'
  | 'update';
export type IdeaAuthorRole = 'customer' | 'organizer';
export type IdeaPlanStatus = 'planned' | 'in_progress' | 'done';
export type IdeaApproval = 'none' | 'pending' | 'approved';

/** What an organizer may post (CreateIdeaDto, rewritten by createForOrganizer). */
export type OrganizerPostType = 'update' | 'question';

/** A stored reference photo, as the shared /upload endpoint returns it. */
export interface IdeaImageDTO {
  url: string;
  key: string;
  originalName: string;
}

/** The organizer's reply — one per post; a new reply replaces it. */
export interface IdeaReplyDTO {
  status: IdeaPlanStatus;
  text: string;
  at: string | null;
}

export interface IdeaDTO {
  id: string;
  bookingId?: string;
  authorRole: IdeaAuthorRole;
  authorName: string;
  type: IdeaType;
  text: string;
  images: IdeaImageDTO[];
  confidential: boolean;
  reply: IdeaReplyDTO | null;
  approval: IdeaApproval;
  approvalLabel: string;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface IdeaCounts {
  /** The customer's own posts. */
  shared: number;
  /** Customer posts the organizer has replied to. */
  planned: number;
  /** Any post waiting on the customer's sign-off. */
  awaitingApproval: number;
}

export interface BoardVisionDTO {
  theme: string;
  vibe: string;
  surprise: string;
  food: string;
  surpriseConfidential: boolean;
  /** False until at least one slot is filled in. */
  captured: boolean;
}

export interface IdeaBoardDTO {
  items: IdeaDTO[];
  counts: IdeaCounts;
  vision: BoardVisionDTO;
}

// ---- Request bodies ----------------------------------------------------------

export interface OrganizerPostBody {
  text: string;
  type: OrganizerPostType;
  images: IdeaImageDTO[];
}

export interface ReplyBody {
  status: IdeaPlanStatus;
  text: string;
  approvalLabel?: string;
}

/** PATCH vision: only the fields that changed; '' clears a slot. */
export type VisionBody = Partial<
  Pick<
    BoardVisionDTO,
    'theme' | 'vibe' | 'surprise' | 'food' | 'surpriseConfidential'
  >
>;

// ---- Forms -------------------------------------------------------------------

export interface PostDraft {
  text: string;
  type: OrganizerPostType;
  images: IdeaImageDTO[];
}

export interface ReplyForm {
  status: IdeaPlanStatus;
  text: string;
  /** Whether to ask the customer to sign off. */
  askApproval: boolean;
  approvalLabel: string;
}

export type ReplyFormErrors = Partial<Record<'text' | 'approvalLabel', string>>;

export interface VisionForm {
  theme: string;
  vibe: string;
  surprise: string;
  food: string;
  surpriseConfidential: boolean;
}

export type VisionSlotKey = 'theme' | 'vibe' | 'surprise' | 'food';

export type VisionFormErrors = Partial<Record<VisionSlotKey, string>>;

// ---- View models -------------------------------------------------------------

export type IdeasFilter =
  | 'all'
  | 'toReply'
  | 'waiting'
  | 'approved'
  | 'questions';

export interface FilterChip {
  value: IdeasFilter;
  label: string;
  count: number;
}

/** A photo ready to render — `uri` is already absolute. */
export interface PhotoModel {
  key: string;
  uri: string;
  label: string;
}

export type StatusChipTone = 'waiting' | 'approved' | 'planned' | 'done';

export interface StatusChipModel {
  tone: StatusChipTone;
  label: string;
}

export interface IdeaCardModel {
  id: string;
  fromOrganizer: boolean;
  authorName: string;
  initials: string;
  timeAgo: string;
  type: IdeaType;
  text: string;
  photos: PhotoModel[];
  confidential: boolean;
  /** Approval state, as a chip; null when nothing was asked. */
  approval: StatusChipModel | null;
  /** The organizer's reply, if any. */
  reply: {
    status: IdeaPlanStatus;
    statusLabel: string;
    text: string;
    timeAgo: string;
  } | null;
  /** The action under the card. */
  replyCta: string;
}

export interface ProgressModel {
  shared: number;
  planned: number;
  waiting: number;
  approved: number;
  /** Planned share of the customer's ideas, 0–100. */
  plannedPercent: number;
  /** "3 of 5 customer ideas have a plan". */
  summary: string;
}

export interface VisionRowModel {
  key: VisionSlotKey;
  label: string;
  icon: string;
  value: string;
  locked: boolean;
}
