import { absoluteFileUrl } from '../../services/urls';
import { whenLabel } from '../Events/utils';
import { dateParts, formatInr, relativeDay } from '../Shared';
import {
  ACTIVE,
  AMOUNT_MAX_DIGITS,
  ASSIGNEE_MAX,
  AWAITING,
  CLOSED,
  EVENT_COPY as COPY,
  NEXT_MOVE,
  REASON_MAX,
  STATUS_LOOK,
  TASK_COLUMNS,
  TITLE_MAX,
  assignmentChip,
} from './constants';
import type {
  BookingDTO,
  BookingTaskDTO,
  CreateTaskBody,
  HeaderModel,
  MoneyLine,
  Permissions,
  RespondModel,
  StatusBody,
  SubVendorLinkDTO,
  SubVendorOption,
  TaskCardModel,
  TaskForm,
  TaskFormErrors,
  TaskProgress,
  TaskStatus,
  TaskUpdatePlan,
  UpdateTaskBody,
} from './types';

const HOUR = 3_600_000;

const time = (iso: string | null | undefined): number =>
  iso ? new Date(iso).getTime() : NaN;

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// ---- Permissions -----------------------------------------------------------

/**
 * What the organizer may do, mirroring the backend:
 *  - accept/decline: `pending | awaiting_organizer` (ALLOWED_TRANSITIONS) and
 *    the response deadline not yet passed (`expireIfOverdue` lapses it first);
 *  - complete: `confirmed | in_progress` → `completed` (ALLOWED_TRANSITIONS);
 *  - tasks: the API lets the owning organizer edit them in any status, but a
 *    closed booking (TERMINAL) is read-only here, as on the web.
 */
export function permissions(b: BookingDTO, now = Date.now()): Permissions {
  const awaiting = AWAITING.includes(b.status);
  const deadline = time(b.organizerRespondBy);
  const lapsed = awaiting && !Number.isNaN(deadline) && deadline <= now;
  const active = ACTIVE.includes(b.status);
  const closed = CLOSED.includes(b.status);
  return {
    canRespond: awaiting && !lapsed,
    respondLapsed: lapsed,
    showBoard: active || (closed && (b.tasks ?? []).length > 0),
    canEditTasks: active,
    canComplete: active,
    closed,
  };
}

// ---- Header & money --------------------------------------------------------

/** Total, then what is paid and what is still owed — from the payment fields. */
export function moneyLines(b: BookingDTO): MoneyLine[] {
  const total: MoneyLine = {
    key: 'total',
    label: COPY.money.total,
    value: formatInr(b.amount),
    settled: false,
  };
  if (b.paymentStatus === 'paid_in_full') {
    return [
      total,
      {
        key: 'balance',
        label: COPY.money.paidInFull,
        value: formatInr(b.amountPaid || b.amount),
        settled: true,
      },
    ];
  }
  const balance = Number.isFinite(b.balanceAmount)
    ? b.balanceAmount
    : Math.max(0, b.amount - b.advanceAmount);
  if (b.paymentStatus === 'advance_paid') {
    const paid = b.amountPaid || b.advanceAmount;
    return [
      total,
      {
        key: 'advance',
        label: COPY.money.advancePaid,
        value: formatInr(paid),
        settled: true,
      },
      {
        key: 'balance',
        label: COPY.money.balanceDue,
        value: formatInr(Math.max(0, b.amount - paid)),
        settled: false,
      },
    ];
  }
  return [
    total,
    {
      key: 'advance',
      label: COPY.money.advanceDue,
      value: formatInr(b.advanceAmount),
      settled: false,
    },
    {
      key: 'balance',
      label: COPY.money.balanceDue,
      value: formatInr(balance),
      settled: false,
    },
  ];
}

export function mapHeader(b: BookingDTO, now = new Date()): HeaderModel {
  const parts = dateParts(b.eventDate);
  return {
    title: b.title || b.occasion || COPY.fallbackTitle,
    customerName: b.customer?.name ?? '',
    location: b.location ?? '',
    day: parts?.day ?? '',
    month: parts?.month ?? '',
    weekday: parts?.weekday ?? '',
    when: whenLabel(b.eventDate, now),
    status: STATUS_LOOK[b.status] ?? { label: b.status, tone: 'grey' },
    money: moneyLines(b),
  };
}

