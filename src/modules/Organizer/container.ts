import { useCallback, useMemo, useState } from 'react';
import { useOrganizer, useReviewSummary, useReviews, useServiceCategories } from './hooks';
import { fetchReviews } from './services';
import { mapOrganizer, ratingBars } from './utils';
import type { OrganizerViewModel, RatingBar, ReviewDTO, ReviewSummaryDTO } from './types';

const NO_SUMMARY: ReviewSummaryDTO = { average: 0, total: 0, histogram: [], tags: [] };

export interface OrganizerContainerResult {
  organizer: OrganizerViewModel | null;
  /** The reviews summary — zeros until any exist, never a failure. */
  summary: ReviewSummaryDTO;
  /** The histogram, already sized for the bars. */
  bars: RatingBar[];
  /** The single review shown inline. Null until one exists. */
  latestReview: ReviewDTO | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

export function useOrganizerContainer(organizerId: string): OrganizerContainerResult {
  const { data, loading, error, refetch } = useOrganizer(organizerId);
  const categories = useServiceCategories();
  const summary = useReviewSummary(organizerId);
  /*
   * The profile shows one review, so it asks for the first page and takes the
   * head of it. The reviews screen makes the same call, which React Navigation
   * keeps warm — opening "All reviews" from here costs no second round trip.
   */
  const reviews = useReviews(organizerId);

  const titles = useMemo(
    () => new Map((categories.data ?? []).map((c) => [c.id, c.title])),
    [categories.data],
  );

  const organizer = useMemo<OrganizerViewModel | null>(
    () => (data ? mapOrganizer(data, titles) : null),
    [data, titles],
  );

  const resolvedSummary = summary.data ?? NO_SUMMARY;

  return {
    organizer,
    // A profile whose reviews could not be counted still opens; the rating
    // panel simply says there are none rather than the screen failing.
    summary: resolvedSummary,
    bars: useMemo(() => ratingBars(resolvedSummary), [resolvedSummary]),
    latestReview: reviews.data?.items?.[0] ?? null,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
  };
}

export interface ReviewsContainerResult {
  summary: ReviewSummaryDTO;
  bars: RatingBar[];
  items: ReviewDTO[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  errorMessage: string | null;
  loadMore: () => void;
  refetch: () => void;
}

export function useReviewsContainer(organizerId: string): ReviewsContainerResult {
  const summary = useReviewSummary(organizerId);
  const first = useReviews(organizerId);
  /*
   * Later pages are appended locally rather than refetched from page one.
   * `useAsync` owns the first page and re-running it would collapse the list
   * back to twenty entries every time somebody asked for more.
   */
  const [extra, setExtra] = useState<ReviewDTO[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreAfter, setHasMoreAfter] = useState<boolean | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const items = useMemo(() => [...(first.data?.items ?? []), ...extra], [first.data, extra]);
  const hasMore = hasMoreAfter ?? first.data?.hasMore ?? false;

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    const next = page + 1;
    setIsLoadingMore(true);
    fetchReviews(organizerId, next)
      .then((data) => {
        setExtra((current) => [...current, ...data.items]);
        setHasMoreAfter(data.hasMore);
        setPage(next);
      })
      // A failed extra page leaves what is already on screen alone; the
      // button stays, so trying again costs one tap.
      .catch(() => {})
      .finally(() => setIsLoadingMore(false));
  }, [hasMore, isLoadingMore, organizerId, page]);

  const refetch = useCallback(() => {
    setExtra([]);
    setPage(1);
    setHasMoreAfter(null);
    first.refetch();
    summary.refetch();
  }, [first, summary]);

  return {
    summary: summary.data ?? NO_SUMMARY,
    bars: ratingBars(summary.data ?? NO_SUMMARY),
    items,
    hasMore,
    isLoading: first.loading,
    isLoadingMore,
    isError: first.error !== null,
    errorMessage: first.error?.message ?? null,
    loadMore,
    refetch,
  };
}
