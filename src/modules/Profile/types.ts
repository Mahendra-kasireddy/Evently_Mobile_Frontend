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

/** One fact about the account, and whether it is missing. */
export interface ProfileFact {
  key: string;
  icon: string;
  label: string;
  value: string;
  /** Shown in place of a value the account does not hold. */
  emptyHint?: string;
  /** True once the phone has been verified — the only fact that carries a badge. */
  verified?: boolean;
}

export interface ProfileViewModel {
  /** '' when the account has no name yet, so the screen can prompt for one. */
  displayName: string;
  initials: string;
  /** Every role the account holds, not just the first. */
  roles: string[];
  facts: ProfileFact[];
}
