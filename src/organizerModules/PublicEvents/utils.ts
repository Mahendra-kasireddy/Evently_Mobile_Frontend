import { absoluteFileUrl } from '../../services/urls';
import { dateParts, formatInr, formatInrCompact } from '../Shared';
import {
  ADDRESS_MAX,
  ALLOWED_TRANSITIONS,
  CHECK_IN_CODE_MAX,
  CHECK_IN_TOKEN_MAX,
  CITY_MAX,
  DESCRIPTION_MAX,
  LIVE_URL_MAX,
  PUBLIC_EVENTS_COPY as COPY,
  STATUS_ACTIONS,
  TICKET_DESCRIPTION_MAX,
  TICKET_NAME_MAX,
  TICKET_PER_CUSTOMER_MAX,
  TICKET_PRICE_MAX,
  TICKET_QUANTITY_MAX,
  TITLE_MAX,
  TITLE_MIN,
  TOKEN_MIN_LENGTH,
  UPLOAD_WINDOW_MAX,
  VENUE_MAX,
} from './constants';
import type {
  AttendeeDTO,
  AttendeeFilter,
  AttendeeQuery,
  AttendeeRowModel,
  CheckInBody,
  CheckInOutcomeDTO,
  CheckInResultModel,
  DashboardDTO,
  DashboardModel,
  DetailRow,
  EventBody,
  EventCardModel,
  EventForm,
  EventFormErrors,
  EventVenueDTO,
  HeaderModel,
  LiveBody,
  LiveForm,
  LiveFormErrors,
  LiveSettingsDTO,
  MemoriesBody,
  MemoriesForm,
  MemoriesSettingsDTO,
  PublicEventDTO,
  PublicEventStatus,
  PublicEventSummaryDTO,
  RecentCheckIn,
  StatusActionModel,
  StatusModel,
  TicketCardModel,
  TicketForm,
  TicketFormErrors,
  TicketTypeBody,
  TicketTypeDTO,
  Tone,
} from './types';

// ---- Dates and times ------------------------------------------------------------

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

const time = (iso: string | null | undefined): number | null => {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? null : t;
};

/** `YYYY-MM-DD` on the device's clock — never via toISOString (UTC). */
export function isoDateOf(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate(),
  )}`;
}

/** An instant split into the form's date and time boxes, on the device clock. */
export function splitIso(iso: string | null | undefined): {
  date: string;
  time: string;
} {
  const t = time(iso);
  if (t === null) return { date: '', time: '' };
  const d = new Date(t);
  return {
    date: isoDateOf(d),
    time: `${pad2(d.getHours())}:${pad2(d.getMinutes())}`,
  };
}

/**
 * What the time box keeps as the organizer types: digits and one colon, and
 * "1930" becomes "19:30" so nobody has to hunt for the colon key.
 */
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

/** "19:30" → { h: 19, m: 30 }; null for anything that isn't a real time. */
export function parseTime(text: string): { h: number; m: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return { h, m };
}

/** A date box and a time box, as the ISO instant the API wants. */
export function combineDateTime(date: string, clock: string): string | null {
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const t = parseTime(clock);
  if (!day || !t) return null;
  const at = new Date(
    Number(day[1]),
    Number(day[2]) - 1,
    Number(day[3]),
    t.h,
    t.m,
  );
  return Number.isNaN(at.getTime()) ? null : at.toISOString();
}

/** "7:30 pm" — written out so it reads the same on every device. */
export function clockLabel(date: Date): string {
  const h = date.getHours();
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad2(date.getMinutes())} ${suffix}`;
}

/** "Fri, 14 Nov · 7:30 pm", with the year when it isn't this one. */
export function whenLabel(
  iso: string | null | undefined,
  now = new Date(),
): string {
  const t = time(iso);
  if (t === null) return '';
  const d = new Date(t);
  const day = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(d.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' }),
  });
  return `${day} · ${clockLabel(d)}`;
}

