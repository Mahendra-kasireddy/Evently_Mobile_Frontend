import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { chooseImageSource } from '../Shared';
import { EVENT_COPY as COPY } from './constants';
import { useBooking, useIdeaBoard, useSubVendors } from './hooks';
import {
  createTask,
  deleteTask,
  pickAndUploadProof,
  updateStatus,
  updateTask,
} from './services';
import type {
  BookingDTO,
  BookingTaskDTO,
  HeaderModel,
  Permissions,
  RespondModel,
  SubVendorOption,
  TaskCardModel,
  TaskForm,
  TaskFormErrors,
  TaskProgress,
  TaskStatus,
} from './types';
import {
  acceptBody,
  columnCounts,
  completeBody,
  completeWarning,
  createTaskBody,
  declineBody,
  emptyTaskForm,
  errorMessage,
  firstBusyColumn,
  formFromTask,
  groupTasks,
  hasErrors,
  ideasCountLabel,
  isNotFound,
  isTaskFormDirty,
  mapHeader,
  mapRespond,
  mapTask,
  mergeBooking,
  permissions,
  subVendorOptions,
  taskProgress,
  updateTaskPlan,
  validateReason,
  validateTaskForm,
  withTaskStatus,
} from './utils';

export interface Notice {
  text: string;
  tone: 'ok' | 'error';
}

export type BookingAction = 'accept' | 'decline' | 'complete';

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

export interface EventContainerResult {
  booking: BookingDTO | null;
  header: HeaderModel | null;
  respond: RespondModel | null;
  can: Permissions | null;
  progress: TaskProgress;
  column: TaskStatus;
  setColumn: (column: TaskStatus) => void;
  counts: Record<TaskStatus, number>;
  /** The cards in the selected column. */
  cards: TaskCardModel[];
  /** Tasks being moved on the server right now. */
  moving: Record<string, boolean>;
  /** "4 ideas" — '' while unknown or when the board failed to load. */
  ideasLabel: string;
  /** Extra line for the completion confirm. */
  completeNote: string;
  subvendors: SubVendorOption[];
  subvendorsFailed: boolean;
  busy: BookingAction | null;
  notice: Notice | null;
  dismissNotice: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
  notFound: boolean;
  errorMessage: string | null;
  refresh: () => void;
  accept: () => Promise<boolean>;
  decline: (reason: string) => Promise<boolean>;
  complete: () => Promise<boolean>;
  moveTask: (taskId: string, status: TaskStatus) => void;
  /** A mutation's response, taken as the new state. */
  apply: (next: BookingDTO) => void;
  taskById: (taskId: string) => BookingTaskDTO | null;
}

/**
 * One booking: the header, the accept/decline gate, the task board and the
 * links out. Every mutation returns the whole booking, which becomes the new
 * state at once — no second request. A task move shows immediately and is put
 * back if the server refuses it.
 */
