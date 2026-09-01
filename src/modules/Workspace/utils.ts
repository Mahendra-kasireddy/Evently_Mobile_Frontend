import {
  PAYMENT_STATUS_LABEL,
  TASK_STATUS_LABEL,
  WORKSPACE_COPY,
  WORKSPACE_STATUS_LABEL,
} from './constants';
import type {
  BookingDetailDTO,
  TaskStatus,
  WorkspaceFact,
  WorkspaceTask,
  WorkspaceTimelineEntry,
  WorkspaceViewModel,
} from './types';

/** "12 December 2026" — the spelling used elsewhere in the app. */
function dateLabel(value: string | null | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** "12 Dec 2026, 14:30" — for timeline entries, where the time matters. */
function dateTimeLabel(value: string | null | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString(
    'en-GB',
    { hour: '2-digit', minute: '2-digit' },
  )}`;
}

/**
 * Indian-format currency, e.g. ₹1,20,000. Returns '' for a missing amount so
 * the row is dropped rather than showing ₹0 for a figure nobody has set.
 */
export function formatINR(amount: number | undefined): string {
  if (!Number.isFinite(amount) || (amount as number) <= 0) return '';
  return `₹${Math.round(amount as number).toLocaleString('en-IN')}`;
}

function titleize(value: string): string {
  const t = (value ?? '').trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
}

const TASK_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'done', 'blocked'];

/**
 * The booking as the workspace screen renders it.
 *
 * Every value comes from GET /booking/:id. A field the booking does not carry
 * produces no row at all — the facts list, the payment lines and the task
 * meta are each filtered — rather than a row reading "—" or "₹0", which the
 * customer would read as a real figure.
 */
export function mapWorkspace(dto: BookingDetailDTO): WorkspaceViewModel {
  const occasion = titleize(dto.occasion);
  const eventDate = dateLabel(dto.eventDate);

  const facts: WorkspaceFact[] = [
    { icon: 'calendar-blank-outline', label: 'When', value: eventDate },
    { icon: 'map-marker-outline', label: 'Where', value: dto.location ?? '' },
    { icon: 'account-tie-outline', label: 'Organizer', value: dto.organizer?.name ?? '' },
    { icon: 'pound', label: 'Reference', value: dto.ref ?? '' },
  ].filter((f) => !!f.value);

  const amount = dto.amount ?? 0;
  const paid = dto.amountPaid ?? 0;

  const tasks: WorkspaceTask[] = (dto.tasks ?? []).map((t) => {
    const status = TASK_STATUSES.includes(t.status) ? t.status : 'pending';
    const due = dateLabel(t.dueDate);
    return {
      id: t.id,
      title: t.title,
      status,
      statusLabel: TASK_STATUS_LABEL[status],
      assigneeName: t.assigneeName ?? '',
      amountLabel: formatINR(t.amount),
      dueLabel: due ? `Due ${due}` : '',
    };
  });

  const timeline: WorkspaceTimelineEntry[] = (dto.timeline ?? [])
    .map((entry, i) => ({
      id: `${entry.at ?? ''}-${i}`,
      label: entry.label ?? '',
      note: entry.note ?? '',
      atLabel: dateTimeLabel(entry.at),
    }))
    .filter((entry) => !!entry.label)
    // Newest first: the customer opens this to see what just happened.
    .reverse();

  return {
    id: dto.id,
    ref: dto.ref,
    workspaceName: occasion ? `Your ${occasion.toLowerCase()} workspace` : WORKSPACE_COPY.fallbackName,
    title: dto.title || occasion || WORKSPACE_COPY.fallbackName,
    status: dto.status,
    statusLabel: WORKSPACE_STATUS_LABEL[dto.status] ?? '',
    progress: Math.min(100, Math.max(0, Math.round(dto.progress ?? 0))),
    // 0 is a real answer ("today"); a booking with no date has none at all.
    daysToGo: dto.eventDate ? (dto.daysToGo ?? 0) : null,
    steps: dto.steps ?? [],
    facts,
    payment: {
      totalLabel: formatINR(amount),
      paidLabel: formatINR(paid),
      dueLabel: formatINR(dto.balanceAmount ?? Math.max(0, amount - paid)),
      statusLabel: PAYMENT_STATUS_LABEL[dto.paymentStatus] ?? '',
      paidPercent: amount > 0 ? Math.min(100, Math.round((paid / amount) * 100)) : 0,
    },
    tasks,
    timeline,
    organizerName: dto.organizer?.name ?? null,
    customerName: dto.customer?.name ?? null,
  };
}

/**
 * How the workspace's back button should reach My Bookings, given the stack it
 * finds itself on.
 *
 * Opened from a bookings row, back is a plain pop. Opened from Home,
 * `navigate('Bookings')` would PUSH the list on top of the workspace, so the
 * list's own back button would come straight back here — a loop. Replacing the
 * workspace instead leaves Home → Bookings, which backs out to Home.
 */
export function workspaceBackAction(routeNames: ReadonlyArray<string>): 'goBack' | 'replace' {
  return routeNames[routeNames.length - 2] === 'Bookings' ? 'goBack' : 'replace';
}
