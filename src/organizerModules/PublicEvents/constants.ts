import type {
  AttendeeFilter,
  EventStatusAction,
  ListFilter,
  MemoryUploaders,
  PublicEventStatus,
  WorkspaceTab,
} from './types';

// ---- Endpoints (evently-BackEnd/src/modules/public-event/organizer-public-event.controller.ts)

export const EVENTS_ENDPOINT = '/public-event/organizer';
export const eventEndpoint = (eventId: string) =>
  `${EVENTS_ENDPOINT}/${encodeURIComponent(eventId)}`;
export const statusEndpoint = (eventId: string) =>
  `${eventEndpoint(eventId)}/status`;
export const ticketTypesEndpoint = (eventId: string) =>
  `${eventEndpoint(eventId)}/ticket-types`;
export const ticketTypeEndpoint = (eventId: string, typeId: string) =>
  `${ticketTypesEndpoint(eventId)}/${encodeURIComponent(typeId)}`;
export const dashboardEndpoint = (eventId: string) =>
  `${eventEndpoint(eventId)}/dashboard`;
export const attendeesEndpoint = (eventId: string) =>
  `${eventEndpoint(eventId)}/attendees`;
export const checkInEndpoint = (eventId: string) =>
  `${eventEndpoint(eventId)}/check-in`;
export const memoriesEndpoint = (eventId: string) =>
  `${eventEndpoint(eventId)}/memories`;
export const liveStreamEndpoint = (eventId: string) =>
  `${eventEndpoint(eventId)}/live-stream`;

/** The shared `/upload` purpose the web uses for a public event's cover. */
export const COVER_PURPOSE = 'coverImage';

// ---- Limits (public-event.constants.ts + dto/public-event.dto.ts)

export const TITLE_MIN = 3;
export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 4000;
export const VENUE_MAX = 160;
export const ADDRESS_MAX = 400;
export const CITY_MAX = 80;
export const CANCEL_REASON_MAX = 500;
export const TICKET_NAME_MAX = 80;
export const TICKET_DESCRIPTION_MAX = 500;
export const TICKET_PRICE_MAX = 10_000_000;
export const TICKET_QUANTITY_MAX = 1_000_000;
export const TICKET_PER_CUSTOMER_MAX = 50;
export const LIVE_URL_MAX = 500;
export const UPLOAD_WINDOW_MAX = 365;
export const CHECK_IN_CODE_MAX = 40;
export const CHECK_IN_TOKEN_MAX = 400;
/** A scanned QR carries the long token; a code read aloud is short (web rule). */
export const TOKEN_MIN_LENGTH = 25;

export const EVENTS_PAGE_SIZE = 20;
export const ATTENDEES_PAGE_SIZE = 50;
export const RECENT_CHECK_INS = 10;
export const SEARCH_DEBOUNCE_MS = 350;

/**
 * What an organizer may move an event to, from where — the server's
 * `ALLOWED_TRANSITIONS`, copied so the screen offers only what it will accept.
 * SOLD_OUT is never a destination: it is what the stock says.
 */
export const ALLOWED_TRANSITIONS: Record<
  PublicEventStatus,
  PublicEventStatus[]
