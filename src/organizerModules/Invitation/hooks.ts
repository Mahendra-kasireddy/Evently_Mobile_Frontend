import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import {
  getInvitation,
  patchInvitation,
  resolveChangeRequest,
  sendInvitation,
} from './services';

export const useOrganizerInvitation = (bookingId: string) =>
  useAsync(() => getInvitation(bookingId), [bookingId]);
export const usePatchInvitation = () => useAsyncCallback(patchInvitation);
export const useSendInvitation = () => useAsyncCallback(sendInvitation);
export const useResolveRequest = () => useAsyncCallback(resolveChangeRequest);
