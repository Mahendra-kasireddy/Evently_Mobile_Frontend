import { useCallback } from 'react';
import { useAsync, type AsyncResult } from '../../hooks/useAsync';
import { useAsyncCallback, type AsyncCallbackResult } from '../../hooks/useAsyncCallback';
import {
  approveInvitation,
  fetchGuests,
  fetchInvitation,
  fetchMyInvitations,
  personalizeBlock,
  requestInvitationChange,
  shareInvitation,
} from './services';
import type {
  BlockPatch,
  GuestDTO,
  InvitationDTO,
  InvitationSummaryDTO,
  ShareResultDTO,
} from './types';

export function useMyInvitations(): AsyncResult<InvitationSummaryDTO[]> {
  return useAsync(fetchMyInvitations, []);
}

export function useInvitation(bookingId: string): AsyncResult<InvitationDTO | null> {
  const load = useCallback(() => fetchInvitation(bookingId), [bookingId]);
  return useAsync(load, [bookingId]);
}

export function useApproveInvitation(): AsyncCallbackResult<[string], InvitationDTO> {
  return useAsyncCallback(approveInvitation);
}

export function usePersonalizeBlock(): AsyncCallbackResult<[string, string, BlockPatch], InvitationDTO> {
  return useAsyncCallback(personalizeBlock);
}

export function useRequestInvitationChange(): AsyncCallbackResult<
  [string, string, string | undefined],
  void
> {
  return useAsyncCallback(requestInvitationChange);
}

export function useGuests(): AsyncCallbackResult<[string], GuestDTO[]> {
  return useAsyncCallback(fetchGuests);
}

export function useShareInvitation(): AsyncCallbackResult<
  [string, { section?: string; guestIds: string[]; newGuests: Array<{ name: string; phone: string }> }],
  ShareResultDTO
> {
  return useAsyncCallback(shareInvitation);
}
