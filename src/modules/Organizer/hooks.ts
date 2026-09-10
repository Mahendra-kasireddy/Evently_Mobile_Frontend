import { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import {
  canReviewBooking,
  fetchOrganizer,
  fetchReviewTags,
  fetchReviews,
  fetchReviewSummary,
  fetchServiceCategories,
  postReview,
} from './services';

export function useOrganizer(organizerId: string) {
  const load = useCallback(() => fetchOrganizer(organizerId), [organizerId]);
  return useAsync(load, [organizerId]);
}

export function useServiceCategories() {
  return useAsync(fetchServiceCategories, []);
}

export function useReviewSummary(organizerId: string) {
  const load = useCallback(() => fetchReviewSummary(organizerId), [organizerId]);
  return useAsync(load, [organizerId]);
}

export function useReviews(organizerId: string) {
  const load = useCallback(() => fetchReviews(organizerId, 1), [organizerId]);
  return useAsync(load, [organizerId]);
}

export function useReviewTags() {
  return useAsync(fetchReviewTags, []);
}

export function useCanReview(bookingId: string) {
  const load = useCallback(() => canReviewBooking(bookingId), [bookingId]);
  return useAsync(load, [bookingId]);
}

export function usePostReview() {
  return useAsyncCallback(postReview);
}
