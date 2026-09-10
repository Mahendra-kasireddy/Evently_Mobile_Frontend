import type { SearchFilters } from './types';

export const SEARCH_ENDPOINT = '/search';
export const OCCASIONS_ENDPOINT = '/plan/occasions';
export const CITIES_ENDPOINT = '/plan/cities';

// Web's tokens, scoped to this screen — matching the other ported surfaces.
export const SEARCH_ACCENT = '#e8633a';
export const SEARCH_NAVY = '#1a2e5a';
export const SEARCH_NAVY_DEEP = '#0e1a33';
export const SEARCH_CANVAS = '#faf8f7';

export const NO_FILTERS: SearchFilters = { occasion: '', city: '', maxBudget: '' };

/**
 * The ceilings a customer can pick, in rupees.
 *
 * Deliberately a short ladder rather than a slider: a slider implies the
 * platform knows the distribution of prices well enough to place a handle
 * meaningfully, and these are the bands the plan wizard already asks in.
 */
export const BUDGET_CEILINGS: Array<{ key: string; label: string; value: number }> = [
  { key: '1l', label: 'Under ₹1L', value: 100000 },
  { key: '3l', label: 'Under ₹3L', value: 300000 },
  { key: '5l', label: 'Under ₹5L', value: 500000 },
  { key: '10l', label: 'Under ₹10L', value: 1000000 },
];

export const SEARCH_COPY = {
  title: 'Search',
  placeholder: 'Search packages, organizers, decor',
  filters: 'Filters',
  clear: 'Clear',
  apply: 'Show results',
  occasion: 'Occasion',
  city: 'City',
  budget: 'Budget',
  any: 'Any',
  packages: 'Packages',
  organizers: 'Organizers',
  resultCount: (n: number) => (n === 1 ? '1 result' : `${n} results`),

  idleTitle: 'What are you planning?',
  idleBody: 'Search by occasion, an organizer’s name, or what you need — decor, catering, photography.',
  emptyTitle: 'Nothing matched',
  emptyBody: 'Try a shorter search, or clear a filter.',
  errorTitle: "We couldn't run that search",
  retry: 'Try again',
};
