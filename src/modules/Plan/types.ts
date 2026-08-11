import type { OccasionArtKey } from '../../Components';

export interface PlanOccasionDTO {
  id: string;
  label: string;
  art: OccasionArtKey;
}

export type CategoryIcon = 'food' | 'water' | 'decor' | 'photo' | 'music' | 'priest' | 'mehendi' | 'transport';

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

export type RecommendationSort = 'best' | 'rating' | 'price' | 'events' | 'response' | 'nearest';

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

export type PlanStatus = 'draft' | 'submitted' | 'quoted' | 'booked' | 'cancelled';

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

export interface RequestQuoteFromOrganizerDTO {
  organizerId: string;
  occasion: string;
  when?: string;
  where?: string;
  guests?: string;
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
  selectedOrganizerId: string;
  step: number;
}

export type SubmitPhase = 'idle' | 'saving' | 'quoting';