/** The label a picked `YYYY-MM-DD` shows in its box. */
export function pickedDateLabel(day: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
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

// ---- Status rules -----------------------------------------------------------------

export const STATUS_TONES: Record<PublicEventStatus, Tone> = {
  draft: 'grey',
  published: 'green',
  sold_out: 'amber',
  completed: 'blue',
  cancelled: 'red',
};

export function statusModel(status: PublicEventStatus): StatusModel {
  return {
    label: COPY.status[status] ?? status,
    tone: STATUS_TONES[status] ?? 'grey',
  };
}

/** The server's transition table: may an organizer take `from` to `to`? */
export function canTransition(
  from: PublicEventStatus,
  to: PublicEventStatus,
): boolean {
  return (ALLOWED_TRANSITIONS[from] ?? []).includes(to);
}

/** Completed and cancelled events are history: no edits (`assertEditable`). */
export function isEditable(status: PublicEventStatus): boolean {
  return status !== 'completed' && status !== 'cancelled';
}

/** The door is open for published, sold-out and completed events (`isCheckInOpen`). */
export function isCheckInOpen(status: PublicEventStatus): boolean {
  return (
    status === 'published' || status === 'sold_out' || status === 'completed'
  );
}

/**
 * The status buttons for an event: only the moves the server accepts, with
 * publishing held back (and saying why) until there is a ticket to sell.
 */
export function statusActions(
  status: PublicEventStatus,
  ticketTypeCount: number,
): StatusActionModel[] {
  return STATUS_ACTIONS.filter(a => canTransition(status, a.to)).map(a => ({
    key: a.key,
    to: a.to,
    label: COPY.actions[a.key],
    blockedReason:
      a.key === 'publish' && ticketTypeCount < 1
        ? COPY.publishNeedsTickets
        : '',
    danger: a.key === 'cancel',
    primary: a.key === 'publish' || a.key === 'complete',
  }));
}

// ---- List cards ---------------------------------------------------------------------

export function placeLine(venue: EventVenueDTO | null | undefined): string {
  return [venue?.name, venue?.city]
    .map(v => (v ?? '').trim())
    .filter(Boolean)
    .join(' · ');
}

export const coverUri = (url: string | null | undefined): string =>
  absoluteFileUrl(url);

const percentOf = (part: number, whole: number): number =>
  whole > 0 ? Math.max(0, Math.min(100, Math.round((part / whole) * 100))) : 0;

export function mapEventCard(
  e: PublicEventSummaryDTO,
  now = new Date(),
): EventCardModel {
  const parts = dateParts(e.startDateTime);
  const sold = e.sold ?? 0;
  const remaining = e.remaining ?? 0;
  const capacity = sold + remaining;
  const types = e.ticketTypeCount ?? 0;
  const end = time(e.endDateTime) ?? time(e.startDateTime);
  return {
    id: e.id,
    title: e.title,
    coverUri: coverUri(e.coverUrl),
    day: parts?.day ?? '',
    month: parts?.month ?? '',
    when: whenLabel(e.startDateTime, now) || COPY.noDate,
    place: placeLine(e.venue) || COPY.noVenue,
    status: statusModel(e.status),
    soldLine: types > 0 ? COPY.sold(sold, capacity) : COPY.noTickets,
    soldPercent: types > 0 ? percentOf(sold, capacity) : null,
    priceLine:
      types > 0
        ? (e.startingPrice ?? 0) > 0
          ? COPY.fromPrice(formatInr(e.startingPrice))
          : COPY.free
        : '',
    past: end !== null && end < now.getTime(),
  };
}

/** Appends a page, keeping the first copy of anything seen twice. */
export function mergeById<T extends { id: string }>(prev: T[], next: T[]): T[] {
  const seen = new Set(prev.map(x => x.id));
  return [...prev, ...next.filter(x => !seen.has(x.id))];
}

export function hasMorePages(
  page: number,
  limit: number,
  total: number,
): boolean {
  return (page + 1) * limit < total;
}

// ---- Workspace header & details -------------------------------------------------------

export function mapHeader(e: PublicEventDTO, now = new Date()): HeaderModel {
  return {
    title: e.title,
    coverUri: coverUri(e.coverUrl),
    when: whenLabel(e.startDateTime, now) || COPY.noDate,
    place: placeLine(e.venue) || COPY.noVenue,
    status: statusModel(e.status),
  };
}

export function detailRows(e: PublicEventDTO, now = new Date()): DetailRow[] {
  const D = COPY.details;
  const v = e.venue ?? {};
  const pin =
    typeof v.latitude === 'number' && typeof v.longitude === 'number'
      ? `${v.latitude}, ${v.longitude}`
      : '';
  const address = [v.address, v.city, v.state]
    .map(x => (x ?? '').trim())
    .filter(Boolean)
    .join(', ');
  return [
    { key: 'title', icon: 'format-title', label: D.name, value: e.title },
    {
      key: 'description',
      icon: 'text-long',
      label: D.description,
      value: (e.description ?? '').trim() || D.none,
    },
    {
      key: 'starts',
      icon: 'calendar-start',
      label: D.starts,
      value: whenLabel(e.startDateTime, now) || D.none,
    },
    {
      key: 'ends',
      icon: 'calendar-end',
      label: D.ends,
      value: whenLabel(e.endDateTime, now) || D.none,
    },
    {
      key: 'venue',
      icon: 'map-marker-outline',
      label: D.venue,
      value: (v.name ?? '').trim() || D.none,
    },
    {
      key: 'address',
      icon: 'home-city-outline',
      label: D.address,
      value: address || D.none,
    },
    {
      key: 'pin',
      icon: 'crosshairs-gps',
      label: D.location,
      value: pin || D.none,
    },
  ];
}

/** A mutation's answer laid over what we had — the server's copy wins. */
export function mergeEvent(
  prev: PublicEventDTO | null,
  next: Partial<PublicEventDTO>,
): PublicEventDTO | null {
  if (!prev) return next.id ? (next as PublicEventDTO) : null;
  return { ...prev, ...next };
}

// ---- Event form --------------------------------------------------------------------------

export function emptyEventForm(): EventForm {
  return {
    title: '',
    description: '',
    coverUrl: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    venueName: '',
    address: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
  };
}

export function formFromEvent(e: PublicEventDTO): EventForm {
  const start = splitIso(e.startDateTime);
  const end = splitIso(e.endDateTime);
  const v = e.venue ?? {};
  return {
    title: e.title ?? '',
    description: e.description ?? '',
    coverUrl: e.coverUrl ?? '',
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    venueName: v.name ?? '',
    address: v.address ?? '',
    city: v.city ?? '',
    state: v.state ?? '',
    latitude: typeof v.latitude === 'number' ? String(v.latitude) : '',
    longitude: typeof v.longitude === 'number' ? String(v.longitude) : '',
  };
}

export function isFormChanged<T extends object>(form: T, initial: T): boolean {
  return (Object.keys(initial) as Array<keyof T>).some(
    k => form[k] !== initial[k],
  );
}

/** What the coordinate boxes keep: digits, one leading minus, one dot. */
export function coordinateText(text: string): string {
  const cleaned = text.replace(/[^\d.-]/g, '');
  const negative = cleaned.startsWith('-');
  const body = cleaned.replace(/-/g, '');
  const [whole, ...rest] = body.split('.');
  const decimal = rest.length ? `.${rest.join('')}` : '';
  return `${negative ? '-' : ''}${whole}${decimal}`;
}

/** '' → null; otherwise the number, or NaN when it isn't one. */
export function parseCoordinate(text: string): number | null {
  const t = text.trim();
  if (!t) return null;
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : NaN;
}

/** The end box: an end time alone means the same day as the start. */
function endParts(form: EventForm): { date: string; time: string } {
  const endTime = form.endTime.trim();
  const endDate = form.endDate.trim() || (endTime ? form.startDate : '');
  return { date: endDate, time: endTime };
}

/** `CreatePublicEventDto`'s rules, plus the service's "end after start". */
export function validateEventForm(form: EventForm): EventFormErrors {
  const F = COPY.form;
  const errors: EventFormErrors = {};
  const title = form.title.trim();
  if (!title) errors.title = F.titleRequired;
  else if (title.length < TITLE_MIN) errors.title = F.titleShort;
  else if (title.length > TITLE_MAX) errors.title = F.titleLong;

  if (form.description.trim().length > DESCRIPTION_MAX) {
    errors.description = F.tooLong(DESCRIPTION_MAX);
  }

  if (!form.startDate) errors.startDate = F.startDateRequired;
  if (!form.startTime.trim()) errors.startTime = F.timeRequired;
  else if (!parseTime(form.startTime)) errors.startTime = F.timeInvalid;

  const end = endParts(form);
  if (end.time && !parseTime(end.time)) errors.endTime = F.timeInvalid;
  else if (end.date && !end.time) errors.endTime = F.endDateNeedsTime;

  const start = combineDateTime(form.startDate, form.startTime);
  const finish =
    end.date && end.time ? combineDateTime(end.date, end.time) : null;
  if (start && finish && !errors.endTime) {
    if (new Date(finish).getTime() <= new Date(start).getTime()) {
      errors.endTime = F.endBeforeStart;
    }
  }

  if (form.venueName.trim().length > VENUE_MAX) {
    errors.venueName = F.tooLong(VENUE_MAX);
  }
  if (form.address.trim().length > ADDRESS_MAX) {
    errors.address = F.tooLong(ADDRESS_MAX);
  }
  if (form.city.trim().length > CITY_MAX) errors.city = F.tooLong(CITY_MAX);
  if (form.state.trim().length > CITY_MAX) errors.state = F.tooLong(CITY_MAX);

  const lat = parseCoordinate(form.latitude);
  const lng = parseCoordinate(form.longitude);
  if (lat !== null && (Number.isNaN(lat) || lat < -90 || lat > 90)) {
    errors.latitude = F.latInvalid;
  }
  if (lng !== null && (Number.isNaN(lng) || lng < -180 || lng > 180)) {
    errors.longitude = F.lngInvalid;
  }
  if (
    !errors.latitude &&
    !errors.longitude &&
    (lat === null) !== (lng === null)
  ) {
    if (lat === null) errors.latitude = F.pinPair;
    else errors.longitude = F.pinPair;
  }
  return errors;
}

export const hasErrors = (errors: object): boolean =>
  Object.values(errors).some(Boolean);

/**
 * The POST / PATCH body. A create leaves blanks out; an edit sends them as ''
 * (and a cleared end as null) so clearing a field actually clears it. The
 * map pin is left out when blank: the server keeps the old one rather than
 * dropping an event on the equator.
 */
export function buildEventBody(
  form: EventForm,
  mode: 'create' | 'edit',
): EventBody {
  const edit = mode === 'edit';
  const text = (v: string) => v.trim();
  const optional = (v: string) => (edit || text(v) ? text(v) : undefined);

  const start = combineDateTime(form.startDate, form.startTime) ?? undefined;
  const end = endParts(form);
  const finish =
    end.date && end.time ? combineDateTime(end.date, end.time) : null;

  const venue: EventVenueDTO = {};
  const name = optional(form.venueName);
  const address = optional(form.address);
  const city = optional(form.city);
  const state = optional(form.state);
  if (name !== undefined) venue.name = name;
  if (address !== undefined) venue.address = address;
  if (city !== undefined) venue.city = city;
  if (state !== undefined) venue.state = state;
  const lat = parseCoordinate(form.latitude);
  const lng = parseCoordinate(form.longitude);
  if (
    lat !== null &&
    lng !== null &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng)
  ) {
    venue.latitude = lat;
    venue.longitude = lng;
  }

  const body: EventBody = { title: text(form.title), startDateTime: start };
  const description = optional(form.description);
  if (description !== undefined) body.description = description;
  const cover = optional(form.coverUrl);
  if (cover !== undefined) body.coverUrl = cover;
  if (finish) body.endDateTime = finish;
  else if (edit) body.endDateTime = null;
  if (Object.keys(venue).length) body.venue = venue;
  return body;
}

