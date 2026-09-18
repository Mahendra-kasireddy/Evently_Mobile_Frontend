export const RECENTS_ENDPOINT = '/search/recents';

/** Matches the server's RecentSearchKind — one list per picker. */
export type RecentKind = 'occasion' | 'area';

export const PICKER_COPY = {
  occasion: {
    title: 'Occasion',
    placeholder: 'Search occasion',
    listHeading: 'All occasions',
    empty: 'No occasion matches that.',
  },
  area: {
    title: 'Where',
    placeholder: 'Search area',
    listHeading: 'Popular cities',
    empty: 'No city matches that.',
  },
  recentsHeading: 'Recent searches',
} as const;

/**
 * Offered when nothing the customer typed matches a listed city.
 *
 * An Indian locality is not reliably in any list — "Patrika Nagar" is a real
 * place a real event happens in — and a picker that refuses what someone typed
 * sends them back to a city that is not where their event is.
 */
export const USE_TYPED_AREA_PREFIX = 'Use';

export const GUESTS_COPY = {
  title: 'Guests',
  subtitle: 'Roughly how many people?',
  customLabel: 'Another number',
  customPlaceholder: 'e.g. 250',
  done: 'Done',
} as const;

/** What the card shows before the customer has said otherwise. */
export const DEFAULT_GUESTS = '100';

/** The presets, used when the feed sends none. */
export const GUESTS_FALLBACK = ['50', '100', '200', '300', '500', '1000'];
