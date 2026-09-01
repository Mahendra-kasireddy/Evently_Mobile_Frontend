import { useCallback, useMemo } from 'react';
import { useBookingDetail, useIdeaBoard, useInvitation } from './hooks';
import { mapWorkspace } from './utils';
import type { IdeaCounts, InvitationDTO, WorkspaceViewModel } from './types';

export interface WorkspaceContainerResult {
  workspace: WorkspaceViewModel | null;
  /** Board counts, or null while they are still loading (or failed). */
  ideaCounts: IdeaCounts | null;
  /** null while the invitation is still the organizer's draft. */
  invitation: InvitationDTO | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

/** Workspace's business logic: load one booking and shape it for the screen. */
export function useWorkspaceContainer(bookingId: string): WorkspaceContainerResult {
  const { data, loading, error, refetch } = useBookingDetail(bookingId);

  /*
   * The board and the invitation load alongside the booking rather than
   * blocking it: either can fail or be empty without costing the customer the
   * rest of their workspace, so neither feeds this screen's error state.
   */
  const board = useIdeaBoard(bookingId);
  const invitation = useInvitation(bookingId);

  const workspace = useMemo<WorkspaceViewModel | null>(() => (data ? mapWorkspace(data) : null), [data]);

  const refetchAll = useCallback(() => {
    refetch();
    board.refetch();
    invitation.refetch();
  }, [refetch, board, invitation]);

  return {
    workspace,
    ideaCounts: board.data?.counts ?? null,
    invitation: invitation.data ?? null,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch: refetchAll,
  };
}
