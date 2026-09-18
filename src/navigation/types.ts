import type { NavigatorScreenParams } from '@react-navigation/native';
import type { SeeAllKind } from '../modules/Home/constants';

export type MainTabParamList = {
  Home: undefined;
  /**
   * The plan wizard. `organizerId` pre-selects an organizer, so "Request a
   * quote" from a profile lands here with them already chosen and the
   * customer only has to write the brief.
   */
  Plan:
    | { occasionId?: string; organizerId?: string; eventDate?: string }
    | undefined;
  /**
   * The customer's events. The same screen is also registered on the root
   * stack as `Bookings`, which is where Home's booked card and the workspace's
   * back button land; as a tab it is the customer's own way in, with no back
   * arrow because there is nothing to go back to.
   */
  Events: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type JoinRole = 'organizer' | 'subvendor';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Join: undefined;
  ComingSoon: { role: JoinRole };
  OrganizerOnboarding: undefined;
  /**
   * Typed with the tab list so a screen can name a tab — `navigate('Main', {
   * screen: 'Plan' })` — from either side of the boundary: from a tab it
   * bubbles up to this navigator, from a pushed stack screen it acts here.
   */
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Location: undefined;
  Notification: undefined;
  /**
   * One booking's workspace. `workspaceName` is optional and purely cosmetic:
   * it lets the header show the right name during the first load, before the
   * booking itself has arrived.
   */
  Workspace: { bookingId: string; workspaceName?: string };
  /**
   * The guest invitation. With a bookingId it opens that booking's invitation;
   * without one — the Profile entry point — it lists every invitation shared
   * with the customer.
   */
  Invitations: { bookingId?: string; organizerName?: string } | undefined;
  /**
   * The ideas & planning board for one booking. The two names are optional and
   * cosmetic — they let the board address the right people on its first frame,
   * without a second request for what the workspace already knows.
   */
  IdeaBoard: { bookingId: string; organizerName?: string; authorName?: string };
  /**
   * One Home section, in full.
   *
   * Every section on Home is a preview — the events stop at three, the offers
   * are a carousel — and each "See all" opens this with the section it means.
   * Separate from the `Events` tab on purpose: that tab is the customer's
   * bookings and the tools hanging off them, and a draft plan has none of
   * those.
   */
  SeeAll: { kind: SeeAllKind };
  /**
   * The two search screens behind Home's "tell us the basics" card.
   *
   * They take no params and return none: the field they edit lives in the
   * store, so a picker does not have to know which screen pushed it.
   */
  OccasionPicker: undefined;
  AreaPicker: undefined;
  /** What the customer has kept for later, from the Home carousel. */
  SavedPackages: undefined;
  /**
   * Packages and organizers matching a query. `openFilters` is how the home
   * header's filter button lands with the sheet already up.
   */
  Search:
    | { kind?: 'packages' | 'organizers'; openFilters?: boolean }
    | undefined;
  /** Every quote on one request, side by side. */
  CompareQuotes: { requestId: string; title?: string };
  /**
   * Two quotes on one request, matched line against line.
   *
   * Both quotation ids are route params rather than derived here, so the
   * screen compares exactly the pair the customer chose.
   */
  LineByLine: {
    requestId: string;
    leftId: string;
    rightId: string;
    title?: string;
  };
  /**
   * Paying the advance on an accepted quotation.
   *
   * The quotation is all that is required — the amount is priced server-side
   * from it. `couponCode` is carried through so the discount the customer
   * applied survives the hop, and `organizerId` only enables the "message
   * first" path; neither affects what is charged.
   */
  Payment: { quotationId: string; couponCode?: string; organizerId?: string };
  /**
   * The receipt, after the advance is settled.
   *
   * `inCash` changes what the screen says, not just how it looks: a cash
   * booking is booked with the advance still owed, and telling that customer
   * "Advance paid" would report money as having moved when it has not.
   */
  PaymentSuccess: { bookingId: string; organizerName?: string; inCash?: boolean };
  /** One organizer's full profile. `name` is only for the first render. */
  Organizer: { organizerId: string; name?: string };
  /** Everything people have said about that organizer. */
  OrganizerReviews: { organizerId: string; name?: string };
  /** One message thread. `withName` is only for the first render's header. */
  Conversation: { conversationId: string; withName?: string };
  /** Every event's agreed amount, what has been paid and what is still owed. */
  Payments: undefined;
  Settings: undefined;
  LegalSupport: undefined;
  /** Contact the Evently team — a real message, not a mailto. */
  Contact: undefined;
};