// ---- Ticket types ------------------------------------------------------------------------

export const digitsOnly = (text: string, max = 9): string =>
  text
    .replace(/\D/g, '')
    .replace(/^0+(?=\d)/, '')
    .slice(0, max);

/** Rupees with at most two decimals. */
export function priceText(text: string): string {
  const cleaned = text.replace(/[^\d.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  const w = whole.replace(/^0+(?=\d)/, '').slice(0, 8);
  return rest.length ? `${w}.${rest.join('').slice(0, 2)}` : w;
}

export const ticketSold = (t: TicketTypeDTO): number =>
  typeof t.sold === 'number'
    ? t.sold
    : Math.max(0, (t.totalQuantity ?? 0) - (t.availableQuantity ?? 0));

export function emptyTicketForm(): TicketForm {
  return {
    name: '',
    description: '',
    price: '',
    totalQuantity: '',
    maxPerCustomer: '',
    salesStartDate: '',
    salesStartTime: '',
    salesEndDate: '',
    salesEndTime: '',
    status: 'active',
  };
}

export function formFromTicket(t: TicketTypeDTO): TicketForm {
  const start = splitIso(t.salesStart);
  const end = splitIso(t.salesEnd);
  return {
    name: t.name ?? '',
    description: t.description ?? '',
    price: String(t.price ?? 0),
    totalQuantity: String(t.totalQuantity ?? ''),
    maxPerCustomer: t.maxPerCustomer ? String(t.maxPerCustomer) : '',
    salesStartDate: start.date,
    salesStartTime: start.time,
    salesEndDate: end.date,
    salesEndTime: end.time,
    status: t.status ?? 'active',
  };
}

/** One optional date+time pair: blank, complete, or an error. */
function windowBound(
  date: string,
  clock: string,
): { iso: string | null; error: string | null } {
  const d = date.trim();
  const c = clock.trim();
  if (!d && !c) return { iso: null, error: null };
  if (!d) return { iso: null, error: COPY.form.startDateRequired };
  if (!c) return { iso: null, error: COPY.form.timeRequired };
  const iso = combineDateTime(d, c);
  return iso
    ? { iso, error: null }
    : { iso: null, error: COPY.form.timeInvalid };
}

/** `TicketTypeDto`'s rules, plus "can't go below what's sold" and the window order. */
export function validateTicketForm(
  form: TicketForm,
  sold = 0,
): TicketFormErrors {
  const T = COPY.tickets;
  const errors: TicketFormErrors = {};
  const name = form.name.trim();
  if (!name) errors.name = T.nameRequired;
  else if (name.length > TICKET_NAME_MAX) errors.name = T.nameTooLong;

  if (form.description.trim().length > TICKET_DESCRIPTION_MAX) {
    errors.description = COPY.form.tooLong(TICKET_DESCRIPTION_MAX);
  }

  const price = form.price.trim();
  if (!price) errors.price = T.priceRequired;
  else if (!/^\d+(\.\d{1,2})?$/.test(price)) errors.price = T.priceInvalid;
  else if (Number(price) > TICKET_PRICE_MAX) errors.price = T.priceTooHigh;

  const qty = form.totalQuantity.trim();
  if (!qty) errors.totalQuantity = T.quantityRequired;
  else if (!/^\d+$/.test(qty)) errors.totalQuantity = T.quantityRequired;
  else if (Number(qty) < 1) errors.totalQuantity = T.quantityMin;
  else if (Number(qty) > TICKET_QUANTITY_MAX) {
    errors.totalQuantity = T.quantityTooHigh;
  } else if (Number(qty) < sold) {
    errors.totalQuantity = T.quantityBelowSold(sold);
  }

  const per = form.maxPerCustomer.trim();
  if (per && (!/^\d+$/.test(per) || Number(per) > TICKET_PER_CUSTOMER_MAX)) {
    errors.maxPerCustomer = T.maxPerInvalid;
  }

  const start = windowBound(form.salesStartDate, form.salesStartTime);
  const end = windowBound(form.salesEndDate, form.salesEndTime);
  if (start.error) {
    errors[form.salesStartDate ? 'salesStartTime' : 'salesStartDate'] =
      start.error;
  }
  if (end.error) {
    errors[form.salesEndDate ? 'salesEndTime' : 'salesEndDate'] = end.error;
  }
  if (
    start.iso &&
    end.iso &&
    new Date(end.iso).getTime() <= new Date(start.iso).getTime()
  ) {
    errors.salesEndTime = T.salesEndBeforeStart;
  }
  return errors;
}

/** POST / PATCH body. On an edit a cleared window bound goes as null. */
export function buildTicketBody(
  form: TicketForm,
  mode: 'create' | 'edit',
): TicketTypeBody {
  const edit = mode === 'edit';
  const body: TicketTypeBody = {
    name: form.name.trim(),
    price: Number(form.price.trim() || 0),
    totalQuantity: Number(form.totalQuantity.trim() || 0),
    status: form.status,
  };
  const description = form.description.trim();
  if (description || edit) body.description = description;
  const per = form.maxPerCustomer.trim();
  if (per || edit) body.maxPerCustomer = per ? Number(per) : 0;
  const start = windowBound(form.salesStartDate, form.salesStartTime).iso;
  const end = windowBound(form.salesEndDate, form.salesEndTime).iso;
  if (start) body.salesStart = start;
  else if (edit) body.salesStart = null;
  if (end) body.salesEnd = end;
  else if (edit) body.salesEnd = null;
  return body;
}

function salesWindowLine(t: TicketTypeDTO, now: Date): string {
  const T = COPY.tickets;
  const a = whenLabel(t.salesStart, now);
  const b = whenLabel(t.salesEnd, now);
  if (a && b) return T.windowBetween(a, b);
  if (a) return T.windowFrom(a);
  if (b) return T.windowUntil(b);
  return T.windowAlways;
}

export function mapTicket(t: TicketTypeDTO, now = new Date()): TicketCardModel {
  const T = COPY.tickets;
  const sold = ticketSold(t);
  const state: StatusModel =
    t.status === 'paused'
      ? { label: T.paused, tone: 'grey' }
      : t.onSale
      ? { label: T.onSale, tone: 'green' }
      : { label: T.notOnSale, tone: 'amber' };
  return {
    id: t.id,
    name: t.name,
    price: t.price > 0 ? formatInr(t.price) : COPY.free,
    soldLine: T.sold(sold, t.totalQuantity),
    percent: percentOf(sold, t.totalQuantity),
    sold,
    window: salesWindowLine(t, now),
    perCustomer: t.maxPerCustomer ? T.perCustomer(t.maxPerCustomer) : '',
    state,
    canArchive: sold === 0,
  };
}

// ---- Dashboard ---------------------------------------------------------------------------

export function mapDashboard(d: DashboardDTO): DashboardModel {
  const O = COPY.overview;
  const sold = d.ticketsSold ?? 0;
  return {
    tiles: [
      {
        key: 'sold',
        label: O.sold,
        value: String(sold),
        sub: O.remaining(d.ticketsRemaining ?? 0),
        icon: 'ticket-confirmation-outline',
      },
      {
        key: 'revenue',
        label: O.revenue,
        value: formatInrCompact(d.revenue ?? 0),
        sub: O.bookings(d.bookings ?? 0),
        icon: 'cash-multiple',
      },
      {
        key: 'checkedIn',
        label: O.checkedIn,
        value: String(d.checkedIn ?? 0),
        sub: O.ofSold(sold),
        icon: 'account-check-outline',
      },
      {
        key: 'capacity',
        label: O.capacity,
        value: String(d.capacity ?? 0),
        sub: `${percentOf(sold, d.capacity ?? 0)}%`,
        icon: 'seat-outline',
      },
    ],
    byType: (d.byTicketType ?? []).map(t => ({
      id: t.id,
      name: t.name,
      price: t.price > 0 ? formatInr(t.price) : COPY.free,
      line: O.typeLine(t.sold, t.total),
      percent: percentOf(t.sold, t.total),
    })),
  };
}

// ---- Attendees ---------------------------------------------------------------------------

export function attendeeQuery(
  filter: AttendeeFilter,
  q: string,
  page: number,
  limit: number,
): AttendeeQuery {
  const query: AttendeeQuery = { page, limit };
  if (filter !== 'all') query.checkIn = filter;
  const search = q.trim();
  if (search) query.q = search.slice(0, 120);
  return query;
}

/** The same test the server applies, so a row changed here leaves or stays correctly. */
export function matchesAttendee(
  a: AttendeeDTO,
  filter: AttendeeFilter,
  q: string,
): boolean {
  if (filter === 'checked_in' && a.status !== 'checked_in') return false;
  if (filter === 'pending' && a.status !== 'valid') return false;
  const search = q.trim().toLowerCase();
  if (!search) return true;
  return [
    a.customerName,
    a.customerEmail,
    a.customerPhone,
    a.code,
    a.bookingReference,
  ]
    .join(' ')
    .toLowerCase()
    .includes(search);
}

export const filterAttendees = (
  rows: AttendeeDTO[],
  filter: AttendeeFilter,
  q: string,
): AttendeeDTO[] => rows.filter(a => matchesAttendee(a, filter, q));

/** A ticket admitted at the door, reflected in the loaded rows. */
export function withCheckedIn(
  rows: AttendeeDTO[],
  ticketId: string,
  at: string,
): AttendeeDTO[] {
  return rows.map(a =>
    a.ticketId === ticketId && a.status === 'valid'
      ? { ...a, status: 'checked_in', checkedInAt: at }
      : a,
  );
}

export function mergeAttendees(
  prev: AttendeeDTO[],
  next: AttendeeDTO[],
): AttendeeDTO[] {
  const seen = new Set(prev.map(a => a.ticketId));
  return [...prev, ...next.filter(a => !seen.has(a.ticketId))];
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : ''))
    .toUpperCase()
    .slice(0, 2);
}