export function useEventContainer(bookingId: string): EventContainerResult {
  const booking = useBooking(bookingId);
  const ideas = useIdeaBoard(bookingId);
  const team = useSubVendors();

  const [latest, setLatest] = useState<BookingDTO | null>(null);
  const [busy, setBusy] = useState<BookingAction | null>(null);
  const [moving, setMoving] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pulling, setPulling] = useState(false);
  const [chosenColumn, setColumn] = useState<TaskStatus | null>(null);

  // A fresh fetch supersedes whatever a mutation handed back.
  const [latestFor, setLatestFor] = useState(booking.data);
  if (latestFor !== booking.data) {
    setLatestFor(booking.data);
    setLatest(null);
  }
  const data = latest ?? booking.data;
  const dataRef = useRef(data);
  dataRef.current = data;
  const busyRef = useRef(busy);
  busyRef.current = busy;
  const movingRef = useRef(moving);
  movingRef.current = moving;

  const refetchBooking = booking.refetch;
  const refetchIdeas = ideas.refetch;
  const refetchTeam = team.refetch;
  const reloadAll = useCallback(() => {
    refetchBooking();
    refetchIdeas();
    refetchTeam();
  }, [refetchBooking, refetchIdeas, refetchTeam]);
  useRefetchOnFocus(reloadAll);

  const refresh = useCallback(() => {
    setPulling(true);
    setNotice(null);
    reloadAll();
  }, [reloadAll]);
  if (pulling && !booking.loading) setPulling(false);

  const apply = useCallback((next: BookingDTO) => {
    setLatest(prev => mergeBooking(prev ?? dataRef.current, next));
  }, []);

  const runStatus = useCallback(
    async (
      action: BookingAction,
      body: Parameters<typeof updateStatus>[1],
      okText: string | null,
      failText: string,
    ): Promise<boolean> => {
      if (busyRef.current) return false;
      setBusy(action);
      setNotice(null);
      try {
        apply(await updateStatus(bookingId, body));
        if (okText) setNotice({ text: okText, tone: 'ok' });
        return true;
      } catch (error) {
        setNotice({ text: errorMessage(error, failText), tone: 'error' });
        // The booking may have moved on (expired, cancelled) — show where it is.
        refetchBooking();
        return false;
      } finally {
        setBusy(null);
      }
    },
    [apply, bookingId, refetchBooking],
  );

  const accept = useCallback(
    () =>
      runStatus(
        'accept',
        acceptBody(),
        COPY.respond.accepted,
        COPY.respond.acceptFailed,
      ),
    [runStatus],
  );
  const decline = useCallback(
    (reason: string) =>
      runStatus('decline', declineBody(reason), null, COPY.decline.failed),
    [runStatus],
  );
  const complete = useCallback(
    () =>
      runStatus(
        'complete',
        completeBody(),
        COPY.complete.done,
        COPY.complete.failed,
      ),
    [runStatus],
  );

  const moveTask = useCallback(
    (taskId: string, status: TaskStatus) => {
      const before = dataRef.current;
      const task = before?.tasks.find(t => t.id === taskId);
      if (!before || !task || movingRef.current[taskId]) return;
      const was = task.status;
      setNotice(null);
      setLatest(withTaskStatus(before, taskId, status));
      setMoving(prev => ({ ...prev, [taskId]: true }));
      updateTask(bookingId, taskId, { status })
        .then(apply)
        .catch(error => {
          setLatest(prev => (prev ? withTaskStatus(prev, taskId, was) : prev));
          setNotice({
            text: errorMessage(error, COPY.board.moveFailed),
            tone: 'error',
          });
        })
        .finally(() =>
          setMoving(prev => {
            const next = { ...prev };
            delete next[taskId];
            return next;
          }),
        );
    },
    [apply, bookingId],
  );

  const taskById = useCallback(
    (taskId: string) =>
      dataRef.current?.tasks.find(t => t.id === taskId) ?? null,
    [],
  );

  const tasks = data?.tasks;
  const grouped = useMemo(() => groupTasks(tasks), [tasks]);
  const column = chosenColumn ?? firstBusyColumn(tasks);
  const cards = useMemo(
    () => grouped[column].map(t => mapTask(t)),
    [grouped, column],
  );

  const ideaCounts = ideas.data?.counts;
  const notFound = !data && isNotFound(booking.error);

  return {
    booking: data,
    header: useMemo(() => (data ? mapHeader(data) : null), [data]),
    respond: useMemo(() => (data ? mapRespond(data) : null), [data]),
    can: useMemo(() => (data ? permissions(data) : null), [data]),
    progress: useMemo(() => taskProgress(tasks), [tasks]),
    column,
    setColumn,
    counts: useMemo(() => columnCounts(tasks), [tasks]),
    cards,
    moving,
    ideasLabel: ideas.error ? '' : ideasCountLabel(ideaCounts),
    completeNote: data ? completeWarning(data) : '',
    subvendors: useMemo(() => subVendorOptions(team.data), [team.data]),
    subvendorsFailed: !!team.error,
    busy,
    notice,
    dismissNotice: useCallback(() => setNotice(null), []),
    isLoading: booking.loading && !data,
    isRefreshing: pulling,
    notFound,
    errorMessage:
      !data && !notFound && booking.error ? booking.error.message : null,
    refresh,
    accept,
    decline,
    complete,
    moveTask,
    apply,
    taskById,
  };
}

// ---- Decline sheet -----------------------------------------------------------

export interface DeclineSheetResult {
  visible: boolean;
  reason: string;
  error: string | null;
  open: () => void;
  close: () => void;
  setReason: (text: string) => void;
  /** Checks the reason; true when it may be sent. */
  check: () => boolean;
}

