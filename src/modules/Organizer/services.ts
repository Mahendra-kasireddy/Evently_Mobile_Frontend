import { apiClient } from '../../services/apiClient';
import {
  MY_REVIEW_ENDPOINT,
  ORGANIZER_BY_ID_ENDPOINT,
  REVIEWS_ENDPOINT,
  REVIEW_TAGS_ENDPOINT,
  SERVICE_CATEGORIES_ENDPOINT,
} from './constants';
import type { OrganizerDetailDTO, ReviewPageDTO, ReviewSummaryDTO } from './types';

export async function fetchOrganizer(organizerId: string): Promise<OrganizerDetailDTO> {
  const { data } = await apiClient.get<OrganizerDetailDTO>(
    `${ORGANIZER_BY_ID_ENDPOINT}/${organizerId}`,
  );
  return data;
}

/**
 * The service categories, so a "Handles" chip reads "Decor & flowers" rather
 * than the raw key the organizer priced. Shared with the plan wizard, which is
 * what keeps the two screens naming the same service the same way.
 */
export async function fetchServiceCategories(): Promise<Array<{ id: string; title: string }>> {
  const { data } = await apiClient.get<Array<{ id: string; title: string }>>(
    SERVICE_CATEGORIES_ENDPOINT,
  );
  return Array.isArray(data) ? data : [];
}

export async function fetchReviewSummary(organizerId: string): Promise<ReviewSummaryDTO> {
  const { data } = await apiClient.get<ReviewSummaryDTO>(
    `${REVIEWS_ENDPOINT}/${organizerId}/summary`,
  );
  return data;
}

export async function fetchReviews(organizerId: string, page = 1): Promise<ReviewPageDTO> {
  const { data } = await apiClient.get<ReviewPageDTO>(`${REVIEWS_ENDPOINT}/${organizerId}`, {
    params: { page },
  });
  return data;
}

export async function fetchReviewTags(): Promise<Array<{ key: string; label: string }>> {
  const { data } = await apiClient.get<Array<{ key: string; label: string }>>(REVIEW_TAGS_ENDPOINT);
  return Array.isArray(data) ? data : [];
}

export async function canReviewBooking(
  bookingId: string,
): Promise<{ canReview: boolean; reason: string }> {
  const { data } = await apiClient.get<{ canReview: boolean; reason: string }>(
    `${MY_REVIEW_ENDPOINT}/${bookingId}/can-review`,
  );
  return data;
}

/**
 * Posts a review for one of the caller's own completed bookings.
 *
 * Only the booking id and what the customer wrote — the organizer, occasion
 * and date are read from the booking server-side, so none of them can be
 * pointed at somebody else.
 */
export async function postReview(
  bookingId: string,
  body: { rating: number; comment: string; tags: string[] },
): Promise<void> {
  await apiClient.post(`${MY_REVIEW_ENDPOINT}/${bookingId}`, body);
}