// ---- Respond-by ------------------------------------------------------------

/** "45m", "18h", "2 days" left until the deadline; null once it has passed. */
export function countdown(
  iso: string | null,
  now = Date.now(),
): { text: string; urgent: boolean } | null {
  const left = time(iso) - now;
  if (Number.isNaN(left) || left <= 0) return null;
  if (left < HOUR) {
    return { text: `${Math.max(1, Math.ceil(left / 60_000))}m`, urgent: true };
  }
  const hours = Math.ceil(left / HOUR);
  if (hours < 48) return { text: `${hours}h`, urgent: hours <= 12 };
  return { text: `${Math.round(hours / 24)} days`, urgent: false };
}

/** "Fri, 31 Oct, 6:00 pm". */
export function deadlineLabel(iso: string | null): string {
  const t = time(iso);
  if (Number.isNaN(t)) return '';
  const d = new Date(t);
  const date = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const h = d.getHours();
  const m = d.getMinutes();
  const clock = `${h % 12 || 12}:${m < 10 ? `0${m}` : m} ${
    h < 12 ? 'am' : 'pm'
  }`;
  return `${date}, ${clock}`;
}

/** What the customer has paid, in a sentence for the respond card. */
export function paymentNote(b: BookingDTO): string {
  if (b.paymentStatus === 'paid_in_full') {
    return COPY.respond.paidFull(formatInr(b.amountPaid || b.amount));
  }
  if (b.paymentStatus === 'advance_paid') {
    return COPY.respond.paidAdvance(formatInr(b.amountPaid || b.advanceAmount));
  }
  if (b.advanceMethod === 'cash') {
    return COPY.respond.cashDue(formatInr(b.advanceAmount));
  }
  return COPY.respond.unpaid;
}

export function mapRespond(b: BookingDTO, now = Date.now()): RespondModel {
  const left = countdown(b.organizerRespondBy, now);
  const deadline = deadlineLabel(b.organizerRespondBy);
  return {
    countdown: left ? COPY.respond.left(left.text) : '',
    deadline: deadline ? COPY.respond.deadline(deadline) : '',
    urgent: left?.urgent ?? false,
    paymentNote: paymentNote(b),
  };
}

// ---- Tasks -----------------------------------------------------------------

export function groupTasks(
  tasks: BookingTaskDTO[] | null | undefined,
): Record<TaskStatus, BookingTaskDTO[]> {
  const out: Record<TaskStatus, BookingTaskDTO[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };
  for (const t of tasks ?? []) {
    (out[t.status] ?? out.todo).push(t);
  }
  return out;
}

export function columnCounts(
  tasks: BookingTaskDTO[] | null | undefined,
): Record<TaskStatus, number> {
  const g = groupTasks(tasks);
  return Object.fromEntries(TASK_COLUMNS.map(c => [c, g[c].length])) as Record<
    TaskStatus,
    number
  >;
}

export function taskProgress(
  tasks: BookingTaskDTO[] | null | undefined,
): TaskProgress {
  const list = tasks ?? [];
  const done = list.filter(t => t.status === 'done').length;
  const total = list.length;
  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0,
    label: total ? COPY.board.progress(done, total) : COPY.board.noTasks,
  };
}

/** The tab to open first: the earliest column with work in it. */
export function firstBusyColumn(
  tasks: BookingTaskDTO[] | null | undefined,
): TaskStatus {
  const counts = columnCounts(tasks);
  return TASK_COLUMNS.find(c => counts[c] > 0) ?? 'todo';
}

