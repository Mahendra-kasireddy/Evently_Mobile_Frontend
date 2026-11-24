import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { chooseImageSource } from '../Shared';
import {
  ATTENDEES_PAGE_SIZE,
  EVENTS_PAGE_SIZE,
  PUBLIC_EVENTS_COPY as COPY,
  RECENT_CHECK_INS,
  SEARCH_DEBOUNCE_MS,
} from './constants';
import { useEventDashboard, usePublicEvent, useTicketTypes } from './hooks';
import {
  archiveTicketType,
  changeStatus,
  checkIn,
  createEvent,
  createTicketType,
  listAttendees,
  listEvents,
  pickAndUploadCover,
  setLiveStream,
  setMemories,
  updateEvent,
  updateTicketType,
} from './services';
import type {
  AttendeeDTO,
  AttendeeFilter,
  AttendeeRowModel,
  CheckInResultModel,
  DashboardModel,
  DetailRow,
  EventCardModel,
  EventForm,
  EventFormErrors,
  EventStatusAction,
  HeaderModel,
  ListFilter,
  LiveForm,
  LiveFormErrors,
  MemoriesForm,
  PublicEventDTO,
  PublicEventSummaryDTO,
  RecentCheckIn,
  StatusActionModel,
  TicketCardModel,
  TicketForm,
  TicketFormErrors,
  TicketTypeDTO,
  WorkspaceTab,
} from './types';
import {
  attendeeQuery,
  buildEventBody,
  buildTicketBody,
  checkInBody,
  detailRows,
  emptyEventForm,
  emptyTicketForm,
  errorMessage,
  filterAttendees,
  formFromEvent,
  formFromTicket,
  hasErrors,
  hasMorePages,
  isCheckInOpen,
  isEditable,
  isFormChanged,
  isNotFound,
  liveBody,
  liveFormFrom,
  loadErrorMessage,
  mapAttendee,
  mapCheckIn,
  mapDashboard,
  mapEventCard,
  mapHeader,
  mapTicket,
  memoriesBody,
  memoriesFormFrom,
  mergeAttendees,
  mergeById,
  mergeEvent,
  recentFrom,
  statusActions,
  ticketSold,
  validateEventForm,
  validateLiveForm,
  validateMemories,
  validateTicketForm,
  withCheckedIn,
} from './utils';

export interface Notice {
  text: string;
  tone: 'ok' | 'error';
}

/** Refetch whenever the screen comes back into view; the first focus is the mount. */
function useRefetchOnFocus(refetch: () => void) {
  const seen = useRef(false);
  const ref = useRef(refetch);
  ref.current = refetch;
  useFocusEffect(
    useCallback(() => {
      if (seen.current) ref.current();
      seen.current = true;
    }, []),
  );
}

// ---- List screen ------------------------------------------------------------------

export interface PublicEventsContainerResult {
  filter: ListFilter;
  setFilter: (filter: ListFilter) => void;
  cards: EventCardModel[];
  total: number;
  hasMore: boolean;
  /** Loaded, no filter, and the organizer has never made an event. */
  isEmpty: boolean;
  /** Loaded, filtered, and nothing matches. */
  isFilteredEmpty: boolean;
  isLoading: boolean;
  /** A new filter's first page is on its way (the chips stay up). */
  isSwitching: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  errorMessage: string | null;
  /** A load-more that failed, shown under the list. */
  moreError: string | null;
  refresh: () => void;
  loadMore: () => void;
}

/**
 * The organizer's public events, one status at a time, a page at a time.
 * Every request carries a ticket; an answer for a filter the organizer has
 * already left is dropped rather than painted over the new one.
 */
