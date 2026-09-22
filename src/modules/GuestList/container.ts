import { useCallback, useMemo, useState } from 'react';
import { GUEST_COPY as COPY } from './constants';
import { useAddGuest, useAddGuests, useGuests, useUpdateGuest } from './hooks';
import { groupFilters, summaryLine, toRow } from './utils';
import type {
  GroupFilterOption,
  GuestDraft,
  GuestGroup,
  GuestRowViewModel,
} from './types';

export interface GuestListContainerResult {
  /** "8 guests · 5 invited". */
  summary: string;
  filters: GroupFilterOption[];
  activeGroup: GuestGroup | null;
  setActiveGroup: (group: GuestGroup | null) => void;
  /** The rows for whichever chip is active. */
  rows: GuestRowViewModel[];
  /** True when the whole list is empty, not just this filter. */
  isEmpty: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;

  /** The add/edit sheet. */
  sheetOpen: boolean;
  editing: GuestDraft | null;
  openAdd: () => void;
  openEdit: (row: GuestRowViewModel) => void;
  closeSheet: () => void;
  isSaving: boolean;
  saveError: string | null;
  save: (draft: GuestDraft) => void;

  /** Importing from the phonebook. */
  isImporting: boolean;
  importGuests: (guests: GuestDraft[]) => void;
  /** What the last import did — cleared when the host acts again. */
  notice: string | null;
  dismissNotice: () => void;
}

/**
 * The guest list.
 *
 * Every write refetches rather than patching the array locally. The server is
 * what normalises a phone number and enforces one guest per number, so the row
 * it hands back can differ from what was typed — "9849011234" comes back as
 * "+91 98490 11234", and a number that already belongs to somebody resolves to
 * them. Patching optimistically would show the host their own typing instead
 * of what was actually saved.
 */
export function useGuestListContainer(bookingId: string): GuestListContainerResult {
  const { data, loading, error, refetch } = useGuests(bookingId);
  const addCall = useAddGuest();
  const updateCall = useUpdateGuest();
  const bulkCall = useAddGuests();

  const [activeGroup, setActiveGroup] = useState<GuestGroup | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<GuestDraft | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  /* Memoised so every list derived from it is not rebuilt on each render. */
  const guests = useMemo(() => data ?? [], [data]);
  const allRows = useMemo(() => guests.map(toRow), [guests]);

  const rows = useMemo(
    () => (activeGroup ? allRows.filter((row) => row.group === activeGroup) : allRows),
    [allRows, activeGroup],
  );

  const openAdd = useCallback(() => {
    setEditingId(null);
    setEditing(null);
    setSaveError(null);
    setNotice(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((row: GuestRowViewModel) => {
    setEditingId(row.id);
    setEditing(row.draft);
    setSaveError(null);
    setNotice(null);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setSaveError(null);
  }, []);

  const save = useCallback(
    (draft: GuestDraft) => {
      setSaveError(null);
      const run = editingId
        ? updateCall.execute(bookingId, editingId, draft)
        : addCall.execute(bookingId, draft);

      run
        .then(() => {
          setSheetOpen(false);
          refetch();
        })
        /*
         * The server's own words, not a generic failure: the message it sends
         * back names who already holds that number, which is the one thing
         * that would let the host fix it.
         */
        .catch((err: { message?: string }) => setSaveError(err?.message ?? null));
    },
    [addCall, bookingId, editingId, refetch, updateCall],
  );

  const importGuests = useCallback(
    (picked: GuestDraft[]) => {
      if (picked.length === 0) return;
      setNotice(null);
      bulkCall
        .execute(bookingId, picked)
        .then((result) => {
          /*
           * Both halves are reported. An import that silently dropped four
           * landlines would leave the host believing everybody in their
           * address book had been invited.
           */
          setNotice(
            [
              result.added.length > 0 ? COPY.imported(result.added.length) : '',
              result.skipped.length > 0 ? COPY.importSkipped(result.skipped.length) : '',
            ]
              .filter(Boolean)
              .join(' ') || COPY.importedNone,
          );
          refetch();
        })
        .catch((err: { message?: string }) => setNotice(err?.message ?? COPY.importedNone));
    },
    [bookingId, bulkCall, refetch],
  );

  return {
    summary: summaryLine(guests, COPY.count, COPY.invited),
    filters: useMemo(() => groupFilters(guests), [guests]),
    activeGroup,
    setActiveGroup,
    rows,
    isEmpty: allRows.length === 0,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,

    sheetOpen,
    editing,
    openAdd,
    openEdit,
    closeSheet,
    isSaving: addCall.loading || updateCall.loading,
    saveError,
    save,

    isImporting: bulkCall.loading,
    importGuests,
    notice,
    dismissNotice: useCallback(() => setNotice(null), []),
  };
}
