import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ALL_FILTER, SUBVENDORS_COPY as COPY } from './constants';
import { useInviteSubVendor, useRemoveSubVendor, useSubVendors } from './hooks';
import type {
  CategoryFilter,
  FilterChip,
  MemberItem,
  PendingItem,
} from './types';
import {
  applyCategory,
  categoryChips,
  effectiveFilter,
  isAlreadyLinked,
  phoneError,
  sanitizePhoneInput,
  splitRoster,
} from './utils';

export interface SubVendorsContainerResult {
  members: MemberItem[];
  allMembersCount: number;
  pending: PendingItem[];
  chips: FilterChip[];
  filter: CategoryFilter;
  setFilter: (filter: CategoryFilter) => void;
  /** True when there is no one on the team and no invite out. */
  isEmpty: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => void;
  notice: string | null;
  dismissNotice: () => void;

  sheetOpen: boolean;
  openInvite: () => void;
  closeInvite: () => void;
  phone: string;
  setPhone: (text: string) => void;
  inviteError: string | null;
  inviting: boolean;
  sendInvite: () => void;

  removingId: string | null;
  remove: (linkId: string, message: string) => void;
}

/**
 * The organizer's team: one request for the roster, filtered by category on
 * the phone, plus the invite sheet and removal. Fetched again whenever the
 * screen comes back into view.
 */
export function useSubVendorsContainer(): SubVendorsContainerResult {
  const roster = useSubVendors();
  const inviter = useInviteSubVendor();
  const remover = useRemoveSubVendor();

  const [chosenFilter, setFilter] = useState<CategoryFilter>(ALL_FILTER);
  const [pulling, setPulling] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [phone, setPhoneRaw] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { members: allMembers, pending } = useMemo(
    () => splitRoster(roster.data),
    [roster.data],
  );
  const chips = useMemo(() => categoryChips(allMembers), [allMembers]);
  const filter = effectiveFilter(chosenFilter, chips);

  const seen = useRef(false);
  const refetch = roster.refetch;
  useFocusEffect(
    useCallback(() => {
      if (seen.current) refetch();
      seen.current = true;
    }, [refetch]),
  );

  const refresh = useCallback(() => {
    setPulling(true);
    refetch();
  }, [refetch]);
  if (pulling && !roster.loading) setPulling(false);

  const openInvite = useCallback(() => {
    setPhoneRaw('');
    setInviteError(null);
    setSheetOpen(true);
  }, []);
  const closeInvite = useCallback(() => {
    if (!inviter.loading) setSheetOpen(false);
  }, [inviter.loading]);

  const setPhone = useCallback((text: string) => {
    setPhoneRaw(sanitizePhoneInput(text));
    setInviteError(null);
  }, []);

  const links = roster.data;
  const { execute: invite, loading: inviting } = inviter;
  const sendInvite = useCallback(() => {
    const invalid = phoneError(phone);
    if (invalid) {
      setInviteError(invalid);
      return;
    }
    setInviteError(null);
    invite(phone)
      .then(result => {
        if (isAlreadyLinked(result.linkId, links)) {
          setInviteError(COPY.alreadyLinked);
          return;
        }
        setSheetOpen(false);
        setNotice(
          result.status === 'active' ? COPY.invitedActive : COPY.invitedPending,
        );
        refetch();
      })
      .catch((err: { message?: string }) => {
        setInviteError(err?.message || COPY.inviteFailed);
      });
  }, [phone, invite, links, refetch]);

  const { execute: removeLink } = remover;
  const remove = useCallback(
    (linkId: string, message: string) => {
      setRemovingId(linkId);
      removeLink(linkId)
        .then(() => {
          setNotice(message);
          refetch();
        })
        .catch((err: { message?: string }) => {
          setNotice(err?.message || COPY.removeFailed);
        })
        .finally(() => setRemovingId(null));
    },
    [removeLink, refetch],
  );

  return {
    members: useMemo(
      () => applyCategory(allMembers, filter),
      [allMembers, filter],
    ),
    allMembersCount: allMembers.length,
    pending,
    chips,
    filter,
    setFilter,
    isEmpty: allMembers.length === 0 && pending.length === 0,
    isLoading: roster.loading && !roster.data,
    isRefreshing: pulling,
    errorMessage: !roster.data && roster.error ? roster.error.message : null,
    refresh,
    notice,
    dismissNotice: () => setNotice(null),

    sheetOpen,
    openInvite,
    closeInvite,
    phone,
    setPhone,
    inviteError,
    inviting,
    sendInvite,

    removingId,
    remove,
  };
}