export function usePublicEventsContainer(): PublicEventsContainerResult {
  const [filter, setFilterState] = useState<ListFilter>('all');
  const [items, setItems] = useState<PublicEventSummaryDTO[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moreError, setMoreError] = useState<string | null>(null);
  const ticket = useRef(0);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const filterRef = useRef(filter);
  filterRef.current = filter;

  const loadFirst = useCallback((next: ListFilter, pulled: boolean) => {
    const id = ++ticket.current;
    if (pulled) setRefreshing(true);
    else setLoading(true);
    setError(null);
    setMoreError(null);
    listEvents(next, 0, EVENTS_PAGE_SIZE)
      .then(res => {
        if (id !== ticket.current) return;
        setLoadedOnce(true);
        setItems(res.items);
        setTotal(res.total);
        setPage(0);
      })
      .catch(err => {
        if (id !== ticket.current) return;
        setError(loadErrorMessage(err));
      })
      .finally(() => {
        if (id !== ticket.current) return;
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    loadFirst('all', false);
  }, [loadFirst]);

  const reload = useCallback(
    () => loadFirst(filterRef.current, false),
    [loadFirst],
  );
  useRefetchOnFocus(reload);

  const setFilter = useCallback(
    (next: ListFilter) => {
      if (next === filterRef.current) return;
      setFilterState(next);
      setItems(null);
      loadFirst(next, false);
    },
    [loadFirst],
  );

  const refresh = useCallback(
    () => loadFirst(filterRef.current, true),
    [loadFirst],
  );

  const hasMore = !!items && hasMorePages(page, EVENTS_PAGE_SIZE, total);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const id = ticket.current;
    const nextPage = page + 1;
    setLoadingMore(true);
    setMoreError(null);
    listEvents(filterRef.current, nextPage, EVENTS_PAGE_SIZE)
      .then(res => {
        if (id !== ticket.current) return;
        setItems(prev => mergeById(prev ?? [], res.items));
        setTotal(res.total);
        setPage(nextPage);
      })
      .catch(err => {
        if (id !== ticket.current) return;
        setMoreError(errorMessage(err, COPY.error));
      })
      .finally(() => setLoadingMore(false));
  }, [hasMore, loadingMore, page]);

  const cards = useMemo(() => {
    const now = new Date();
    return (items ?? []).map(e => mapEventCard(e, now));
  }, [items]);

  const loaded = !!items && !loading;
  return {
    filter,
    setFilter,
    cards,
    total,
    hasMore,
    isEmpty: loaded && filter === 'all' && cards.length === 0,
    isFilteredEmpty: loaded && filter !== 'all' && cards.length === 0,
    isLoading: loading && !items && !loadedOnce,
    isSwitching: loading && !items && loadedOnce,
    isRefreshing: refreshing,
    isLoadingMore: loadingMore,
    errorMessage: !items && error ? error : null,
    moreError,
    refresh,
    loadMore,
  };
}

// ---- Event form sheet (create + edit) ------------------------------------------------

export interface EventFormSheetResult {
  visible: boolean;
  isEdit: boolean;
  form: EventForm;
  errors: EventFormErrors;
  dirty: boolean;
  saving: boolean;
  saveError: string | null;
  uploading: boolean;
  coverError: string | null;
  showAdvanced: boolean;
  toggleAdvanced: () => void;
  openCreate: () => void;
  openEdit: (event: PublicEventDTO) => void;
  /** Closes without asking — the sheet asks first when `dirty`. */
  close: () => void;
  setField: <K extends keyof EventForm>(key: K, value: EventForm[K]) => void;
  pickCover: () => Promise<void>;
  removeCover: () => void;
  /** Validates, then creates or saves; resolves true once it is stored. */
  submit: () => Promise<boolean>;
}

/**
 * One form for creating and editing an event, because they ask for exactly
 * the same things. The cover uploads first, so an event only ever points at
 * a picture that already exists.
 */
