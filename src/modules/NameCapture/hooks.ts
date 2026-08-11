import { useAsync, type AsyncResult } from '../../hooks/useAsync';
import { useAsyncCallback, type AsyncCallbackResult } from '../../hooks/useAsyncCallback';
import { fetchNameStatus, updateName } from './services';
import type { UpdateNameResponseDTO, UserNameStatusDTO } from './types';

export function useNameStatus(): AsyncResult<UserNameStatusDTO> {
  return useAsync(fetchNameStatus, []);
}

export function useUpdateName(): AsyncCallbackResult<[string], UpdateNameResponseDTO> {
  return useAsyncCallback(updateName);
}
