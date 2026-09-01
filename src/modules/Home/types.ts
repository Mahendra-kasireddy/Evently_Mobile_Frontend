// ---------------------------------------------------------------------------
// Raw API DTOs — mirror the backend's GET /home/getHomeFeed contract exactly.
// Extend this shape (and the mappers in utils.ts) as new sections are added
// (booking, notifications, upcoming events, ...) without touching the UI.
// ---------------------------------------------------------------------------

export interface ProfileSummaryDTO {
  id: string;
  name: string;
  initials: string;
  location: string;
}

export interface HeroDraft {
  occasion: string;
  when: string;
  where: string;
  guests: string;
}

export interface HeroOptions {
  occasion: string[];
  when: string[];
  where: string[];
  guests: string[];
}

export type TrustIcon = 'zap' | 'shield' | 'star';

export interface TrustItemDTO {
  icon: TrustIcon;
  label: string;
}

export interface HeroContentDTO {
  greetingTemplate: string;
  headingLead: string;
  headingAccent: string;
  headingTail: string;
  subtitle: string;
  draftLabel: string;
  defaultDraft: HeroDraft;
  options: HeroOptions;
  trust: TrustItemDTO[];
}

export type OccasionIcon = 'heart' | 'gift' | 'home' | 'sparkles' | 'star' | 'briefcase';

export type OccasionArtKey = 'wedding' | 'birthday' | 'housewarming' | 'naming' | 'anniversary' | 'corporate';

export interface OccasionCardDTO {
  id: string;
  icon: OccasionIcon;
  art: OccasionArtKey;
  label: string;
  cta: string;
}

export interface PlanSectionDTO {
  title: string;
  subtitle: string;
  occasions: OccasionCardDTO[];
}

export type HowStepIcon = 'edit' | 'file' | 'chart' | 'shield';

export interface HowStepDTO {
  num: string;
  icon: HowStepIcon;
  title: string;
  description: string;
}

export interface HowItWorksDTO {
  title: string;
  subtitle: string;
  steps: HowStepDTO[];
}

export type ToolIcon = 'wallet' | 'users' | 'list' | 'bell';

export interface ToolDTO {
  id: string;
  icon: ToolIcon;
  title: string;
  description: string;
}

export interface ToolsSectionDTO {
  title: string;
  subtitle: string;
  tools: ToolDTO[];
}

export interface HomeContentDTO {
  hero: HeroContentDTO;
  planSection: PlanSectionDTO;
  packages: { title: string; subtitle: string; buildLabel?: string };
  topOrganizers: { title: string; seeAllLabel: string };
  howItWorks: HowItWorksDTO;
  tools: ToolsSectionDTO;
}

export interface PackageItemDTO {
  id: string;
  badge: string;
  title: string;
  guests: string;
  budget: string;
  tags: string[];
  /** Which illustration and gradient the card's banner uses. */
  art: OccasionArtKey;
}

export type OrganizerTier = 'Gold' | 'Silver' | 'Platinum';

export interface OrganizerDTO {
  id: string;
  initials: string;
  name: string;
  avatarColor: string;
  tier: OrganizerTier;
  rating: number;
  reviews: number;
  /** Events this organizer has run — 0 for one who has not run any yet. */
  events: number;
  tags: string[];
  location: string;
}

/**
 * Whether `topOrganizers` really are in the customer's city ('city'), or come
 * from further afield because nothing local existed ('all'). The section says
 * which, rather than letting a "near you" heading imply the first.
 */
export type OrganizerScope = 'city' | 'all';

/**
 * GET /organizer/getOrganizerById/:id — the sanitized public profile. Only the
 * fields the detail sheet shows are declared; the endpoint returns more.
 */
export interface OrganizerProfileDTO {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: OrganizerTier;
  rating: number;
  reviews: number;
  events: number;
  tags: string[];
  location: string;
  city: string;
  occasions: string[];
  capacityMin: number;
  capacityMax: number;
  estRange: string;
  responseRate: number;
  responseHours: number;
  businessName: string;
  displayName: string;
}

/** Which real record the Home event resolved from — decides where tapping it goes. */
export type EventSource = 'plan' | 'quote' | 'booking';

export type CurrentEventStage =
  | 'draft'
  | 'submitted'
  | 'quotes_received'
  | 'quote_accepted'
  | 'booking_created'
  | 'booking_confirmed'
  | 'in_progress'
  | 'completed';

export interface CurrentEventDTO {
  stage: CurrentEventStage;
  title: string;
  /**
   * The four facts the Home card shows. Each comes from the underlying record
   * — a booking's fixed date and venue, or the brief's own words — and is ''
   * when that record doesn't carry it, never a placeholder.
   */
  occasion: string;
  when: string;
  where: string;
  guests: string;
  /** Which record this resolved from — decides where tapping it goes. */
  source: EventSource;
  progress: number;
  daysToGo: number | null;
}