export function useDeclineSheet(): DeclineSheetResult {
  const [visible, setVisible] = useState(false);
  const [reason, setReasonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  return {
    visible,
    reason,
    error,
    open: useCallback(() => {
      setError(null);
      setVisible(true);
    }, []),
    close: useCallback(() => setVisible(false), []),
    setReason: useCallback((text: string) => {
      setReasonText(text);
      setError(null);
    }, []),
    check: () => {
      const found = validateReason(reason);
      setError(found);
      return !found;
    },
  };
}

// ---- Task sheet --------------------------------------------------------------

export interface TaskSheetResult {
  visible: boolean;
  /** The task being edited — live from the booking, so a new proof shows at once. */
  task: BookingTaskDTO | null;
  isNew: boolean;
  form: TaskForm;
  errors: TaskFormErrors;
  dirty: boolean;
  saving: boolean;
  deleting: boolean;
  uploading: boolean;
  error: string | null;
  openNew: () => void;
  openTask: (taskId: string) => void;
  close: () => void;
  setField: <K extends keyof TaskForm>(key: K, value: TaskForm[K]) => void;
  save: () => Promise<boolean>;
  remove: () => Promise<boolean>;
  uploadProof: () => Promise<void>;
}

/** Create or edit one task: its fields, the checks, and the requests. */
export function useTaskSheet(
  bookingId: string,
  e: Pick<EventContainerResult, 'apply' | 'taskById' | 'booking'>,
): TaskSheetResult {
  const [visible, setVisible] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskForm>(emptyTaskForm);
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apply, taskById } = e;
  const task = taskId
    ? e.booking?.tasks.find(t => t.id === taskId) ?? null
    : null;

  const reset = (next: TaskForm, id: string | null) => {
    setForm(next);
    setTaskId(id);
    setErrors({});
    setError(null);
    setVisible(true);
  };

  const openNew = () => reset(emptyTaskForm(), null);
  const openTask = (id: string) => {
    const found = taskById(id);
    if (found) reset(formFromTask(found), id);
  };
  const close = useCallback(() => setVisible(false), []);

  const setField = useCallback(
    <K extends keyof TaskForm>(key: K, value: TaskForm[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
      setErrors(prev => (prev[key] ? { ...prev, [key]: undefined } : prev));
      setError(null);
    },
    [],
  );

  const save = async (): Promise<boolean> => {
    if (saving || deleting) return false;
    const found = validateTaskForm(form);
    if (hasErrors(found)) {
      setErrors(found);
      setError(COPY.sheet.fixFields);
      return false;
    }
    setSaving(true);
    setError(null);
    try {
      if (!taskId) {
        apply(await createTask(bookingId, createTaskBody(form)));
      } else if (task) {
        const plan = updateTaskPlan(form, task);
        if (Object.keys(plan.body).length) {
          apply(await updateTask(bookingId, taskId, plan.body));
        }
        if (plan.followUp) {
          apply(await updateTask(bookingId, taskId, plan.followUp));
        }
      }
      setVisible(false);
      return true;
    } catch (err) {
      setError(errorMessage(err, COPY.sheet.saveFailed));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (): Promise<boolean> => {
    if (!taskId || saving || deleting) return false;
    setDeleting(true);
    setError(null);
    try {
      apply(await deleteTask(bookingId, taskId));
      setVisible(false);
      return true;
    } catch (err) {
      setError(errorMessage(err, COPY.sheet.deleteFailed));
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const uploadProof = async () => {
    if (!taskId || uploading) return;
    const source = await chooseImageSource(COPY.sheet.proofPick);
    if (!source) return;
    setUploading(true);
    setError(null);
    try {
      const file = await pickAndUploadProof(source);
      if (file) {
        apply(await updateTask(bookingId, taskId, { photoProof: file }));
      }
    } catch (err) {
      setError(errorMessage(err, COPY.sheet.proofFailed));
    } finally {
      setUploading(false);
    }
  };

  return {
    visible,
    task,
    isNew: !taskId,
    form,
    errors,
    dirty: isTaskFormDirty(form, task),
    saving,
    deleting,
    uploading,
    error,
    openNew,
    openTask,
    close,
    setField,
    save,
    remove,
    uploadProof,
  };
}
