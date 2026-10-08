import type { GuestGroup } from '../GuestList/types';

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

/**
 * Where an invitation is on its way to the guests.
 *
 * Every invitation goes the same way — somebody writes the parts that are
 * theirs, the customer approves the lot, and then it is sent — so the screen
 * shows one of three states rather than a set of independent flags.
 */
export type InvitationStage = 'write' | 'approve' | 'share';

/**
 * What kind of block this is, as the server names it.
 *
 * The key is an identity ('header', 'story'); the type is a *renderer*. A
 * screen picks a component by type, so a block added later arrives with a type
 * this app already knows how to draw — and one it does not falls through to
 * the generic renderer rather than disappearing.
 */
export type InvitationBlockType =
  | 'cover'
  | 'story'
  | 'countdown'
  | 'memories'
  | 'guestWall'
  | 'liveStream'
  | 'saveTheDate'
  | 'ride'
  | 'generic';

export interface InvitationBlockDTO {
  key: string;
  /** Absent on a server that predates typed blocks; treated as 'generic'. */
  type?: InvitationBlockType;
  title: string;
  /** Backend icon name; mapped to a MaterialCommunityIcons glyph on this side. */
  icon: string;
  owner: BlockOwner;
  hidden: boolean;
  heading: string;
  body: string;
  /**
   * The customer has signed this section off.
   *
   * Reported true for every section of an already-approved invitation, so an
   * invitation approved before per-section sign-off existed does not come
   * back asking to be approved again.
   */
  approved: boolean;
}

export interface InvitationSubEventDTO {
  id: string;
  name: string;
  eventDate: string;
  eventTime: string;
  endTime: string;
  /** The card's own zone; the event's date and time are read against it. */
  timezone?: string;
  venueName: string;
  venueAddress: string;
  dressCode: string;
  note: string;
  colour: string;
  /** Present for the customer, never for a guest. */
  visibility?: 'all' | 'groups' | 'hidden';

  /* ---- F5: this event's live stream ----
   *
   * All optional: a server that predates F5 simply sends none of them, and
   * `liveOf` below then finds nothing live, which is the correct answer.
   */
  liveEnabled?: boolean;
  liveTitle?: string;
  liveUrl?: string;
  live360Url?: string;
  liveVrUrl?: string;
  /** ISO instant the organizer switched it on. Server-owned. */
  liveStartedAt?: string;
}

/* ---- F6: Shared Memories -------------------------------------------------
 *
 * The same shapes the web reads. Nothing is modelled twice: these are the
 * server's answers, named.
 */

/** Whether the gallery exists, and who may do what. Server-owned. */
export interface MemorySettingsDTO {
  enabled: boolean;
  guestUpload: boolean;
  guestView: boolean;
  guestDownload: boolean;
  moderation: boolean;
  uploadFrom: string;
  uploadWindowDays: number;
  /** Whether uploads are open right now, and why not when they are shut. */
  window: { open: boolean; reason: string; opensAt: string; closesAt: string };
}

/** One item, as the customer who owns the celebration reads it. */
export interface MemoryDTO {
  id: string;
  kind: 'photo' | 'video' | 'reel';
  subEvent: string;
  /** The original. For the download flow only — never rendered in a grid. */
  url: string;
  thumbnailUrl: string;
  displayUrl: string;
  caption: string;
  durationSec: number;
  likes: number;
  uploader: string;
  status: string;
  moderationStatus: string;
  visibility: string;
  flags: string[];
  createdAt: string;
}

export interface MemoryGalleryDTO {
  items: MemoryDTO[];
  /** Empty when there is no further page. */
  nextCursor: string;
  counts: { all: number; photo: number; video: number; reel: number };
  awaiting: number;
  subEvents: Array<{ id: string; name: string }>;
}

export interface MemoryUploadOutcomeDTO {
  status: 'added' | 'pending' | 'duplicate' | 'flagged';
  /** Already worded for a person; shown as it arrives. */
  message: string;
  media?: MemoryDTO;
}