/**
 * Statuses a live booking can be in behind the Home "BOOKED" card. Mirrors the
 * backend's LIVE_BOOKING_STATUSES — terminal states never reach this card.
 */
export type BookedEventStatus = 'pending' | 'awaiting_organizer' | 'confirmed' | 'in_progress';

export interface BookedStepDTO {
  label: string;
  done: boolean;
}

/**
 * The customer's ongoing booking, already composed by the backend
 * (BookingService.getActiveForUser): a derived title, status-aware copy, and
 * milestones whose done-count is what `progress` is calculated from. Nothing
 * here is re-derived on the client.
 */
export interface BookedEventDTO {
  id: string;
  ref: string;
  title: string;
  description: string;
  progress: number;
  daysToGo: number;
  status: BookedEventStatus;
  /** False while the booking is paid for but not yet accepted by the organizer. */
  organizerConfirmed: boolean;
  organizerName: string;
  steps: BookedStepDTO[];
}

export interface HomeFeedDTO {
  user: ProfileSummaryDTO;
  content: HomeContentDTO;
  packages: PackageItemDTO[];
  topOrganizers: OrganizerDTO[];
  topOrganizersScope: OrganizerScope;
  /**
   * The ongoing booking behind Home's rich "BOOKED" card. Null at every other
   * stage, where the compact `currentEvent` widget shows instead — the two are
   * mutually exclusive, as they are on web.
   */
  booking: BookedEventDTO | null;
  currentEvent: CurrentEventDTO | null;
  unreadCount: number;
}

// ---------------------------------------------------------------------------
// UI view models — what sections/ actually render. Built by utils.ts mappers
// and assembled by container.ts. Each top-level field is nullable so a
// missing/empty backend section simply disappears from the screen.
// ---------------------------------------------------------------------------

export interface CurrentEventViewModel {
  title: string;
  occasion: string;
  when: string;
  where: string;
  guests: string;
  source: EventSource;
  progress: number;
  daysToGo: number | null;
  stage: CurrentEventStage;
}

export interface BookedStep {
  label: string;
  done: boolean;
}

export interface BookedEventViewModel {
  id: string;
  ref: string;
  title: string;
  description: string;
  progress: number;
  daysToGo: number;
  status: BookedEventStatus;
  organizerConfirmed: boolean;
  organizerName: string;
  steps: BookedStep[];
}

export interface TrustItem {
  icon: TrustIcon;
  label: string;
}

export interface BannerViewModel {
  greeting: string;
  headingLead: string;
  headingAccent: string;
  headingTail: string;
  subtitle: string;
  draftLabel: string;
  defaultDraft: HeroDraft;
  options: HeroOptions;
  trust: TrustItem[];
}

export interface CategoryItem {
  id: string;
  icon: OccasionIcon;
  art: OccasionArtKey;
  label: string;
  cta: string;
}

export interface CategoriesViewModel {
  title: string;
  subtitle: string;
  items: CategoryItem[];
}

export interface PackageItem {
  id: string;
  badge: string;
  title: string;
  guests: string;
  budget: string;
  tags: string[];
  art: OccasionArtKey;
}

export interface PackagesViewModel {
  title: string;
  subtitle: string;
  /** "Build your own" — omitted when the backend supplies no label. */
  buildLabel: string | null;
  items: PackageItem[];
}

export interface OrganizerItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: OrganizerTier;
  rating: number;
  reviews: number;
  events: number;
  tags: string[];
}

export interface TopOrganizersViewModel {
  title: string;
  items: OrganizerItem[];
  /** Where these organizers came from, so the section can caveat itself. */
  scope: OrganizerScope;
  /** The customer's city, for that caveat. '' when none is set. */
  city: string;
}

export interface HowStepItem {
  num: string;
  icon: HowStepIcon;
  title: string;
  description: string;
}

export interface HowItWorksViewModel {
  title: string;
  subtitle: string;
  steps: HowStepItem[];
}

export interface ToolItem {
  id: string;
  icon: ToolIcon;
  title: string;
  description: string;
}

export interface ToolsViewModel {
  title: string;
  subtitle: string;
  tools: ToolItem[];
}

export interface HomeViewModel {
  banner: BannerViewModel | null;
  bookedEvent: BookedEventViewModel | null;
  currentEvent: CurrentEventViewModel | null;
  categories: CategoriesViewModel | null;
  packages: PackagesViewModel | null;
  topOrganizers: TopOrganizersViewModel | null;
  howItWorks: HowItWorksViewModel | null;
  tools: ToolsViewModel | null;
}

export interface HomeHeaderViewModel {
  unreadCount: number;
  locationLabel: string;
}
