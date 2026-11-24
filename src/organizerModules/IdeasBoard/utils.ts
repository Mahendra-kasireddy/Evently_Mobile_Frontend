import { absoluteFileUrl } from '../../services/urls';
import { initials, plannedPercent } from '../../modules/Workspace/constants';
import type { StoredFile } from '../Shared';
import {
  APPROVAL_LABEL_MAX,
  FILTERS,
  IDEAS_COPY as COPY,
  PLAN_STATUSES,
  PLAN_STATUS_LABEL,
  POST_TYPES,
  TEXT_MAX,
  VISION_SLOTS,
  VISION_SLOT_MAX,
} from './constants';
import type {
  BoardVisionDTO,
  FilterChip,
  IdeaBoardDTO,
  IdeaCardModel,
  IdeaCounts,
  IdeaDTO,
  IdeaImageDTO,
  IdeasFilter,
  OrganizerPostBody,
  PhotoModel,
  PostDraft,
  ProgressModel,
  ReplyBody,
  ReplyForm,
  ReplyFormErrors,
  VisionBody,
  VisionForm,
  VisionFormErrors,
  VisionRowModel,
} from './types';

export { initials };

// ---- Filters -----------------------------------------------------------------

/** Does this post belong in the given filter? */
export function matchesFilter(idea: IdeaDTO, filter: IdeasFilter): boolean {
  switch (filter) {
    case 'toReply':
      return idea.authorRole === 'customer' && !idea.reply;
    case 'waiting':
      return idea.approval === 'pending';
    case 'approved':
      return idea.approval === 'approved';
    case 'questions':
      return idea.type === 'question';
    default:
      return true;
  }
}

export function filterIdeas(items: IdeaDTO[], filter: IdeasFilter): IdeaDTO[] {
  return items.filter(i => matchesFilter(i, filter));
}

/**
 * The chips worth showing. A filter that would show nothing is left out — "All"
 * and the one selected always stay — and a row of just "All" is no row at all.
 */
export function filterChips(
  items: IdeaDTO[],
  selected: IdeasFilter,
): FilterChip[] {
  const chips = FILTERS.map(f => ({
    value: f.value,
    label: f.label,
    count: filterIdeas(items, f.value).length,
  })).filter(c => c.value === 'all' || c.value === selected || c.count > 0);
  return chips.length > 1 ? chips : [];
}

// ---- Counts & progress -------------------------------------------------------

/** The server's counts, recomputed after a mutation (IdeaService.counts). */
export function countsFor(items: IdeaDTO[]): IdeaCounts {
  const fromCustomer = items.filter(d => d.authorRole === 'customer');
  return {
    shared: fromCustomer.length,
    planned: fromCustomer.filter(d => !!d.reply).length,
    awaitingApproval: items.filter(d => d.approval === 'pending').length,
  };
}

export function progressModel(
  counts: IdeaCounts,
  items: IdeaDTO[],
): ProgressModel {
  return {
    shared: counts.shared,
    planned: counts.planned,
    waiting: counts.awaitingApproval,
    approved: items.filter(i => i.approval === 'approved').length,
    plannedPercent: plannedPercent(counts.planned, counts.shared),
    summary: COPY.progress.summary(counts.planned, counts.shared),
  };
}

// ---- Board state -------------------------------------------------------------

/**
 * A post the server just returned, folded into the board: replaces the post
 * with the same id, or goes on top (the feed is newest first). Counts are
 * recomputed so the progress card moves with it.
 */
export function mergeIdea(board: IdeaBoardDTO, idea: IdeaDTO): IdeaBoardDTO {
  const exists = board.items.some(i => i.id === idea.id);
  const items = exists
    ? board.items.map(i => (i.id === idea.id ? idea : i))
    : [idea, ...board.items];
  return { ...board, items, counts: countsFor(items) };
}

/** A board response with every list and field defaulted. */
export function normalizeBoard(
  dto: Partial<IdeaBoardDTO> | null,
): IdeaBoardDTO {
  const items = Array.isArray(dto?.items)
    ? dto!.items.map(i => ({ ...i, images: i.images ?? [] }))
    : [];
  const v = dto?.vision;
  return {
    items,
    counts: dto?.counts ?? countsFor(items),
    vision: {
      theme: v?.theme ?? '',
      vibe: v?.vibe ?? '',
      surprise: v?.surprise ?? '',
      food: v?.food ?? '',
      surpriseConfidential: v?.surpriseConfidential ?? true,
      captured: v?.captured ?? false,
    },
  };
}

// ---- Cards -------------------------------------------------------------------

/** Stored photos as image sources — every URL absolutised. */
export function mapPhotos(
  images: IdeaImageDTO[] | null | undefined,
): PhotoModel[] {
  return (images ?? [])
    .map((image, i) => ({
      key: image.key || `${image.url}-${i}`,
      uri: absoluteFileUrl(image.url),
      label: image.originalName || 'Reference photo',
    }))
    .filter(p => !!p.uri);
}

