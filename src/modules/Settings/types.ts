/** What the customer may change about their own account. */
export interface ProfileDetails {
  name: string;
  email: string;
  city: string;
}

/** PATCH /user/updateProfile — only the fields the customer owns. */
export type UpdateProfileBody = Partial<ProfileDetails> & {
  /** An Evently upload's URL (from POST /upload); the server checks the host. */
  photoUrl?: string;
};

export interface UserDetailsDTO {
  id: string;
  name: string;
  phone: string;
  email?: string;
  /** '' or absent until the customer adds one. */
  photoUrl?: string;
  phoneVerified: boolean;
  city: string;
  roles: string[];
  status: string;
  createdAt: string;
}

export interface SettingsField {
  key: keyof ProfileDetails;
  label: string;
  hint?: string;
  placeholder: string;
  keyboard: 'default' | 'email-address';
  autoCapitalize: 'words' | 'none';
}

/** GET/PATCH /user/preferences — what the customer has chosen to be told about. */
export interface NotificationPrefs {
  quotes: boolean;
  invitations: boolean;
  marketing: boolean;
}

export interface PrefToggle {
  key: keyof NotificationPrefs;
  title: string;
  subtitle: string;
}
