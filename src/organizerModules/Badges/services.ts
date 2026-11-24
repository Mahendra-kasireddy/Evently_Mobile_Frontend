import { apiClient } from '../../services/apiClient';
import { BADGES_ENDPOINT } from './constants';
import type { BadgeStatusDTO } from './types';

export async function getBadgeStatus(): Promise<BadgeStatusDTO> {
  const { data } = await apiClient.get<BadgeStatusDTO>(BADGES_ENDPOINT);
  return data;
}