/** One file on its way up, as the picker handed it over. */
export interface UploadMemoryInput {
  uri: string;
  fileName: string;
  mimeType: string;
  subEventId?: string;
  caption?: string;
  durationSec?: number;
  reel?: boolean;
}

/** A colour a card may be given. Server-owned, like the templates. */
export interface CardColourDTO {
  id: string;
  label: string;
  wash: string;
  ink: string;
}

/** An outstanding ask with the organizer. Resolved ones are not returned. */
export interface ChangeRequestDTO {
  id: string;
  blockKey: string;
  blockTitle: string;
  note: string;
  at: string;
}

/** What the cover may sit behind. '' is "nothing uploaded". */
export type HeroMediaType = '' | 'image' | 'video';

export interface InvitationDetailsDTO {
  eyebrow: string;
  hostOne: string;
  hostTwo: string;
  joiner: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  /* ---- the cover block ---- */
  /** A template id from the invitation's own `templates`. */
  template?: string;
  /** A font id from the invitation's own `fonts`. */
  fontStyle?: string;
  /** The welcome message. Capped by the server; see `limits`. */
  message?: string;
  heroMediaType?: HeroMediaType;
  heroMediaUrl?: string;
  heroMediaKey?: string;
  heroMediaDurationSec?: number;
  /** What the story section is called, e.g. "Our Journey". */
  storyTitle?: string;
}

/**
 * What the countdown counts down to, as the API resolves it.
 *
 * `startsAt` is one absolute instant, already resolved from the event's own
 * wall-clock date, time and zone — the app subtracts and never interprets.
 */
export interface InvitationCountdownDTO {
  subEventId: string;
  name: string;
  /** ISO instant, or null when the event has no date yet. */
  startsAt: string | null;
  timezone: string;
  venueName: string;
  venueAddress: string;
  postEventMessage: string;
}

/** One photograph in the couple's story, and the line that goes under it. */
export interface InvitationStoryCardDTO {
  /** Server-assigned; stable across reorders, unlike an array index. */
  id: string;
  imageUrl: string;
  caption: string;
  /** The organizer's arrangement. The server sends them already sorted. */
  order: number;
}

/**
 * A theme, as the server defines it.
 *
 * Served rather than hard-coded here: the server refuses a template id it does
 * not know, so the picker offers exactly the set that will save.
 */
export interface InvitationTemplateDTO {
  id: string;
  label: string;
  /** The hero ramp as plain colours, painted top-left to bottom-right. */
  heroStops: string[];
  wash: string;
  accent: string;
}

/** A typography style, by the name a customer would use for it. */
export interface InvitationFontDTO {
  id: string;
  label: string;
  note: string;
}

/** The server's own bounds, so the editor's counter cannot disagree with it. */
export interface InvitationLimitsDTO {
  welcomeMessage: number;
  heroVideoSeconds: number;
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
  /**
   * Guests can open it — it has been approved at least once. Stays true while
   * an update is out for review: guests keep the approved version meanwhile.
   */
  isLive?: boolean;
  /** When the version guests see was approved. */
  publishedAt?: string | null;
  details: InvitationDetailsDTO;
  blocks: InvitationBlockDTO[];
  subEvents: InvitationSubEventDTO[];
  /** The story, in the organizer's order. Empty means there is no story. */
  storyCards?: InvitationStoryCardDTO[];
  /** What the countdown counts down to. Absent when no date is set anywhere. */
  countdown?: InvitationCountdownDTO | null;
  /** Colours a Save-the-Date card may be given. Server-owned. */
  cardPalette?: CardColourDTO[];
  /** Minutes a calendar entry runs for when a card has no end time. */
  defaultSubEventMinutes?: number;
  changeRequests: ChangeRequestDTO[];
  /* The catalogues and bounds the editor works within. Optional so a client
     talking to a server that predates them still renders. */
  templates?: InvitationTemplateDTO[];
  fonts?: InvitationFontDTO[];
  limits?: InvitationLimitsDTO;
}

/** GET /invitation/mine/:bookingId/guests */
export interface GuestDTO {
  id: string;
  name: string;
  phone: string;
  phoneDisplay: string;
  /** Absent on a record written before groups existed. */
  group?: GuestGroup;
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