export function mapAttendee(
  a: AttendeeDTO,
  now = new Date(),
): AttendeeRowModel {
  const A = COPY.attendees;
  const state: StatusModel =
    a.status === 'checked_in'
      ? { label: A.checkedIn, tone: 'green' }
      : a.status === 'cancelled'
      ? { label: A.cancelled, tone: 'red' }
      : a.status === 'refunded'
      ? { label: A.refunded, tone: 'grey' }
      : { label: A.notYet, tone: 'amber' };
  const name = a.customerName?.trim() || A.guest;
  return {
    id: a.ticketId,
    name,
    initials: initialsOf(name),
    ticketType: a.ticketTypeName ?? '',
    code: a.code ?? '',
    state,
    canCheckIn: a.status === 'valid',
    checkedInAt: a.status === 'checked_in' ? whenLabel(a.checkedInAt, now) : '',
  };
}

// ---- Check-in ----------------------------------------------------------------------------

/**
 * What the box holds, as the server wants it: a long scanner payload is the
 * QR token, anything short is the code (upper-cased, as the server matches).
 */
export function checkInBody(
  raw: string,
): { body: CheckInBody; error: null } | { body: null; error: string } {
  const value = raw.trim();
  if (!value) return { body: null, error: COPY.checkIn.empty };
  if (value.length >= TOKEN_MIN_LENGTH) {
    return value.length > CHECK_IN_TOKEN_MAX
      ? { body: null, error: COPY.checkIn.tooLong }
      : { body: { qrToken: value }, error: null };
  }
  const code = value.replace(/\s+/g, '').toUpperCase();
  return code.length > CHECK_IN_CODE_MAX
    ? { body: null, error: COPY.checkIn.tooLong }
    : { body: { code }, error: null };
}

