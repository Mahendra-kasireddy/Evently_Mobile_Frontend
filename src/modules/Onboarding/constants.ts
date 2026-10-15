import type { OnboardingSlide } from './types';

// Hypie's light, warm look — the same page colour as the splash and the
// "How do you want to use Hypie?" screen. Scoped to this module only.
export const ONBOARDING_BG = '#fff8f4';
export const ONBOARDING_INK = '#1b1f4b';
export const ONBOARDING_MUTED = '#6b6f86';
export const ONBOARDING_ACCENT = '#f0603a';
/** The buttons run warm orange into violet, like the app icon. */
export const ONBOARDING_BUTTON: [string, string] = ['#ff8a4c', '#8a4dff'];

// Exactly 3 slides, one idea each, short enough to read in a glance.
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    key: 'discover',
    art: 'discover',
    image: require('../../assets/images/onboarding_discover.png'),
    glow: '#ffe4d6',
    heading: 'Discover & Book\nYour Celebrations',
    subtitle:
      'Find the perfect event for your special moments, compare options and book with ease.',
  },
  {
    key: 'platform',
    art: 'platform',
    image: require('../../assets/images/onboarding_platform.png'),
    glow: '#ece6ff',
    heading: 'One Platform,\nEndless Possibilities',
    subtitle:
      'Connecting customers, organizers and vendors for unforgettable celebrations.',
  },
  {
    key: 'celebrate',
    art: 'celebrate',
    image: require('../../assets/images/onboarding_celebrate.png'),
    glow: '#ffe3ee',
    heading: 'Let’s Make\nYour Moments Special!',
    subtitle: 'Celebrate More. Stress Less.',
  },
];
