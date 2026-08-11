import type { SettingsPref } from './types';

// Mirrors the web app's own settings page, which is also local-state only —
// there's no backend preferences endpoint yet, on either platform.
export const INITIAL_PREFS: SettingsPref[] = [
  {
    key: 'email',
    group: 'Notifications',
    title: 'Email notifications',
    subtitle: 'Quotes, bookings and payment updates.',
    enabled: true,
  },
  {
    key: 'push',
    group: 'Notifications',
    title: 'Push notifications',
    subtitle: 'Real-time alerts on your phone.',
    enabled: true,
  },
  {
    key: 'marketing',
    group: 'Notifications',
    title: 'Offers & tips',
    subtitle: 'Occasional ideas to plan better events.',
    enabled: false,
  },
  {
    key: 'profileVisible',
    group: 'Privacy',
    title: 'Show profile to organizers',
    subtitle: 'Let organizers see your name when you request quotes.',
    enabled: true,
  },
];
