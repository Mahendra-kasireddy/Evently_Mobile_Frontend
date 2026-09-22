export interface UserDetailsDTO {
  id: string;
  name: string;
  phone: string;
  email?: string;
  phoneVerified: boolean;
  city: string;
  roles: string[];
  status: string;
  createdAt: string;
}

/** Which group a row belongs to. */
export type ProfileGroupKey = 'events' | 'account' | 'more';

/** Where a row goes. Kept as a key so the screen owns navigation, not the data. */
export type ProfileAction =
  | 'bookings'
  | 'savedPackages'
  | 'invitations'
  | 'guestList'
  | 'payments'
  | 'location'
  | 'notifications'
  | 'settings'
  | 'listBusiness'
  | 'help'
  | 'signOut';

export interface ProfileRowSpec {
  action: ProfileAction;
  icon: string;
  label: string;
}

export interface ProfileGroupSpec {
  key: ProfileGroupKey;
  title: string;
  rows: ProfileRowSpec[];
}

/**
 * The counts that ride on a row as a pill.
 *
 * Each is optional by nature rather than by failure — an account with nothing
 * saved and nothing to approve is the normal early state — and a zero shows no
 * pill at all rather than a badge reading "0".
 */
export interface ProfileBadges {
  savedPackages: number;
  invitationsToApprove: number;
}

export interface ProfileViewModel {
  /** '' when the account has no name yet, so the screen can prompt for one. */
  displayName: string;
  initials: string;
  /**
   * The phone with its middle digits masked — what the screen prints. The
   * unmasked number is not carried here because nothing on this screen shows it.
   */
  maskedPhone: string;
  /** Every role the account holds, not just the first. */
  roles: string[];
  /** True when the account already runs a business, so it is not asked to list one. */
  isOrganizer: boolean;
}
