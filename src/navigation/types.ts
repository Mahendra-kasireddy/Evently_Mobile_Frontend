export type MainTabParamList = {
  Home: undefined;
  Plan: { occasionId?: string } | undefined;
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
  Main: undefined;
  Location: undefined;
  Notification: undefined;
  Bookings: undefined;
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
  Settings: undefined;
  LegalSupport: undefined;
  /** Contact the Evently team — a real message, not a mailto. */
  Contact: undefined;
};
