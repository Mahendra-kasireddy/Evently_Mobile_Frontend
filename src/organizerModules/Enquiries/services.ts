import { apiClient } from '../../services/apiClient';
import { INCOMING_ENDPOINT } from './constants';
import type { IncomingRequestDTO } from './types';

/** Every request this organizer can see — sent to them, or open to all matches. */
export async function getIncomingRequests(): Promise<IncomingRequestDTO[]> {
  const { data } = await apiClient.get<IncomingRequestDTO[]>(INCOMING_ENDPOINT);
  return data;
}
