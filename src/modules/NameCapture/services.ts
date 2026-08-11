import { apiClient } from '../../services/apiClient';
import { GET_USER_DETAILS_ENDPOINT, UPDATE_PROFILE_ENDPOINT } from './constants';
import type { UpdateNameResponseDTO, UserNameStatusDTO } from './types';

export async function fetchNameStatus(): Promise<UserNameStatusDTO> {
  const { data } = await apiClient.get<UserNameStatusDTO>(GET_USER_DETAILS_ENDPOINT);
  return data;
}

export async function updateName(name: string): Promise<UpdateNameResponseDTO> {
  const { data } = await apiClient.patch<UpdateNameResponseDTO>(UPDATE_PROFILE_ENDPOINT, { name });
  return data;
}
