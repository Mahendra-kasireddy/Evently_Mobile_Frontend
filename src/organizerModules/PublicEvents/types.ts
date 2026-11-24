/**
 * The organizer's public events, as `/public-event/organizer/*` returns them
 * (evently-BackEnd/src/modules/public-event). DTOs first, then what the
 * screens draw.
 */

export type PublicEventStatus =
  | 'draft'
  | 'published'
  | 'sold_out'
  | 'completed'
  | 'cancelled';

export type TicketTypeStatus = 'active' | 'paused';
export type LiveAccess = 'free' | 'ticketed';
export type LiveState = 'upcoming' | 'live' | 'ended';
export type MemoryUploaders = 'checked_in' | 'ticket_holders' | 'nobody';
export type CheckInResult =
  | 'entry_allowed'
  | 'already_checked_in'
  | 'invalid_ticket';
export type AttendeeTicketStatus =
  | 'valid'
  | 'checked_in'
  | 'cancelled'
  | 'refunded';

export type ListFilter = 'all' | PublicEventStatus;
export type AttendeeFilter = 'all' | 'checked_in' | 'pending';
export type EventStatusAction = 'publish' | 'unpublish' | 'complete' | 'cancel';
export type WorkspaceTab =
  | 'overview'
  | 'tickets'
  | 'attendees'
  | 'checkin'
  | 'details'
  | 'memories';
export type Tone = 'amber' | 'green' | 'blue' | 'grey' | 'red';

// ---- DTOs -------------------------------------------------------------------

