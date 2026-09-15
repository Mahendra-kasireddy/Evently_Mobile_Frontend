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

/** Who delivers a package, as its card names them. */
export interface PackageOrganizerDTO {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  rating: number;
  reviews: number;
  /** The organizer's bookings this month — theirs, not the package's. */
  bookedThisMonth: number;
}

export interface PackageItemDTO {
  id: string;
  badge: string;
  title: string;
  guests: string;
  budget: string;
  tags: string[];
  /** The line over the banner, e.g. "Marigold stage · 150 guests". */
  bannerNote: string;
  /** '' falls back to the occasion illustration. */
  photoUrl: string;
  /** 0 when only the budget band is known. */
  price: number;
  /** 0 unless this is a real reduction — never a decorative "was" figure. */
  listPrice: number;
  organizer: PackageOrganizerDTO | null;
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
  /** Published starting price, in rupees. 0 when they have not set one. */
  basePrice: number;
  /** Typical hours to reply. 0 when unknown. */
  responseHours: number;
  /** Bookings taken since the start of the month; 0 when none. */
  bookedThisMonth: number;
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
  /** The underlying record's id — the request, plan or booking behind it. */
  refId: string;
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
  /** How many organizers have replied so far. */
  quoteCount: number;
  /** The spread across those replies, in rupees. Both 0 when none are priced. */
  lowestQuote: number;
  highestQuote: number;
  /** One row per organizer who replied, cheapest first. */
  quotes: QuoteRowDTO[];
  /**
   * How many organizers the brief was sent to. 0 on briefs from before
   * recipients were recorded — the card then counts what arrived rather than
   * claiming a total it does not know.
   */
  sentToCount: number;
  /** Recipients who have not replied yet, named. */
  awaiting: QuoteOrganizerRefDTO[];
  /** Whole days until the brief stops taking quotes; null if it never does. */
  closesInDays: number | null;
}

