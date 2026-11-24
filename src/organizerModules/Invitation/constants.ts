import type { SectionId } from './types';

/* ---- Endpoints (evently-BackEnd/src/modules/invitation) ------------------ */

const enc = (id: string) => encodeURIComponent(id);

/** GET (created on first open) and PATCH — the organizer's working copy. */
export const invitationEndpoint = (bookingId: string) =>
  `/invitation/organizer/${enc(bookingId)}`;
/** POST — hands the working copy to the customer for approval. */
export const sendEndpoint = (bookingId: string) =>
  `${invitationEndpoint(bookingId)}/send`;
/** POST — marks one of the customer's asks as dealt with. */
export const resolveEndpoint = (bookingId: string, requestId: string) =>
  `${invitationEndpoint(bookingId)}/change-requests/${enc(requestId)}/resolve`;
/** GET (paged, filtered) and POST (multipart) — Shared Memories. */
export const memoriesEndpoint = (bookingId: string) =>
  `${invitationEndpoint(bookingId)}/memories`;

/** `/upload` purposes the web editor uses (features/organizer/invitation/artwork.ts). */
export const UPLOAD_PURPOSE = {
  image: 'coverImage',
  video: 'video',
  story: 'gallery',
} as const;

/* ---- Limits (mirrors of the backend; the server's answer decides) -------- */

export const LIMITS = {
  /** HERO_VIDEO_MAX_SECONDS — overridden by `limits.heroVideoSeconds`. */
  heroVideoSeconds: 300,
  /** UPLOAD_RULES.video.maxBytes. */
  videoBytes: 250 * 1024 * 1024,
  /** UPLOAD_RULES.coverImage / gallery maxBytes. */
  imageBytes: 8 * 1024 * 1024,
  /** STORY_MAX_CARDS / STORY_CAPTION_MAX / STORY_TITLE_MAX. */
  storyCards: 12,
  storyCaption: 120,
  storyTitle: 60,
  /** WELCOME_MESSAGE_MAX — overridden by `limits.welcomeMessage`. */
  welcomeMessage: 200,
  /** NOTIFICATION_MESSAGE_MAX (also the post-event message's cap). */
  notification: 400,
  /** ArrayMaxSize on `subEvents`. */
  subEvents: 20,
  eyebrow: 80,
  host: 60,
  joiner: 20,
  venueName: 120,
  venueAddress: 240,
  subName: 80,
  dressCode: 80,
  note: 300,
  /** Memories: CLIP_MAX_SECONDS and the multer cap. */
  clipSeconds: 15 * 60,
  memoryBytes: 105 * 1024 * 1024,
  memoryPage: 24,
} as const;

/** What `/upload` accepts for a video (UPLOAD_RULES.video.mimeTypes). */
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const VIDEO_EXTENSIONS: Record<string, string> = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
};

/** The web editor's curated list — every entry a real IANA zone. */
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';
export const TIMEZONES: readonly string[] = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Kathmandu',
  'Asia/Colombo',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Toronto',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
  'UTC',
];

/** Hub order, icon and the one line under each section's title in its editor. */
export const SECTION_META: Record<
  SectionId,
  {
    title: string;
    icon: string;
    blurb: string;
    gradient: readonly [string, string];
  }
> = {
  artwork: {
    title: 'Invitation design',
    icon: 'image-frame',
    blurb:
      'Design the invitation wherever you normally design, then upload the finished image or video. It is what your customer approves and what guests open.',
    gradient: ['#f29a3b', '#d9462f'],
  },
  details: {
    title: 'Details',
    icon: 'card-text-outline',
    blurb:
      'The template, names, date and venue on the cover — and the timezone the countdown is worked out in.',
    gradient: ['#a084ff', '#5a35e0'],
  },
  story: {
    title: 'Story',
    icon: 'image-multiple-outline',
    blurb:
      'A few photos, in the order guests swipe through them. Each can carry a short line.',
    gradient: ['#ff8fb1', '#d35d7e'],
  },
  dates: {
    title: 'Save the date',
    icon: 'calendar-heart',
    blurb:
      'One card per event — guests see them in this order, each with its own Add to calendar button.',
    gradient: ['#3cc9a1', '#0e8a68'],
  },
  countdown: {
    title: 'Countdown',
    icon: 'timer-sand',
    blurb:
      'Guests see a live countdown to the event you choose, in that event’s own timezone.',
    gradient: ['#6fa8ff', '#3557a8'],
  },
  memories: {
    title: 'Shared memories',
    icon: 'camera-burst',
    blurb:
      'What everyone photographed. You can add your own — the gallery itself is your customer’s.',
    gradient: ['#ffc65c', '#e8902a'],
  },
};

export const SECTION_ORDER: SectionId[] = [
  'artwork',
  'details',
  'story',
  'dates',
  'countdown',
  'memories',
];