export interface EventVenueDTO {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface MemoriesSettingsDTO {
  enabled: boolean;
  uploaders: MemoryUploaders;
  attendeeView: boolean;
  attendeeDownload: boolean;
  moderation: boolean;
  uploadWindowDays: number;
}

export interface LiveSettingsDTO {
  enabled: boolean;
  access: LiveAccess;
  url: string;
  startsAt: string | null;
  endsAt: string | null;
  replayEnabled: boolean;
  /** Only on the PATCH response. */
  state?: LiveState;
}

export interface PublicEventDTO {
  id: string;
  title: string;
  category?: string;
  description?: string;
  coverUrl?: string;
  startDateTime: string;
  endDateTime?: string | null;
  timezone?: string;
  venue?: EventVenueDTO;
  capacity?: number;
  maxPerCustomer?: number;
  status: PublicEventStatus;
  publishedAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string;
  memories?: Partial<MemoriesSettingsDTO>;
  liveStream?: Partial<LiveSettingsDTO>;
}

/** A row of the list: the event plus the numbers on its card. */
export interface PublicEventSummaryDTO extends PublicEventDTO {
  ticketTypeCount?: number;
  sold?: number;
  remaining?: number;
  startingPrice?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TicketTypeDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  totalQuantity: number;
  availableQuantity: number;
  salesStart?: string | null;
  salesEnd?: string | null;
  maxPerCustomer?: number;
  status: TicketTypeStatus;
  archived?: boolean;
  /** Only from GET …/ticket-types. */
  sold?: number;
  onSale?: boolean;
}

/** GET /public-event/organizer/:id */
export interface PublicEventDetailDTO {
  event: PublicEventDTO;
  ticketTypes: TicketTypeDTO[];
  liveState?: LiveState;
}

export interface DashboardDTO {
  eventId: string;
  status: PublicEventStatus;
  ticketsSold: number;
  ticketsRemaining: number;
  capacity: number;
  bookings: number;
  revenue: number;
  checkedIn: number;
  pendingEntry: number;
  liveState: LiveState;
  memoriesEnabled: boolean;
  liveStreamEnabled: boolean;
  byTicketType: Array<{
    id: string;
    name: string;
    price: number;
    total: number;
    remaining: number;
    sold: number;
  }>;
}

export interface AttendeeDTO {
  ticketId: string;
  code: string;
  status: AttendeeTicketStatus;
  checkedInAt: string | null;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  ticketTypeName: string;
  bookingReference?: string;
  paymentStatus?: string;
  amount?: number;
}

export interface CheckInOutcomeDTO {
  result: CheckInResult;
  reason?: string;
  ticket?: {
    ticketId: string;
    code: string;
    status: string;
    checkedInAt: string | null;
    customerName: string;
    ticketTypeName: string;
  };
}

// ---- Request bodies -----------------------------------------------------------

/** CreatePublicEventDto / UpdatePublicEventDto — only the fields this app edits. */
export interface EventBody {
  title?: string;
  description?: string;
  coverUrl?: string;
  startDateTime?: string;
  /** null clears the end on an edit. */
  endDateTime?: string | null;
  venue?: EventVenueDTO;
}

export interface StatusBody {
  status: PublicEventStatus;
  reason?: string;
}

export interface TicketTypeBody {
  name?: string;
  description?: string;
  price?: number;
  totalQuantity?: number;
  /** null clears the bound on an edit. */
  salesStart?: string | null;
  salesEnd?: string | null;
  maxPerCustomer?: number;
  status?: TicketTypeStatus;
}

export interface AttendeeQuery {
  checkIn?: 'checked_in' | 'pending';
  q?: string;
  page: number;
  limit: number;
}

export type CheckInBody = { qrToken: string } | { code: string };

export type MemoriesBody = MemoriesSettingsDTO;

export interface LiveBody {
  enabled: boolean;
  access: LiveAccess;
  url: string;
  startsAt: string | null;
  endsAt: string | null;
  replayEnabled: boolean;
}

// ---- Forms --------------------------------------------------------------------

/** Dates are `YYYY-MM-DD` (device clock); times `HH:MM` (24h). */
export interface EventForm {
  title: string;
  description: string;
  /** The stored cover URL as the server returned it ('' for none). */
  coverUrl: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venueName: string;
  address: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
}

export type EventFormErrors = Partial<Record<keyof EventForm, string>>;

export interface TicketForm {
  name: string;
  description: string;
  price: string;
  totalQuantity: string;
  maxPerCustomer: string;
  salesStartDate: string;
  salesStartTime: string;
  salesEndDate: string;
  salesEndTime: string;
  status: TicketTypeStatus;
}

export type TicketFormErrors = Partial<Record<keyof TicketForm, string>>;

export interface MemoriesForm {
  enabled: boolean;
  uploaders: MemoryUploaders;
  attendeeView: boolean;
  attendeeDownload: boolean;
  moderation: boolean;
  uploadWindowDays: string;
}

export interface LiveForm {
  enabled: boolean;
  access: LiveAccess;
  url: string;
  replayEnabled: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export type LiveFormErrors = Partial<Record<keyof LiveForm, string>>;

// ---- View models ------------------------------------------------------------------

export interface StatusModel {
  label: string;
  tone: Tone;
}

export interface EventCardModel {
  id: string;
  title: string;
  coverUri: string;
  day: string;
  month: string;
  when: string;
  place: string;
  status: StatusModel;
  soldLine: string;
  /** 0–100, for the bar; null when there is nothing to sell yet. */
  soldPercent: number | null;
  priceLine: string;
  past: boolean;
}

export interface HeaderModel {
  title: string;
  coverUri: string;
  when: string;
  place: string;
  status: StatusModel;
}

export interface StatusActionModel {
  key: EventStatusAction;
  to: PublicEventStatus;
  label: string;
  /** Why it can't run yet ('' when it can). */
  blockedReason: string;
  danger: boolean;
  primary: boolean;
}

export interface DashboardTile {
  key: 'sold' | 'revenue' | 'checkedIn' | 'capacity';
  label: string;
  value: string;
  sub: string;
  icon: string;
}

export interface DashboardTypeRow {
  id: string;
  name: string;
  price: string;
  line: string;
  percent: number;
}

export interface DashboardModel {
  tiles: DashboardTile[];
  byType: DashboardTypeRow[];
}

export interface TicketCardModel {
  id: string;
  name: string;
  price: string;
  soldLine: string;
  percent: number;
  sold: number;
  window: string;
  perCustomer: string;
  state: StatusModel;
  canArchive: boolean;
}

export interface AttendeeRowModel {
  id: string;
  name: string;
  initials: string;
  ticketType: string;
  code: string;
  state: StatusModel;
  canCheckIn: boolean;
  checkedInAt: string;
}

export interface CheckInResultModel {
  tone: 'ok' | 'warn' | 'bad';
  icon: string;
  title: string;
  name: string;
  detail: string;
}

export interface RecentCheckIn {
  id: string;
  name: string;
  detail: string;
  at: string;
}

export interface DetailRow {
  key: string;
  icon: string;
  label: string;
  value: string;
}