export function useEventFormSheet({
  onCreated,
  onUpdated,
}: {
  onCreated?: (event: PublicEventDTO) => void;
  onUpdated?: (event: PublicEventDTO) => void;
}): EventFormSheetResult {
  const [visible, setVisible] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [initial, setInitial] = useState<EventForm>(emptyEventForm);
  const [form, setForm] = useState<EventForm>(emptyEventForm);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const reset = (next: EventForm, id: string | null) => {
    setInitial(next);
    setForm(next);
    setEventId(id);
    setErrors({});
    setSaveError(null);
    setCoverError(null);
    setShowAdvanced(!!(next.latitude || next.longitude));
    setVisible(true);
  };

  const openCreate = () => reset(emptyEventForm(), null);
  const openEdit = (event: PublicEventDTO) =>
    reset(formFromEvent(event), event.id);
  const close = useCallback(() => setVisible(false), []);

  const setField = useCallback(
    <K extends keyof EventForm>(key: K, value: EventForm[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
      setErrors(prev => {
        // The end's error is about the pair; touching any of it clears it.
        const pair =
          key === 'endDate' || key === 'startDate' || key === 'startTime';
        if (!prev[key] && !(pair && prev.endTime)) return prev;
        const next = { ...prev, [key]: undefined };
        if (pair) next.endTime = undefined;
        return next;
      });
      setSaveError(null);
    },
    [],
  );

  const pickCover = async () => {
    if (uploading) return;
    const source = await chooseImageSource(COPY.form.coverPick);
    if (!source) return;
    setUploading(true);
    setCoverError(null);
    try {
      const file = await pickAndUploadCover(source);
      if (file) setForm(prev => ({ ...prev, coverUrl: file.url }));
    } catch (err) {
      setCoverError(errorMessage(err, COPY.form.coverFailed));
    } finally {
      setUploading(false);
    }
  };

  const removeCover = () => setForm(prev => ({ ...prev, coverUrl: '' }));

  const submit = async (): Promise<boolean> => {
    if (saving || uploading) return false;
    const found = validateEventForm(form);
    if (hasErrors(found)) {
      setErrors(found);
      if (found.latitude || found.longitude) setShowAdvanced(true);
      setSaveError(COPY.form.fixFields);
      return false;
    }
    setSaving(true);
    setSaveError(null);
    try {
      if (eventId) {
        const saved = await updateEvent(eventId, buildEventBody(form, 'edit'));
        setVisible(false);
        onUpdated?.(saved);
      } else {
        const created = await createEvent(buildEventBody(form, 'create'));
        setVisible(false);
        onCreated?.(created);
      }
      return true;
    } catch (err) {
      setSaveError(errorMessage(err, COPY.form.saveFailed));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    visible,
    isEdit: !!eventId,
    form,
    errors,
    dirty: isFormChanged(form, initial),
    saving,
    saveError,
    uploading,
    coverError,
    showAdvanced,
    toggleAdvanced: useCallback(() => setShowAdvanced(v => !v), []),
    openCreate,
    openEdit,
    close,
    setField,
    pickCover,
    removeCover,
    submit,
  };
}

// ---- Workspace screen --------------------------------------------------------------

export interface PublicEventContainerResult {
  event: PublicEventDTO | null;
  header: HeaderModel | null;
  details: DetailRow[];
  actions: StatusActionModel[];
  editable: boolean;
  checkInOpen: boolean;
  tab: WorkspaceTab;
  setTab: (tab: WorkspaceTab) => void;
  dashboard: DashboardModel | null;
  dashboardFailed: boolean;
  tickets: TicketCardModel[];
  ticketsLoading: boolean;
  ticketsFailed: boolean;
  /** Changing status right now. */
  busy: EventStatusAction | null;
  archiving: Record<string, boolean>;
  notice: Notice | null;
  setNotice: (notice: Notice | null) => void;
  isLoading: boolean;
  isRefreshing: boolean;
  notFound: boolean;
  errorMessage: string | null;
  refresh: () => void;
  /** After something moved stock or money: the numbers and the ticket list. */
  reloadNumbers: () => void;
  runStatus: (action: EventStatusAction, reason?: string) => Promise<boolean>;
  archive: (typeId: string) => void;
  /** A mutation's answer, taken as the new state. */
  apply: (next: Partial<PublicEventDTO>) => void;
  ticketById: (typeId: string) => TicketTypeDTO | null;
}

/**
 * One event: its header and status moves, the numbers, the tickets. Each
 * mutation's answer becomes the state at once; anything that moves stock
 * (status, tickets) reloads the dashboard behind it.
 */
export function usePublicEventContainer(
  eventId: string,
): PublicEventContainerResult {
  const detail = usePublicEvent(eventId);
  const dash = useEventDashboard(eventId);
  const types = useTicketTypes(eventId);

  const [latest, setLatest] = useState<PublicEventDTO | null>(null);
  const [tab, setTab] = useState<WorkspaceTab>('overview');
  const [busy, setBusy] = useState<EventStatusAction | null>(null);
  const [archiving, setArchiving] = useState<Record<string, boolean>>({});
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pulling, setPulling] = useState(false);

  // A fresh fetch supersedes whatever a mutation handed back.
  const [latestFor, setLatestFor] = useState(detail.data);
  if (latestFor !== detail.data) {
    setLatestFor(detail.data);
    setLatest(null);
  }
  const [typesFor, setTypesFor] = useState(types.data);
  if (typesFor !== types.data) {
    setTypesFor(types.data);
    setRemoved({});
  }

  const event = latest ?? detail.data?.event ?? null;
  const eventRef = useRef(event);
  eventRef.current = event;
  const busyRef = useRef(busy);
  busyRef.current = busy;

  const refetchDetail = detail.refetch;
  const refetchDash = dash.refetch;
  const refetchTypes = types.refetch;
  const reloadNumbers = useCallback(() => {
    refetchDash();
    refetchTypes();
  }, [refetchDash, refetchTypes]);
  const reloadAll = useCallback(() => {
    refetchDetail();
    refetchDash();
    refetchTypes();
  }, [refetchDash, refetchDetail, refetchTypes]);
  useRefetchOnFocus(reloadAll);

  const refresh = useCallback(() => {
    setPulling(true);
    setNotice(null);
    reloadAll();
  }, [reloadAll]);
  if (pulling && !detail.loading) setPulling(false);

  const apply = useCallback((next: Partial<PublicEventDTO>) => {
    setLatest(prev => mergeEvent(prev ?? eventRef.current, next));
  }, []);

  const runStatus = useCallback(
    async (action: EventStatusAction, reason?: string): Promise<boolean> => {
      const current = eventRef.current;
      if (busyRef.current || !current) return false;
      const target = statusActions(current.status, 1).find(
        a => a.key === action,
      );
      if (!target) return false;
      setBusy(action);
      setNotice(null);
      try {
        const body =
          action === 'cancel' && reason?.trim()
            ? { status: target.to, reason: reason.trim() }
            : { status: target.to };
        apply(await changeStatus(eventId, body));
        setNotice({ text: COPY.statusDone[action], tone: 'ok' });
        reloadNumbers();
        return true;
      } catch (err) {
        setNotice({
          text: errorMessage(err, COPY.statusFailed),
          tone: 'error',
        });
        refetchDetail();
        return false;
      } finally {
        setBusy(null);
      }
    },
    [apply, eventId, refetchDetail, reloadNumbers],
  );

  const archive = useCallback(
    (typeId: string) => {
      setArchiving(prev => ({ ...prev, [typeId]: true }));
      setNotice(null);
      archiveTicketType(eventId, typeId)
        .then(() => {
          setRemoved(prev => ({ ...prev, [typeId]: true }));
          setNotice({ text: COPY.tickets.archived, tone: 'ok' });
          reloadNumbers();
          refetchDetail();
        })
        .catch(err =>
          setNotice({
            text: errorMessage(err, COPY.tickets.archiveFailed),
            tone: 'error',
          }),
        )
        .finally(() =>
          setArchiving(prev => {
            const next = { ...prev };
            delete next[typeId];
            return next;
          }),
        );
    },
    [eventId, refetchDetail, reloadNumbers],
  );

  const typeList = useMemo(
    () => (types.data ?? []).filter(t => !removed[t.id]),
    [types.data, removed],
  );
  const typesRef = useRef(typeList);
  typesRef.current = typeList;
  const ticketById = useCallback(
    (typeId: string) => typesRef.current.find(t => t.id === typeId) ?? null,
    [],
  );

  /* The publish guard needs a count even before the Tickets tab has loaded:
     the event's own payload carries its live types. */
  const typeCount = types.data
    ? typeList.length
    : detail.data?.ticketTypes?.length ?? 0;

  const notFound = !event && isNotFound(detail.error);
  const dashData = dash.data;

  return {
    event,
    header: useMemo(() => (event ? mapHeader(event) : null), [event]),
    details: useMemo(() => (event ? detailRows(event) : []), [event]),
    actions: useMemo(
      () => (event ? statusActions(event.status, typeCount) : []),
      [event, typeCount],
    ),
    editable: event ? isEditable(event.status) : false,
    checkInOpen: event ? isCheckInOpen(event.status) : false,
    tab,
    setTab,
    dashboard: useMemo(
      () => (dashData ? mapDashboard(dashData) : null),
      [dashData],
    ),
    dashboardFailed: !dashData && !!dash.error,
    tickets: useMemo(() => {
      const now = new Date();
      return typeList.map(t => mapTicket(t, now));
    }, [typeList]),
    ticketsLoading: types.loading && !types.data,
    ticketsFailed: !types.data && !!types.error,
    busy,
    archiving,
    notice,
    setNotice,
    isLoading: detail.loading && !event,
    isRefreshing: pulling,
    notFound,
    errorMessage:
      !event && !notFound && detail.error
        ? loadErrorMessage(detail.error)
        : null,
    refresh,
    reloadNumbers,
    runStatus,
    archive,
    apply,
    ticketById,
  };
}

// ---- Cancel sheet --------------------------------------------------------------------

export interface CancelSheetResult {
  visible: boolean;
  reason: string;
  open: () => void;
  close: () => void;
  setReason: (text: string) => void;
}

export function useCancelSheet(): CancelSheetResult {
  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState('');
  return {
    visible,
    reason,
    open: useCallback(() => {
      setReason('');
      setVisible(true);
    }, []),
    close: useCallback(() => setVisible(false), []),
    setReason,
  };
}

// ---- Ticket sheet --------------------------------------------------------------------

export interface TicketSheetResult {
  visible: boolean;
  isNew: boolean;
  /** Seats already gone on the type being edited — the floor for its total. */
  sold: number;
  form: TicketForm;
  errors: TicketFormErrors;
  dirty: boolean;
  saving: boolean;
  saveError: string | null;
  openNew: () => void;
  openEdit: (typeId: string) => void;
  close: () => void;
  setField: <K extends keyof TicketForm>(key: K, value: TicketForm[K]) => void;
  save: () => Promise<boolean>;
}

/** Add or edit one ticket type. */
export function useTicketSheet(
  eventId: string,
  w: Pick<
    PublicEventContainerResult,
    'ticketById' | 'reloadNumbers' | 'setNotice'
  >,
): TicketSheetResult {
  const [visible, setVisible] = useState(false);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [sold, setSold] = useState(0);
  const [initial, setInitial] = useState<TicketForm>(emptyTicketForm);
  const [form, setForm] = useState<TicketForm>(emptyTicketForm);
  const [errors, setErrors] = useState<TicketFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { ticketById, reloadNumbers, setNotice } = w;

  const reset = (next: TicketForm, id: string | null, floor: number) => {
    setInitial(next);
    setForm(next);
    setTypeId(id);
    setSold(floor);
    setErrors({});
    setSaveError(null);
    setVisible(true);
  };

  const openNew = () => reset(emptyTicketForm(), null, 0);
  const openEdit = (id: string) => {
    const found = ticketById(id);
    if (found) reset(formFromTicket(found), id, ticketSold(found));
  };
  const close = useCallback(() => setVisible(false), []);

  const setField = useCallback(
    <K extends keyof TicketForm>(key: K, value: TicketForm[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
      setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev));
      setSaveError(null);
    },
    [],
  );

  const save = async (): Promise<boolean> => {
    if (saving) return false;
    const found = validateTicketForm(form, sold);
    if (hasErrors(found)) {
      setErrors(found);
      setSaveError(COPY.form.fixFields);
      return false;
    }
    setSaving(true);
    setSaveError(null);
    try {
      if (typeId) {
        await updateTicketType(eventId, typeId, buildTicketBody(form, 'edit'));
      } else {
        await createTicketType(eventId, buildTicketBody(form, 'create'));
      }
      setVisible(false);
      setNotice({ text: COPY.tickets.saved, tone: 'ok' });
      reloadNumbers();
      return true;
    } catch (err) {
      setSaveError(errorMessage(err, COPY.tickets.saveFailed));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    visible,
    isNew: !typeId,
    sold,
    form,
    errors,
    dirty: isFormChanged(form, initial),
    saving,
    saveError,
    openNew,
    openEdit,
    close,
    setField,
    save,
  };
}

// ---- Attendees -------------------------------------------------------------------------

export interface AttendeesResult {
  filter: AttendeeFilter;
  setFilter: (filter: AttendeeFilter) => void;
  query: string;
  setQuery: (text: string) => void;
  rows: AttendeeRowModel[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  errorMessage: string | null;
  checking: Record<string, boolean>;
  reload: () => void;
  loadMore: () => void;
  /** Admit one row from the list, by its code. */
  checkInRow: (ticketId: string) => void;
  /** A ticket admitted elsewhere (the Check-in tab), reflected here. */
  markCheckedIn: (ticketId: string, at: string) => void;
}

/**
 * Who is coming, one row per seat. Nothing loads until the tab is first
 * opened; the search waits for the organizer to stop typing.
 */
export function useAttendees(
  eventId: string,
  active: boolean,
  onAdmitted: () => void,
  setNotice: (notice: Notice | null) => void,
): AttendeesResult {
  const [filter, setFilterState] = useState<AttendeeFilter>('all');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<AttendeeDTO[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState<Record<string, boolean>>({});
  const ticket = useRef(0);
  const started = useRef(false);

  const load = useCallback(
    (f: AttendeeFilter, q: string) => {
      const id = ++ticket.current;
      setLoading(true);
      setError(null);
      listAttendees(eventId, attendeeQuery(f, q, 0, ATTENDEES_PAGE_SIZE))
        .then(res => {
          if (id !== ticket.current) return;
          setItems(res.items);
          setTotal(res.total);
          setPage(0);
        })
        .catch(err => {
          if (id !== ticket.current) return;
          setError(errorMessage(err, COPY.attendees.loadFailed));
        })
        .finally(() => {
          if (id === ticket.current) setLoading(false);
        });
    },
    [eventId],
  );

  // Debounce the box into the query the server sees.
  useEffect(() => {
    const t = setTimeout(() => setSearch(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!active && !started.current) return;
    started.current = true;
    load(filter, search);
  }, [active, filter, search, load]);

  const reload = useCallback(() => {
    if (started.current) load(filter, search);
  }, [filter, search, load]);

  const hasMore = !!items && hasMorePages(page, ATTENDEES_PAGE_SIZE, total);
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const id = ticket.current;
    const nextPage = page + 1;
    setLoadingMore(true);
    listAttendees(
      eventId,
      attendeeQuery(filter, search, nextPage, ATTENDEES_PAGE_SIZE),
    )
      .then(res => {
        if (id !== ticket.current) return;
        setItems(prev => mergeAttendees(prev ?? [], res.items));
        setTotal(res.total);
        setPage(nextPage);
      })
      .catch(err =>
        setNotice({
          text: errorMessage(err, COPY.attendees.loadFailed),
          tone: 'error',
        }),
      )
      .finally(() => setLoadingMore(false));
  }, [eventId, filter, hasMore, loadingMore, page, search, setNotice]);

  const markCheckedIn = useCallback((ticketId: string, at: string) => {
    setItems(prev => (prev ? withCheckedIn(prev, ticketId, at) : prev));
  }, []);

  const itemsRef = useRef(items);
  itemsRef.current = items;
  const checkInRow = useCallback(
    (ticketId: string) => {
      const row = itemsRef.current?.find(a => a.ticketId === ticketId);
      if (!row || checking[ticketId]) return;
      setChecking(prev => ({ ...prev, [ticketId]: true }));
      setNotice(null);
      checkIn(eventId, { code: row.code })
        .then(outcome => {
          const model = mapCheckIn(outcome);
          if (outcome.result !== 'invalid_ticket') {
            markCheckedIn(
              ticketId,
              outcome.ticket?.checkedInAt ?? new Date().toISOString(),
            );
          }
          if (outcome.result === 'entry_allowed') onAdmitted();
          setNotice({
            text: [model.title, model.name].filter(Boolean).join(' — '),
            tone: model.tone === 'bad' ? 'error' : 'ok',
          });
        })
        .catch(err =>
          setNotice({
            text: errorMessage(err, COPY.checkIn.failed),
            tone: 'error',
          }),
        )
        .finally(() =>
          setChecking(prev => {
            const next = { ...prev };
            delete next[ticketId];
            return next;
          }),
        );
    },
    [checking, eventId, markCheckedIn, onAdmitted, setNotice],
  );

  const setFilter = useCallback((next: AttendeeFilter) => {
    setFilterState(next);
    setItems(null);
  }, []);

  /* A row checked in under "Not yet" leaves that view, as it would on the
     server — the same test, run on what is loaded. */
  const rows = useMemo(() => {
    const now = new Date();
    return filterAttendees(items ?? [], filter, '').map(a =>
      mapAttendee(a, now),
    );
  }, [items, filter]);

  return {
    filter,
    setFilter,
    query,
    setQuery,
    rows,
    total,
    hasMore,
    isLoading: loading && !items,
    isLoadingMore: loadingMore,
    errorMessage: !items && error ? error : null,
    checking,
    reload,
    loadMore,
    checkInRow,
    markCheckedIn,
  };
}

// ---- Check-in --------------------------------------------------------------------------

export interface CheckInResult {
  value: string;
  setValue: (text: string) => void;
  busy: boolean;
  error: string | null;
  result: CheckInResultModel | null;
  recent: RecentCheckIn[];
  submit: () => Promise<void>;
  clearResult: () => void;
}

/** The door: one box, the server's answer, and who came in this session. */
export function useCheckIn(
  eventId: string,
  onAdmitted: (ticketId: string, at: string) => void,
): CheckInResult {
  const [value, setValueState] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckInResultModel | null>(null);
  const [recent, setRecent] = useState<RecentCheckIn[]>([]);

  const setValue = useCallback((text: string) => {
    setValueState(text);
    setError(null);
  }, []);

  const submit = async () => {
    if (busy) return;
    const parsed = checkInBody(value);
    if (!parsed.body) {
      setError(parsed.error);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const outcome = await checkIn(eventId, parsed.body);
      setResult(mapCheckIn(outcome));
      const admitted = recentFrom(outcome);
      if (admitted && outcome.ticket) {
        setRecent(prev =>
          [admitted, ...prev.filter(r => r.id !== admitted.id)].slice(
            0,
            RECENT_CHECK_INS,
          ),
        );
        onAdmitted(
          outcome.ticket.ticketId,
          outcome.ticket.checkedInAt ?? new Date().toISOString(),
        );
      }
      setValueState('');
    } catch (err) {
      setResult(null);
      setError(errorMessage(err, COPY.checkIn.failed));
    } finally {
      setBusy(false);
    }
  };

  return {
    value,
    setValue,
    busy,
    error,
    result,
    recent,
    submit,
    clearResult: useCallback(() => setResult(null), []),
  };
}

// ---- Memories & live ---------------------------------------------------------------------

export interface MemoriesLiveResult {
  memories: MemoriesForm;
  memoriesError: string | null;
  memoriesDirty: boolean;
  savingMemories: boolean;
  setMemory: <K extends keyof MemoriesForm>(
    key: K,
    value: MemoriesForm[K],
  ) => void;
  saveMemories: () => Promise<void>;
  live: LiveForm;
  liveErrors: LiveFormErrors;
  liveDirty: boolean;
  savingLive: boolean;
  setLive: <K extends keyof LiveForm>(key: K, value: LiveForm[K]) => void;
  saveLive: () => Promise<void>;
}

/**
 * The two settings cards. Each shows the server's values until the organizer
 * touches it, and the server's answer to a save becomes the event's values.
 */
export function useMemoriesLive(
  eventId: string,
  w: Pick<
    PublicEventContainerResult,
    'event' | 'apply' | 'setNotice' | 'reloadNumbers'
  >,
): MemoriesLiveResult {
  const { event, apply, setNotice, reloadNumbers } = w;
  const serverMemories = useMemo(
    () => memoriesFormFrom(event?.memories),
    [event?.memories],
  );
  const serverLive = useMemo(
    () => liveFormFrom(event?.liveStream),
    [event?.liveStream],
  );
  const [memDraft, setMemDraft] = useState<MemoriesForm | null>(null);
  const [liveDraft, setLiveDraft] = useState<LiveForm | null>(null);
  const [memoriesError, setMemoriesError] = useState<string | null>(null);
  const [liveErrors, setLiveErrors] = useState<LiveFormErrors>({});
  const [savingMemories, setSavingMemories] = useState(false);
  const [savingLive, setSavingLive] = useState(false);

  const memories = memDraft ?? serverMemories;
  const live = liveDraft ?? serverLive;

  const setMemory = <K extends keyof MemoriesForm>(
    key: K,
    value: MemoriesForm[K],
  ) => {
    setMemDraft({ ...memories, [key]: value });
    setMemoriesError(null);
  };
  const setLive = <K extends keyof LiveForm>(key: K, value: LiveForm[K]) => {
    setLiveDraft({ ...live, [key]: value });
    setLiveErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const saveMemories = async () => {
    if (savingMemories) return;
    const found = validateMemories(memories);
    if (found) {
      setMemoriesError(found);
      return;
    }
    setSavingMemories(true);
    setNotice(null);
    try {
      const body = memoriesBody(memories);
      await setMemories(eventId, body);
      // Every field is sent, so what was sent is what is stored.
      apply({ memories: body });
      setMemDraft(null);
      setNotice({ text: COPY.memories.saved, tone: 'ok' });
      reloadNumbers();
    } catch (err) {
      setNotice({
        text: errorMessage(err, COPY.memories.failed),
        tone: 'error',
      });
    } finally {
      setSavingMemories(false);
    }
  };

  const saveLive = async () => {
    if (savingLive) return;
    const found = validateLiveForm(live);
    if (hasErrors(found)) {
      setLiveErrors(found);
      return;
    }
    setSavingLive(true);
    setNotice(null);
    try {
      const body = liveBody(live);
      /* Every field is sent, so what was sent is what is stored — and the
         response spreads a Mongoose subdocument, so it is not relied on. */
      await setLiveStream(eventId, body);
      apply({ liveStream: body });
      setLiveDraft(null);
      setNotice({ text: COPY.live.saved, tone: 'ok' });
      reloadNumbers();
    } catch (err) {
      setNotice({ text: errorMessage(err, COPY.live.failed), tone: 'error' });
    } finally {
      setSavingLive(false);
    }
  };

  return {
    memories,
    memoriesError,
    memoriesDirty: isFormChanged(memories, serverMemories),
    savingMemories,
    setMemory,
    saveMemories,
    live,
    liveErrors,
    liveDirty: isFormChanged(live, serverLive),
    savingLive,
    setLive,
    saveLive,
  };
}