export const INVITATION_COPY = {
  title: 'Guest invitation',
  loading: 'Loading the invitation…',
  error: 'We couldn’t load this invitation',
  retry: 'Try again',
  notFoundTitle: 'Invitation not available',
  notFoundBody:
    'This booking could not be found, or it belongs to another organizer.',
  back: 'Go back',

  /* ---- hub ---- */
  progressLabel: 'Invitation progress',
  steps: {
    uploaded: 'Uploaded',
    sent: 'Sent to customer',
    approved: 'Approved · link live',
  },
  phase: {
    draft: 'Draft',
    sent: 'Waiting for approval',
    changes: 'Changes requested',
    approved: 'Approved · live for guests',
  },
  phaseBody: {
    draft:
      'Not sent yet. Your customer reviews it and approves it — nothing reaches a guest until they do.',
    sent: 'Only your customer can approve it. You’ll be notified when they do.',
    changes:
      'Your customer asked for changes. Make them, then send the invitation again.',
    approved: 'Guests can open the invitation link.',
  },
  unsent:
    'You have edits your customer hasn’t seen. Guests keep the approved version until your customer approves the update.',
  unsentDraft: 'Your edits are saved.',
  send: 'Send to customer',
  sendUpdate: 'Send update to customer',
  resend: 'Re-send after changes',
  sending: 'Sending…',
  sendNeedsArtwork: 'Upload the invitation design before sending it.',
  sendNothingNew: 'Nothing new to send — edit a section to send an update.',
  confirmSendTitle: 'Send to your customer?',
  confirmSendBody:
    'They’ll be notified and asked to approve it. Nothing reaches a guest until they do.',
  confirmResendBody:
    'Your customer reviews this version and approves it. Sending closes their open change requests.',
  confirmSend: 'Send',
  cancel: 'Cancel',
  sent: 'Sent to your customer for approval.',
  sendFailed: 'The invitation could not be sent. Try again.',
  sectionsLabel: 'Sections',
  preview: 'Guest preview',
  previewHint: 'See it the way guests will',

  /* ---- change requests ---- */
  asksTitle: 'Change requests',
  asksLead: 'From your customer. Sending again closes them all.',
  asksWhole: 'The invitation overall',
  asksResolve: 'Mark resolved',
  resolved: 'Marked as resolved.',
  resolveFailed: 'Could not mark it resolved. Try again.',

  /* ---- section cards ---- */
  card: {
    artworkNone: 'Upload the finished invitation',
    artworkImage: 'Image uploaded',
    artworkVideo: (length: string) =>
      length ? `Video uploaded · ${length}` : 'Video uploaded',
    detailsTodo: 'Add the names and the date',
    detailsDone: (template: string, date: string) =>
      [template, date].filter(Boolean).join(' · '),
    storyNone: 'Optional · add a few photos',
    storyCount: (n: number) => (n === 1 ? '1 photo' : `${n} photos`),
    datesNone: 'Optional · add the events',
    datesCount: (n: number) => (n === 1 ? '1 event' : `${n} events`),
    datesUnnamed: 'An event has no name — guests won’t see it',
    countdownNone: 'Set a date to count down to',
    countdownTo: (name: string) => `Counting down to ${name}`,
    countdownWhole: 'the event date',
    memories: 'See and add photos and videos',
    optional: 'Optional',
  },

  /* ---- editors (shared) ---- */
  save: 'Save',
  saving: 'Saving…',
  saved: (title: string) => `${title} saved.`,
  saveFailed: 'Could not save. Your changes are still here — try again.',
  fixFields: 'Fix the highlighted fields first.',
  discardTitle: 'Discard changes?',
  discardBody: 'Your unsaved changes will be lost.',
  keepEditing: 'Keep editing',
  discard: 'Discard',
  uploading: 'Uploading…',
  uploadFailed:
    'That file could not be uploaded. Check the format and size, then try again.',
  timePh: 'HH:MM',
  timeHint: '24-hour time, e.g. 18:30',
  timeInvalid: 'Use HH:MM, e.g. 18:30',
  pickDate: 'Pick a date',
  clearDate: 'Clear date',
  count: (n: number, max: number) => `${n}/${max}`,
  moveUp: 'Move up',
  moveDown: 'Move down',
  remove: 'Remove',
  close: 'Close',

  /* ---- artwork ---- */
  artworkEmptyTitle: 'Nothing uploaded yet',
  artworkEmptyBody:
    'JPG, PNG or WEBP for an image; MP4, WEBM or MOV for a video.',
  artworkImage: 'Upload image',
  artworkVideo: 'Upload video',
  artworkReplaceImage: 'Replace with image',
  artworkReplaceVideo: 'Replace with video',
  artworkRemove: 'Remove',
  artworkRemoveTitle: 'Remove the invitation design?',
  artworkRemoveBody:
    'Your customer sees “being prepared” again until you upload a new one.',
  artworkPickTitle: 'Invitation image',
  artworkSaved: 'Invitation design saved.',
  artworkRemoved: 'Invitation design removed.',
  artworkNotStored:
    'The file uploaded, but the server did not store it on the invitation. Try again.',
  videoLength: (length: string) => `Video · ${length}`,
  videoTooLong: (seconds: number, max: number) =>
    `That video is ${seconds} seconds. An invitation video can be at most ${max} seconds.`,
  videoUnreadable:
    'We couldn’t read that video’s length, so it can’t be used as the invitation.',
  videoType: 'That video format isn’t supported. Use MP4, WEBM or MOV.',
  videoTooBig: (mb: number) =>
    `That video is too large — the limit is ${mb}MB.`,
  pickFailed: 'Could not open your photos. Check the app’s permissions.',
  imageNote:
    'Images up to 8MB, at least 600 × 200px. Videos up to 250MB and the length limit below.',
  videoMax: (seconds: number) =>
    `Videos can be up to ${Math.round(seconds / 60)} minutes.`,

  /* ---- details ---- */
  template: 'Template',
  font: 'Lettering',
  eyebrow: 'Line above the names',
  hostOne: 'First name',
  joiner: 'Joining word',
  hostTwo: 'Second name',
  eventDate: 'Event date & start time',
  timezone: 'Event timezone',
  timezoneHint: 'The countdown guests see is worked out in this zone.',
  venueName: 'Venue',
  venueAddress: 'Venue address',
  message: 'Welcome message',
  groupLook: 'Look',
  groupNames: 'Names',
  groupWhen: 'When & where',
  groupMessage: 'Message',

  /* ---- story ---- */
  storyTitleField: 'Section title',
  storyTitlePh: 'Our story',
  storyCaption: 'Caption',
  storyCaptionPh: 'Where our story began…',
  storyAdd: 'Add a photo',
  storyPickTitle: 'Story photo',
  storyFull: (max: number) => `A story can have at most ${max} photos.`,
  storyEmpty: 'With no photos, guests don’t see a story section at all.',
  storyCaptionLong: (n: number, max: number) =>
    `Photo ${n}’s caption is too long — the limit is ${max} characters.`,
  storyPhoto: (n: number) => `Photo ${n}`,

  /* ---- dates ---- */
  datesEmpty: 'No events yet. Add the first one — Mehendi, Sangeet, Wedding…',
  datesAdd: 'Add an event',
  datesFull: (max: number) => `You can add up to ${max} events.`,
  subNew: 'New event',
  subEdit: 'Edit event',
  subDone: 'Done',
  subName: 'Event name',
  subNamePh: 'Mehendi',
  subNameRequired: 'Give the event a name — guests don’t see unnamed events.',
  subStart: 'Date & start time',
  subEnd: 'End time',
  subEndHint: 'Leave blank and calendar entries run for three hours.',
  subTimezone: 'Timezone',
  subVenueName: 'Venue',
  subVenueAddress: 'Venue address',
  subAddressHint: 'Used for the calendar entry and the guest’s directions.',
  subDressCode: 'Dress code',
  subNote: 'Special note',
  subUnnamed: 'Untitled event',
  subNoDate: 'No date yet',
  subHidden: 'Hidden from guests',
  subLive: 'Live stream on',
  subRemoveTitle: 'Remove this event?',
  subRemoveBody: 'It’s removed when you save the events.',
  subCountdownNote: 'The countdown points at this event.',

  /* ---- countdown ---- */
  countdownTarget: 'Count down to',
  countdownWhole: 'The event date on the invitation',
  countdownWholeHint: 'From Details',
  countdownNoEvents: 'Add Save the date events to count down to one of them.',
  countdownAfter: 'After it starts, show instead',
  countdownAfterPh: 'We’re married! Thank you for celebrating with us.',
  noticeTitle: 'Day-before notice',
  noticeLead:
    'A card guests see once, in the last 24 hours — with the date, venue and directions.',
  noticeBody: 'What it says',
  noticeBodyPh: 'We’re almost there — we can’t wait to celebrate with you.',
  noticeMissed: 'What it says afterwards',
  noticeMissedPh: 'We hope you had a wonderful time.',
  noticeMissedWhy:
    'Shown to a guest who only opens the invitation after the day.',
  countdownNoDate: 'No date yet',

  /* ---- memories ---- */
  memOff: 'Shared memories are off',
  memOffBody:
    'Your customer decides whether the gallery is on, who can see it and what stays in it.',
  memLoadFailed: 'Could not load the gallery.',
  memAddTitle: 'Add to shared memories',
  memAddLibrary: 'Photo or video from library',
  memAddCamera: 'Take a photo',
  memAddReel: 'Record a reel (up to 60s)',
  memTooLong: (minutes: number) => `A clip can be at most ${minutes} minutes.`,
  memTooBig: 'That file is too large to share.',
  memFailed: 'That couldn’t be shared. Check the file and try again.',
  memOwnerNote: 'Your customer controls this gallery.',

  /* ---- preview ---- */
  previewTitle: 'Guest preview',
  previewNote:
    'Your saved working copy, the way guests will see it once your customer approves it.',
  previewNothing:
    'Nothing for guests yet — upload the invitation design to start.',
} as const;
