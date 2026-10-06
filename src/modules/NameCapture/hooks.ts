import { useAsync, type AsyncResult } from '../../hooks/useAsync';
import { useAsyncCallback, type AsyncCallbackResult } from '../../hooks/useAsyncCallback';
import { fetchNameStatus, updateProfileBasics } from './services';
import type { ProfileBasics, UpdateNameResponseDTO, UserNameStatusDTO } from './types';

export function useNameStatus(): AsyncResult<UserNameStatusDTO> {
  return useAsync(fetchNameStatus, []);
}

export function useUpdateProfileBasics(): AsyncCallbackResult<[ProfileBasics], UpdateNameResponseDTO> {
  return useAsyncCallback(updateProfileBasics);
}
