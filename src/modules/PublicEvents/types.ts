/**
 * Public events, as the customer's app reads them.
 *
 * These mirror `/public-event/*` exactly. Nothing is invented for the screens'
 * convenience — in particular, every permission below arrives as a yes or a no
 * the server already decided. The app renders those answers; it never works
 * one out, because an app that computes its own entitlement is one that can be
 * told to say yes.
 */

export type PublicEventStatus =
  | 'draft'
  | 'published'
  | 'sold_out'
  | 'completed'
  | 'cancelled';
/** Where ticket sales stand — decided by the server from stock and windows. */
export type SaleState =
  | 'on_sale'
  | 'sold_out'
  | 'upcoming'
  | 'closed'
  | 'unavailable';
export type LiveState = 'upcoming' | 'live' | 'ended';
export type TicketState = 'upcoming' | 'checked_in' | 'completed' | 'cancelled';

/** One card in the catalogue. */
export interface EventCard {
  id: string;
  title: string;
  category: string;
  coverUrl: string;
  startDateTime: string;
  endDateTime: string | null;
  timezone: string;
  venueName: string;
  city: string;
  startingPrice: number;
  soldOut: boolean;
  /** Absent on older servers; read `soldOut` then. */
  saleState?: SaleState;
  /** When sales open, for an `upcoming` event. */
  salesOpenAt?: string | null;
  status: PublicEventStatus;
  liveEnabled: boolean;
  liveState: LiveState;
}

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
}

export interface TicketOption {
  id: string;
  name: string;
  description: string;
  price: number;
  onSale: boolean;
  available: number;
  /**
   * The most this customer may take right now.
   *
   * The server has already weighed the event's ceiling, the type's own, what is
   * left on the shelf and what this customer already holds. The stepper only
   * has to obey it.
   */
  maxForYou: number;
  salesStart: string | null;
  salesEnd: string | null;
}

export interface EventDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  coverUrl: string;
  startDateTime: string;
  endDateTime: string | null;
  timezone: string;
  venue: EventVenue;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: PublicEventStatus;
  soldOut: boolean;
  saleState?: SaleState;
  salesOpenAt?: string | null;
  canBook: boolean;
  ticketTypes: TicketOption[];
  memories: {
    enabled: boolean;
    canView: boolean;
    canUpload: boolean;
    canDownload: boolean;
  };
  live: {
    enabled: boolean;
    state: LiveState;
    access: 'free' | 'ticketed';
    canWatch: boolean;
    replayEnabled: boolean;
    /** Empty unless this customer is entitled — the server withholds it. */
    url: string;
  };
  you: { hasTicket: boolean; checkedIn: boolean };
}

/** What `POST /browse/:id/book` answers with. */
export interface StartedBooking {
  bookingId: string;
  reference: string;
  amount: number;
  amountInPaise?: number;
  /** null for a free ticket, which is already confirmed. */
  payment: { orderId: string; keyId: string; currency: 'INR' } | null;
  status: string;
  ticketIds: string[];
}

export interface ConfirmedBooking {
  bookingId: string;
  reference: string;
  status: string;
  paymentStatus: string;
  amount: number;
  quantity: number;
  ticketIds: string[];
}

/** A row in My Tickets. */
export interface MyTicket {
  ticketId: string;
  code: string;
  state: TicketState;
  checkedInAt: string | null;
  eventId: string;
  eventTitle: string;
  coverUrl: string;
  startDateTime: string | null;
  timezone: string;
  venueName: string;
  city: string;
  ticketTypeName: string;
  bookingReference: string;
  paymentStatus: string;
}

/** One ticket, with the QR drawn by the server. */
export interface DigitalTicket {
  ticketId: string;
  code: string;
  /** An SVG document. Empty on a cancelled or refunded ticket. */
  qrSvg: string;
  status: string;
  checkedInAt: string | null;
  customerName: string;
  eventId: string;
  eventTitle: string;
  coverUrl: string;
  startDateTime: string | null;
  endDateTime: string | null;
  timezone: string;
  venue: Partial<EventVenue>;
  ticketTypeName: string;
  bookingReference: string;
  paymentStatus: string;
}

export interface Paged<T> {
  items: T[];
  total?: number;
  page: number;
  limit: number;
}

export interface BrowseQuery {
  q?: string;
  category?: string;
  city?: string;
  sort?: 'soon' | 'price' | 'new';
  limit?: number;
}

export type EventMemoryKind = 'photo' | 'video';

/** One photo or clip in an event's shared gallery. */
export interface EventMemory {
  id: string;
  kind: EventMemoryKind;
  url: string;
  caption: string;
  /** 'pending' is yours, waiting for the organizer; nobody else sees it. */
  status: 'visible' | 'pending' | 'rejected' | 'removed';
  mine: boolean;
  createdAt: string | null;
}

export interface EventMemoriesPage {
  items: EventMemory[];
  canUpload: boolean;
}

/** A file picked from the phone, ready to upload. */
export interface MemoryUploadInput {
  uri: string;
  fileName: string;
  mimeType: string;
}

/** What the checkout shows under "Customer details". */
export interface CustomerContact {
  name?: string;
  email?: string;
  phone?: string;
}
