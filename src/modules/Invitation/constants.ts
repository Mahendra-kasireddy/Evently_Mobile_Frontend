import type { TextStyle } from 'react-native';
import { fontFor } from '../../theme';
import type {
  BlockOwner,
  InvitationBlockType,
  InvitationStage,
  InvitationTemplateDTO,
} from './types';

export const MY_INVITATIONS_ENDPOINT = '/invitation/mine';

/** The cover is one block among the rest — this is the key it is stored under. */
export const COVER_BLOCK_KEY = 'header';

/**
 * The theme used when the invitation names none, or names one this build has
 * never heard of. Same shape as a served template, so the renderer never has
 * to branch on "is there a theme".
 */
export const COVER_FALLBACK_TEMPLATE: InvitationTemplateDTO = {
  id: 'midnight',
  label: 'Midnight',
  heroStops: ['#101B33', '#1A2E5A', '#2B1E32'],
  wash: '#FBF7F1',
  accent: '#FFB48A',
};

/**
 * How each font id is actually drawn.
 *
 * The server owns the *set* — which styles exist, and which ids it will
 * accept — and this owns the drawing, because only the app knows which faces
 * it ships. Poppins is bundled; the serif looks are the platform's own serif,
 * which every device has, so nothing here waits on a font file being added to
 * the build.
 */
export const COVER_FONT_STYLE: Record<string, TextStyle> = {
  elegant: { fontFamily: 'serif', fontWeight: '400', letterSpacing: 1.2 },
  classic: { fontFamily: fontFor('700'), fontWeight: '700', letterSpacing: -0.4 },
  romantic: { fontFamily: 'serif', fontStyle: 'italic', letterSpacing: 0.4 },
  modern: { fontFamily: fontFor('800'), fontWeight: '800', letterSpacing: -0.8 },
  traditional: { fontFamily: 'serif', fontWeight: '700', letterSpacing: 3 },
};
export const COVER_FONT_FALLBACK = 'elegant';
/** Traditional is the one that is set in capitals. */
export const COVER_FONT_UPPERCASE = 'traditional';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const INV_ACCENT = '#e8633a';
export const INV_NAVY = '#1a2e5a';
export const INV_NAVY_DEEP = '#0e1a33';
export const INV_ACCENT_SOFT = '#fdeee7';
export const INV_GREEN = '#1d9e75';
/** The one line the screen's chrome is ruled with. */
export const INV_HAIRLINE = '#efe9e5';
export const INV_GREEN_SOFT = '#e8f6ef';
/* The third tint on the banner's tiles — the guest link's own colour, kept
   apart from "done" green and "waiting on you" coral. */
/** The screen's own ground: paper, not canvas. */
export const INV_PAPER = '#fdf9f4';
/** The gold the invitation is ruled with — the web app's own `--c-gold`. */
export const INV_GOLD = '#b0852b';
/** The blush a countdown figure sits on, and the cream behind the card. */
export const INV_BLUSH = '#fbede7';
export const INV_CREAM = '#fbf4ed';
/** The petal in the corner blossom — blush, a shade up from INV_BLUSH. */
export const INV_BLUSH_PETAL = '#f3cfc0';
/** Legible ink on a blush tile — the mark inside an Event Details row. */
export const INV_ACCENT_INK = '#9c6248';
export const INV_VIOLET = '#5b46c9';
export const INV_VIOLET_SOFT = '#eeeaff';

/**
 * The backend names each section's icon in its own vocabulary; this maps them
 * onto the app's icon set. An unknown key falls back rather than rendering a
 * blank square.
 */
export const BLOCK_ICON: Record<string, string> = {
  image: 'image-outline',
  sparkles: 'creation',
  clock: 'clock-outline',
  calendar: 'calendar-blank-outline',
  play: 'play-circle-outline',
  camera: 'camera-outline',
  users: 'account-group-outline',
  car: 'car-outline',
  qr: 'qrcode',
  map: 'map-marker-outline',
  gift: 'gift-outline',
  music: 'music-note-outline',
};
export const BLOCK_ICON_FALLBACK = 'card-text-outline';