export function mapTask(t: BookingTaskDTO, now = new Date()): TaskCardModel {
  const dueTime = time(t.dueDate);
  const hasDue = !Number.isNaN(dueTime);
  return {
    id: t.id,
    title: t.title,
    status: t.status,
    assignee: t.assigneeName ?? '',
    assignment: t.subVendorId ? assignmentChip(t.assignmentStatus) : null,
    due: hasDue ? COPY.board.due(relativeDay(t.dueDate, now)) : '',
    overdue:
      hasDue &&
      t.status !== 'done' &&
      startOfDay(new Date(dueTime)) < startOfDay(now),
    amount: t.amount > 0 ? formatInr(t.amount) : '',
    proofUri: absoluteFileUrl(t.photoProof?.url),
    next: NEXT_MOVE[t.status] ?? NEXT_MOVE.todo,
  };
}

/** The booking with one task moved — the optimistic state. */
export function withTaskStatus(
  b: BookingDTO,
  taskId: string,
  status: TaskStatus,
): BookingDTO {
  return {
    ...b,
    tasks: b.tasks.map(t => (t.id === taskId ? { ...t, status } : t)),
  };
}

/** The booking without one task — the optimistic delete. */
export function withoutTask(b: BookingDTO, taskId: string): BookingDTO {
  return { ...b, tasks: b.tasks.filter(t => t.id !== taskId) };
}

/**
 * A mutation's response as the new state. Task routes return the booking
 * without populating the customer, so the one already on screen is kept.
 */
export function mergeBooking(
  prev: BookingDTO | null,
  next: BookingDTO,
): BookingDTO {
  return {
    ...next,
    tasks: Array.isArray(next.tasks) ? next.tasks : [],
    customer: next.customer ?? prev?.customer ?? null,
  };
}

/** Only sub-vendors whose link is active can be assigned (assertLinked). */
export function subVendorOptions(
  links: SubVendorLinkDTO[] | null | undefined,
): SubVendorOption[] {
  return (links ?? [])
    .filter(l => l.status === 'active' && l.subVendor)
    .map(l => ({
      id: l.subVendor!.id,
      name: l.subVendor!.fullName,
      initials:
        l.subVendor!.initials ||
        l.subVendor!.fullName.slice(0, 1).toUpperCase(),
      category: l.subVendor!.category ?? '',
    }));
}

// ---- Task form -------------------------------------------------------------

export const emptyTaskForm = (): TaskForm => ({
  title: '',
  dueDate: '',
  amount: '',
  mode: 'none',
  subVendorId: '',
  assigneeName: '',
});

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

/** A server date as the device's local `YYYY-MM-DD`. */
export function toLocalIso(iso: string | null | undefined): string {
  const t = time(iso);
  if (Number.isNaN(t)) return '';
  const d = new Date(t);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** A picked `YYYY-MM-DD` as noon local time, so no timezone shifts its day. */
export function fromLocalIso(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0).toISOString();
}

export function formFromTask(t: BookingTaskDTO): TaskForm {
  return {
    title: t.title,
    dueDate: toLocalIso(t.dueDate),
    amount: t.amount > 0 ? String(Math.round(t.amount)) : '',
    mode: t.subVendorId ? 'subvendor' : t.assigneeName ? 'person' : 'none',
    subVendorId: t.subVendorId ?? '',
    assigneeName: t.subVendorId ? '' : t.assigneeName ?? '',
  };
}

export const digitsOnly = (text: string) =>
  text.replace(/\D/g, '').slice(0, AMOUNT_MAX_DIGITS);

export function validateTaskForm(f: TaskForm): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const title = f.title.trim();
  if (!title) errors.title = COPY.sheet.titleRequired;
  else if (title.length > TITLE_MAX) errors.title = COPY.sheet.titleTooLong;
  if (f.mode === 'subvendor' && !f.subVendorId) {
    errors.subVendorId = COPY.sheet.pickSubvendor;
  }
  if (f.mode === 'person') {
    const name = f.assigneeName.trim();
    if (!name || name.length > ASSIGNEE_MAX) {
      errors.assigneeName = COPY.sheet.personRequired;
    }
  }
  if (f.amount && !/^\d+$/.test(f.amount))
    errors.amount = COPY.sheet.amountInvalid;
  return errors;
}

export const hasErrors = (e: object) => Object.values(e).some(Boolean);

