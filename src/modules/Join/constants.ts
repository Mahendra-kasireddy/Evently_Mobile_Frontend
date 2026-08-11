import type { RoleCardData } from './types';

// Web's actual brand palette (evently-FrontEnd/src/index.css :root) — same
// navy/orange identity Home/Login already port. Scoped to this module only.
export const JOIN_BG = '#f8f8f6'; // --color-bg
export const JOIN_NAVY = '#1a2e5a'; // --color-navy / --color-text
export const JOIN_ACCENT = '#e8633a'; // --color-primary
export const JOIN_TEXT_MUTED = '#5b6675'; // --color-text-muted
export const JOIN_GREEN = '#1d9e75';

// Copy + role data ported from web's /join page (evently-FrontEnd
// src/features/auth/join/Component.tsx JOIN_COPY + join/service.ts mockRoles).
// This is business-account (organizer/sub-vendor) signup, a separate audience
// from the customer app's phone+OTP login — mobile only surfaces the entry
// point + a "coming soon" placeholder, since the full onboarding wizards
// (bank details, GST, service categories, etc.) are web-only for now.
export const JOIN_COPY = {
  title: 'Join as your role.',
  subtitle: 'Manage events, coordinate services, or deliver on the ground — Evently connects all three.',
} as const;

export const ROLE_CARDS: RoleCardData[] = [
  {
    key: 'organizer',
    icon: 'briefcase-variant-outline',
    badgeIcon: 'trophy-outline',
    badge: 'Gold',
    title: "I'm an Organizer",
    description: 'Manage bookings, coordinate sub-vendors, build your event business — all from one dashboard.',
    cta: 'Get started',
    accent: JOIN_ACCENT,
    accentSoft: '#fdeee7',
    badgeSoft: '#fbf1dc',
  },
  {
    key: 'subvendor',
    icon: 'truck-outline',
    badgeIcon: 'star-outline',
    badge: 'Score 92',
    title: "I'm a Sub-vendor",
    description: 'Accept tasks from organizers, deliver your services, and get paid automatically — no chasing needed.',
    cta: 'Get started',
    accent: JOIN_GREEN,
    accentSoft: '#e5f6f0',
    badgeSoft: '#e5f6f0',
  },
];
