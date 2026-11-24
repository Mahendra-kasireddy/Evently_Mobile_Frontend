import type { TabLook } from '../../navigation/EventlyTabBar';
import type { OrganizerTabParamList } from '../../navigation/types';

export const UNREAD_COUNT_ENDPOINT = '/notification/getUnreadCount';

/**
 * Every organizer screen, and whether it is native yet.
 *
 * The native organizer app is built one screen at a time. A screen that is not
 * native opens its web page inside a native screen (OrganizerWebPage, or the
 * tab's own embedded page), so every release works end to end. Building a
 * screen natively means pointing its `screen` at the native route here — one
 * line, and every link to it follows.
 */
export const ORGANIZER_ROUTES = {
  home: { title: 'Dashboard', path: '/organizer/home' },
  setup: { title: 'Go-live setup', path: '/organizer/setup' },
  enquiries: { title: 'Enquiries', path: '/organizer/quotes' },
  quoteBuilder: { title: 'Quote builder', path: '/organizer/quote-builder' },
  events: { title: 'Events', path: '/organizer/events' },
  calendar: { title: 'Calendar', path: '/organizer/calendar' },
  subvendors: { title: 'Sub-vendors', path: '/organizer/subvendors' },
  publicEvents: { title: 'Public events', path: '/organizer/public-events' },
  earnings: { title: 'Earnings', path: '/organizer/earnings' },
  coupons: { title: 'Coupons', path: '/organizer/coupons' },
  badges: { title: 'Badges & tiers', path: '/organizer/badges' },
  academy: { title: 'Evently Academy', path: '/organizer/academy' },
  profile: { title: 'Profile', path: '/organizer/profile' },
} as const;

export type OrganizerRouteKey = keyof typeof ORGANIZER_ROUTES;

/** The five tabs: which page each opens, and how it looks on the bar. */
export const ORGANIZER_TABS: Array<{
  name: keyof OrganizerTabParamList;
  route: OrganizerRouteKey;
  look: TabLook;
}> = [
  {
    name: 'OrgHome',
    route: 'home',
    look: {
      gradient: ['#ff8a5c', '#e8433a'],
      ink: '#e2552f',
      on: 'home-variant',
      off: 'home-variant-outline',
      label: 'Home',
    },
  },
  {
    name: 'OrgEnquiries',
    route: 'enquiries',
    look: {
      gradient: ['#a084ff', '#5a35e0'],
      ink: '#6d4df2',
      on: 'message-text',
      off: 'message-text-outline',
      label: 'Enquiries',
    },
  },
  {
    name: 'OrgEvents',
    route: 'events',
    look: {
      gradient: ['#3cc9a1', '#0e8a68'],
      ink: '#0f8a68',
      on: 'party-popper',
      off: 'party-popper',
      label: 'Events',
    },
  },
  {
    name: 'OrgEarnings',
    route: 'earnings',
    look: {
      gradient: ['#ffc65c', '#e8902a'],
      ink: '#c7741a',
      on: 'wallet',
      off: 'wallet-outline',
      label: 'Earnings',
    },
  },
  {
    name: 'OrgProfile',
    route: 'profile',
    look: {
      gradient: ['#5b9bff', '#2554b8'],
      ink: '#2b5aa8',
      on: 'account-circle',
      off: 'account-circle-outline',
      label: 'Profile',
    },
  },
];

export const ORGANIZER_SHELL_COPY = {
  notifications: 'Notifications',
} as const;

/** A native organizer screen that a web path maps to, with its params. */
export type NativeOrganizerRoute =
  | {
      name:
        | 'OrganizerBadges'
        | 'OrganizerAcademy'
        | 'OrganizerCoupons'
        | 'OrganizerSubVendors'
        | 'OrganizerCalendar';
    }
  | { name: 'OrganizerQuote'; params: { requestId: string } }
  | { name: 'OrganizerSetup'; params?: { step: string } }
  | { name: 'OrganizerEvent'; params: { bookingId: string } }
  | { name: 'OrganizerIdeas'; params: { bookingId: string } }
  | { name: 'OrganizerPublicEvents' }
  | { name: 'OrganizerPublicEvent'; params: { eventId: string } }
  | { name: 'OrganizerInvitation'; params: { bookingId: string } };

export type NativeOrganizerScreen = NativeOrganizerRoute['name'];

/**
 * Organizer web paths that now have a native screen — a notification (or any
 * link) to one opens the native screen instead of the web page.
 */
/** Screens a path maps to with no params. */
type PlainOrganizerScreen = Exclude<
  NativeOrganizerScreen,
  | 'OrganizerQuote'
  | 'OrganizerSetup'
  | 'OrganizerEvent'
  | 'OrganizerIdeas'
  | 'OrganizerPublicEvent'
  | 'OrganizerInvitation'
>;

export const NATIVE_SCREEN_FOR_PATH: Record<string, PlainOrganizerScreen> = {
  '/organizer/badges': 'OrganizerBadges',
  '/organizer/academy': 'OrganizerAcademy',
  '/organizer/coupons': 'OrganizerCoupons',
  '/organizer/subvendors': 'OrganizerSubVendors',
  '/organizer/calendar': 'OrganizerCalendar',
  '/organizer/public-events': 'OrganizerPublicEvents',
};

/** The native route for a web path, params included; null when it is still a web page. */
export function nativeRouteForPath(path: string): NativeOrganizerRoute | null {
  const bare = path.split(/[?#]/)[0].replace(/\/+$/, '');
  if (bare === '/organizer/setup' || bare === '/onboarding/organizer') {
    const step = /[?&]step=([a-z]+)/.exec(path)?.[1];
    return step
      ? { name: 'OrganizerSetup', params: { step } }
      : { name: 'OrganizerSetup' };
  }
  // One event's workspace — not its ideas board or invitation, still web pages.
  const invitation = /^\/organizer\/invitation\/([^/]+)$/.exec(bare);
  if (invitation)
    return {
      name: 'OrganizerInvitation',
      params: { bookingId: invitation[1] },
    };
  const publicEvent = /^\/organizer\/public-events\/([^/]+)$/.exec(bare);
  if (publicEvent)
    return {
      name: 'OrganizerPublicEvent',
      params: { eventId: publicEvent[1] },
    };
  const ideas = /^\/organizer\/events\/([^/]+)\/ideas$/.exec(bare);
  if (ideas) return { name: 'OrganizerIdeas', params: { bookingId: ideas[1] } };
  const event = /^\/organizer\/events\/([^/]+)$/.exec(bare);
  if (event) return { name: 'OrganizerEvent', params: { bookingId: event[1] } };
  const quote = /^\/organizer\/respond\/([^/]+)$/.exec(bare);
  if (quote) return { name: 'OrganizerQuote', params: { requestId: quote[1] } };
  const name = NATIVE_SCREEN_FOR_PATH[bare];
  return name ? { name } : null;
}

export function nativeScreenForPath(
  path: string,
): NativeOrganizerScreen | null {
  return nativeRouteForPath(path)?.name ?? null;
}
