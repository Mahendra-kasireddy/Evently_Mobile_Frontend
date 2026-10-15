import { brand } from '../../theme';
import type { RoleCardData } from './types';

/**
 * The business side of Evently, in the words a business owner uses — and
 * only what is true of the sign-up as it is built:
 *
 *   organizer   mobile → name, business, category, city → dashboard.
 *               Services, portfolio and ID (Aadhaar + PAN) come later, from
 *               the dashboard, before going live. GST is optional. Bank
 *               details only before the first payout.
 *   sub-vendor  mobile → your service and rate → dashboard. No documents.
 *
 * The old copy said "Needs GST and one ID proof" on both — wrong for both,
 * and the kind of line that sends somebody without a GSTIN away.
 */
export const JOIN_COPY = {
  eyebrow: 'FOR BUSINESSES',
  title: 'Work with Hypie',
  subtitle:
    'Get booked for events near you. Sign in with the same number you already use — one account, both sides.',
  chips: [
    { icon: 'lightning-bolt', label: '2-min signup' },
    { icon: 'file-clock-outline', label: 'Docs later' },
    { icon: 'account-sync-outline', label: 'One account' },
  ],
  pick: 'I am a…',
  howTitle: 'How it works',
  steps: [
    { icon: 'cellphone-check', title: 'Verify mobile', body: 'A 6-digit code' },
    { icon: 'form-textbox', title: 'Add basics', body: 'About 2 minutes' },
    {
      icon: 'view-dashboard-outline',
      title: 'Start working',
      body: 'Your dashboard',
    },
  ],
  sameNumber: 'Already a customer? Use the same number.',
  /** Kept for the render dump and anything that still reads it. */
  footnote:
    'No documents needed to start. ID is asked only before you go live.',
} as const;

export const ROLE_CARDS: RoleCardData[] = [
  {
    key: 'organizer',
    icon: 'briefcase-variant-outline',
    iconColor: '#ffffff',
    iconBackground: brand.accentSoft,
    gradient: ['#f47b4d', '#e2477a'],
    title: 'Event organizer',
    description: 'Plan and run whole events — weddings, birthdays, corporate',
    perks: [
      'Get customer requests in your city',
      'Send itemised quotes and get booked',
      'Assign sub-vendors and track payouts',
    ],
    requirement: '2 min · ID later',
  },
  {
    key: 'subvendor',
    icon: 'room-service-outline',
    iconColor: '#ffffff',
    iconBackground: brand.coolSoft,
    gradient: ['#7c8cff', '#4b3bd6'],
    title: 'Sub-vendor',
    description: 'One service — catering, decor, photos, sound, mehendi',
    perks: [
      'Take jobs from organizers on Hypie',
      'Set your own rate per plate, day or event',
      'Link to an organizer you already work with',
    ],
    requirement: '1 min · No documents',
  },
];