export function mapCheckIn(o: CheckInOutcomeDTO): CheckInResultModel {
  const C = COPY.checkIn;
  const t = o.ticket;
  const detail = [t?.ticketTypeName, t?.code].filter(Boolean).join(' · ');
  if (o.result === 'entry_allowed') {
    return {
      tone: 'ok',
      icon: 'check-circle',
      title: C.allowed,
      name: t?.customerName || COPY.attendees.guest,
      detail,
    };
  }
  if (o.result === 'already_checked_in') {
    return {
      tone: 'warn',
      icon: 'alert-circle',
      title: C.already,
      name: t?.customerName ?? '',
      detail: [o.reason, detail].filter(Boolean).join(' · '),
    };
  }
  return {
    tone: 'bad',
    icon: 'close-circle',
    title: C.invalid,
    name: t?.customerName ?? '',
    detail: [o.reason, detail].filter(Boolean).join(' · '),
  };
}

/** An admitted guest for the session list; null for anything else. */
export function recentFrom(
  o: CheckInOutcomeDTO,
  now = new Date(),
): RecentCheckIn | null {
  if (o.result !== 'entry_allowed' || !o.ticket) return null;
  const t = o.ticket;
  return {
    id: t.ticketId,
    name: t.customerName || COPY.attendees.guest,
    detail: [t.ticketTypeName, t.code].filter(Boolean).join(' · '),
    at: clockLabel(t.checkedInAt ? new Date(t.checkedInAt) : now),
  };
}

