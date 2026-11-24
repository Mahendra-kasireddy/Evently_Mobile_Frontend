/*
 * `GET /booking/:id` as the owning organizer receives it (the backend's
 * `detailView`), the request bodies the workspace sends, and the view models
 * the screen draws. Only the fields this screen reads are typed.
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
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type AssignmentStatus =
  | 'unassigned'
  | 'pending'
  | 'accepted'
  | 'declined';

/** What `POST /upload` stores — sent back as-is in a task PATCH. */
export interface StoredFileDTO {
  url: string;
  key: string;
  originalName?: string;
}

export interface BookingTaskDTO {
  id: string;
  title: string;
  status: TaskStatus;
  /** The sub-vendor's name when one is linked, else whatever the organizer typed. */
  assigneeName: string;
  subVendorId: string | null;
  assignmentStatus: AssignmentStatus;
  /** What this task pays its sub-vendor, ₹. 0 when not set. */
  amount: number;
  dueDate: string | null;
  photoProof: StoredFileDTO | null;
}

export interface BookingDTO {
  id: string;
  ref: string;
  title: string;
  occasion: string;
  location: string;
  eventDate?: string;
  daysToGo: number;
  amount: number;
  advanceAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  /** 'cash' when the advance is owed to the organizer in person. */
  advanceMethod?: 'online' | 'cash';
  /** Deadline to accept or decline; null once answered. */
  organizerRespondBy: string | null;
  declineReason: string;
  status: BookingStatus;
  tasks: BookingTaskDTO[];
  /** Null when the server did not populate it (task mutations never do). */
  customer: { id: string; name: string } | null;
}

/** `GET /booking/organizer/subvendors` — one roster link. */
export interface SubVendorLinkDTO {
  linkId: string;
  status: 'pending' | 'active' | 'removed';
  subVendor: {
    id: string;
    fullName: string;
    initials: string;
    category: string;
  } | null;
}

/** `GET /idea/organizer/:bookingId` — only the counts are read here. */
export interface IdeaBoardDTO {
  counts: { shared: number; planned: number; awaitingApproval: number };
}

/** `PATCH /booking/:id/status` — the backend's UpdateBookingStatusDto. */
export interface StatusBody {
  status: BookingStatus;
  /** ≤ 500 chars. On a decline it becomes the booking's declineReason. */
  note?: string;
}

/** `POST /booking/:id/tasks` — CreateBookingTaskDto. */
export interface CreateTaskBody {
  title: string;
  assigneeName?: string;
  dueDate?: string;
  subVendorId?: string;
  amount?: number;
}

/** `PATCH /booking/:id/tasks/:taskId` — UpdateBookingTaskDto. */
export interface UpdateTaskBody {
  title?: string;
  status?: TaskStatus;
  assigneeName?: string;
  dueDate?: string;
  photoProof?: StoredFileDTO;
  /** null clears the assignment. */
  subVendorId?: string | null;
  amount?: number;
}

// ---- View models ----------------------------------------------------------

export type StatusTone = 'amber' | 'green' | 'blue' | 'grey' | 'red';

export interface Chip {
  label: string;
  tone: StatusTone;
}

export interface MoneyLine {
  key: 'total' | 'advance' | 'balance';
  label: string;
  value: string;
  /** Paid lines read green; owed lines read in ink. */
  settled: boolean;
}

export interface HeaderModel {
  title: string;
  customerName: string;
  location: string;
  /** Date tile — '' when the booking has no date yet. */
  day: string;
  month: string;
  weekday: string;
  /** "In 12 days", "Today", "3 days ago". */
  when: string;
  status: Chip;
  money: MoneyLine[];
}

export interface RespondModel {
  /** "18h left", "2 days left" — '' without a deadline. */
  countdown: string;
  /** "Respond by Fri, 31 Oct, 6:00 pm" — '' without a deadline. */
  deadline: string;
  urgent: boolean;
  /** "Customer has paid ₹45,000 advance." */
  paymentNote: string;
}

/** What this organizer may do with the booking right now. */
export interface Permissions {
  /** Accept / decline: awaiting, and the response window still open. */
  canRespond: boolean;
  /** Awaiting, but the window has run out — the server will expire it. */
  respondLapsed: boolean;
  /** The board is drawn at all. */
  showBoard: boolean;
  /** Tasks may be added, edited, moved, deleted. */
  canEditTasks: boolean;
  /** "Mark event completed" is offered. */
  canComplete: boolean;
  /** Completed, cancelled, declined or expired. */
  closed: boolean;
}

export interface TaskCardModel {
  id: string;
  title: string;
  status: TaskStatus;
  /** '' when nobody is assigned. */
  assignee: string;
  /** Sub-vendor's answer — null for free-text or no assignee. */
  assignment: Chip | null;
  /** "Due Tomorrow", "Due Fri, 14 Nov" — '' when no date. */
  due: string;
  overdue: boolean;
  /** "₹4,500" — '' when 0. */
  amount: string;
  /** Absolute image URI for the proof thumbnail — '' when none. */
  proofUri: string;
  next: { status: TaskStatus; label: string; icon: string };
}

export interface TaskProgress {
  done: number;
  total: number;
  percent: number;
  label: string;
}

export type AssignMode = 'none' | 'subvendor' | 'person';

export interface TaskForm {
  title: string;
  /** Local `YYYY-MM-DD`, or ''. */
  dueDate: string;
  /** Digits only, or ''. */
  amount: string;
  mode: AssignMode;
  subVendorId: string;
  assigneeName: string;
}

export type TaskFormErrors = Partial<Record<keyof TaskForm, string>>;

export interface SubVendorOption {
  id: string;
  name: string;
  initials: string;
  category: string;
}

/** A task update, plus a second PATCH the backend needs for one case. */
export interface TaskUpdatePlan {
  body: UpdateTaskBody;
  followUp: UpdateTaskBody | null;
}