/** The occasion an invitation belongs to, so a list row is identifiable. */
export const OCCASION_ICON: Record<string, string> = {
  wedding: 'heart-outline',
  birthday: 'gift-outline',
  housewarming: 'home-outline',
  naming: 'creation',
  anniversary: 'star-outline',
  corporate: 'briefcase-outline',
};
export const OCCASION_ICON_FALLBACK = 'email-heart-outline';

/**
 * Which renderer draws a block, by its type.
 *
 * Only the cover is built; everything else is the generic renderer, and this
 * map is where a new block is registered when its turn comes — one line,
 * rather than a branch added to every screen that draws a block.
 */
export const BLOCK_RENDERER: Record<InvitationBlockType, 'cover' | 'generic'> = {
  cover: 'cover',
  story: 'generic',
  countdown: 'generic',
  memories: 'generic',
  guestWall: 'generic',
  liveStream: 'generic',
  saveTheDate: 'generic',
  ride: 'generic',
  generic: 'generic',
};

/**
 * What each badge means. The organizer assembles most of the invitation; a few
 * sections are the customer's own words, and the difference decides which
 * action a row offers.
 */
export const OWNER_BADGE: Record<BlockOwner, string> = {
  organizer: 'By your organizer',
  customer: 'Yours to personalize',
};

export const INVITATION_STATUS_LABEL: Record<string, string> = {
  sent: 'Needs your approval',
  approved: 'Approved · live',
};

/**
 * The three views of one invitation.
 *
 * Organizer: what was assembled, section by section, editable where the
 * customer owns it. Approve: the sign-off pass, one section at a time.
 *
 * The guest's view is not a third tab — it is not a way of working on the
 * invitation, it is a look at the finished thing, so it lives in the menu
 * beside the guest list.
 */
/**
 * The words for each stage: where the invitation is, what the one button
 * does, and what it promises. Said as the thing itself — "Share on WhatsApp",
 * not "Proceed" — so nothing on the screen has to be decoded.
 */
export const STAGE_TITLE: Record<InvitationStage, string> = {
  write: 'Still being written',
  approve: 'Ready for your approval',
  share: 'Ready to send',
};

export const STAGE_CTA: Record<InvitationStage, string> = {
  write: 'Write your sections',
  approve: 'Review & approve',
  share: 'Share on WhatsApp',
};

export const STAGE_CTA_NOTE: Record<InvitationStage, string> = {
  write: 'Only you can write the parts that are yours.',
  approve: 'Nothing reaches a guest until you approve it.',
  share: 'Nothing is shared until you send the link.',
};

