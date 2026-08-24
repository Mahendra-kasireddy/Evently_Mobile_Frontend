export const DASHBOARD_ENDPOINT = '/booking/organizer/dashboard';
export const BADGES_ENDPOINT = '/booking/organizer/badges';
export const taskEndpoint = (bookingId: string, taskId: string): string => `/booking/${bookingId}/tasks/${taskId}`;

// Web's actual brand palette (evently-FrontEnd src/index.css :root) — same
// navy/orange identity the rest of the app's organizer-facing screens port.
export const OH_NAVY = '#1a2e5a';
export const OH_ACCENT = '#e8633a';
export const OH_TEXT_MUTED = '#5b6675';
export const OH_BORDER = '#ebebeb';
export const OH_BG = '#f8f8f6';
export const OH_TEAL = '#1d9e75';
export const OH_TEAL_SOFT = '#e5f6f0';
export const OH_AMBER = '#a2790a';
export const OH_AMBER_SOFT = '#fdf3d8';
export const OH_CORAL_SOFT = '#fdeee7';

export const TIER_COLOR: Record<string, string> = {
  bronze: '#a9673a',
  silver: '#8a94a6',
  gold: '#c9971f',
  platinum: '#8B5CF6',
};

export const HOME_COPY = {
  title: 'Your business, today',
  statsEnquiries: 'New enquiries',
  statsActive: 'Active bookings',
  statsMonth: 'This month',
  statsRating: 'Avg rating',
  tasksTitle: "Today's tasks",
  tasksEmpty: 'Nothing due today.',
  badgeTitle: 'Badge progress',
  topTierNote: "You've reached the top tier.",
  scheduleTitle: 'Next 7 days',
  scheduleEmpty: 'Nothing on the calendar this week.',
  enquiriesTitle: 'Pending enquiries',
  enquiriesEmpty: 'No open enquiries right now.',
} as const;
