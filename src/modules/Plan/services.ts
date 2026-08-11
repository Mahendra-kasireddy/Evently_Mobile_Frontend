import { apiClient } from '../../services/apiClient';
import {
  CREATE_PLAN_ENDPOINT,
  MY_DRAFT_ENDPOINT,
  PLAN_ORGANIZERS_ENDPOINT,
  PLAN_SCREEN_ENDPOINT,
  REQUEST_QUOTE_FROM_ORGANIZER_ENDPOINT,
  SAVE_DRAFT_ENDPOINT,
} from './constants';
import type {
  PlanOrganizerDTO,
  PlanScreenDTO,
  PlanSubmissionDTO,
  PlanUpsertDTO,
  RecommendationArgs,
  RequestQuoteFromOrganizerDTO,
} from './types';

export async function fetchPlanScreen(): Promise<PlanScreenDTO> {
  const { data } = await apiClient.get<PlanScreenDTO>(PLAN_SCREEN_ENDPOINT);
  return data;
}

export async function fetchOrganizers(args: RecommendationArgs): Promise<PlanOrganizerDTO[]> {
  const { data } = await apiClient.get<PlanOrganizerDTO[]>(PLAN_ORGANIZERS_ENDPOINT, {
    params: {
      categories: args.categories.join(','),
      occasion: args.occasion || undefined,
      guests: args.guests || undefined,
      city: args.city || undefined,
      area: args.area || undefined,
      budget: args.budget || undefined,
      eventDate: args.eventDate || undefined,
      sort: args.sort || undefined,
      minRating: args.minRating || undefined,
      tiers: args.tiers && args.tiers.length ? args.tiers.join(',') : undefined,
      requireCategories:
        args.requireCategories && args.requireCategories.length ? args.requireCategories.join(',') : undefined,
      maxPrice: args.maxPrice || undefined,
      availableOnly: args.availableOnly ? 'true' : undefined,
    },
  });
  return data;
}

export async function fetchMyDraft(): Promise<PlanSubmissionDTO | null> {
  const { data } = await apiClient.get<PlanSubmissionDTO | null>(MY_DRAFT_ENDPOINT);
  return data;
}

export async function saveDraft(body: PlanUpsertDTO): Promise<PlanSubmissionDTO> {
  const { data } = await apiClient.put<PlanSubmissionDTO>(SAVE_DRAFT_ENDPOINT, body);
  return data;
}

export async function createPlan(body: PlanUpsertDTO): Promise<PlanSubmissionDTO> {
  const { data } = await apiClient.post<PlanSubmissionDTO>(CREATE_PLAN_ENDPOINT, body);
  return data;
}

export async function requestQuoteFromOrganizer(body: RequestQuoteFromOrganizerDTO): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(REQUEST_QUOTE_FROM_ORGANIZER_ENDPOINT, body);
  return data;
}
