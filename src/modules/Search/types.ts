import type { OrganizerDTO, PackageItemDTO } from '../Home/types';

export type SearchKind = 'all' | 'packages' | 'organizers';

/** GET /search — the same shapes Home renders, so one card serves both. */
export interface SearchResultsDTO {
  packages: PackageItemDTO[];
  organizers: OrganizerDTO[];
  total: number;
}

/** What the customer has narrowed the search to. */
export interface SearchFilters {
  occasion: string;
  city: string;
  /** '' means no ceiling; otherwise a budget-range key from the plan config. */
  maxBudget: string;
}
