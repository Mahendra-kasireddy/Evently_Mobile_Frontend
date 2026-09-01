import { apiClient } from '../../services/apiClient';
import { HOME_FEED_ENDPOINT, ORGANIZER_BY_ID_ENDPOINT, REQUEST_QUOTES_ENDPOINT } from './constants';
import type { HeroDraft, HomeFeedDTO, OrganizerProfileDTO } from './types';

/** Single responsibility: call the API and return its raw payload. */
export async function fetchHomeFeed(): Promise<HomeFeedDTO> {
  const { data } = await apiClient.get<HomeFeedDTO>(HOME_FEED_ENDPOINT);
  return data;
}

/** Hero "Get quotes" — opens a quote request from the draft fields. */
export async function requestQuotes(draft: HeroDraft): Promise<void> {
  await apiClient.post(REQUEST_QUOTES_ENDPOINT, draft);
}

/** "View Profile" — the organizer's sanitized public profile. */
export async function fetchOrganizerProfile(organizerId: string): Promise<OrganizerProfileDTO> {
  const { data } = await apiClient.get<OrganizerProfileDTO>(`${ORGANIZER_BY_ID_ENDPOINT}/${organizerId}`);
  return data;
}
