/**
 * Pure helpers for the invitation editor: mapping the server's answer onto the
 * hub and the forms, validating, and building PATCH bodies that carry only
 * what changed. Nothing here touches React or the network.
 */
import type { InvitationDTO } from '../../modules/Invitation/types';
import { absoluteFileUrl } from '../../services/urls';
import {
  DEFAULT_TIMEZONE,
  INVITATION_COPY as COPY,
  LIMITS,
  SECTION_META,
  SECTION_ORDER,
  VIDEO_EXTENSIONS,
  VIDEO_TYPES,
} from './constants';
import type {
  ChangeRequestModel,
  CountdownForm,
  CountdownTarget,
  DetailsErrors,
  DetailsForm,
  HubModel,
  InvitationDetailsDTO,
  InvitationPhase,
  InvitationSubEventDTO,
  OrganizerInvitationDTO,
  PickedFile,
  ProgressStep,
  SectionCardModel,
  SendModel,
  StoryCardForm,
  StoryCardInput,
  StoryForm,
  SubEventErrors,
  SubEventForm,
  SubEventInput,
  UpdateInvitationBody,
} from './types';

/* ---- Small formatters ----------------------------------------------------- */

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export const isTime = (value: string): boolean => TIME_RE.test(value);
export const isDay = (value: string): boolean => DAY_RE.test(value);

