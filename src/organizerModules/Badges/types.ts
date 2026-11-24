/** `GET /booking/organizer/badges`, then what the Badges screen draws. */

export interface TierRequirementsDTO {
  events: number;
  avgRating: number;
  trainingStage: number;
  maxComplaints: number;
}

export interface BadgeStatusDTO {
  currentTier: string;
  /** 0.12 = 12%. */
  commissionRate: number;
  events: number;
  avgRating: number;
  trainingStage: number;
  complaintsCount: number;
  nextTier: string | null;
  nextRequirements: TierRequirementsDTO | null;
  tierLadder: Array<{ tier: string; commissionRate: number }>;
}

export interface HeroModel {
  tier: string;
  /** "Silver organizer". */
  title: string;
  /** "7 of 10 events to Gold · 4.6★ rating". */
  subtitle: string;
  rate: string;
}

export interface LadderStep {
  tier: string;
  rate: string;
  state: 'done' | 'current' | 'ahead';
}

export type RequirementKey = 'events' | 'rating' | 'training' | 'complaints';

export interface RequirementModel {
  key: RequirementKey;
  label: string;
  /** "7/10", "4.6 ✓", "Stage 1 of 2". */
  value: string;
  met: boolean;
  /** 0–1. */
  progress: number;
}

export interface BadgesModel {
  hero: HeroModel;
  ladder: LadderStep[];
  nextTier: string | null;
  requirements: RequirementModel[];
  perks: Array<{ icon: string; label: string }>;
  /** How many of the next tier's requirements are met, "2 of 4". */
  metCount: number;
}