/** Anything typed into a new task, or anything changed on an existing one. */
export function isTaskFormDirty(
  form: TaskForm,
  task: BookingTaskDTO | null,
): boolean {
  const base = task ? formFromTask(task) : emptyTaskForm();
  return (Object.keys(base) as Array<keyof TaskForm>).some(
    k => form[k].trim() !== base[k].trim(),
  );
}

/** `POST /booking/:id/tasks` from the form. */
export function createTaskBody(f: TaskForm): CreateTaskBody {
  const body: CreateTaskBody = { title: f.title.trim() };
  if (f.dueDate) body.dueDate = fromLocalIso(f.dueDate);
  if (f.mode === 'subvendor' && f.subVendorId) body.subVendorId = f.subVendorId;
  if (f.mode === 'person' && f.assigneeName.trim()) {
    body.assigneeName = f.assigneeName.trim();
  }
  if (f.amount) body.amount = Number(f.amount);
  return body;
}

/**
 * `PATCH /booking/:id/tasks/:taskId` with only what changed.
 *
 * One backend quirk shapes this: a PATCH carrying `subVendorId: null` clears
 * the sub-vendor but ignores an `assigneeName` sent with it. Moving a task
 * from a sub-vendor to a typed name therefore takes a second PATCH.
 */
export function updateTaskPlan(
  f: TaskForm,
  task: BookingTaskDTO,
): TaskUpdatePlan {
  const body: UpdateTaskBody = {};
  let followUp: UpdateTaskBody | null = null;
  const title = f.title.trim();
  if (title !== task.title) body.title = title;

  if (f.dueDate && f.dueDate !== toLocalIso(task.dueDate)) {
    body.dueDate = fromLocalIso(f.dueDate);
  }

  const amount = f.amount ? Number(f.amount) : 0;
  if (amount !== (task.amount || 0)) body.amount = amount;

  const name = f.assigneeName.trim();
  if (f.mode === 'subvendor') {
    if (f.subVendorId && f.subVendorId !== task.subVendorId) {
      body.subVendorId = f.subVendorId;
    }
  } else if (task.subVendorId) {
    body.subVendorId = null;
    if (f.mode === 'person' && name) followUp = { assigneeName: name };
  } else {
    const wanted = f.mode === 'person' ? name : '';
    if (wanted !== (task.assigneeName ?? '')) body.assigneeName = wanted;
  }
  return { body, followUp };
}

// ---- Booking status --------------------------------------------------------

export const acceptBody = (): StatusBody => ({ status: 'confirmed' });
export const completeBody = (): StatusBody => ({ status: 'completed' });
export const declineBody = (reason: string): StatusBody => ({
  status: 'rejected',
  note: reason.trim(),
});

/** The decline reason is required here — the customer reads it. */
export function validateReason(reason: string): string | null {
  const text = reason.trim();
  if (!text) return COPY.decline.required;
  if (text.length > REASON_MAX) return COPY.decline.tooLong;
  return null;
}

/** The extra line in the completion confirm: open tasks, or a future date. */
export function completeWarning(b: BookingDTO, now = new Date()): string {
  const open = (b.tasks ?? []).filter(t => t.status !== 'done').length;
  const t = time(b.eventDate);
  const future = !Number.isNaN(t) && startOfDay(new Date(t)) > startOfDay(now);
  return `${future ? COPY.complete.notYet : ''}${
    open ? COPY.complete.openTasks(open) : ''
  }`.trim();
}

/** The ideas card's subtitle count; '' when the counts are unknown. */
export function ideasCountLabel(
  counts: { shared: number } | null | undefined,
): string {
  if (!counts || !Number.isFinite(counts.shared)) return '';
  return COPY.links.ideasCount(counts.shared);
}

/** The server's own words when it gives some, else the fallback. */
export function errorMessage(error: unknown, fallback: string): string {
  const message = (error as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) {
    const first = message.find(m => typeof m === 'string' && m.trim());
    return typeof first === 'string' ? first : fallback;
  }
  return typeof message === 'string' && message.trim() ? message : fallback;
}

/** Bad id, not this organizer's, or gone — all read as "not found". */
export function isNotFound(error: { status?: number } | null): boolean {
  return [400, 403, 404].includes(error?.status ?? 0);
}