// ---- Memories & live -------------------------------------------------------------------------

export function memoriesFormFrom(
  m: Partial<MemoriesSettingsDTO> | null | undefined,
): MemoriesForm {
  return {
    enabled: m?.enabled ?? false,
    uploaders: m?.uploaders ?? 'checked_in',
    attendeeView: m?.attendeeView ?? true,
    attendeeDownload: m?.attendeeDownload ?? false,
    moderation: m?.moderation ?? false,
    uploadWindowDays: String(m?.uploadWindowDays ?? 7),
  };
}

export function validateMemories(form: MemoriesForm): string | null {
  const days = form.uploadWindowDays.trim();
  if (!/^\d+$/.test(days) || Number(days) > UPLOAD_WINDOW_MAX) {
    return COPY.memories.windowInvalid;
  }
  return null;
}

export function memoriesBody(form: MemoriesForm): MemoriesBody {
  return {
    enabled: form.enabled,
    uploaders: form.uploaders,
    attendeeView: form.attendeeView,
    attendeeDownload: form.attendeeDownload,
    moderation: form.moderation,
    uploadWindowDays: Number(form.uploadWindowDays.trim() || 0),
  };
}

export function liveFormFrom(
  l: Partial<LiveSettingsDTO> | null | undefined,
): LiveForm {
  const start = splitIso(l?.startsAt);
  const end = splitIso(l?.endsAt);
  return {
    enabled: l?.enabled ?? false,
    access: l?.access ?? 'ticketed',
    url: l?.url ?? '',
    replayEnabled: l?.replayEnabled ?? false,
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
  };
}

