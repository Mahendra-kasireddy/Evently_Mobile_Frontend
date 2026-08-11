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
  Main: undefined;
  Location: undefined;
  Notification: undefined;
  Bookings: undefined;
  Invitations: undefined;
  Settings: undefined;
  LegalSupport: undefined;
};
