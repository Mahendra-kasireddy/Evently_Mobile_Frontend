import { apiClient } from '../../services/apiClient';
import { EARNINGS_ENDPOINT } from './constants';
import type { EarningsDTO } from './types';

export async function getEarnings(): Promise<EarningsDTO> {
  const { data } = await apiClient.get<EarningsDTO>(EARNINGS_ENDPOINT);
  return data;
}
