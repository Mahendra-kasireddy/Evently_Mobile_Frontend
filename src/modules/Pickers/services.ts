import { apiClient } from '../../services/apiClient';
import { RECENTS_ENDPOINT, type RecentKind } from './constants';
import type { RecentSearchDTO } from './types';

export async function fetchRecents(
  kind: RecentKind,
): Promise<RecentSearchDTO[]> {
  const { data } = await apiClient.get<RecentSearchDTO[]>(
    `${RECENTS_ENDPOINT}/${kind}`,
  );
  return data;
}

export async function recordRecent(
  kind: RecentKind,
  label: string,
  value: string,
): Promise<RecentSearchDTO> {
  const { data } = await apiClient.post<RecentSearchDTO>(RECENTS_ENDPOINT, {
    kind,
    label,
    value,
  });
  return data;
}

export async function removeRecent(id: string): Promise<void> {
  await apiClient.delete(`${RECENTS_ENDPOINT}/${id}`);
}
