import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { CALENDAR_COPY as COPY, MAX_BLOCK_DAYS } from './constants';
import { useBlockDays, useOrganizerCalendar, useSetDateBlocked } from './hooks';
import type {
  CalendarDayCell,
  MonthKey,
  SelectedDay,
  UpcomingRow,
} from './types';
import {
  buildMonthGrid,
  canBlock,
  dayState,
  indexCalendar,
  monthOf,
  monthTitle,
  pickRange,
  sameMonth,
  selectedDay,
  shiftMonth,
  todayKey,
  togglePick,
  upcomingInMonth,
  withBlocked,
} from './utils';

export interface CalendarContainerResult {
  monthTitle: string;
  cells: CalendarDayCell[];
  /** False while the grid is on another month or another day is picked. */
  onToday: boolean;
  selected: SelectedDay;
  upcoming: UpcomingRow[];
  selecting: boolean;
  picked: string[];
  /** A block/unblock request is on its way. */
  busy: boolean;
  notice: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  refresh: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  goToday: () => void;
  pressDay: (cell: CalendarDayCell) => void;
  longPressDay: (cell: CalendarDayCell) => void;
  /** Opens a day, moving the grid to its month. */
  openDay: (iso: string) => void;
  toggleBlocked: () => void;
  startSelecting: () => void;
  cancelSelecting: () => void;
  confirmSelecting: () => void;
}

/**
 * The organizer's month: bookings and blocked days, one day open below the
 * grid. Blocking is optimistic — the day greys out at once and comes back if
 * the server says no. Fetched again whenever the screen comes back.
 */
export function useCalendarContainer(): CalendarContainerResult {
  const calendar = useOrganizerCalendar();
  const setBlocked = useSetDateBlocked();
  const blockMany = useBlockDays();

  const today = todayKey();
  const [month, setMonth] = useState<MonthKey>(() => monthOf(today));
  const [selectedIso, setSelectedIso] = useState(today);
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [anchor, setAnchor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pulling, setPulling] = useState(false);

  // The blocked list after a block/unblock; a fresh fetch supersedes it.
  const [override, setOverride] = useState<string[] | null>(null);
  const [overrideFor, setOverrideFor] = useState(calendar.data);
  if (overrideFor !== calendar.data) {
    setOverrideFor(calendar.data);
    setOverride(null);
  }

  const data = calendar.data;
  const blockedDates = useMemo(
    () => override ?? data?.blockedDates ?? [],
    [override, data],
  );
  const index = useMemo(
    () => indexCalendar({ bookedDates: data?.bookedDates ?? [], blockedDates }),
    [data, blockedDates],
  );

  const refetch = calendar.refetch;
  const seen = useRef(false);
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
  if (pulling && !calendar.loading) setPulling(false);

  /** Shows a month and opens today in it, or else its 1st. */
  const showMonth = (next: MonthKey) => {
    setMonth(next);
    setSelectedIso(
      sameMonth(next, monthOf(today))
        ? today
        : `${next.year}-${String(next.month + 1).padStart(2, '0')}-01`,
    );
  };

  const pressDay = (cell: CalendarDayCell) => {
    if (selecting) {
      if (!canBlock(cell.iso, index, today)) return;
      setPicked(p => togglePick(p, cell.iso));
      setAnchor(cell.iso);
      return;
    }
    setSelectedIso(cell.iso);
    if (!cell.inMonth) setMonth(monthOf(cell.iso));
  };

  const longPressDay = (cell: CalendarDayCell) => {
    if (busy || !canBlock(cell.iso, index, today)) return;
    if (!selecting) {
      setSelecting(true);
      setNotice(null);
      setPicked([cell.iso]);
    } else if (anchor) {
      setPicked(p => pickRange(p, anchor, cell.iso, index, today));
    } else {
      setPicked(p => togglePick(p, cell.iso));
    }
    setAnchor(cell.iso);
  };

  const toggleBlocked = () => {
    if (busy || !data) return;
    const iso = selectedIso;
    const state = dayState(iso, index, today);
    if (state === 'booked' || iso < today) return;
    const on = state !== 'blocked';
    const before = blockedDates;
    setOverride(withBlocked(before, iso, on));
    setBusy(true);
    setNotice(null);
    setBlocked
      .execute({ date: iso, blocked: on })
      .then(list => setOverride(list))
      .catch(() => {
        setOverride(before);
        setNotice(on ? COPY.blockFailed : COPY.unblockFailed);
      })
      .finally(() => setBusy(false));
  };

  const startSelecting = () => {
    setSelecting(true);
    setPicked([]);
    setAnchor(null);
    setNotice(null);
  };

  const cancelSelecting = () => {
    setSelecting(false);
    setPicked([]);
    setAnchor(null);
  };

  const confirmSelecting = () => {
    if (busy) return;
    const days = picked.filter(d => canBlock(d, index, today));
    if (days.length === 0) return;
    if (days.length > MAX_BLOCK_DAYS) {
      setNotice(COPY.tooMany);
      return;
    }
    const before = blockedDates;
    setOverride(Array.from(new Set([...before, ...days])).sort());
    setBusy(true);
    setNotice(null);
    blockMany
      .execute(days)
      .then(list => {
        setOverride(list);
        cancelSelecting();
      })
      .catch(() => {
        // Some days may have saved — put things back and ask the server.
        setOverride(before);
        setNotice(COPY.blockManyFailed);
        cancelSelecting();
        refetch();
      })
      .finally(() => setBusy(false));
  };

  const cells = useMemo(
    () => buildMonthGrid(month, index, today),
    [month, index, today],
  );

  return {
    monthTitle: monthTitle(month),
    cells,
    onToday: sameMonth(month, monthOf(today)) && selectedIso === today,
    selected: useMemo(
      () => selectedDay(selectedIso, index, today),
      [selectedIso, index, today],
    ),
    upcoming: useMemo(
      () => upcomingInMonth(month, index, today),
      [month, index, today],
    ),
    selecting,
    picked,
    busy,
    notice,
    isLoading: calendar.loading && !data,
    isRefreshing: pulling,
    errorMessage: !data && calendar.error ? calendar.error.message : null,
    refresh,
    prevMonth: () => showMonth(shiftMonth(month, -1)),
    nextMonth: () => showMonth(shiftMonth(month, 1)),
    goToday: () => showMonth(monthOf(today)),
    pressDay,
    longPressDay,
    openDay: (iso: string) => {
      setSelectedIso(iso);
      setMonth(monthOf(iso));
    },
    toggleBlocked,
    startSelecting,
    cancelSelecting,
    confirmSelecting,
  };
}
