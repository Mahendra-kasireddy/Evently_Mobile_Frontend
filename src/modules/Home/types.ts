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
  tags: string[];
}

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
  occasion: string;
  progress: number;
  daysToGo: number | null;
}

export interface HomeFeedDTO {
  user: ProfileSummaryDTO;
  content: HomeContentDTO;
  packages: PackageItemDTO[];
  topOrganizers: OrganizerDTO[];
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
  progress: number;
  daysToGo: number | null;
  stage: CurrentEventStage;
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

export interface FeaturedEventItem {
  id: string;
  badge: string;
  title: string;
  guests: string;
  budget: string;
  tags: string[];
}

export interface FeaturedEventsViewModel {
  title: string;
  subtitle: string;
  buildLabel: string | null;
  items: FeaturedEventItem[];
}

export interface RecommendedEventItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: OrganizerTier;
  rating: number;
  reviews: number;
  tags: string[];
}

export interface RecommendedEventsViewModel {
  title: string;
  seeAllLabel: string;
  items: RecommendedEventItem[];
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
  currentEvent: CurrentEventViewModel | null;
  categories: CategoriesViewModel | null;
  featuredEvents: FeaturedEventsViewModel | null;
  recommendedEvents: RecommendedEventsViewModel | null;
  howItWorks: HowItWorksViewModel | null;
  tools: ToolsViewModel | null;
}

export interface HomeHeaderViewModel {
  unreadCount: number;
  locationLabel: string;
}
