import type { OccasionArtKey } from '../../Components';

/**
 * GET /user/saved-packages — the live package documents, populated from the
 * ids on the account. Same shape the Home carousel reads, because it is the
 * same collection: a saved package that the admin later edits shows its new
 * price band here rather than the one it had when it was saved.
 */
export interface SavedPackageDTO {
  id: string;
  badge: string;
  title: string;
  guests: string;
  budget: string;
  tags: string[];
  art: OccasionArtKey;
}
