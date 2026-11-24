import type {
  AssignmentStatus,
  BookingStatus,
  Chip,
  TaskStatus,
} from './types';

const id = (value: string) => encodeURIComponent(value);

export const bookingEndpoint = (bookingId: string) =>
  `/booking/${id(bookingId)}`;
export const statusEndpoint = (bookingId: string) =>
  `/booking/${id(bookingId)}/status`;
export const tasksEndpoint = (bookingId: string) =>
  `/booking/${id(bookingId)}/tasks`;
export const taskEndpoint = (bookingId: string, taskId: string) =>
  `/booking/${id(bookingId)}/tasks/${id(taskId)}`;
export const SUBVENDORS_ENDPOINT = '/booking/organizer/subvendors';
export const ideasEndpoint = (bookingId: string) =>
  `/idea/organizer/${id(bookingId)}`;

/** `POST /upload` purpose for a task's photo proof. */
export const PROOF_PURPOSE = 'taskProof';

/** Pages that are still web — opened in OrganizerWebPage. */
export const invitationPath = (bookingId: string) =>
  `/organizer/invitation/${bookingId}`;
export const ideasPath = (bookingId: string) =>
  `/organizer/events/${bookingId}/ideas`;

/** Backend limits (CreateBookingTaskDto / UpdateBookingStatusDto). */
export const TITLE_MAX = 160;
export const ASSIGNEE_MAX = 80;
export const REASON_MAX = 500;
export const AMOUNT_MAX_DIGITS = 8;

/** Booking statuses the organizer may still accept or decline (ALLOWED_TRANSITIONS). */
export const AWAITING: BookingStatus[] = ['pending', 'awaiting_organizer'];
/** Live bookings: tasks editable, completion allowed (ALLOWED_TRANSITIONS). */
export const ACTIVE: BookingStatus[] = ['confirmed', 'in_progress'];
/** No transition leaves these (backend TERMINAL). */
export const CLOSED: BookingStatus[] = [
  'completed',
  'cancelled',
  'rejected',
  'expired',
];

export const TASK_COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'done'];

export const STATUS_LOOK: Record<BookingStatus, Chip> = {
  pending: { label: 'Booking placed', tone: 'amber' },
  awaiting_organizer: { label: 'Needs your yes', tone: 'amber' },
  confirmed: { label: 'Confirmed', tone: 'green' },
  in_progress: { label: 'In progress', tone: 'blue' },
  completed: { label: 'Completed', tone: 'grey' },
  cancelled: { label: 'Cancelled', tone: 'red' },
  rejected: { label: 'Declined', tone: 'red' },
  expired: { label: 'Expired', tone: 'grey' },
};

export const ASSIGNMENT_LOOK: Record<
  Exclude<AssignmentStatus, 'unassigned'>,
  Chip
> = {
  pending: { label: 'Waiting for reply', tone: 'amber' },
  accepted: { label: 'Accepted', tone: 'green' },
  declined: { label: 'Declined', tone: 'red' },
};

/** The one-tap move on each card. */
export const NEXT_MOVE: Record<
  TaskStatus,
  { status: TaskStatus; label: string; icon: string }
> = {
  todo: { status: 'in_progress', label: 'Start', icon: 'play' },
  in_progress: { status: 'done', label: 'Mark done', icon: 'check' },
  done: { status: 'in_progress', label: 'Reopen', icon: 'undo-variant' },
};

