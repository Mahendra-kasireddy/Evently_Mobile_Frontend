import type { JoinRole } from '../../navigation/types';

export const COMING_SOON_BG = '#0e1a33'; // --color-navy-deep, matches Login/Onboarding
export const COMING_SOON_ACCENT = '#e8633a'; // --color-primary
export const COMING_SOON_ACCENT_WARM = '#ff8b5e'; // --color-accent-warm

export const COMING_SOON_ROLE_LABEL: Record<JoinRole, string> = {
  organizer: 'Organizer',
  subvendor: 'Sub-vendor',
};

export const COMING_SOON_ROLE_ICON: Record<JoinRole, string> = {
  organizer: 'briefcase-variant-outline',
  subvendor: 'truck-outline',
};

export const COMING_SOON_ROLE_DESCRIPTION: Record<JoinRole, string> = {
  organizer: "We're building a dedicated Organizer experience for the Evently app. It'll be ready soon.",
  subvendor: "We're building a dedicated Sub-vendor experience for the Evently app. It'll be ready soon.",
};
