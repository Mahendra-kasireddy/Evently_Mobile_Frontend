/**
 * The organizer's guest-invitation editor.
 *
 * DTOs are the wire shapes of `GET/PATCH /invitation/organizer/:bookingId`
 * (evently-BackEnd invitation.service.ts `view()`); forms are what an editor
 * holds while the organizer types.
 */
import type {
  MemoryDTO,
  MemoryGalleryDTO,
  MemoryUploadOutcomeDTO,
} from '../../modules/Invitation/types';

export type { MemoryDTO, MemoryGalleryDTO, MemoryUploadOutcomeDTO };

export type InvitationStatus = 'draft' | 'sent' | 'approved';
export type HeroMediaType = '' | 'image' | 'video';
export type SubEventVisibility = 'all' | 'groups' | 'hidden';

export interface InvitationDetailsDTO {
  template?: string;
  eyebrow?: string;
  hostOne?: string;
  hostTwo?: string;
  joiner?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  message?: string;
  fontStyle?: string;
  heroMediaType?: HeroMediaType;
  heroMediaUrl?: string;
  heroMediaKey?: string;
  heroMediaDurationSec?: number;
  storyTitle?: string;
  countdownSubEventId?: string;
  oneDayNotificationEnabled?: boolean;
  oneDayNotificationMessage?: string;
  missedNotificationMessage?: string;
  timezone?: string;
  postEventMessage?: string;
  rsvpEnabled?: boolean;
  rsvpDeadline?: string;
  rsvpPlusOnes?: boolean;
}

export interface InvitationSubEventDTO {
  id: string;
  name: string;
  eventDate: string;
  eventTime: string;
  endTime: string;
  timezone?: string;
  venueName: string;
  venueAddress: string;
  dressCode: string;
  note: string;
  colour: string;
  visibility?: SubEventVisibility;
  groups?: string[];
  liveEnabled?: boolean;
  liveTitle?: string;
  liveUrl?: string;
  live360Url?: string;
  liveVrUrl?: string;
  /** Server-owned; never sent back. */
  liveStartedAt?: string;
}

export interface InvitationStoryCardDTO {
  id: string;
  imageUrl: string;
  imageKey?: string;
  caption: string;
  order: number;
}

export interface ChangeRequestDTO {
  id: string;
  blockKey: string;
  blockTitle: string;
  note: string;
  at: string;
  resolved?: boolean;
}

export interface InvitationTemplateDTO {
  id: string;
  label: string;
  heroStops: string[];
  wash: string;
  accent: string;
}

export interface InvitationFontDTO {
  id: string;
  label: string;
  note: string;
}

export interface CardColourDTO {
  id: string;
  label: string;
  wash: string;
  ink: string;
}

export interface InvitationCountdownDTO {
  subEventId: string;
  name: string;
  startsAt: string | null;
  timezone: string;
  venueName: string;
  venueAddress: string;
  postEventMessage: string;
}

export interface InvitationLimitsDTO {
  welcomeMessage: number;
  heroVideoSeconds: number;
  storyCards: number;
  storyCaption: number;
}

/** GET / PATCH / send / resolve all answer with this. */
export interface OrganizerInvitationDTO {
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
  isLive?: boolean;
  publishedAt?: string | null;
  /** Edits saved since the last send. */
  hasUnsentChanges?: boolean;
  details: InvitationDetailsDTO;
  blocks: Array<Record<string, unknown>>;
  subEvents: InvitationSubEventDTO[];
  storyCards?: InvitationStoryCardDTO[];
  countdown?: InvitationCountdownDTO | null;
  templates?: InvitationTemplateDTO[];
  fonts?: InvitationFontDTO[];
  limits?: InvitationLimitsDTO;
  cardPalette?: CardColourDTO[];
  defaultSubEventMinutes?: number;
  /** Outstanding asks only. */
  changeRequests: ChangeRequestDTO[];
}

/* ---- PATCH body ----------------------------------------------------------- */

