import type { OccasionArtKey } from '../../Components';

export interface PlanOccasionDTO {
  id: string;
  label: string;
  art: OccasionArtKey;
}

export type CategoryIcon =
  | 'food'
  | 'water'
  | 'decor'
  | 'photo'
  | 'music'
  | 'priest'
  | 'mehendi'
  | 'transport';

export interface PlanCategoryDTO {
  id: string;
  title: string;
  subtitle: string;
  icon: CategoryIcon;
}

export type OrgTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface PlanOrganizerDTO {
  id: string;
  initials: string;
  name: string;
  avatarColor: string;
  tier: OrgTier;
  rating: number;
  reviews: number;
  events: number;
  location: string;
  tags: string[];
  matches: number;
  total: number;
  estRange: string;
  reasons?: string[];
  estMin?: number;
  estMax?: number;
  available?: boolean;
  responseHours?: number;
  score?: number;
  concierge?: boolean;
}

export type RecommendationSort =
  | 'best'
  | 'rating'
  | 'price'
  | 'events'
  | 'response'
  | 'nearest';

export interface PlanFiltersDTO {
  tiers: OrgTier[];
  ratings: string[];
  categories: string[];
  sorts: string[];
}

export interface PlanStepDTO {
  id: string;
  label: string;
  heading: string;
  subtitle: string;
}

export type TrustIcon = 'zap' | 'shield' | 'calendar';
export interface PlanTrustDTO {
  icon: TrustIcon;
  label: string;
}

export type NextIcon = 'file' | 'chart' | 'heart';
export interface WhatNextItemDTO {
  icon: NextIcon;
  title: string;
  desc: string;
}

export interface IdeasConfigDTO {
  title: string;
  subtitle: string;
  suggestions: string[];
  placeholder: string;
}

export interface QuoteNoteDTO {
  title: string;
  text: string;
}

export interface PlanScreenDTO {
  occasions: PlanOccasionDTO[];
  steps: PlanStepDTO[];
  cityOptions: string[];
  guestOptions: string[];
  budgetOptions: string[];
  subtitle: string;
  trust: PlanTrustDTO[];
  whatNext: WhatNextItemDTO[];
  ideas: IdeasConfigDTO;
  budgetBanner: string;
  quoteNote: QuoteNoteDTO;
  continueLabel: string;
  footnote: string;
  categories: PlanCategoryDTO[];
  filters: PlanFiltersDTO;
}

export type PlanStatus =
  | 'draft'
  | 'submitted'
  | 'quoted'
  | 'booked'
  | 'cancelled';

/** A persisted event plan returned by the backend (getMyDraft/createPlan/saveDraft). */
export interface PlanSubmissionDTO {
  id: string;
  planCode?: string;
  occasion: string;
  eventDate?: string;
  city: string;
  area: string;
  guests: string;
  budget: string;
  ideas: string;
  categories: string[];
  status: PlanStatus;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload for PUT /plan/saveDraft and POST /plan/createPlan. */
export interface PlanUpsertDTO {
  occasion?: string;
  eventDate?: string;
  city?: string;
  area?: string;
  guests?: string;
  budget?: string;
  ideas?: string;
  categories?: string[];
}

/** Query args for GET /plan/getOrganizers. */
export interface RecommendationArgs {
  categories: string[];
  occasion?: string;
  guests?: string;
  city?: string;
  area?: string;
  budget?: string;
  eventDate?: string;
  sort?: RecommendationSort;
  minRating?: number;
  tiers?: string[];
  requireCategories?: string[];
  maxPrice?: number;
  availableOnly?: boolean;
}

/**
 * POST /quote/requestQuoteFromOrganizer — the brief, addressed to one
 * organizer.
 *
 * The four optional fields below used to be missing, and the wizard sent only
 * the occasion, date, place and headcount: an organizer opened a request for a
 * wedding and could not see which services had been asked for, because the
 * customer's choices never left the phone. `RequestQuotesDto` on the server
 * has accepted all of them the whole time.
 */
export interface RequestQuoteFromOrganizerDTO {
  /**
   * Every organizer the customer chose. A brief can go to several now, so
   * this is a list even when they picked one — the server records the same
   * recipient list either way, and "went to 1 organizer" and "went to 4" are
   * then the same code path rather than two.
   */
  organizerIds: string[];
  occasion: string;
  when?: string;
  where?: string;
  guests?: string;
  /**
   * The plan this brief was raised from. Without it the plan and the request
   * are two unrelated records, and the customer's one event is listed twice —
   * once as a plan in progress, once as a brief awaiting replies.
   */
  planId?: string;
  budget?: string;
  /** The service categories chosen in step 2 — what the organizer is quoting for. */
  categories?: string[];
  /** The customer's own words, from "Your ideas & special requests". */
  ideas?: string;
}

// ---- Client-only wizard draft (not a DTO — local state, persisted via PlanUpsertDTO) ----

export interface PlanDraft {
  occasionId: string;
  eventDate: string;
  city: string;
  area: string;
  guests: string;
  budget: string;
  ideas: string;
  categories: string[];
  /**
   * The organizers this brief will be sent to, in the order they were ticked.
   *
   * A list rather than one id: a customer comparing quotes needs more than one
   * to compare, and sending the same brief four times by hand was the only way
   * to get that before. Capped in the UI at MAX_ORGANIZERS, which matches the
   * server's own ceiling.
   */
  selectedOrganizerIds: string[];
  step: number;
}

export type SubmitPhase = 'idle' | 'saving' | 'quoting';
