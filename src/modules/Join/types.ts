import type { JoinRole } from '../../navigation/types';

export interface RoleCardData {
  key: JoinRole;
  icon: string;
  iconColor: string;
  iconBackground: string;
  title: string;
  /** The two ends of the card's icon gradient. */
  gradient: [string, string];
  description: string;
  /** What the role gets, three short lines. */
  perks: string[];
  /** What it takes to start — said on the card, because people tap before reading on. */
  requirement: string;
}
