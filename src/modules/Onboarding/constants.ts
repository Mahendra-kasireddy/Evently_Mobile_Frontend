import type { OnboardingSlide } from './types';

// Web's actual brand palette (evently-FrontEnd/src/index.css :root) — same
// navy/orange identity Home/Plan/Login already port. Scoped to this module only.
export const ONBOARDING_BG = '#0e1a33'; // --color-navy-deep
export const ONBOARDING_ACCENT = '#e8633a'; // --color-primary
export const ONBOARDING_ACCENT_WARM = '#ff8b5e'; // --color-accent-warm

// Exactly 3 slides, one idea each, short enough to read in a glance — the
// same real value proposition web's login promo panel states, trimmed down
// (web's /onboarding routes are organizer/sub-vendor signup, a different
// audience entirely, so this copy isn't ported from a literal onboarding page).
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    key: 'welcome',
    icon: 'shield-check-outline',
    heading: 'Plan events, effortlessly',
    subtitle: 'Track your event and approve every detail, all in one place.',
  },
  {
    key: 'organizers',
    icon: 'creation',
    heading: 'One organizer, everything covered',
    subtitle: 'Catering, decor, photography & more — no juggling vendors.',
  },
  {
    key: 'quotes',
    icon: 'file-document-outline',
    heading: 'Compare quotes with confidence',
    subtitle: 'See transparent, itemised quotes before you decide.',
  },
];
