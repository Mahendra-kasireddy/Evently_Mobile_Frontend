import { apiClient } from '../../services/apiClient';
import { CITIES_ENDPOINT, OCCASIONS_ENDPOINT, SEARCH_ENDPOINT } from './constants';
import type { SearchKind, SearchResultsDTO } from './types';

export interface SearchParams {
  q: string;
  occasion: string;
  city: string;
  maxBudget: number | null;
  kind: SearchKind;
}

/**
 * One search.
 *
 * Empty values are dropped rather than sent as blanks: the endpoint treats
 * every filter as optional, and `occasion=` would otherwise reach the server
 * as a real filter matching nothing.
 */
export async function search(params: SearchParams): Promise<SearchResultsDTO> {
  const query: Record<string, string | number> = {};
  if (params.q.trim()) query.q = params.q.trim();
  if (params.occasion) query.occasion = params.occasion;
  if (params.city) query.city = params.city;
  if (params.maxBudget != null) query.maxBudget = params.maxBudget;
  if (params.kind !== 'all') query.kind = params.kind;

  const { data } = await apiClient.get<SearchResultsDTO>(SEARCH_ENDPOINT, { params: query });
  return data;
}

/** The filter sheet's own options — the same lists the plan wizard offers. */
export async function fetchOccasions(): Promise<Array<{ id: string; label: string }>> {
  const { data } = await apiClient.get<Array<{ id: string; label: string }>>(OCCASIONS_ENDPOINT);
  return Array.isArray(data) ? data : [];
}

export async function fetchCities(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>(CITIES_ENDPOINT);
  return Array.isArray(data) ? data : [];
}