export function validateLiveForm(form: LiveForm): LiveFormErrors {
  const L = COPY.live;
  const errors: LiveFormErrors = {};
  const url = form.url.trim();
  if (!url && form.enabled) errors.url = L.urlRequired;
  else if (url && !/^https:\/\/[^\s/]+\.[^\s]+$/i.test(url)) {
    errors.url = L.urlInvalid;
  } else if (url.length > LIVE_URL_MAX) errors.url = L.urlTooLong;

  const start = windowBound(form.startDate, form.startTime);
  const end = windowBound(form.endDate, form.endTime);
  if (start.error) {
    errors[form.startDate ? 'startTime' : 'startDate'] = start.error;
  }
  if (end.error) errors[form.endDate ? 'endTime' : 'endDate'] = end.error;
  if (
    start.iso &&
    end.iso &&
    new Date(end.iso).getTime() <= new Date(start.iso).getTime()
  ) {
    errors.endTime = L.endBeforeStart;
  }
  return errors;
}

export function liveBody(form: LiveForm): LiveBody {
  return {
    enabled: form.enabled,
    access: form.access,
    url: form.url.trim(),
    startsAt: windowBound(form.startDate, form.startTime).iso,
    endsAt: windowBound(form.endDate, form.endTime).iso,
    replayEnabled: form.replayEnabled,
  };
}

// ---- Errors ------------------------------------------------------------------------------

/**
 * The server's own words for a failure. Nest's validation answers with a list
 * of messages; the first is enough to act on.
 */
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
  return [400, 404].includes(error?.status ?? 0);
}

/**
 * What to say when a load fails (web loadError.ts): only a status of 0 is a
 * connection problem; anything else came back with words worth repeating.
 */
export function loadErrorMessage(
  error: { status?: number; message?: unknown } | null,
): string {
  if (!error) return COPY.error;
  const status = error.status ?? 0;
  if (status === 0) return COPY.offline;
  if (status === 401) return COPY.sessionExpired;
  if (status === 403) return errorMessage(error, COPY.notOrganizer);
  return errorMessage(error, COPY.error);
}
