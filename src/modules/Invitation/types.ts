export type InvitationStatus = 'draft' | 'sent' | 'approved';

/** Who owns a section: the organizer builds it, or the customer writes it. */
export type BlockOwner = 'organizer' | 'customer';

/**
 * GET /invitation/mine — one row per invitation shared with the customer.
 *
 * The booking's own details come with it: without them every row in the list
 * reads "Guest invitation" and the customer cannot tell one from another.
 */
export interface InvitationSummaryDTO {
  bookingId: string;
  status: InvitationStatus;
  bookingTitle: string;
  bookingRef: string;
  occasion: string;
  eventDate: string | null;
  sentAt: string | null;
  approvedAt: string | null;
}

/** A list row, once shaped for the screen. */
export interface InvitationListItem {
  bookingId: string;
  status: InvitationStatus;
  title: string;
  ref: string;
  occasion: string;
  dateLabel: string;
  statusLabel: string;
  /** True while the invitation is waiting on this customer to approve it. */
  needsYou: boolean;
}

export interface InvitationBlockDTO {
  key: string;
  title: string;
  /** Backend icon name; mapped to a MaterialCommunityIcons glyph on this side. */
  icon: string;
  owner: BlockOwner;
  hidden: boolean;
  heading: string;
  body: string;
}

export interface InvitationSubEventDTO {
  id: string;
  name: string;
  eventDate: string;
  eventTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  dressCode: string;
  note: string;
  colour: string;
}

/** An outstanding ask with the organizer. Resolved ones are not returned. */
export interface ChangeRequestDTO {
  id: string;
  blockKey: string;
  blockTitle: string;
  note: string;
  at: string;
}

export interface InvitationDetailsDTO {
  eyebrow: string;
  hostOne: string;
  hostTwo: string;
  joiner: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
}

/** GET /invitation/mine/:bookingId */
export interface InvitationDTO {
  id: string;
  bookingId: string;
  bookingRef: string;
  bookingTitle: string;
  occasion: string;
  eventDate: string | null;
  location: string;
  status: InvitationStatus;
  sentAt: string | null;
  approvedAt: string | null;
  details: InvitationDetailsDTO;
  blocks: InvitationBlockDTO[];
  subEvents: InvitationSubEventDTO[];
  changeRequests: ChangeRequestDTO[];
}

/** GET /invitation/mine/:bookingId/guests */
export interface GuestDTO {
  id: string;
  name: string;
  phone: string;
  phoneDisplay: string;
  /** Section keys already sent; '' means the complete invitation. */
  sharedSections: string[];
  lastSharedAt: string | null;
  viewed: boolean;
}

export type ShareStatus = 'sent' | 'handoff' | 'failed';

export interface ShareOutcomeDTO {
  guest: GuestDTO;
  status: ShareStatus;
  /** In handoff mode the client must open this to finish the send. */
  handoffUrl?: string;
  url: string;
  error?: string;
}

export interface ShareResultDTO {
  mode: string;
  results: ShareOutcomeDTO[];
}

/** What the personalize sheet submits. */
export interface BlockPatch {
  heading: string;
  body: string;
  hidden: boolean;
}
