import type { StoredFile } from '../Shared';

/*
 * The organizer's own profile endpoints, then the view models the Profile and
 * Edit screens draw. Only the fields these screens read are typed.
 */

/** `GET /organizer/profile`. */
export interface OrganizerProfileDTO {
  id: string;
  onboardingStatus: string;
  firstName: string;
  lastName: string;
  businessName: string;
  displayName: string;
  tagline: string;
  businessDescription: string;
  primaryCategory: string;
  secondaryCategories: string[];
  city: string;
  profilePhoto: StoredFile | null;
  gallery: StoredFile[];
}

/** `GET /organizer/profile/preview` — what customers see, and whether they can. */
export interface ProfilePreviewDTO {
  rating: number;
  reviews: number;
  events: number;
  tier: string;
  isLive: boolean;
}

/** `GET /organizer/services-config` — the categories only. */
export interface ServicesConfigDTO {
  categories: Array<{ key: string; label: string }>;
}

export interface IdentityModel {
  name: string;
  /** "Wedding Planner · Hyderabad". */
  subtitle: string;
  initials: string;
  photoUrl: string;
  tier: string;
  isLive: boolean;
  rating: string;
  reviews: number;
  events: number;
}

export interface PortfolioImage {
  key: string;
  /** Already absolutised — safe to hand to an Image. */
  uri: string;
}

export type ProfileAction =
  | 'editProfile'
  | 'setup'
  | 'services'
  | 'bank'
  | 'coupons'
  | 'badges'
  | 'academy'
  | 'subvendors'
  | 'notifications'
  | 'switchCustomer'
  | 'help'
  | 'signOut';

export interface MenuRow {
  action: ProfileAction;
  icon: string;
  label: string;
  hint?: string;
}

export interface MenuGroupSpec {
  key: string;
  title: string;
  rows: MenuRow[];
}

/** The editable fields on the Edit business profile screen. */
export interface EditForm {
  businessName: string;
  displayName: string;
  tagline: string;
  businessDescription: string;
  secondaryCategories: string[];
}

export type EditErrors = Partial<Record<keyof EditForm, string>>;