export const INVITATION_COPY = {
  /* Grouped so a screen can index them by stage rather than branching. */
  stageTitle: STAGE_TITLE,
  stageCta: STAGE_CTA,
  stageCtaNote: STAGE_CTA_NOTE,
  /* The contents page. */
  insideTitle: "What's inside",
  insideWritten: 'Written',
  insideApproved: 'Approved',
  /* Short on purpose: this is the commonest row by far, and five of them
     reading "Not written yet" turns the contents page into a wall. */
  insideEmpty: 'Not yet',
  insideYours: 'Yours to write',
  /** How much there is, said once above the list rather than counted by eye. */
  insideCount: (total: number, yours: number) =>
    yours > 0
      ? `${total} sections · ${yours} ${yours === 1 ? 'needs' : 'need'} you`
      : `${total} sections`,
  /* How the stage line reads under its own title. */
  stageWriteNote: (n: number) =>
    n === 1 ? 'One section is still yours to write.' : `${n} sections are still yours to write.`,
  stageApproveNote: (n: number) =>
    n === 1 ? 'One section is waiting on you.' : `${n} sections are waiting on you.`,
  stageShareNote: 'Every section is approved. Your guest link is live.',
  approveAll: (n: number) => (n === 1 ? 'Approve the last block' : `Approve all ${n} blocks`),
  approveAllNote: 'Approve each block, or ask your organizer for a change.',
  /* Said under the send button because it is the promise the button makes. */
  shareNote: 'Nothing is shared until you send the link.',
  shareLockedNote: 'Approve the invitation first — then you can send it.',
  accept: 'Accept',
  accepted: 'Approved by you',
  waitingOnYou: 'WAITING ON YOU',
  shareBlock: 'Share this block',
  /* Behind the menu: the guest's view, and the list it would go to. */
  approveSheetTitle: 'Approve your invitation',
  menuTitle: 'Invitation',
  menuPreview: 'Preview as a guest',
  menuPreviewNote: 'Exactly what the link opens',
  menuGuests: 'Guest list',
  menuGuestsNote: 'Add people, fix a number, file them into groups',
  /* Whether anything has reached a guest — the one yes-or-no on this screen. */
  /* On the page itself: the header's own control, the per-section one, and
     what a section the organizer owns offers instead. */
  editHeader: 'Edit header',
  edit: 'Edit',
  ask: 'Ask',
  hiddenCount: (n: number) =>
    n === 1 ? '1 section is hidden from guests' : `${n} sections are hidden from guests`,
  /** A section the organizer has not written yet. */
  blockEmpty: 'Your organizer has not written this section yet.',
  /** The same state, on a section the customer owns and can write now. */
  blockEmptyYours: 'Nothing here yet — tap Edit to write it.',
  /** An invitation with no names on it yet. */
  headerUnnamed: 'Your celebration',

  listTitle: 'My Invitations',
  listNeedsYou: (n: number) =>
    `${n} ${n === 1 ? 'invitation is' : 'invitations are'} waiting on you.`,
  listAllApproved: 'Everything is approved — your guest links are live.',
  untitledEvent: 'Your event',
  listReview: 'Review',
  listView: 'View',
  detailTitle: 'Guest invitation',
  eyebrow: (organizer: string) => `GUEST INVITATION · PREPARED BY ${organizer.toUpperCase()}`,
  heading: 'Your guest invitation',
  sub: 'Review each section, personalize what’s yours, and approve to publish the guest link.',

  approve: 'Approve & publish',
  approving: 'Publishing…',
  approved: 'Approved · live',
  approvedNote: 'You approved this invitation — the guest link is live.',
  awaitingNote: 'Nothing is live yet. Approve to publish the guest link.',
  requestChanges: 'Request changes',
  requestChange: 'Request change',
  preview: 'Preview',
  personalize: 'Personalize',
  share: 'Share',
  guestList: 'Guest list',
  shareAll: 'Share on WhatsApp',

  bannerTitle: 'Your organizer built this invitation for you.',
  bannerBody:
    'Sections marked “By your organizer” are handled for you — ask for a change if you need one. Sections marked “Yours to personalize” you can edit yourself.',

  sections: 'Sections',
  hidden: 'Hidden from guests',
  ready: 'Ready',
  pendingRequests: (n: number) => `${n} change ${n === 1 ? 'request' : 'requests'} with your organizer`,

  // Personalize
  personalizeTitle: 'Personalize this section',
  fieldHeading: 'Headline guests see',
  fieldHeadingHint: 'Leave blank to use the section name.',
  fieldBody: 'What you want to say',
  fieldHide: 'Hide this section from guests',
  save: 'Save changes',
  saving: 'Saving…',
  cancel: 'Cancel',

  // Request change
  requestTitle: 'Ask your organizer for a change',
  requestSub: 'They’ll get your note and can update the invitation.',
  requestField: 'What would you like changed?',
  requestPlaceholder: 'e.g. the live stream should start at 6pm, not 7pm',
  requestSend: 'Send to organizer',
  requestSending: 'Sending…',
  requestSent: 'Sent to your organizer',

  // Preview
  previewTitle: 'Guest preview',
  previewSectionTitle: (section: string) => `“${section}” as guests see it`,
  previewSub: 'What your guests see when they open the link',
  previewClose: 'Close',
  previewAll: 'Preview whole invitation',
  previewSection: 'Preview',
  previewShareSection: 'Send this section',
  previewShareAll: 'Send to guests',
  /** Why the send button is not offered — stated, never left as a dead button. */
  previewShareNotApproved: 'Approve the invitation first — then you can send it to guests.',
  previewShareHidden: 'Hidden sections can’t be sent. Unhide it from Personalize first.',
  previewOwnerCustomer: 'Yours to personalize',
  previewOwnerOrganizer: 'Built by your organizer',
  previewHiddenNote: (n: number) =>
    `${n} ${n === 1 ? 'section is' : 'sections are'} hidden from guests.`,
  /**
   * A hidden section has no guest appearance to show. Saying so is the whole
   * answer to "what does this look like to a guest" — nothing.
   */
  previewHiddenSection: 'This section is hidden, so guests never see it. Unhide it from Personalize to include it.',
  previewEmptySection: 'This section has nothing in it yet, so guests see only its heading.',

  // Share
  /* The sheet, as the design words it. "Share", not "Send": nothing leaves
     until the customer picks who, and the button says so. */
  shareHeading: (section?: string) => (section ? `Share “${section}”` : 'Share the invitation'),
  shareLead: 'Guests open this straight from the WhatsApp link. No app needed.',
  shareSelected: (n: number) => `${n} selected`,
  shareSelectAll: 'Select all',
  shareClearAll: 'Clear',
  /* The primary button before anything is ticked — it names the step rather
     than offering a send that would do nothing. */
  sharePickFirst: 'Pick who receives it',
  shareSendTo: (n: number) => `Send to ${n} ${n === 1 ? 'guest' : 'guests'}`,
  shareManageGuests: 'Manage guest list',
  shareEmptyGroup: (label: string) => `Nobody is filed under ${label} yet.`,
  shareTitle: 'Send to guests',
  shareIntro: 'Pick who to send it to, or add someone new. Guests need no account.',
  shareLoading: 'Loading your guest list…',
  shareNoGuests: 'No guests yet — add the first one below.',
  shareAddGuest: 'Add a guest',
  shareGuestName: 'Guest name',
  shareGuestPhone: 'WhatsApp number',
  sharePhoneHint: 'Indian mobiles need no country code; for anywhere else start with +.',
  shareNeedGuest: 'Choose at least one guest, or add a new one.',
  shareNeedName: 'Enter the guest’s name.',
  shareNeedPhone: 'Enter a WhatsApp number.',
  shareAlreadySent: 'Already sent',
  shareViewed: 'Opened it',
  shareSend: 'Send on WhatsApp',
  shareSending: 'Sending…',
  shareNotApproved: 'Approve the invitation first — then you can send it to guests.',
  shareWhatsappCaveat:
    'We can’t check whether a number has WhatsApp — if it doesn’t, the message won’t arrive.',
  shareHandoff: 'WhatsApp opens with the message ready — press send there to deliver it.',
  shareOpenWhatsapp: 'Open WhatsApp',
  shareFailed: 'That could not be sent.',
  shareDone: 'Done',

  // States
  emptyTitle: 'No invitation yet',
  emptyBody:
    'Once your organizer shares a guest invitation for one of your bookings, you can review and approve it here.',
  preparingTitle: 'Being prepared',
  preparingBody:
    'Your organizer is still putting this invitation together. You’ll be able to review and approve it here as soon as they share it — nothing reaches your guests until you do.',
  /* ---- the invitation itself ---- */
  /** The screen's own name. It is the invitation, not a builder for one. */
  artworkTitle: 'Invitation',
  artworkView: 'View full screen',
  artworkVideoNoPlayer:
    'This build can\u2019t play video yet. Your organizer sent a video invitation \u2014 it is saved, and guests will see it once video playback is enabled.',
  artworkPendingTitle: 'Being prepared',
  artworkPendingBody:
    'Your organizer is designing your invitation. It will appear here as soon as they send it \u2014 nothing reaches your guests until you approve it.',
  /* Where it stands, and what the two buttons under it do. */
  artworkWaiting: 'Waiting for your approval',
  artworkWaitingNote: 'Nothing reaches a guest until you approve it.',
  artworkApproved: 'Approved \u00b7 your guest link is live',
  artworkApprovedNote: 'Your organizer has been told. You can still ask for a change.',
  artworkApprove: 'Approve this invitation',
  artworkApproving: 'Approving\u2026',
  artworkAsk: 'Ask for a change',
  artworkAskNote: 'Your organizer updates the design and sends it again.',
  artworkGuests: 'Guest list',
  /* ---- Save the Date ---- */
  saveTheDateTitle: 'Save the Date',
  saveTheDateLead: 'Celebrate every beautiful moment with us',
  saveTheDateDress: 'Dress code',
  saveTheDateAdd: 'Add to Calendar',
  saveTheDateNoDate: 'This celebration has no date yet.',
  /* ---- F5: the live stream ---- */
  liveBadge: 'LIVE',
  liveNow: 'LIVE NOW',
  liveTitle: 'Live Stream',
  liveHappening: (name: string) => `${name} is happening now!`,
  liveLead: 'Join us and watch the celebration live from anywhere.',
  liveWatch: 'Watch Live',
  liveDetails: 'Event Details',
  liveDress: 'Dress Code',
  liveStandard: 'Standard',
  live360: '360\u00b0',
  liveVr: 'VR',
  /* Said plainly, because this app opens the stream rather than playing it. */
  liveOpens: 'Opens in your browser or the streaming app.',
  /* ---- the countdown ---- */
  countdownTo: 'Countdown to',
  countdownRemaining: 'Time remaining',
  countdownDays: 'Days',
  countdownHours: 'Hours',
  countdownMinutes: 'Mins',
  countdownSeconds: 'Secs',
  countdownStarted: 'The celebration has begun.',
  /* ---- the story ---- */
  storyTitle: 'Our story',
  storyOpen: (n: number) => `Open story photograph ${n} full screen`,
  storyPosition: (n: number, total: number) => `${n} / ${total}`,

  /* ---- the cover ---- */
  /** What the cover is called on the contents page. Not "Invitation header":
      that is the builder's word for it, and nobody reading their own
      invitation calls it a header. */
  coverRow: 'Cover',
  coverEdit: 'Edit the cover',
  coverTitle: 'Your invitation cover',
  coverSub: 'The first thing a guest sees when they open the link.',
  coverScroll: 'Scroll for details',
  coverPhoto: 'Add a photo',
  coverVideo: 'Add a video',
  coverReplace: 'Replace',
  coverRemove: 'Remove',
  coverMediaNone: 'No photo or video — guests see your theme.',
  coverMediaImage: 'Photo behind the cover',
  coverMediaVideo: 'Video behind the cover',
  coverUploading: 'Uploading…',
  coverVideoTooLong: (max: number) => `A cover video can be at most ${max} seconds.`,
  coverVideoUnknownLength:
    'We could not read that video\u2019s length, so it can\u2019t be used as a cover.',
  coverVideoSilent: 'It plays on its own, without sound, and loops.',
  /** Said only where the player is genuinely absent — never as a guess. */
  coverVideoNoPlayer:
    'This build can\u2019t play video yet, so the cover shows your theme here. The video is saved and stays on the invitation.',
  coverNames: 'Whose celebration is it?',
  coverHostOne: 'First name',
  coverHostTwo: 'Second name (optional)',
  coverJoiner: 'Joined by',
  coverWhen: 'When',
  coverDate: 'Date',
  coverTime: 'Time (24h, e.g. 18:30)',
  coverWhere: 'Where',
  coverVenueName: 'Venue',
  coverVenueAddress: 'Address',
  coverMessage: 'Welcome message',
  coverMessageHint: 'One or two lines your guests read first.',
  coverTheme: 'Theme',
  coverFont: 'Lettering',
  coverSaved: 'Cover saved',
  coverPickFailed: 'That file could not be opened.',

  loading: 'Opening your invitation…',
  errorTitle: 'We couldn’t load your invitation',
  retry: 'Try again',
};
