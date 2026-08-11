import { apiClient } from '../../services/apiClient';
import { GET_USER_DETAILS_ENDPOINT, LOGOUT_ENDPOINT } from './constants';
import type { UserDetailsDTO } from './types';

export async function getUserDetails(): Promise<UserDetailsDTO> {
  const { data } = await apiClient.get<UserDetailsDTO>(GET_USER_DETAILS_ENDPOINT);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post(LOGOUT_ENDPOINT);
}