export function mapIdea(idea: IdeaDTO, now = Date.now()): IdeaCardModel {
  const fromOrganizer = idea.authorRole === 'organizer';
  const name =
    idea.authorName?.trim() ||
    (fromOrganizer ? COPY.feed.organizerFallback : COPY.feed.customerFallback);
  const ago = (iso: string | null | undefined) =>
    iso ? relativeAt(iso, now) : '';
  return {
    id: idea.id,
    fromOrganizer,
    authorName: name,
    initials: initials(name),
    timeAgo: ago(idea.createdAt),
    type: idea.type,
    text: idea.text,
    photos: mapPhotos(idea.images),
    confidential: !!idea.confidential,
    approval:
      idea.approval === 'pending'
        ? {
            tone: 'waiting',
            label: idea.approvalLabel
              ? `${COPY.feed.waiting} · ${idea.approvalLabel}`
              : COPY.feed.waiting,
          }
        : idea.approval === 'approved'
        ? {
            tone: 'approved',
            label: idea.approvedAt
              ? `${COPY.feed.approved} · ${ago(idea.approvedAt)}`
              : COPY.feed.approved,
          }
        : null,
    reply: idea.reply
      ? {
          status: idea.reply.status,
          statusLabel:
            PLAN_STATUS_LABEL[idea.reply.status] ?? PLAN_STATUS_LABEL.planned,
          text: idea.reply.text,
          timeAgo: ago(idea.reply.at),
        }
      : null,
    replyCta: idea.reply
      ? COPY.feed.updateCta
      : fromOrganizer
      ? COPY.feed.askCta
      : COPY.feed.replyCta,
  };
}

/** The customer board's relativeTime, against a fixed "now" so it can be tested. */
function relativeAt(iso: string, now: number): string {
  const diff = now - new Date(iso).getTime();
  if (Number.isNaN(diff)) return '';
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

// ---- Composer ----------------------------------------------------------------

/** What /upload returned, as a post stores it. */
export function toIdeaImage(
  file: StoredFile,
  fallbackName: string,
): IdeaImageDTO {
  return {
    url: file.url,
    key: file.key ?? '',
    originalName: file.originalName || fallbackName,
  };
}

export function validatePostText(text: string): string | null {
  const t = text.trim();
  if (!t) return COPY.composer.textRequired;
  if (t.length > TEXT_MAX) return COPY.composer.textTooLong(TEXT_MAX);
  return null;
}

/** The POST body, or the reason it can't be sent. */
export function buildPostBody(
  draft: PostDraft,
): { body: OrganizerPostBody; error: null } | { body: null; error: string } {
  const error = validatePostText(draft.text);
  if (error) return { body: null, error };
  return {
    body: {
      text: draft.text.trim(),
      type: POST_TYPES.includes(draft.type) ? draft.type : 'update',
      images: draft.images.map(i => ({
        url: i.url,
        key: i.key ?? '',
        originalName: i.originalName ?? '',
      })),
    },
    error: null,
  };
}

/** How many more photos may be attached. */
export function photosLeft(attached: number, max: number): number {
  return Math.max(0, max - attached);
}

// ---- Reply -------------------------------------------------------------------

/** The reply form for a post — its current reply, if it has one. */
export function replyFormFor(idea: IdeaDTO): ReplyForm {
  return {
    status: idea.reply?.status ?? 'planned',
    text: idea.reply?.text ?? '',
    askApproval: false,
    approvalLabel: '',
  };
}

export function validateReplyForm(form: ReplyForm): ReplyFormErrors {
  const errors: ReplyFormErrors = {};
  const text = form.text.trim();
  if (!text) errors.text = COPY.reply.textRequired;
  else if (text.length > TEXT_MAX)
    errors.text = COPY.reply.textTooLong(TEXT_MAX);
  if (form.askApproval) {
    const label = form.approvalLabel.trim();
    if (!label) errors.approvalLabel = COPY.reply.approvalRequired;
    else if (label.length > APPROVAL_LABEL_MAX) {
      errors.approvalLabel = COPY.reply.approvalTooLong(APPROVAL_LABEL_MAX);
    }
  }
  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.values(errors).some(Boolean);
}

/** ReplyIdeaDto — `approvalLabel` only when the customer is being asked. */
export function buildReplyBody(form: ReplyForm): ReplyBody {
  const body: ReplyBody = {
    status: PLAN_STATUSES.includes(form.status) ? form.status : 'planned',
    text: form.text.trim(),
  };
  const label = form.approvalLabel.trim();
  if (form.askApproval && label) body.approvalLabel = label;
  return body;
}

// ---- Vision ------------------------------------------------------------------

export function visionFormFrom(vision: BoardVisionDTO): VisionForm {
  return {
    theme: vision.theme ?? '',
    vibe: vision.vibe ?? '',
    surprise: vision.surprise ?? '',
    food: vision.food ?? '',
    surpriseConfidential: vision.surpriseConfidential ?? true,
  };
}

export function validateVisionForm(form: VisionForm): VisionFormErrors {
  const errors: VisionFormErrors = {};
  for (const slot of VISION_SLOTS) {
    if (form[slot.key].trim().length > VISION_SLOT_MAX) {
      errors[slot.key] = COPY.vision.tooLong(VISION_SLOT_MAX);
    }
  }
  return errors;
}

/**
 * UpdateVisionDto: only what changed. Fields left out are untouched on the
 * server, and an emptied slot is sent as '' — which clears it.
 */
export function buildVisionBody(
  form: VisionForm,
  current: BoardVisionDTO,
): VisionBody {
  const body: VisionBody = {};
  for (const slot of VISION_SLOTS) {
    const next = form[slot.key].trim();
    if (next !== (current[slot.key] ?? '').trim()) body[slot.key] = next;
  }
  if (form.surpriseConfidential !== current.surpriseConfidential) {
    body.surpriseConfidential = form.surpriseConfidential;
  }
  return body;
}

export function visionRows(vision: BoardVisionDTO): VisionRowModel[] {
  return VISION_SLOTS.map(slot => ({
    key: slot.key,
    label: slot.label,
    icon: slot.icon,
    value: (vision[slot.key] ?? '').trim(),
    locked:
      slot.key === 'surprise' &&
      vision.surpriseConfidential &&
      !!vision.surprise?.trim(),
  }));
}

// ---- Errors ------------------------------------------------------------------

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
