import type {
  IdeaPlanStatus,
  IdeasFilter,
  OrganizerPostType,
  VisionSlotKey,
} from './types';

const id = (value: string) => encodeURIComponent(value);

// ---- Endpoints (evently-BackEnd/src/modules/idea/idea.controller.ts) ---------

/** GET the board; POST an update or question onto it. */
export const boardEndpoint = (bookingId: string) =>
  `/idea/organizer/${id(bookingId)}`;
/** POST the organizer's reply (plan status, text, optional approval ask). */
export const replyEndpoint = (ideaId: string) =>
  `/idea/organizer/${id(ideaId)}/reply`;
/** PATCH the event vision — returns the whole board. */
export const visionEndpoint = (bookingId: string) =>
  `/idea/organizer/${id(bookingId)}/vision`;

/** `POST /upload` purpose for a board photo (same as web board/upload.ts). */
export const IDEA_IMAGE_PURPOSE = 'ideaImage';

// ---- Backend limits (CreateIdeaDto / ReplyIdeaDto / UpdateVisionDto) ---------

export const TEXT_MAX = 4000;
export const APPROVAL_LABEL_MAX = 400;
export const VISION_SLOT_MAX = 120;
/** The API sets no cap; this keeps a post readable on a phone. */
export const PHOTO_MAX = 6;

export const POST_TYPES: OrganizerPostType[] = ['update', 'question'];
export const PLAN_STATUSES: IdeaPlanStatus[] = [
  'planned',
  'in_progress',
  'done',
];

export const FILTERS: Array<{ value: IdeasFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'toReply', label: 'To reply' },
  { value: 'waiting', label: 'Waiting for customer' },
  { value: 'approved', label: 'Approved' },
  { value: 'questions', label: 'Questions' },
];

export const VISION_SLOTS: Array<{
  key: VisionSlotKey;
  label: string;
  icon: string;
  placeholder: string;
}> = [
  {
    key: 'theme',
    label: 'Theme & colours',
    icon: 'palette-outline',
    placeholder: 'e.g. Marigold & maroon',
  },
  {
    key: 'vibe',
    label: 'Vibe',
    icon: 'heart-outline',
    placeholder: 'e.g. Traditional + fun',
  },
  {
    key: 'surprise',
    label: 'Surprise',
    icon: 'gift-outline',
    placeholder: 'e.g. Flash mob at the sangeet',
  },
  {
    key: 'food',
    label: 'Food',
    icon: 'silverware-fork-knife',
    placeholder: 'e.g. Veg-forward + live counters',
  },
];

export const IDEAS_COPY = {
  title: 'Ideas & planning',
  loading: 'Opening the planning board…',
  error: "We couldn't load the planning board.",
  retry: 'Try again',
  notFoundTitle: 'Board not found',
  notFoundBody:
    "This booking isn't one of yours any more, or it no longer exists.",
  back: 'Go back',
  dismiss: 'Dismiss',
  failed: 'Something went wrong. Please try again.',

  progress: {
    title: 'Board progress',
    shared: 'Customer ideas',
    planned: 'Planned',
    waiting: 'Waiting for approval',
    summary: (planned: number, shared: number) =>
      shared === 0
        ? 'No ideas from the customer yet'
        : `${planned} of ${shared} customer ${
            shared === 1 ? 'idea has' : 'ideas have'
          } a plan`,
    approved: (n: number) => `${n} approved`,
  },

  vision: {
    title: 'Event vision',
    subtitle: 'Your summary — the customer sees this on their board',
    empty:
      'Capture the theme, colours and feel once you understand them. The customer reads it back to check they were heard.',
    slotEmpty: 'Not captured yet',
    edit: 'Edit vision',
    add: 'Add vision',
    sheetTitle: 'Event vision',
    sheetBody: 'Leave a slot empty to clear it.',
    lockLabel: 'Keep the surprise private',
    lockHint: 'Kept off anything the customer shares onward.',
    save: 'Save vision',
    saving: 'Saving…',
    cancel: 'Cancel',
    close: 'Close',
    noChanges: 'Nothing has changed yet.',
    tooLong: (max: number) => `Keep it under ${max} characters.`,
    saved: 'Vision saved — the customer can see it now.',
    saveFailed: "The vision couldn't be saved.",
  },

  composer: {
    placeholder: {
      update: 'Share an update — a moodboard, options, progress…',
      question: 'Ask the customer something…',
    } as Record<OrganizerPostType, string>,
    photo: 'Photo',
    uploading: 'Uploading…',
    pickTitle: 'Add a reference photo',
    photoLimit: (max: number) => `You can attach up to ${max} photos.`,
    photoFailed:
      "That photo couldn't be uploaded. Try a JPG, PNG or WebP under 5MB.",
    removePhoto: 'Remove photo',
    post: {
      update: 'Post update',
      question: 'Ask',
    } as Record<OrganizerPostType, string>,
    posting: 'Posting…',
    textRequired: 'Write something first.',
    textTooLong: (max: number) => `Keep it under ${max} characters.`,
    postFailed: "Your post couldn't be shared.",
    posted: 'Posted — the customer has been notified.',
  },

  feed: {
    you: 'You',
    customer: 'Customer',
    organizerFallback: 'You',
    customerFallback: 'Customer',
    confidential: 'Kept private',
    yourPlan: 'Your reply',
    waiting: 'Waiting for customer',
    approved: 'Approved by customer',
    replyCta: 'Reply with a plan…',
    updateCta: 'Update your reply…',
    askCta: 'Add a status or ask for approval…',
    photo: (i: number, n: number) => `Photo ${i} of ${n}`,
    openPhoto: 'Open photo',
  },

  filters: {
    emptyTitle: 'Nothing in this filter',
    emptyBody: 'Try another filter.',
  },

  empty: {
    title: 'No posts yet',
    body: 'Share your first update — moodboards, options, questions for the customer',
  },

  reply: {
    title: 'Reply',
    statusLabel: 'Where this stands',
    textLabel: 'Your reply',
    placeholder: 'What you are doing about this…',
    askLabel: 'Ask the customer to approve',
    askHint: 'They get an Approve button on this post.',
    approvalLabel: 'What are they approving?',
    approvalPlaceholder: 'e.g. Approve the mandap décor mockup',
    reaskNote: 'Already approved — asking again resets it to waiting.',
    save: 'Send reply',
    saving: 'Sending…',
    cancel: 'Cancel',
    close: 'Close',
    textRequired: 'Write a reply first.',
    textTooLong: (max: number) => `Keep it under ${max} characters.`,
    approvalRequired: 'Say what they are approving.',
    approvalTooLong: (max: number) => `Keep it under ${max} characters.`,
    sent: 'Reply sent — the customer has been notified.',
    failed: "Your reply couldn't be sent.",
  },

  viewer: {
    close: 'Close photo',
  },
};

export const POST_TYPE_LABEL: Record<OrganizerPostType, string> = {
  update: 'Update',
  question: 'Question',
};

export const PLAN_STATUS_LABEL: Record<IdeaPlanStatus, string> = {
  planned: 'Planned',
  in_progress: 'In progress',
  done: 'Done',
};