/** Typing help for HH:MM: "1930" → "19:30", stray characters dropped. */
export function normalizeTimeText(text: string): string {
  const cleaned = text.replace(/[^\d:]/g, '');
  if (cleaned.includes(':')) {
    const at = cleaned.indexOf(':');
    const h = cleaned.slice(0, at).replace(/\D/g, '').slice(0, 2);
    const m = cleaned
      .slice(at + 1)
      .replace(/\D/g, '')
      .slice(0, 2);
    return `${h}:${m}`;
  }
  const digits = cleaned.slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}:${digits.slice(2)}`
    : digits;
}

/** `yyyy-mm-dd` → "Sat, 14 Nov 2026"; '' for anything else. */
export function dayLabel(day: string | null | undefined): string {
  const match = DAY_RE.exec(day ?? '');
  if (!match) return '';
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  ).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** `18:30` → "6:30 PM"; '' when not a time. */
export function clockLabel(time: string | null | undefined): string {
  if (!time || !isTime(time)) return '';
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** "Asia/Kolkata" → "Asia/Kolkata" without underscores, for reading. */
export const zoneLabel = (zone: string): string => zone.replace(/_/g, ' ');

/** 135 → "2:15"; '' when unknown. */
export function lengthLabel(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '';
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** An ISO instant → "14 Nov"; '' when missing. */
export function shortDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** The server's sentence (class-validator sends a list), or a fallback. */
export function errorText(error: unknown, fallback: string): string {
  const message = (error as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) {
    const joined = message.filter(m => typeof m === 'string').join(' ');
    return joined || fallback;
  }
  return typeof message === 'string' && message.trim() ? message : fallback;
}

/** 404 / 403 / bad id: the booking is not this organizer's to open. */
export function isNotFound(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;
  return status === 404 || status === 403;
}

/** Move one item to a position, clamped to the list. Same list if no move. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  const target = Math.max(0, Math.min(list.length - 1, to));
  if (from < 0 || from >= list.length || from === target) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(target, 0, moved as T);
  return next;
}

/* ---- Limits --------------------------------------------------------------- */

/** The server's own bounds where it sends them, the mirrors otherwise. */
export function limitsOf(dto: OrganizerInvitationDTO | null | undefined) {
  return {
    heroVideoSeconds: dto?.limits?.heroVideoSeconds || LIMITS.heroVideoSeconds,
    welcomeMessage: dto?.limits?.welcomeMessage || LIMITS.welcomeMessage,
    storyCards: dto?.limits?.storyCards || LIMITS.storyCards,
    storyCaption: dto?.limits?.storyCaption || LIMITS.storyCaption,
  };
}

/* ---- Hub ------------------------------------------------------------------ */

/** The uploaded invitation, if there is one (half a record is not one). */
export function artworkOf(
  details: InvitationDetailsDTO | null | undefined,
): { kind: 'image' | 'video'; seconds: number } | null {
  const url = (details?.heroMediaUrl ?? '').trim();
  const kind = details?.heroMediaType ?? '';
  if (!url || (kind !== 'image' && kind !== 'video')) return null;
  return { kind, seconds: details?.heroMediaDurationSec ?? 0 };
}

/** Draft, waiting, changes asked, or approved — open asks win. */
export function phaseOf(dto: OrganizerInvitationDTO): InvitationPhase {
  if ((dto.changeRequests ?? []).length > 0 && dto.status !== 'draft')
    return 'changes';
  return dto.status;
}

/** The web editor's three steps: uploaded, sent, approved. */
export function progressSteps(dto: OrganizerInvitationDTO): ProgressStep[] {
  return [
    {
      key: 'uploaded',
      label: COPY.steps.uploaded,
      done: artworkOf(dto.details) !== null,
    },
    { key: 'sent', label: COPY.steps.sent, done: dto.status !== 'draft' },
    {
      key: 'approved',
      label: COPY.steps.approved,
      done: dto.status === 'approved',
    },
  ];
}

/**
 * The one main action. The backend accepts a send at any time; the app offers
 * it when it would tell the customer something new — a first send, an answer
 * to their asks, or saved edits they have not seen — and only once there is
 * an invitation design to approve (the web editor's rule).
 */
export function sendModel(dto: OrganizerInvitationDTO): SendModel {
  const phase = phaseOf(dto);
  if (!artworkOf(dto.details)) {
    return {
      canSend: false,
      label: dto.status === 'draft' ? COPY.send : COPY.sendUpdate,
      hint: COPY.sendNeedsArtwork,
      confirmBody: COPY.confirmSendBody,
    };
  }
  if (phase === 'draft') {
    return {
      canSend: true,
      label: COPY.send,
      hint: '',
      confirmBody: COPY.confirmSendBody,
    };
  }
  if (phase === 'changes') {
    return {
      canSend: true,
      label: COPY.resend,
      hint: '',
      confirmBody: COPY.confirmResendBody,
    };
  }
  if (dto.hasUnsentChanges) {
    return {
      canSend: true,
      label: COPY.sendUpdate,
      hint: '',
      confirmBody: COPY.confirmResendBody,
    };
  }
  return {
    canSend: false,
    label: COPY.sendUpdate,
    hint: COPY.sendNothingNew,
    confirmBody: COPY.confirmResendBody,
  };
}

/** The template's name, for the Details card line. */
function templateLabel(dto: OrganizerInvitationDTO): string {
  const id = dto.details.template ?? '';
  return (dto.templates ?? []).find(t => t.id === id)?.label ?? '';
}

/** Each section, with whether it is done and the one line that says so. */
export function sectionCards(dto: OrganizerInvitationDTO): SectionCardModel[] {
  const d = dto.details;
  const card = (
    id: SectionCardModel['id'],
    line: string,
    state: SectionCardModel['state'],
  ): SectionCardModel => ({
    id,
    title: SECTION_META[id].title,
    icon: SECTION_META[id].icon,
    line,
    state,
  });

  const artwork = artworkOf(d);
  const stories = (dto.storyCards ?? []).length;
  const events = dto.subEvents ?? [];
  const unnamed = events.some(e => !(e.name ?? '').trim());
  const countdown = dto.countdown;

  const byId: Record<SectionCardModel['id'], SectionCardModel> = {
    artwork: artwork
      ? card(
          'artwork',
          artwork.kind === 'video'
            ? COPY.card.artworkVideo(lengthLabel(artwork.seconds))
            : COPY.card.artworkImage,
          'done',
        )
      : card('artwork', COPY.card.artworkNone, 'todo'),
    details:
      (d.hostOne ?? '').trim() && isDay(d.eventDate ?? '')
        ? card(
            'details',
            COPY.card.detailsDone(templateLabel(dto), dayLabel(d.eventDate)),
            'done',
          )
        : card('details', COPY.card.detailsTodo, 'todo'),
    story:
      stories > 0
        ? card('story', COPY.card.storyCount(stories), 'done')
        : card('story', COPY.card.storyNone, 'optional'),
    dates:
      events.length === 0
        ? card('dates', COPY.card.datesNone, 'optional')
        : unnamed
        ? card('dates', COPY.card.datesUnnamed, 'todo')
        : card('dates', COPY.card.datesCount(events.length), 'done'),
    countdown: countdown?.startsAt
      ? card(
          'countdown',
          COPY.card.countdownTo(
            countdown.subEventId && countdown.name
              ? countdown.name
              : COPY.card.countdownWhole,
          ),
          'done',
        )
      : card('countdown', COPY.card.countdownNone, 'todo'),
    memories: card('memories', COPY.card.memories, 'info'),
  };
  return SECTION_ORDER.map(id => byId[id]);
}

export function requestModels(
  dto: OrganizerInvitationDTO,
): ChangeRequestModel[] {
  return (dto.changeRequests ?? [])
    .filter(r => !r.resolved)
    .map(r => ({
      id: r.id,
      title: r.blockTitle || COPY.asksWhole,
      note: r.note,
      when: shortDate(r.at),
    }));
}

export function mapHub(dto: OrganizerInvitationDTO): HubModel {
  const phase = phaseOf(dto);
  return {
    phase,
    phaseLabel: COPY.phase[phase],
    phaseBody: COPY.phaseBody[phase],
    unsentNote:
      dto.hasUnsentChanges && dto.status !== 'draft' && phase !== 'changes'
        ? COPY.unsent
        : '',
    steps: progressSteps(dto),
    sections: sectionCards(dto),
    send: sendModel(dto),
    requests: requestModels(dto),
  };
}

/* ---- Details -------------------------------------------------------------- */

const DETAIL_KEYS: Array<keyof DetailsForm> = [
  'template',
  'fontStyle',
  'eyebrow',
  'hostOne',
  'joiner',
  'hostTwo',
  'eventDate',
  'eventTime',
  'timezone',
  'venueName',
  'venueAddress',
  'message',
];

export function detailsFormFrom(dto: OrganizerInvitationDTO): DetailsForm {
  const d = dto.details;
  return {
    template: d.template || dto.templates?.[0]?.id || '',
    fontStyle: d.fontStyle ?? '',
    eyebrow: d.eyebrow ?? '',
    hostOne: d.hostOne ?? '',
    joiner: d.joiner ?? '',
    hostTwo: d.hostTwo ?? '',
    eventDate: d.eventDate ?? '',
    eventTime: d.eventTime ?? '',
    timezone: d.timezone || DEFAULT_TIMEZONE,
    venueName: d.venueName ?? '',
    venueAddress: d.venueAddress ?? '',
    message: d.message ?? '',
  };
}

/** Only the fields that changed, trimmed — `{}` when nothing did. */
export function detailsPatch(
  baseline: DetailsForm,
  form: DetailsForm,
): UpdateInvitationBody {
  const details: Partial<InvitationDetailsDTO> = {};
  for (const key of DETAIL_KEYS) {
    const next = form[key].trim();
    if (next !== baseline[key].trim()) details[key] = next;
  }
  return Object.keys(details).length ? { details } : {};
}

export function validateDetails(
  form: DetailsForm,
  welcomeMax: number = LIMITS.welcomeMessage,
): DetailsErrors {
  const errors: DetailsErrors = {};
  if (form.eventDate && !isDay(form.eventDate))
    errors.eventDate = COPY.pickDate;
  if (form.eventTime && !isTime(form.eventTime))
    errors.eventTime = COPY.timeInvalid;
  if (form.message.trim().length > welcomeMax)
    errors.message = COPY.count(form.message.trim().length, welcomeMax);
  return errors;
}

/* ---- Story ---------------------------------------------------------------- */

export function storyCardForm(
  key: string,
  imageUrl: string,
  imageKey: string,
  caption = '',
): StoryCardForm {
  return { key, imageUrl, imageKey, uri: absoluteFileUrl(imageUrl), caption };
}

export function storyFormFrom(dto: OrganizerInvitationDTO): StoryForm {
  const cards = [...(dto.storyCards ?? [])]
    .sort((a, b) => a.order - b.order)
    .map((c, i) =>
      storyCardForm(
        c.id || `card-${i}`,
        c.imageUrl,
        c.imageKey ?? '',
        c.caption,
      ),
    );
  return { title: dto.details.storyTitle ?? '', cards };
}

const storyInputs = (cards: StoryCardForm[]): StoryCardInput[] =>
  cards.map(c => ({
    imageUrl: c.imageUrl,
    ...(c.imageKey ? { imageKey: c.imageKey } : {}),
    caption: c.caption.trim(),
  }));

/**
 * The story's PATCH: the whole card list when any card was added, removed,
 * moved or re-captioned (the API replaces the list), and the title when it
 * changed. `{}` when nothing did.
 */
export function storyPatch(
  baseline: StoryForm,
  form: StoryForm,
): UpdateInvitationBody {
  const body: UpdateInvitationBody = {};
  const before = storyInputs(baseline.cards);
  const after = storyInputs(form.cards);
  if (JSON.stringify(before) !== JSON.stringify(after)) body.storyCards = after;
  if (form.title.trim() !== baseline.title.trim())
    body.details = { storyTitle: form.title.trim() };
  return body;
}

/** The first problem with the story, worded for the organizer, or ''. */
export function validateStory(
  form: StoryForm,
  limits: { storyCards: number; storyCaption: number } = LIMITS,
): string {
  if (form.cards.length > limits.storyCards)
    return COPY.storyFull(limits.storyCards);
  const long = form.cards.findIndex(
    c => c.caption.trim().length > limits.storyCaption,
  );
  if (long >= 0) return COPY.storyCaptionLong(long + 1, limits.storyCaption);
  if (form.title.trim().length > LIMITS.storyTitle)
    return COPY.count(form.title.trim().length, LIMITS.storyTitle);
  return '';
}

/* ---- Save the date -------------------------------------------------------- */

export function subEventFormFrom(
  e: InvitationSubEventDTO,
  fallbackZone: string,
  key: string,
): SubEventForm {
  return {
    key,
    id: e.id ?? '',
    name: e.name ?? '',
    eventDate: e.eventDate ?? '',
    eventTime: e.eventTime ?? '',
    endTime: e.endTime ?? '',
    timezone: e.timezone || fallbackZone || DEFAULT_TIMEZONE,
    venueName: e.venueName ?? '',
    venueAddress: e.venueAddress ?? '',
    dressCode: e.dressCode ?? '',
    note: e.note ?? '',
    colour: e.colour ?? '',
    visibility: e.visibility ?? 'all',
    groups: e.groups ?? [],
    liveEnabled: e.liveEnabled ?? false,
    liveTitle: e.liveTitle ?? '',
    liveUrl: e.liveUrl ?? '',
    live360Url: e.live360Url ?? '',
    liveVrUrl: e.liveVrUrl ?? '',
  };
}

export function subEventsFormFrom(dto: OrganizerInvitationDTO): SubEventForm[] {
  const zone = dto.details.timezone || DEFAULT_TIMEZONE;
  return (dto.subEvents ?? []).map((e, i) =>
    subEventFormFrom(e, zone, e.id || `event-${i}`),
  );
}

export function emptySubEvent(zone: string, key: string): SubEventForm {
  return subEventFormFrom(
    {
      id: '',
      name: '',
      eventDate: '',
      eventTime: '',
      endTime: '',
      timezone: zone,
      venueName: '',
      venueAddress: '',
      dressCode: '',
      note: '',
      colour: '',
      visibility: 'all',
    },
    zone,
    key,
  );
}

/**
 * One event as the API takes it: declared fields only, trimmed. Fields this
 * app does not edit (colour, visibility, groups, live stream) are echoed back
 * unchanged — the list is replaced wholesale, so leaving them out would
 * reset them (and switch a running stream off).
 */
export function subEventInput(form: SubEventForm): SubEventInput {
  return {
    ...(form.id ? { id: form.id } : {}),
    name: form.name.trim(),
    eventDate: form.eventDate,
    eventTime: form.eventTime,
    endTime: form.endTime,
    timezone: form.timezone || DEFAULT_TIMEZONE,
    venueName: form.venueName.trim(),
    venueAddress: form.venueAddress.trim(),
    dressCode: form.dressCode.trim(),
    note: form.note.trim(),
    colour: form.colour,
    visibility: form.visibility,
    ...(form.visibility === 'groups' ? { groups: form.groups ?? [] } : {}),
    liveEnabled: form.liveEnabled,
    liveTitle: form.liveTitle,
    liveUrl: form.liveUrl,
    live360Url: form.live360Url,
    liveVrUrl: form.liveVrUrl,
  };
}

/** The whole list when anything in it changed (order included), else `{}`. */
export function subEventsPatch(
  baseline: SubEventForm[],
  list: SubEventForm[],
): UpdateInvitationBody {
  const before = baseline.map(subEventInput);
  const after = list.map(subEventInput);
  return JSON.stringify(before) === JSON.stringify(after)
    ? {}
    : { subEvents: after };
}

export function validateSubEvent(form: SubEventForm): SubEventErrors {
  const errors: SubEventErrors = {};
  if (!form.name.trim()) errors.name = COPY.subNameRequired;
  if (form.eventDate && !isDay(form.eventDate))
    errors.eventDate = COPY.pickDate;
  if (form.eventTime && !isTime(form.eventTime))
    errors.eventTime = COPY.timeInvalid;
  if (form.endTime && !isTime(form.endTime)) errors.endTime = COPY.timeInvalid;
  return errors;
}

/** "Sat, 14 Nov 2026 · 6:30 PM · The Leela" — what the row says. */
export function subEventLine(form: {
  eventDate: string;
  eventTime: string;
  venueName: string;
}): string {
  const date = dayLabel(form.eventDate) || COPY.subNoDate;
  return [date, clockLabel(form.eventTime), form.venueName.trim()]
    .filter(Boolean)
    .join(' · ');
}

/* ---- Countdown ------------------------------------------------------------ */

export function countdownFormFrom(dto: OrganizerInvitationDTO): CountdownForm {
  const d = dto.details;
  const target = d.countdownSubEventId ?? '';
  const known = (dto.subEvents ?? []).some(e => e.id && e.id === target);
  return {
    countdownSubEventId: known ? target : '',
    postEventMessage: d.postEventMessage ?? '',
    oneDayNotificationEnabled: d.oneDayNotificationEnabled ?? true,
    oneDayNotificationMessage: d.oneDayNotificationMessage ?? '',
    missedNotificationMessage: d.missedNotificationMessage ?? '',
  };
}

export function countdownPatch(
  baseline: CountdownForm,
  form: CountdownForm,
): UpdateInvitationBody {
  const details: Partial<InvitationDetailsDTO> = {};
  if (form.countdownSubEventId !== baseline.countdownSubEventId)
    details.countdownSubEventId = form.countdownSubEventId;
  if (form.oneDayNotificationEnabled !== baseline.oneDayNotificationEnabled)
    details.oneDayNotificationEnabled = form.oneDayNotificationEnabled;
  const texts: Array<
    | 'postEventMessage'
    | 'oneDayNotificationMessage'
    | 'missedNotificationMessage'
  > = [
    'postEventMessage',
    'oneDayNotificationMessage',
    'missedNotificationMessage',
  ];
  for (const key of texts) {
    if (form[key].trim() !== baseline[key].trim())
      details[key] = form[key].trim();
  }
  return Object.keys(details).length ? { details } : {};
}

/** The invitation's own date, then every saved event (only those have ids). */
export function countdownTargets(
  dto: OrganizerInvitationDTO,
): CountdownTarget[] {
  const d = dto.details;
  return [
    {
      id: '',
      label: COPY.countdownWhole,
      line:
        [dayLabel(d.eventDate), clockLabel(d.eventTime)]
          .filter(Boolean)
          .join(' · ') || COPY.countdownNoDate,
    },
    ...(dto.subEvents ?? [])
      .filter(e => !!e.id)
      .map(e => ({
        id: e.id,
        label: e.name.trim() || COPY.subUnnamed,
        line: subEventLine({
          eventDate: e.eventDate,
          eventTime: e.eventTime,
          venueName: e.venueName ?? '',
        }),
      })),
  ];
}

/* ---- Files ---------------------------------------------------------------- */

/** A picked clip's media type, from the picker or its extension. */
export function videoTypeOf(file: { name: string; type: string }): string {
  if (file.type && file.type.startsWith('video/')) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXTENSIONS[ext] ?? file.type ?? '';
}

/**
 * Why a picked video cannot be the invitation, or ''. A length we cannot read
 * is not a length under the limit (the web editor's rule).
 */
export function videoProblem(file: PickedFile, maxSeconds: number): string {
  if (!VIDEO_TYPES.includes(videoTypeOf(file))) return COPY.videoType;
  if (file.fileSize && file.fileSize > LIMITS.videoBytes)
    return COPY.videoTooBig(Math.round(LIMITS.videoBytes / (1024 * 1024)));
  const seconds = Math.round(file.duration ?? 0);
  if (!Number.isFinite(seconds) || seconds <= 0) return COPY.videoUnreadable;
  if (seconds > maxSeconds) return COPY.videoTooLong(seconds, maxSeconds);
  return '';
}

/** Why a picked memory would be refused outright, or ''. */
export function memoryProblem(file: PickedFile): string {
  if (file.fileSize && file.fileSize > LIMITS.memoryBytes)
    return COPY.memTooBig;
  if (
    file.type.startsWith('video/') &&
    Math.round(file.duration ?? 0) > LIMITS.clipSeconds
  )
    return COPY.memTooLong(LIMITS.clipSeconds / 60);
  return '';
}

/* ---- Guest preview -------------------------------------------------------- */

/**
 * The organizer's answer in the shape the customer's invitation sections
 * read, so the preview draws with the very components guests' hosts see.
 * Hidden events are left out — no guest would get them.
 */
export function toGuestInvitation(dto: OrganizerInvitationDTO): InvitationDTO {
  return {
    id: dto.id,
    bookingId: dto.bookingId,
    bookingRef: dto.bookingRef,
    bookingTitle: dto.bookingTitle,
    occasion: dto.occasion,
    eventDate: dto.eventDate,
    location: dto.location,
    status: dto.status,
    sentAt: dto.sentAt,
    approvedAt: dto.approvedAt,
    isLive: dto.isLive,
    publishedAt: dto.publishedAt ?? null,
    details: {
      eyebrow: dto.details.eyebrow ?? '',
      hostOne: dto.details.hostOne ?? '',
      hostTwo: dto.details.hostTwo ?? '',
      joiner: dto.details.joiner ?? '',
      eventDate: dto.details.eventDate ?? '',
      eventTime: dto.details.eventTime ?? '',
      venueName: dto.details.venueName ?? '',
      venueAddress: dto.details.venueAddress ?? '',
      template: dto.details.template,
      fontStyle: dto.details.fontStyle,
      message: dto.details.message,
      heroMediaType: dto.details.heroMediaType,
      heroMediaUrl: dto.details.heroMediaUrl,
      heroMediaKey: dto.details.heroMediaKey,
      heroMediaDurationSec: dto.details.heroMediaDurationSec,
      storyTitle: dto.details.storyTitle,
    },
    blocks: [],
    subEvents: (dto.subEvents ?? [])
      .filter(e => e.visibility !== 'hidden' && e.name.trim())
      .map(e => ({
        id: e.id,
        name: e.name,
        eventDate: e.eventDate,
        eventTime: e.eventTime,
        endTime: e.endTime,
        timezone: e.timezone,
        venueName: e.venueName,
        venueAddress: e.venueAddress,
        dressCode: e.dressCode,
        note: e.note,
        colour: e.colour,
        liveEnabled: e.liveEnabled,
        liveTitle: e.liveTitle,
        liveUrl: e.liveUrl,
        live360Url: e.live360Url,
        liveVrUrl: e.liveVrUrl,
        liveStartedAt: e.liveStartedAt,
      })),
    storyCards: (dto.storyCards ?? []).map(c => ({
      id: c.id,
      imageUrl: c.imageUrl,
      caption: c.caption,
      order: c.order,
    })),
    countdown: dto.countdown ?? null,
    cardPalette: dto.cardPalette,
    defaultSubEventMinutes: dto.defaultSubEventMinutes,
    changeRequests: [],
    templates: dto.templates,
    fonts: dto.fonts,
  };
}
