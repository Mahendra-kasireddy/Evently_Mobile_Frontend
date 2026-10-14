import { brand } from '../../theme';
import type { RoleCardData } from './types';

/**
 * The business side of Evently, in the words a business owner uses.
 *
 * The first line of the description is the one that matters: the customer app
 * has no sign-up, so people arriving here have often come looking for one.
 * Saying outright that a business profile sits on the same number is what
 * stops an organizer registering twice.
 */
export const JOIN_COPY = {
  title: 'Register a business profile',
  subtitle:
    'Customers sign in with their number alone. Organizers and sub-vendors register a business profile on the same number.',
  footnote:
    'Business roles need GST and one ID proof. Takes about five minutes.',
} as const;

/** Stated on both cards rather than only in the footnote — people tap before they read to the end. */
export const REQUIREMENT_NOTE = 'Needs GST and one ID proof';

export const ROLE_CARDS: RoleCardData[] = [
  {
    key: 'organizer',
    icon: 'briefcase-outline',
    iconColor: brand.accentDeep,
    iconBackground: brand.accentSoft,
    title: 'Event organizer',
    description:
      'Receive customer briefs, send itemised quotes, assign sub-vendors and manage payouts.',
    requirement: REQUIREMENT_NOTE,
  },
  {
    key: 'subvendor',
    icon: 'account-switch-outline',
    iconColor: brand.navy,
    iconBackground: brand.coolSoft,
    title: 'Sub-vendor',
    description:
      'Catering, decor, photography, sound and more. Take jobs from organizers on the platform.',
    requirement: REQUIREMENT_NOTE,
  },
];
