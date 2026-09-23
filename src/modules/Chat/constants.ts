export const CONVERSATIONS_ENDPOINT = '/message/mine';
export const ORGANIZER_CONVERSATIONS_ENDPOINT = '/message/organizer';
export const UNREAD_COUNT_ENDPOINT = '/message/unread-count';
export const OPEN_WITH_ORGANIZER_ENDPOINT = '/message/with-organizer';
export const MESSAGE_ENDPOINT = '/message';

/**
 * How many measured replies it takes before "usually replies in 2h" is a claim
 * about a habit rather than about one afternoon.
 */
export const MIN_REPLY_SAMPLES = 3;

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const CHAT_ACCENT = '#e8633a';
export const CHAT_NAVY = '#1a2e5a';
export const CHAT_NAVY_DEEP = '#0e1a33';
export const CHAT_CANVAS = '#faf8f7';
export const CHAT_HAIRLINE = '#efe9e5';
export const CHAT_GREEN = '#1d9e75';
/** The bubble a message from the other side sits in. */
export const CHAT_THEIRS = '#ffffff';

/**
 * Questions worth asking, offered as one tap.
 *
 * Two sets, because the useful question changes: an empty thread needs an
 * opener, a thread already running needs the thing customers forget to pin
 * down. They fill the box rather than sending, so nothing goes out in the
 * customer's name that they did not choose to send.
 *
 * These are prompts, not claims — none of them asserts anything about the
 * organizer, the event or the price.
 */
export const OPENING_SUGGESTIONS = [
  'Are my dates still available?',
  'What does your package include?',
  'Can you share recent work?',
];

export const FOLLOW_UP_SUGGESTIONS = [
  'Are my dates still available?',
  'Can you itemise the decor?',
  'What is the advance to confirm?',
  'Can we do a site visit?',
];

export const CHAT_COPY = {
  title: 'Messages',
  /** A thread that exists but nobody has written in yet. */
  noMessagesYet: 'No messages yet — say hello',
  loading: 'Loading your messages…',
  errorTitle: "We couldn't load your messages",
  retry: 'Try again',
  emptyTitle: 'No messages yet',
  emptyBody: 'Message an organizer from their profile and the conversation will be waiting here.',
  emptyCta: 'Find organizers',

  quote: 'Quote',
  threadLoading: 'Loading…',
  threadEmpty: 'Say hello — most organizers reply the same day.',
  placeholder: 'Write a message',
  send: 'Send',
  sendFailed: "That didn't send. Check your connection and try again.",
  /*
   * Said in the empty thread only. The app polls rather than streams, so a
   * chat that looks live but is not would be a claim the transport cannot
   * keep — but repeating it over every open thread is nagging, and pull to
   * refresh is where somebody actually looks for it.
   */
  freshnessNote: 'Pull down to check for new messages.',
};
