import { useMemo, useState } from 'react';
import { JUMP_TILES } from './constants';
import { useEventExtras, useMyBookings } from './hooks';
import { focusEvent, jumpTilesFor, mapBookings } from './utils';
import type { BookingItem, BookingTab, EventExtras, JumpTile } from './types';

const NO_EXTRAS: EventExtras = { ideas: null, guests: null };

export interface BookingContainerResult {
  items: BookingItem[];
  active: BookingItem[];
  past: BookingItem[];
  /** Which pill is selected. */
  tab: BookingTab;
  setTab: (tab: BookingTab) => void;
  /** The events under the selected pill. */
  visible: BookingItem[];
  /**
   * The event the "Jump to" tiles act on — the soonest active one — or null
   * when nothing is active, in which case the grid is not shown at all.
   */
  focus: BookingItem | null;
  tiles: JumpTile[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

export function useBookingContainer(): BookingContainerResult {
  const { data, loading, error, refetch } = useMyBookings();
  const [tab, setTab] = useState<BookingTab>('active');

  const items = useMemo<BookingItem[]>(() => (data ? mapBookings(data) : []), [data]);
  const active = useMemo(() => items.filter((i) => i.tab === 'active'), [items]);
  const past = useMemo(() => items.filter((i) => i.tab === 'past'), [items]);
  const focus = useMemo(() => focusEvent(active), [active]);

  const extras = useEventExtras(focus?.id ?? null);
  const tiles = useMemo(
    () => jumpTilesFor(JUMP_TILES, focus, extras.data ?? NO_EXTRAS),
    [focus, extras.data],
  );

  return {
    items,
    active,
    past,
    tab,
    setTab,
    visible: tab === 'active' ? active : past,
    focus,
    tiles,
    isLoading: loading,
    isError: error !== null,
    errorMessage: error?.message ?? null,
    refetch,
  };
}
