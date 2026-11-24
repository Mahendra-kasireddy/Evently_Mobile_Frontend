export const BADGES_ENDPOINT = '/booking/organizer/badges';

/**
 * What a tier unlocks — a business promise, not data, so it lives here. The
 * commission perk carries `{rate}`, filled from the live tier ladder so it can
 * never drift from what the backend charges.
 */
export const TIER_PERKS: Record<
  string,
  Array<{ icon: string; label: string }>
> = {
  Gold: [
    { icon: 'trending-up', label: 'Higher search ranking' },
    { icon: 'shield-check-outline', label: 'Verified+ badge' },
    { icon: 'percent-outline', label: 'Lower {rate} commission' },
    { icon: 'account-group-outline', label: 'Priority enquiries' },
  ],
  Platinum: [
    { icon: 'trending-up', label: 'Top search placement' },
    { icon: 'shield-star-outline', label: 'Platinum badge' },
    { icon: 'percent-outline', label: 'Lowest {rate} commission' },
    { icon: 'headset', label: 'Dedicated support' },
  ],
};

export const BADGES_COPY = {
  title: 'Badges & tiers',
  loading: 'Loading your tier…',
  error: 'We couldn’t load your tier.',
  retry: 'Try again',

  currentTier: 'Current tier',
  organizer: (tier: string) => `${tier} organizer`,
  toNext: (events: number, need: number, tier: string, rating: string) =>
    `${events} of ${need} events to ${tier} · ${rating}★ rating`,
  doneEvents: (events: number, rating: string) =>
    `${events} events completed · ${rating}★ rating`,
  yourCommission: (rate: string) => `You pay ${rate} commission`,

  ladderTitle: 'Your path',
  commission: (rate: string) => `${rate} fee`,
  you: 'You',

  requirementsTitle: (tier: string) => `Reach ${tier}`,
  requirementsMet: (met: number, total: number) => `${met} of ${total} done`,
  events: 'Events completed',
  rating: (min: number) => `Average rating ${min.toFixed(1)}+`,
  training: (stage: number) =>
    stage <= 1
      ? 'Academy stage 1'
      : stage === 2
      ? 'Academy stages 1 & 2'
      : `Academy stages 1–${stage}`,
  complaints: 'No major complaints',
  stage: (have: number, need: number) => `Stage ${have} of ${need}`,
  goAcademy: 'Go to Academy',

  unlocksTitle: (tier: string) => `What unlocks at ${tier}`,

  topTitle: 'You’re at the top tier',
  topBody:
    'Platinum is the highest tier — you have every perk and the lowest commission.',

  helpTitle: (tier: string) => `Need help reaching ${tier}?`,
  helpBody: 'Our team can build a plan with you.',
  helpCta: 'Talk to us',
} as const;