export const EVENT_COPY = {
  fallbackTitle: 'Event',
  loading: 'Opening your event…',
  error: 'We couldn’t load this event.',
  retry: 'Try again',
  notFoundTitle: 'Event not found',
  notFoundBody:
    'This booking may have been removed or is no longer visible to you.',
  back: 'Back to events',
  dismiss: 'Dismiss',
  noDate: 'Date to be set',

  money: {
    total: 'Total',
    advancePaid: 'Advance paid',
    advanceDue: 'Advance due',
    balanceDue: 'Balance due',
    paidInFull: 'Paid in full',
  },

  respond: {
    title: 'Needs your answer',
    body: 'Accept to lock the date, or decline so the customer’s advance is refunded.',
    left: (text: string) => `${text} left`,
    deadline: (when: string) => `Respond by ${when}`,
    lapsedTitle: 'Response time is over',
    lapsedBody:
      'The window to accept this booking has closed. Pull to refresh to see its final status.',
    paidAdvance: (amount: string) => `Customer has paid ${amount} advance.`,
    paidFull: (amount: string) => `Customer has paid ${amount} in full.`,
    cashDue: (amount: string) =>
      `${amount} advance is to be paid to you in cash.`,
    unpaid: 'The customer hasn’t paid an advance yet.',
    accept: 'Accept booking',
    accepting: 'Accepting…',
    decline: 'Decline',
    acceptTitle: 'Accept this booking?',
    acceptBody: (title: string, date: string) =>
      `You’re committing to ${title}${
        date ? ` on ${date}` : ''
      }. The customer is told right away.`,
    acceptConfirm: 'Accept',
    acceptCancel: 'Not now',
    accepted: 'Booking accepted. Add tasks to plan the event.',
    acceptFailed: 'Couldn’t accept the booking. Please try again.',
  },

  decline: {
    title: 'Decline this booking',
    body: 'Tell the customer why. They see this reason, and their advance is refunded.',
    label: 'Reason',
    placeholder: 'e.g. We’re already booked on this date',
    required: 'Please add a reason for the customer.',
    tooLong: `Keep the reason under ${REASON_MAX} characters.`,
    submit: 'Decline booking',
    declining: 'Declining…',
    cancel: 'Keep booking',
    confirmTitle: 'Decline for sure?',
    confirmBody: 'This can’t be undone. The customer will be refunded.',
    confirm: 'Decline',
    failed: 'Couldn’t decline the booking. Please try again.',
    close: 'Close',
  },

  board: {
    title: 'Tasks',
    progress: (done: number, total: number) => `${done} of ${total} done`,
    noTasks: 'No tasks yet',
    columns: {
      todo: 'To do',
      in_progress: 'In progress',
      done: 'Done',
    } as Record<TaskStatus, string>,
    empty: {
      todo: 'Nothing left to start.',
      in_progress: 'Nothing in progress.',
      done: 'Nothing finished yet.',
    } as Record<TaskStatus, string>,
    firstTitle: 'Plan the event with tasks',
    firstBody:
      'Catering, decor, photos — add each job, assign it to your team and track it here.',
    add: 'Add task',
    readOnly: 'This event is closed, so tasks can’t be changed.',
    unassigned: 'Not assigned',
    due: (when: string) => `Due ${when}`,
    proof: 'Photo proof',
    moveFailed: 'Couldn’t move the task. It’s back where it was.',
  },

  sheet: {
    newTitle: 'New task',
    editTitle: 'Edit task',
    title: 'What needs doing',
    titlePh: 'e.g. Confirm 300-plate catering',
    titleRequired: 'Give the task a name.',
    titleTooLong: `Keep the name under ${TITLE_MAX} characters.`,
    due: 'Due date',
    dueBlank: 'No due date',
    pickDue: 'Due date',
    assign: 'Who’s doing it',
    modes: { none: 'No one', subvendor: 'Sub-vendor', person: 'Someone else' },
    noSubvendors:
      'No sub-vendors in your team yet. Invite them from Sub-vendors, or type a name instead.',
    subvendorsFailed: 'Couldn’t load your team. You can type a name instead.',
    pickSubvendor: 'Choose who should do this.',
    person: 'Name',
    personPh: 'e.g. Ravi (decor helper)',
    personRequired: 'Type who is doing it.',
    amount: 'Pay for this task (₹)',
    amountPh: 'Optional',
    amountInvalid: 'Enter the amount in whole rupees.',
    amountHint:
      'What you’ll pay for this job. Only you and the assignee see it.',
    proof: 'Photo proof',
    proofNew: 'Save the task first, then add a photo.',
    proofAdd: 'Add photo',
    proofReplace: 'Replace photo',
    proofUploading: 'Uploading…',
    proofPick: 'Photo proof',
    proofFailed: 'Couldn’t upload the photo. Please try again.',
    reassignNote: 'Changing the sub-vendor sends them a new request to accept.',
    save: 'Save task',
    create: 'Add task',
    saving: 'Saving…',
    saveFailed: 'Couldn’t save the task. Please try again.',
    fixFields: 'Fix the highlighted fields.',
    delete: 'Delete task',
    deleteTitle: 'Delete this task?',
    deleteBody: (title: string) => `“${title}” will be removed from the board.`,
    deleteConfirm: 'Delete',
    deleteFailed: 'Couldn’t delete the task. Please try again.',
    keep: 'Keep',
    close: 'Close',
    discardTitle: 'Discard changes?',
    discardBody: 'What you changed in this task won’t be saved.',
    discard: 'Discard',
    keepEditing: 'Keep editing',
    clearDate: 'Clear due date',
    titleCount: (n: number) => `${n}/${TITLE_MAX}`,
  },

  complete: {
    title: 'All wrapped up?',
    body: 'Mark the event completed once it’s done. The customer is told and it moves to your past events.',
    action: 'Mark event completed',
    marking: 'Marking…',
    confirmTitle: 'Mark event completed?',
    confirmBody: 'This closes the event. Tasks can’t be changed afterwards.',
    openTasks: (n: number) =>
      n === 1 ? '1 task is still open. ' : `${n} tasks are still open. `,
    notYet: 'The event date hasn’t come yet. ',
    confirm: 'Mark completed',
    cancel: 'Not yet',
    done: 'Event marked completed.',
    failed: 'Couldn’t mark the event completed. Please try again.',
  },

  closed: {
    completed: {
      title: 'Event completed',
      body: 'Nicely done. This event is closed.',
    },
    cancelled: {
      title: 'Booking cancelled',
      body: 'This booking was cancelled and is now closed.',
    },
    rejected: {
      title: 'You declined this booking',
      body: 'The customer’s advance is refunded.',
    },
    expired: {
      title: 'Booking expired',
      body: 'It wasn’t accepted in time, so the customer’s advance is refunded.',
    },
    reason: 'Reason given',
  },

  links: {
    title: 'With your customer',
    invitation: 'Guest invitation',
    invitationSub: 'Build the invite and send it for approval',
    invitationPage: 'Guest invitation',
    ideas: 'Ideas board',
    ideasCount: (n: number) => (n === 1 ? '1 idea' : `${n} ideas`),
    ideasSub: 'Ideas and plans shared with the customer',
    ideasPage: 'Ideas & planning',
  },
} as const;

/** The tone of an assignment chip, or null when nobody needs to answer. */
export const assignmentChip = (status: AssignmentStatus): Chip | null =>
  status === 'unassigned' ? null : ASSIGNMENT_LOOK[status] ?? null;