export interface StoryCardInput {
  imageUrl: string;
  imageKey?: string;
  caption: string;
}

/** `InvitationSubEventDTO` (backend) — only the declared fields, never `liveStartedAt`. */
export interface SubEventInput {
  id?: string;
  name: string;
  eventDate: string;
  eventTime: string;
  endTime: string;
  timezone: string;
  venueName: string;
  venueAddress: string;
  dressCode: string;
  note: string;
  colour: string;
  visibility: SubEventVisibility;
  groups?: string[];
  liveEnabled: boolean;
  liveTitle: string;
  liveUrl: string;
  live360Url: string;
  liveVrUrl: string;
}

export interface UpdateInvitationBody {
  details?: Partial<InvitationDetailsDTO>;
  /** Replaces the whole list; array order is the display order. */
  subEvents?: SubEventInput[];
  /** Replaces the whole story; array order is the order guests read it in. */
  storyCards?: StoryCardInput[];
}

/* ---- Hub ------------------------------------------------------------------ */

export type SectionId =
  | 'artwork'
  | 'details'
  | 'story'
  | 'dates'
  | 'countdown'
  | 'memories';

/** Where the invitation stands, as one word. */
export type InvitationPhase = 'draft' | 'sent' | 'changes' | 'approved';

export type SectionState = 'done' | 'todo' | 'optional' | 'info';

export interface SectionCardModel {
  id: SectionId;
  title: string;
  icon: string;
  line: string;
  state: SectionState;
}

export interface ProgressStep {
  key: 'uploaded' | 'sent' | 'approved';
  label: string;
  done: boolean;
}

export interface SendModel {
  /** Shown at all (there is an invitation to act on). */
  canSend: boolean;
  label: string;
  /** Why it is disabled, or what sending does. */
  hint: string;
  confirmBody: string;
}

export interface HubModel {
  phase: InvitationPhase;
  phaseLabel: string;
  phaseBody: string;
  unsentNote: string;
  steps: ProgressStep[];
  sections: SectionCardModel[];
  send: SendModel;
  requests: ChangeRequestModel[];
}

export interface ChangeRequestModel {
  id: string;
  title: string;
  note: string;
  when: string;
}

/* ---- Forms ---------------------------------------------------------------- */

export interface DetailsForm {
  template: string;
  fontStyle: string;
  eyebrow: string;
  hostOne: string;
  joiner: string;
  hostTwo: string;
  eventDate: string;
  eventTime: string;
  timezone: string;
  venueName: string;
  venueAddress: string;
  message: string;
}

export type DetailsErrors = Partial<Record<keyof DetailsForm, string>>;

/** One story card while it is being arranged. */
export interface StoryCardForm {
  /** Stable list key: the server id, or a local one for a new card. */
  key: string;
  imageUrl: string;
  imageKey: string;
  /** Absolute, renderable source for the thumbnail. */
  uri: string;
  caption: string;
}

export interface StoryForm {
  title: string;
  cards: StoryCardForm[];
}

/** One Save-the-Date event while it is being edited. */
export interface SubEventForm extends SubEventInput {
  /** Stable list key: the server id, or a local one for a new event. */
  key: string;
  id: string;
}

export type SubEventErrors = Partial<
  Record<'name' | 'eventDate' | 'eventTime' | 'endTime', string>
>;

export interface CountdownForm {
  countdownSubEventId: string;
  postEventMessage: string;
  oneDayNotificationEnabled: boolean;
  oneDayNotificationMessage: string;
  missedNotificationMessage: string;
}

export interface CountdownTarget {
  id: string;
  label: string;
  line: string;
}

/** A file the picker handed over, ready for multipart. */
export interface PickedFile {
  uri: string;
  name: string;
  type: string;
  fileSize?: number;
  /** Seconds, for a clip. */
  duration?: number;
}

export interface Notice {
  text: string;
  tone: 'ok' | 'error';
}
