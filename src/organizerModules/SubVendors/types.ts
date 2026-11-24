/*
 * `GET /booking/organizer/subvendors` as the organizer receives it, then the
 * view models the Sub-vendors screen draws. Only the fields this screen reads
 * are typed.
 */

export type SubVendorLinkStatus = 'pending' | 'active' | 'removed';

export interface SubVendorRefDTO {
  id: string;
  fullName: string;
  initials: string;
  avatarColor: string;
  /** `food`, `decor`, `photography`… — the backend's SubVendorCategory. */
  category: string;
  serviceArea: string;
  baseRate: number;
  /** "plate", "day", "event"… */
  baseRateUnit: string;
  /** The vendor's own availability, independent of the link status. */
  active: boolean;
}

export interface SubVendorLinkDTO {
  linkId: string;
  status: SubVendorLinkStatus;
  /** The 10-digit mobile the organizer invited; null when the vendor linked themselves. */
  invitedPhone: string | null;
  /** When the link was made (ISO). Null on legacy links. */
  invitedAt: string | null;
  rating: number;
  /** Null until the invited number signs up as a sub-vendor. */
  subVendor: SubVendorRefDTO | null;
  /** Tasks this vendor finished for this organizer. */
  eventsCount: number;
  /** Done ÷ accepted tasks, 0–100. 0 when nothing was accepted yet. */
  performancePercent: number;
}

/** `POST /organizer/subvendors/invite` — the backend's InviteSubvendorDto. */
export interface InviteBody {
  phone: string;
}

export interface InviteResult {
  linkId: string;
  status: SubVendorLinkStatus;
}

export type ChipTone = 'green' | 'amber' | 'grey';

/** A sub-vendor who is on the team (the link resolved to a profile). */
export interface MemberItem {
  linkId: string;
  name: string;
  initials: string;
  /** Category key, for the filter chips. */
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  serviceArea: string;
  /** "₹450 / plate", or '' when the vendor hasn't set a rate. */
  rate: string;
  /** 0–100, or null when no task has been accepted yet. */
  performance: number | null;
  eventsDone: number;
  chip: { label: string; tone: ChipTone };
}

/** An invited number that hasn't signed up yet. */
export interface PendingItem {
  linkId: string;
  /** "+91 98765 43210". */
  phone: string;
  /** "Sent 2h ago", or '' when the API has no date. */
  sentAgo: string;
}

/** `all`, or a category key. */
export type CategoryFilter = string;

export interface FilterChip {
  key: CategoryFilter;
  label: string;
  count: number;
}

export type PerformanceTone = 'good' | 'fair' | 'low';
