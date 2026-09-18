import type { RecentKind } from './constants';

/** GET /search/recents/:kind */
export interface RecentSearchDTO {
  id: string;
  kind: RecentKind;
  /** What the row shows. */
  label: string;
  /** What the draft stores — an occasion id, or the area text itself. */
  value: string;
}

/** One row in a picker, whether it came from the server list or a recent. */
export interface PickerOption {
  label: string;
  value: string;
  /**
   * What the recents list should call this, when the row's own label is a
   * prompt rather than a name — the typed-area row reads `Use “Patrika Nagar”`
   * and must be remembered as `Patrika Nagar`.
   */
  rememberAs?: string;
}