> = {
  draft: ['published', 'cancelled'],
  published: ['draft', 'completed', 'cancelled'],
  sold_out: ['draft', 'completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

/** The order the actions are offered in, and where each one goes. */
export const STATUS_ACTIONS: Array<{
  key: EventStatusAction;
  to: PublicEventStatus;
}> = [
  { key: 'publish', to: 'published' },
  { key: 'complete', to: 'completed' },
  { key: 'unpublish', to: 'draft' },
  { key: 'cancel', to: 'cancelled' },
];

export const LIST_FILTERS: ListFilter[] = [
  'all',
  'draft',
  'published',
  'sold_out',
  'completed',
  'cancelled',
];

export const ATTENDEE_FILTERS: AttendeeFilter[] = [
  'all',
  'checked_in',
  'pending',
];

export const WORKSPACE_TABS: WorkspaceTab[] = [
  'overview',
  'tickets',
  'attendees',
  'checkin',
  'details',
  'memories',
];

export const UPLOADER_OPTIONS: MemoryUploaders[] = [
  'checked_in',
  'ticket_holders',
  'nobody',
];

export const PUBLIC_EVENTS_COPY = {
  title: 'Public events',
  fallbackTitle: 'Public event',
  loading: 'Getting your events…',
  loadingOne: 'Opening your event…',
  error: 'Something went wrong',
  retry: 'Try again',
  back: 'Go back',
  dismiss: 'Dismiss',
  close: 'Close',
  cancel: 'Cancel',
  notFoundTitle: 'Event not found',
  notFoundBody:
    'This event may have been removed, or it belongs to another organizer.',
  offline: "We couldn't reach the server. Check your connection and try again.",
  sessionExpired: 'Your session has expired. Sign in again to continue.',
  notOrganizer:
    'Your account is not set up as an organizer yet, so there are no public events to show.',

  // ---- List
  newEvent: 'New event',
  newEventNote: 'Starts as a draft — nobody sees it until you publish.',
  filters: {
    all: 'All',
    draft: 'Drafts',
    published: 'Published',
    sold_out: 'Sold out',
    completed: 'Completed',
    cancelled: 'Cancelled',
  } as Record<ListFilter, string>,
  countLine: (n: number) => (n === 1 ? '1 event' : `${n} events`),
  emptyTitle: 'Sell tickets to your own event',
  emptyBody:
    'Concerts, workshops, comedy nights — create the event, add ticket types and publish. We handle bookings and check-in.',
  emptyFilteredTitle: 'Nothing here yet',
  emptyFilteredBody: 'No events with this status. Try All.',
  loadMore: 'Load more',
  loadingMore: 'Loading…',
  noDate: 'Date to be set',
  noVenue: 'Venue to be added',
  sold: (sold: number, capacity: number) =>
    capacity > 0 ? `${sold} / ${capacity} sold` : `${sold} sold`,
  noTickets: 'No tickets yet',
  fromPrice: (price: string) => `From ${price}`,
  free: 'Free',
  open: 'Open',

  // ---- Statuses
  status: {
    draft: 'Draft',
    published: 'Published',
    sold_out: 'Sold out',
    completed: 'Completed',
    cancelled: 'Cancelled',
  } as Record<PublicEventStatus, string>,

  // ---- Status actions
  actions: {
    publish: 'Publish',
    unpublish: 'Move to draft',
    complete: 'Mark completed',
    cancel: 'Cancel event',
  } as Record<EventStatusAction, string>,
  confirm: {
    publish: {
      title: 'Publish this event?',
      body: 'It goes live in the catalogue and tickets go on sale.',
      ok: 'Publish',
    },
    unpublish: {
      title: 'Move back to draft?',
      body: 'It leaves the catalogue and sales stop. Tickets already sold stay valid.',
      ok: 'Move to draft',
    },
    complete: {
      title: 'Mark as completed?',
      body: 'Sales close for good and the event can no longer be edited. Check-in stays open.',
      ok: 'Mark completed',
    },
    cancel: {
      title: 'Cancel this event?',
      body: 'Sales stop and the event cannot be edited or published again. Attendees will see your reason.',
      ok: 'Cancel event',
    },
  } as Record<EventStatusAction, { title: string; body: string; ok: string }>,
  keep: 'Not now',
  publishNeedsTickets: 'Add at least one ticket type before publishing.',
  addTickets: 'Add tickets',
  statusDone: {
    publish: 'Published — tickets are on sale.',
    unpublish: 'Moved back to draft.',
    complete: 'Marked as completed.',
    cancel: 'Event cancelled.',
  } as Record<EventStatusAction, string>,
  statusFailed: "Couldn't change the status. Please try again.",
  cancelSheetTitle: 'Cancel event',
  cancelReason: 'Reason (optional)',
  cancelReasonPh: 'e.g. The venue is unavailable on this date',
  cancelling: 'Cancelling…',
  readOnly:
    'This event is closed, so its details and tickets can no longer be changed.',

  // ---- Tabs
  tabs: {
    overview: 'Overview',
    tickets: 'Tickets',
    attendees: 'Attendees',
    checkin: 'Check-in',
    details: 'Details',
    memories: 'Memories & live',
  } as Record<WorkspaceTab, string>,

  // ---- Overview
  overview: {
    sold: 'Tickets sold',
    revenue: 'Revenue',
    revenueSub: 'Paid bookings',
    checkedIn: 'Checked in',
    capacity: 'Capacity',
    remaining: (n: number) => `${n} left`,
    ofSold: (n: number) => `of ${n} sold`,
    bookings: (n: number) => (n === 1 ? '1 booking' : `${n} bookings`),
    byType: 'By ticket type',
    noTypes: 'No ticket types yet.',
    typeLine: (sold: number, total: number) => `${sold} / ${total}`,
    unavailable: "Couldn't load the numbers. Pull down to try again.",
    nextDraft: 'Next step: add ticket types, then publish to go on sale.',
    nextPublish: 'Ready when you are — publish to put tickets on sale.',
  },

  // ---- Tickets
  tickets: {
    title: 'Ticket types',
    add: 'Add ticket type',
    emptyTitle: 'No tickets yet',
    emptyBody: 'Add at least one ticket type — General, VIP, Early bird…',
    sold: (sold: number, total: number) => `${sold} of ${total} sold`,
    onSale: 'On sale',
    notOnSale: 'Not on sale',
    paused: 'Paused',
    windowAlways: 'Sells while the event is published',
    windowFrom: (d: string) => `Sales open ${d}`,
    windowUntil: (d: string) => `Sales close ${d}`,
    windowBetween: (a: string, b: string) => `Sales ${a} – ${b}`,
    perCustomer: (n: number) => `Max ${n} per customer`,
    edit: 'Edit',
    archive: 'Remove',
    archiveTitle: 'Remove this ticket type?',
    archiveBody: 'Customers will no longer see it. This cannot be undone.',
    archiveOk: 'Remove',
    archived: 'Ticket type removed.',
    archiveFailed: "Couldn't remove this ticket type.",
    soldHint: 'Already sold — pause it instead of removing it.',
    loadFailed: "Couldn't load ticket types.",
    sheetNew: 'New ticket type',
    sheetEdit: 'Edit ticket type',
    name: 'Name',
    namePh: 'e.g. General admission',
    price: 'Price (₹)',
    pricePh: '0 for free',
    quantity: 'Number of tickets',
    quantityPh: 'e.g. 200',
    quantityHint: (sold: number) =>
      sold > 0 ? `${sold} already sold — can't go below that.` : '',
    maxPer: 'Max per customer (optional)',
    maxPerPh: 'No limit',
    description: 'Description (optional)',
    descriptionPh: 'What this ticket includes',
    salesStart: 'Sales open',
    salesEnd: 'Sales close',
    salesHint: 'Leave blank to sell for as long as the event is published.',
    statusLabel: 'Selling',
    active: 'On sale',
    pausedOption: 'Paused',
    save: 'Save ticket',
    create: 'Add ticket',
    saving: 'Saving…',
    saved: 'Ticket saved.',
    saveFailed: "Couldn't save this ticket type.",
    nameRequired: 'Give this ticket a name.',
    nameTooLong: `Keep the name under ${TICKET_NAME_MAX} characters.`,
    priceRequired: 'Enter a price (0 for free).',
    priceInvalid: 'Enter a valid price.',
    priceTooHigh: 'That price is too high.',
    quantityRequired: 'How many tickets are there?',
    quantityMin: 'Quantity must be at least 1 ticket.',
    quantityTooHigh: 'That is more tickets than we allow.',
    quantityBelowSold: (sold: number) =>
      `${sold} have already been sold, so the total cannot go below ${sold}.`,
    maxPerInvalid: `Use a number from 0 to ${TICKET_PER_CUSTOMER_MAX}.`,
    salesEndBeforeStart: 'Sales cannot close before they open.',
  },

  // ---- Attendees
  attendees: {
    searchPh: 'Search name, email, phone or code',
    filters: {
      all: 'All',
      checked_in: 'Checked in',
      pending: 'Not yet',
    } as Record<AttendeeFilter, string>,
    count: (shown: number, total: number) =>
      total > shown ? `Showing ${shown} of ${total}` : `${total} tickets`,
    emptyTitle: 'No attendees yet',
    emptyBody: 'People who book tickets show up here, one row per seat.',
    emptyFiltered: 'Nobody matches this filter.',
    checkedIn: 'Checked in',
    notYet: 'Not checked in',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    checkIn: 'Check in',
    loadFailed: "Couldn't load attendees.",
    guest: 'Guest',
  },

  // ---- Check-in
  checkIn: {
    title: 'Check in at the door',
    body: 'Type the ticket code the guest shows you, or paste the text from a QR scanner.',
    placeholder: 'Ticket code',
    submit: 'Check in',
    checking: 'Checking…',
    closed:
      'Check-in opens once the event is published. A draft or cancelled event has nobody to let in.',
    empty: 'Enter a ticket code first.',
    tooLong: 'That code is too long.',
    allowed: 'Entry allowed',
    already: 'Already checked in',
    invalid: 'Invalid ticket',
    failed: "Couldn't check this ticket. Please try again.",
    recent: 'Checked in this session',
    noRecent: 'Guests you check in show up here.',
    noCamera:
      'Camera scanning is not available in the app yet — use the ticket code.',
  },

  // ---- Details
  details: {
    title: 'Event details',
    edit: 'Edit details',
    name: 'Name',
    description: 'About',
    starts: 'Starts',
    ends: 'Ends',
    venue: 'Venue',
    address: 'Address',
    location: 'Map pin',
    none: 'Not set',
  },

  // ---- Memories & live
  memories: {
    title: 'Shared memories',
    body: 'A photo gallery attendees add to after the event.',
    enabled: 'Turn on memories',
    uploadersLabel: 'Who can add photos',
    uploaders: {
      checked_in: 'People who came',
      ticket_holders: 'Anyone with a ticket',
      nobody: 'Only you',
    } as Record<MemoryUploaders, string>,
    attendeeView: 'Attendees can view the gallery',
    attendeeDownload: 'Attendees can download photos',
    moderation: 'Approve photos before they appear',
    windowLabel: 'Uploads stay open for (days)',
    windowPh: '7',
    windowInvalid: `Use a number from 0 to ${UPLOAD_WINDOW_MAX}.`,
    save: 'Save memories',
    saved: 'Memories settings saved.',
    failed: "Couldn't save memories settings.",
  },
  live: {
    title: 'Live stream',
    body: 'Stream the event for people who cannot be there.',
    enabled: 'Turn on live stream',
    url: 'Stream link',
    urlPh: 'https://youtube.com/live/…',
    urlHint:
      'Paste the link you would share — YouTube, Vimeo, Twitch, Facebook or Cloudflare Stream.',
    urlRequired: 'Add the stream link to turn the stream on.',
    urlInvalid: 'Use a full link starting with https://',
    urlTooLong: `Keep the link under ${LIVE_URL_MAX} characters.`,
    accessLabel: 'Who can watch',
    free: 'Anyone',
    ticketed: 'Ticket holders',
    replay: 'Keep a replay after it ends',
    startsAt: 'Stream starts',
    endsAt: 'Stream ends',
    timesHint: 'Optional — when the broadcast itself runs.',
    endBeforeStart: 'The stream cannot end before it starts.',
    save: 'Save live stream',
    saved: 'Live stream saved.',
    failed: "Couldn't save the live stream.",
    state: {
      upcoming: 'Upcoming',
      live: 'Live now',
      ended: 'Ended',
    } as Record<string, string>,
  },

  // ---- Event form
  form: {
    createTitle: 'New event',
    editTitle: 'Edit event',
    sectionBasics: 'The basics',
    sectionWhen: 'When',
    sectionWhere: 'Where',
    sectionAdvanced: 'Advanced',
    advancedHint: 'Map pin — only if you want an exact location.',
    title: 'Event name',
    titlePh: 'e.g. Hyderabad Comedy Night',
    description: 'Description',
    descriptionPh: 'What happens, who it is for, what to bring.',
    cover: 'Cover photo',
    coverHint: 'The first thing a customer sees. Landscape works best.',
    coverAdd: 'Add cover photo',
    coverChange: 'Change',
    coverRemove: 'Remove',
    coverPick: 'Cover photo',
    coverUploading: 'Uploading…',
    coverFailed: "Couldn't upload that photo. Try another.",
    startDate: 'Start date',
    startTime: 'Start time',
    endDate: 'End date',
    endTime: 'End time',
    pickDate: 'Pick a date',
    sameDay: 'Same day',
    optional: 'Optional',
    timePh: 'HH:MM',
    timeHint: '24-hour clock, e.g. 19:30',
    venueName: 'Venue name',
    venueNamePh: 'e.g. Shilpakala Vedika',
    address: 'Address',
    addressPh: 'Street, area',
    city: 'City',
    state: 'State',
    latitude: 'Latitude',
    longitude: 'Longitude',
    showAdvanced: 'Show advanced',
    hideAdvanced: 'Hide advanced',
    create: 'Create event',
    save: 'Save changes',
    saving: 'Saving…',
    created: 'Event created as a draft.',
    saved: 'Changes saved.',
    saveFailed: "Couldn't save the event. Please try again.",
    fixFields: 'Please fix the highlighted fields.',
    discardTitle: 'Discard changes?',
    discardBody: 'What you typed will be lost.',
    keepEditing: 'Keep editing',
    discard: 'Discard',
    titleRequired: 'Give your event a name.',
    titleShort: `Use at least ${TITLE_MIN} characters.`,
    titleLong: `Keep the name under ${TITLE_MAX} characters.`,
    startDateRequired: 'Pick the start date.',
    timeRequired: 'Add a time.',
    timeInvalid: 'Use HH:MM, e.g. 19:30.',
    endDateNeedsTime: 'Add an end time, or clear the end date.',
    endBeforeStart: 'The event cannot end before it starts.',
    latInvalid: 'Latitude is a number from -90 to 90.',
    lngInvalid: 'Longitude is a number from -180 to 180.',
    pinPair: 'Add both latitude and longitude, or neither.',
    tooLong: (max: number) => `Keep this under ${max} characters.`,
    count: (n: number, max: number) => `${n}/${max}`,
    clearDate: 'Clear date',
  },
} as const;
