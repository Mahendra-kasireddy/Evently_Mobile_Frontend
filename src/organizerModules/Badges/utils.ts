import { BADGES_COPY as COPY, TIER_PERKS } from './constants';
import type {
  BadgeStatusDTO,
  BadgesModel,
  LadderStep,
  RequirementModel,
} from './types';

/** 0.08 → "8%". */
export const ratePercent = (rate: number): string =>
  `${Math.round((rate ?? 0) * 100)}%`;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function mapRequirements(b: BadgeStatusDTO): RequirementModel[] {
  const req = b.nextRequirements;
  if (!req) return [];
  const rating = b.avgRating > 0 ? b.avgRating.toFixed(1) : '—';
  const eventsMet = b.events >= req.events;
  const ratingMet = b.avgRating >= req.avgRating;
  const trainingMet = b.trainingStage >= req.trainingStage;
  const complaintsMet = b.complaintsCount <= req.maxComplaints;
  return [
    {
      key: 'events',
      label: COPY.events,
      value: eventsMet ? `${b.events} ✓` : `${b.events}/${req.events}`,
      met: eventsMet,
      progress: req.events > 0 ? clamp01(b.events / req.events) : 1,
    },
    {
      key: 'rating',
      label: COPY.rating(req.avgRating),
      value: ratingMet ? `${rating} ✓` : rating,
      met: ratingMet,
      progress: req.avgRating > 0 ? clamp01(b.avgRating / req.avgRating) : 1,
    },
    {
      key: 'training',
      label: COPY.training(req.trainingStage),
      value: trainingMet
        ? `Stage ${b.trainingStage} ✓`
        : COPY.stage(b.trainingStage, req.trainingStage),
      met: trainingMet,
      progress:
        req.trainingStage > 0
          ? clamp01(b.trainingStage / req.trainingStage)
          : 1,
    },
    {
      key: 'complaints',
      label: COPY.complaints,
      value: complaintsMet ? `${b.complaintsCount} ✓` : `${b.complaintsCount}`,
      met: complaintsMet,
      progress: complaintsMet ? 1 : 0,
    },
  ];
}

export function mapLadder(b: BadgeStatusDTO): LadderStep[] {
  const at = b.tierLadder.findIndex(t => t.tier === b.currentTier);
  return b.tierLadder.map((t, i) => ({
    tier: t.tier,
    rate: ratePercent(t.commissionRate),
    state: i < at ? 'done' : i === at ? 'current' : 'ahead',
  }));
}

export function mapBadges(b: BadgeStatusDTO): BadgesModel {
  const rating = b.avgRating > 0 ? b.avgRating.toFixed(1) : '—';
  const req = b.nextRequirements;
  const next = b.nextTier;
  const nextRate =
    b.tierLadder.find(t => t.tier === next)?.commissionRate ?? null;
  const requirements = mapRequirements(b);
  return {
    hero: {
      tier: b.currentTier,
      title: COPY.organizer(b.currentTier),
      subtitle:
        next && req && b.events < req.events
          ? COPY.toNext(b.events, req.events, next, rating)
          : COPY.doneEvents(b.events, rating),
      rate: COPY.yourCommission(ratePercent(b.commissionRate)),
    },
    ladder: mapLadder(b),
    nextTier: next,
    requirements,
    perks: (next ? TIER_PERKS[next] ?? [] : []).map(p => ({
      icon: p.icon,
      label:
        nextRate === null
          ? p.label.replace(' {rate}', '')
          : p.label.replace('{rate}', ratePercent(nextRate)),
    })),
    metCount: requirements.filter(r => r.met).length,
  };
}
