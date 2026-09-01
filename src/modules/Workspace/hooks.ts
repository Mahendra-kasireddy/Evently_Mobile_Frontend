import { useCallback } from 'react';
import { useAsync, type AsyncResult } from '../../hooks/useAsync';
import { useAsyncCallback, type AsyncCallbackResult } from '../../hooks/useAsyncCallback';
import {
  approveIdea,
  createIdea,
  fetchBookingDetail,
  fetchIdeaBoard,
  fetchInvitation,
  uploadIdeaImage,
} from './services';
import type {
  BookingDetailDTO,
  DraftPost,
  IdeaBoardDTO,
  IdeaDTO,
  IdeaImage,
  InvitationDTO,
  PickedImage,
} from './types';

export function useBookingDetail(bookingId: string): AsyncResult<BookingDetailDTO> {
  const load = useCallback(() => fetchBookingDetail(bookingId), [bookingId]);
  return useAsync(load, [bookingId]);
}

export function useIdeaBoard(bookingId: string): AsyncResult<IdeaBoardDTO> {
  const load = useCallback(() => fetchIdeaBoard(bookingId), [bookingId]);
  return useAsync(load, [bookingId]);
}

/** Resolves to null while the invitation is still the organizer's draft. */
export function useInvitation(bookingId: string): AsyncResult<InvitationDTO | null> {
  const load = useCallback(() => fetchInvitation(bookingId), [bookingId]);
  return useAsync(load, [bookingId]);
}

export function usePostIdea(): AsyncCallbackResult<[string, DraftPost], IdeaDTO> {
  return useAsyncCallback(createIdea);
}

export function useUploadIdeaImage(): AsyncCallbackResult<[PickedImage], IdeaImage> {
  return useAsyncCallback(uploadIdeaImage);
}

export function useApproveIdea(): AsyncCallbackResult<[string], IdeaDTO> {
  return useAsyncCallback(approveIdea);
}