export interface QuoteOrganizerRefDTO {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

/** One organizer's reply, as the Home card lists it. */
export interface QuoteRowDTO {
  id: string;
  organizer: QuoteOrganizerRefDTO | null;
  total: number;
  lineItemCount: number;
  /** ISO — turned into "2h ago" by the mapper. */
  repliedAt: string | null;
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
  /** The occasion alone — the date and venue are their own fields. */
  title: string;
  description: string;
  /** "5 Sep 2026", '' when the booking has no date. */
  dateLabel: string;
  location: string;
  /** '' when the booking came from no brief — see ActiveBookingView. */
  guests: string;
  progress: number;
  daysToGo: number;
  status: BookedEventStatus;
  /** False while the booking is paid for but not yet accepted by the organizer. */
  organizerConfirmed: boolean;
  organizerName: string;
  organizerId: string;
  organizerInitials: string;
  organizerAvatarColor: string;
  /** Distinct sub-vendors actually assigned to this event; 0 if none yet. */
  vendorCount: number;
  steps: BookedStepDTO[];
}

/** GET /offer/live, via the home payload — only offers live right now. */
export interface OfferDTO {
  id: string;
  eyebrow: string;
  title: string;
  terms: string;
  ctaLabel: string;
  tone: string;
  /** '' when the offer does not expire. */
  endsLabel: string;
}

/**
 * GET /home/getHomeFeed → `coupons`. A live platform coupon this customer
 * could still use — see `CouponService.listClaimable`.
 *
 * Deliberately unpriced: away from a checkout there is no booking total to
 * take a percentage of, so the terms come across and the saving does not.
 */
export interface ClaimableCouponDTO {
  id: string;
  code: string;
  title: string;
  /** The organizer it belongs to, or '' when it is platform-wide. */
  organizerName: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount: number;
  minBookingAmount: number;
  /** '' / null when the coupon does not expire. */
  endsAt: string | null;
  perCustomerLimit: number;
  /** How many times this customer has already spent it. */
  timesUsed: number;
}

/** One tile in "Plan something new". */
export interface OccasionTileDTO {
  id: string;
  label: string;
  art: string;
  /** Cheapest published base price among organizers serving it; 0 when none. */
  fromPrice: number;
  /** True for the single most-planned occasion, false for all when none. */
  mostPlanned: boolean;
  /** An uploaded photo for this tile, or '' to use the illustration. */
  imageUrl?: string;
}

export interface HomeFeedDTO {
  user: ProfileSummaryDTO;
  content: HomeContentDTO;
  packages: PackageItemDTO[];
  topOrganizers: OrganizerDTO[];
  topOrganizersScope: OrganizerScope;
  /**
   * The ongoing booking behind Home's rich "BOOKED" card. Null at every other
   * stage, where the `currentEvent` hero carries the event instead.
   */
  booking: BookedEventDTO | null;
  currentEvent: CurrentEventDTO | null;
  /**
   * The customer's other live events, furthest along first, never repeating
   * `currentEvent`.
   *
   * Empty for most accounts. It is not empty when somebody has, say, a
   * confirmed booking in December and a brief still gathering quotes for
   * September — two events, and Home used to show only the first.
   */
  otherEvents: CurrentEventDTO[];
  unreadCount: number;
  offers: OfferDTO[];
  coupons: ClaimableCouponDTO[];
  occasions: OccasionTileDTO[];
  /** For the header's heart badge, without fetching the list it does not show. */
  savedPackageCount: number;
}

// ---------------------------------------------------------------------------
// UI view models — what sections/ actually render. Built by utils.ts mappers
// and assembled by container.ts. Each top-level field is nullable so a
// missing/empty backend section simply disappears from the screen.
// ---------------------------------------------------------------------------

export interface CurrentEventViewModel {
  /** The underlying record's id, so the hero's button can open it. */
  refId: string;
  title: string;
  occasion: string;
  when: string;
  where: string;
  guests: string;
  source: EventSource;
  progress: number;
  daysToGo: number | null;
  stage: CurrentEventStage;
  /** "5 Sep 2026 · Kukatpally · 150 guests" — only the parts that exist. */
  factsLine: string;
  /** The stage, as the card's eyebrow says it. */
  stageLabel: string;
  quoteCount: number;
  /** '' when nothing is priced yet; else "Lowest ₹6,25,000 · highest ₹7,42,000". */
  spreadLabel: string;
  /** '' when no quotes have arrived; else "3 organizers have quoted". */
  quotedLabel: string;
  /**
   * "Your request went to 4 organizers · 3 have replied", or just the replies
   * when the brief predates the recipient list. '' before anyone has answered.
   */
  reachLine: string;
  /** "Closes in 4 days" / "Closes today", or '' when it never closes. */
  closesLabel: string;
  /** The replies, cheapest first. Empty until somebody quotes. */
  quoteRows: QuoteRow[];
  /** "Sreeja Wedding Co. hasn't replied yet", or '' when everyone has. */
  awaitingLabel: string;
  /**
   * The main button's words.
   *
   * Counted where there is something to count — "Compare 3 quotes" says what
   * pressing it gets you, which "Compare quotes" does not.
   */
  ctaLabel: string;
}

/** One organizer's reply, ready to render. */
export interface QuoteRow {
  id: string;
  organizerName: string;
  initials: string;
  avatarColor: string;
  /** "₹6,25,000". */
  totalLabel: string;
  /** "7 line items · 2h ago" — only the parts that are known. */
  metaLabel: string;
  /** "Lowest" on the cheapest, else "+₹59,000" against it. */
  deltaLabel: string;
  isLowest: boolean;
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
  /** "5 Sep 2026 · Kukatpally · 150 guests" — only the facts we hold. */
  factsLine: string;
  /** "3 days to go" / "Today" — the number is emphasised by the card. */
  daysToGoValue: string;
  daysToGoLabel: string;
  progress: number;
  daysToGo: number;
  status: BookedEventStatus;
  organizerConfirmed: boolean;
  organizerName: string;
  organizerId: string;
  organizerInitials: string;
  organizerAvatarColor: string;
  /** "Managing 6 vendors for you", or what is true when there are none. */
  organizerNote: string;
  /** "1 of 4 steps done". */
  stepsDoneLabel: string;
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

export interface PackageOrganizer {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  /** '' when the organizer has taken none this month. */
  bookedLabel: string;
}

export interface PackageItem {
  id: string;
  badge: string;
  title: string;
  guests: string;
  budget: string;
  tags: string[];
  art: OccasionArtKey;
  bannerNote: string;
  photoUrl: string;
  /** The price as printed, or '' when only the band is known. */
  priceLabel: string;
  /** The struck-through original, or '' when there is no real reduction. */
  listPriceLabel: string;
  organizer: PackageOrganizer | null;
}

/** A label/value line in the coupon's details sheet. */
export interface CouponDetail {
  label: string;
  value: string;
}

/**
 * One card in the promo strip.
 *
 * The code sits where a category label used to: it is the part the customer
 * actually needs, and reading it off the card is the only way to carry it to a
 * checkout. `terms` is derived from the coupon's real limits rather than from
 * marketing copy, so a card cannot promise a condition the coupon does not
 * have.
 */
export interface CouponOffer {
  id: string;
  /** Shown as the eyebrow — this is a real, spendable code. */
  code: string;
  title: string;
  /** "On bookings over ₹50,000 · ends 30 September", or '' when unbounded. */
  terms: string;
  ctaLabel: string;
  tone: 'accent' | 'navy';
  description: string;
  details: CouponDetail[];
}

export interface CouponsViewModel {
  title: string;
  /** "3 live" — the real count, never a fixed label. */
  countLabel: string;
  items: CouponOffer[];
}

export interface OccasionTile {
  id: string;
  label: string;
  art: OccasionArtKey;
  icon: OccasionIcon;
  /** "From ₹40,000", "Most planned", or '' when neither is known. */
  note: string;
  /**
   * An uploaded photo for this tile, already absolutised, or '' for none.
   *
   * '' is the ordinary case and not a missing value: the tile then paints its
   * `art` gradient, which is what every tile has always shown.
   */
  photoUrl: string;
}

export interface OccasionsViewModel {
  title: string;
  subtitle: string;
  items: OccasionTile[];
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
  /** "₹7L" — '' when they have published no starting price. */
  fromLabel: string;
  /** "Replies in 1h" — '' when their response time is unknown. */
  repliesLabel: string;
  /** "19 booked this month" — '' when they have taken none. */
  bookedLabel: string;
}

export interface TopOrganizersViewModel {
  title: string;
  /** The caveat when the list had to widen past the city; '' when it did not. */
  scopeNote: string;
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
  /** The live events the big card is not already about. Usually empty. */
  otherEvents: CurrentEventViewModel[];
  categories: CategoriesViewModel | null;
  /** "Plan something new" — the occasion grid, replacing the old categories. */
  occasions: OccasionsViewModel | null;
  offers: CouponsViewModel | null;
  packages: PackagesViewModel | null;
  topOrganizers: TopOrganizersViewModel | null;
  howItWorks: HowItWorksViewModel | null;
  tools: ToolsViewModel | null;
}

export interface HomeHeaderViewModel {
  unreadCount: number;
  /** How many packages the account has kept — the heart's badge. */
  savedCount: number;
  locationLabel: string;
}
