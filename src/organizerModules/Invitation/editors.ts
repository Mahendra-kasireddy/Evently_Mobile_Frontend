/**
 * One hook per section editor. Each fills its form once per opening (so a
 * background refetch never overwrites what is being typed), saves only what
 * changed through the one PATCH, and hands the server's answer back.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { chooseImageSource, pickImage } from '../Shared';
import { INVITATION_COPY as COPY, LIMITS, UPLOAD_PURPOSE } from './constants';
import {
  captureMemory,
  getMemories,
  patchInvitation,
  pickMemoryFromLibrary,
  pickVideo,
  uploadFile,
  uploadMemory,
} from './services';
import type {
  CountdownForm,
  CountdownTarget,
  DetailsErrors,
  DetailsForm,
  InvitationFontDTO,
  InvitationTemplateDTO,
  MemoryDTO,
  MemoryGalleryDTO,
  OrganizerInvitationDTO,
  SectionId,
  StoryForm,
  SubEventErrors,
  SubEventForm,
  UpdateInvitationBody,
} from './types';
import {
  artworkOf,
  countdownFormFrom,
  countdownPatch,
  countdownTargets,
  detailsFormFrom,
  detailsPatch,
  emptySubEvent,
  errorText,
  limitsOf,
  memoryProblem,
  moveItem,
  storyCardForm,
  storyFormFrom,
  storyPatch,
  subEventsFormFrom,
  subEventsPatch,
  validateDetails,
  validateStory,
  validateSubEvent,
  videoProblem,
  videoTypeOf,
} from './utils';

/** What every editor is handed by the screen container. */
export interface EditorDeps {
  bookingId: string;
  invitation: OrganizerInvitationDTO | null;
  active: boolean;
  /** A save landed (or there was nothing to save): back to the hub. */
  onSaved: (dto: OrganizerInvitationDTO | null, section: SectionId) => void;
}

/** What the screen needs from any editor, for its footer and its guard. */
export interface EditorBase {
  dirty: boolean;
  saving: boolean;
  error: string;
  save: () => void;
}

/** The form, seeded from the invitation once each time the editor opens. */
function useDraft<T>(
  active: boolean,
  invitation: OrganizerInvitationDTO | null,
  from: (dto: OrganizerInvitationDTO) => T,
) {
  const [baseline, setBaseline] = useState<T | null>(null);
  const [form, setForm] = useState<T | null>(null);
  useEffect(() => {
    if (!active) {
      setBaseline(null);
      setForm(null);
      return;
    }
    if (baseline !== null || !invitation) return;
    const seeded = from(invitation);
    setBaseline(seeded);
    setForm(seeded);
  }, [active, invitation, baseline, from]);
  return { baseline, form, setForm };
}

/** The PATCH, its busy flag and its error. An empty body saves nothing. */
function useSaver(
  bookingId: string,
  section: SectionId,
  active: boolean,
  onSaved: EditorDeps['onSaved'],
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!active) setError('');
  }, [active]);

  const run = useCallback(
    async (body: UpdateInvitationBody) => {
      if (!Object.keys(body).length) {
        onSaved(null, section);
        return;
      }
      setSaving(true);
      setError('');
      try {
        const dto = await patchInvitation(bookingId, body);
        onSaved(dto, section);
      } catch (e) {
        setError(errorText(e, COPY.saveFailed));
      } finally {
        setSaving(false);
      }
    },
    [bookingId, section, onSaved],
  );
  return { saving, error, setError, run };
}

/* ---- Details -------------------------------------------------------------- */

export interface DetailsEditor extends EditorBase {
  form: DetailsForm | null;
  errors: DetailsErrors;
  templates: InvitationTemplateDTO[];
  fonts: InvitationFontDTO[];
  welcomeMax: number;
  set: <K extends keyof DetailsForm>(key: K, value: DetailsForm[K]) => void;
}

export function useDetailsEditor(d: EditorDeps): DetailsEditor {
  const { baseline, form, setForm } = useDraft(
    d.active,
    d.invitation,
    detailsFormFrom,
  );
  const saver = useSaver(d.bookingId, 'details', d.active, d.onSaved);
  const [errors, setErrors] = useState<DetailsErrors>({});
  const welcomeMax = limitsOf(d.invitation).welcomeMessage;

  useEffect(() => {
    if (!d.active) setErrors({});
  }, [d.active]);

  const { setError } = saver;
  const set = useCallback(
    <K extends keyof DetailsForm>(key: K, value: DetailsForm[K]) => {
      setForm(prev => (prev ? { ...prev, [key]: value } : prev));
      setErrors(prev => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setError('');
    },
    [setForm, setError],
  );

  const { run } = saver;
  const save = useCallback(() => {
    if (!form || !baseline) return;
    const found = validateDetails(form, welcomeMax);
    if (Object.keys(found).length) {
      setErrors(found);
      setError(COPY.fixFields);
      return;
    }
    run(detailsPatch(baseline, form)).catch(() => undefined);
  }, [form, baseline, welcomeMax, run, setError]);

  return {
    form,
    errors,
    templates: d.invitation?.templates ?? [],
    fonts: d.invitation?.fonts ?? [],
    welcomeMax,
    set,
    dirty:
      !!form &&
      !!baseline &&
      Object.keys(detailsPatch(baseline, form)).length > 0,
    saving: saver.saving,
    error: saver.error,
    save,
  };
}

/* ---- Story ---------------------------------------------------------------- */

export interface StoryEditor extends EditorBase {
  form: StoryForm | null;
  uploading: boolean;
  maxCards: number;
  maxCaption: number;
  setTitle: (title: string) => void;
  setCaption: (key: string, caption: string) => void;
  move: (key: string, delta: number) => void;
  remove: (key: string) => void;
  add: () => void;
}

export function useStoryEditor(d: EditorDeps): StoryEditor {
  const { baseline, form, setForm } = useDraft(
    d.active,
    d.invitation,
    storyFormFrom,
  );
  const saver = useSaver(d.bookingId, 'story', d.active, d.onSaved);
  const [uploading, setUploading] = useState(false);
  const limits = limitsOf(d.invitation);
  const { setError, run } = saver;

  const edit = useCallback(
    (fn: (prev: StoryForm) => StoryForm) => {
      setForm(prev => (prev ? fn(prev) : prev));
      setError('');
    },
    [setForm, setError],
  );

  const setTitle = useCallback(
    (title: string) => edit(prev => ({ ...prev, title })),
    [edit],
  );
  const setCaption = useCallback(
    (key: string, caption: string) =>
      edit(prev => ({
        ...prev,
        cards: prev.cards.map(c => (c.key === key ? { ...c, caption } : c)),
      })),
    [edit],
  );
  const move = useCallback(
    (key: string, delta: number) =>
      edit(prev => {
        const from = prev.cards.findIndex(c => c.key === key);
        return { ...prev, cards: moveItem(prev.cards, from, from + delta) };
      }),
    [edit],
  );
  const remove = useCallback(
    (key: string) =>
      edit(prev => ({
        ...prev,
        cards: prev.cards.filter(c => c.key !== key),
      })),
    [edit],
  );

  const count = form?.cards.length ?? 0;
  const add = useCallback(() => {
    if (uploading) return;
    if (count >= limits.storyCards) {
      setError(COPY.storyFull(limits.storyCards));
      return;
    }
    (async () => {
      const source = await chooseImageSource(COPY.storyPickTitle);
      if (!source) return;
      try {
        const image = await pickImage(source, 2000);
        if (!image) return;
        setUploading(true);
        setError('');
        const stored = await uploadFile(image, UPLOAD_PURPOSE.story);
        const key = `new-${Date.now()}`;
        edit(prev => ({
          ...prev,
          cards: [...prev.cards, storyCardForm(key, stored.url, stored.key)],
        }));
      } catch (e) {
        setError(errorText(e, COPY.uploadFailed));
      } finally {
        setUploading(false);
      }
    })().catch(() => undefined);
  }, [uploading, count, limits.storyCards, edit, setError]);

  const save = useCallback(() => {
    if (!form || !baseline) return;
    const problem = validateStory(form, limits);
    if (problem) {
      setError(problem);
      return;
    }
    run(storyPatch(baseline, form)).catch(() => undefined);
  }, [form, baseline, limits, run, setError]);

  return {
    form,
    uploading,
    maxCards: limits.storyCards,
    maxCaption: limits.storyCaption,
    setTitle,
    setCaption,
    move,
    remove,
    add,
    dirty:
      !!form &&
      !!baseline &&
      Object.keys(storyPatch(baseline, form)).length > 0,
    saving: saver.saving,
    error: saver.error,
    save,
  };
}

/* ---- Save the date -------------------------------------------------------- */

/** The one event open in the sheet: which, its fields and their errors. */
export interface SubEventSheetState {
  isNew: boolean;
  form: SubEventForm;
  original: SubEventForm;
  errors: SubEventErrors;
}

export interface DatesEditor extends EditorBase {
  list: SubEventForm[] | null;
  sheet: SubEventSheetState | null;
  sheetDirty: boolean;
  countdownId: string;
  canAdd: boolean;
  openNew: () => void;
  openEdit: (key: string) => void;
  setSheetField: <K extends keyof SubEventForm>(
    key: K,
    value: SubEventForm[K],
  ) => void;
  sheetDone: () => void;
  closeSheet: () => void;
  move: (key: string, delta: number) => void;
  remove: (key: string) => void;
}

export function useDatesEditor(d: EditorDeps): DatesEditor {
  const {
    baseline,
    form: list,
    setForm: setList,
  } = useDraft(d.active, d.invitation, subEventsFormFrom);
  const saver = useSaver(d.bookingId, 'dates', d.active, d.onSaved);
  const [sheet, setSheet] = useState<SubEventSheetState | null>(null);
  const zone = d.invitation?.details.timezone || '';
  const { setError, run } = saver;

  useEffect(() => {
    if (!d.active) setSheet(null);
  }, [d.active]);

  const openNew = useCallback(() => {
    const blank = emptySubEvent(zone, `new-${Date.now()}`);
    setSheet({ isNew: true, form: blank, original: blank, errors: {} });
  }, [zone]);

  const openEdit = useCallback(
    (key: string) => {
      const found = list?.find(e => e.key === key);
      if (found)
        setSheet({ isNew: false, form: found, original: found, errors: {} });
    },
    [list],
  );

  const setSheetField = useCallback(
    <K extends keyof SubEventForm>(key: K, value: SubEventForm[K]) => {
      setSheet(prev => {
        if (!prev) return prev;
        const errors = { ...prev.errors };
        delete errors[key as keyof SubEventErrors];
        return { ...prev, form: { ...prev.form, [key]: value }, errors };
      });
    },
    [],
  );

  const sheetDone = useCallback(() => {
    if (!sheet) return;
    const errors = validateSubEvent(sheet.form);
    if (Object.keys(errors).length) {
      setSheet({ ...sheet, errors });
      return;
    }
    const done = sheet.form;
    setList(prev => {
      if (!prev) return prev;
      return sheet.isNew
        ? [...prev, done]
        : prev.map(e => (e.key === done.key ? done : e));
    });
    setError('');
    setSheet(null);
  }, [sheet, setList, setError]);

  const closeSheet = useCallback(() => setSheet(null), []);

  const move = useCallback(
    (key: string, delta: number) => {
      setList(prev => {
        if (!prev) return prev;
        const from = prev.findIndex(e => e.key === key);
        return moveItem(prev, from, from + delta);
      });
      setError('');
    },
    [setList, setError],
  );

  const remove = useCallback(
    (key: string) => {
      setList(prev => (prev ? prev.filter(e => e.key !== key) : prev));
      setError('');
    },
    [setList, setError],
  );

  const save = useCallback(() => {
    if (!list || !baseline) return;
    const unnamed = list.findIndex(e => !e.name.trim());
    if (unnamed >= 0) {
      setError(COPY.subNameRequired);
      return;
    }
    run(subEventsPatch(baseline, list)).catch(() => undefined);
  }, [list, baseline, run, setError]);

  return {
    list,
    sheet,
    sheetDirty:
      !!sheet && JSON.stringify(sheet.form) !== JSON.stringify(sheet.original),
    countdownId: d.invitation?.details.countdownSubEventId ?? '',
    canAdd: (list?.length ?? 0) < LIMITS.subEvents,
    openNew,
    openEdit,
    setSheetField,
    sheetDone,
    closeSheet,
    move,
    remove,
    dirty:
      !!list &&
      !!baseline &&
      Object.keys(subEventsPatch(baseline, list)).length > 0,
    saving: saver.saving,
    error: saver.error,
    save,
  };
}

/* ---- Countdown ------------------------------------------------------------ */

export interface CountdownEditor extends EditorBase {
  form: CountdownForm | null;
  targets: CountdownTarget[];
  set: <K extends keyof CountdownForm>(key: K, value: CountdownForm[K]) => void;
}

export function useCountdownEditor(d: EditorDeps): CountdownEditor {
  const { baseline, form, setForm } = useDraft(
    d.active,
    d.invitation,
    countdownFormFrom,
  );
  const saver = useSaver(d.bookingId, 'countdown', d.active, d.onSaved);
  const { setError, run } = saver;

  const set = useCallback(
    <K extends keyof CountdownForm>(key: K, value: CountdownForm[K]) => {
      setForm(prev => (prev ? { ...prev, [key]: value } : prev));
      setError('');
    },
    [setForm, setError],
  );

  const save = useCallback(() => {
    if (!form || !baseline) return;
    run(countdownPatch(baseline, form)).catch(() => undefined);
  }, [form, baseline, run]);

  return {
    form,
    targets: d.invitation ? countdownTargets(d.invitation) : [],
    set,
    dirty:
      !!form &&
      !!baseline &&
      Object.keys(countdownPatch(baseline, form)).length > 0,
    saving: saver.saving,
    error: saver.error,
    save,
  };
}

/* ---- Artwork -------------------------------------------------------------- */

export interface ArtworkEditor {
  busy: 'image' | 'video' | 'remove' | null;
  error: string;
  message: string;
  maxSeconds: number;
  uploadImage: () => void;
  uploadVideo: () => void;
  remove: () => void;
}

/**
 * Upload first, then point the invitation at it — never the other way round,
 * so the invitation only ever names a file that exists. Each change saves at
 * once; there is nothing to discard.
 */
export function useArtworkEditor(
  bookingId: string,
  invitation: OrganizerInvitationDTO | null,
  active: boolean,
  apply: (dto: OrganizerInvitationDTO) => void,
): ArtworkEditor {
  const [busy, setBusy] = useState<ArtworkEditor['busy']>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const maxSeconds = limitsOf(invitation).heroVideoSeconds;

  useEffect(() => {
    if (!active) {
      setError('');
      setMessage('');
    }
  }, [active]);

  const write = useCallback(
    async (details: UpdateInvitationBody['details'], ok: string) => {
      const saved = await patchInvitation(bookingId, { details });
      apply(saved);
      const stored = artworkOf(saved.details) !== null;
      const wanted = !!details?.heroMediaUrl;
      if (stored !== wanted) {
        setError(COPY.artworkNotStored);
        return;
      }
      setMessage(ok);
    },
    [bookingId, apply],
  );

  const uploadImage = useCallback(() => {
    if (busy) return;
    (async () => {
      const source = await chooseImageSource(COPY.artworkPickTitle);
      if (!source) return;
      try {
        const image = await pickImage(source, 3000);
        if (!image) return;
        setBusy('image');
        setError('');
        setMessage('');
        const stored = await uploadFile(image, UPLOAD_PURPOSE.image);
        await write(
          {
            heroMediaType: 'image',
            heroMediaUrl: stored.url,
            heroMediaKey: stored.key,
            heroMediaDurationSec: 0,
          },
          COPY.artworkSaved,
        );
      } catch (e) {
        setError(errorText(e, COPY.uploadFailed));
      } finally {
        setBusy(null);
      }
    })().catch(() => undefined);
  }, [busy, write]);

  const uploadVideo = useCallback(() => {
    if (busy) return;
    (async () => {
      try {
        const picked = await pickVideo();
        if (!picked) return;
        const problem = videoProblem(picked, maxSeconds);
        if (problem) {
          setError(problem);
          setMessage('');
          return;
        }
        setBusy('video');
        setError('');
        setMessage('');
        const stored = await uploadFile(
          { ...picked, type: videoTypeOf(picked) },
          UPLOAD_PURPOSE.video,
        );
        await write(
          {
            heroMediaType: 'video',
            heroMediaUrl: stored.url,
            heroMediaKey: stored.key,
            heroMediaDurationSec: Math.round(picked.duration ?? 0),
          },
          COPY.artworkSaved,
        );
      } catch (e) {
        setError(errorText(e, COPY.uploadFailed));
      } finally {
        setBusy(null);
      }
    })().catch(() => undefined);
  }, [busy, maxSeconds, write]);

  const remove = useCallback(() => {
    if (busy) return;
    setBusy('remove');
    setError('');
    setMessage('');
    write(
      {
        heroMediaType: '',
        heroMediaUrl: '',
        heroMediaKey: '',
        heroMediaDurationSec: 0,
      },
      COPY.artworkRemoved,
    )
      .catch(e => setError(errorText(e, COPY.saveFailed)))
      .finally(() => setBusy(null));
  }, [busy, write]);

  return {
    busy,
    error,
    message,
    maxSeconds,
    uploadImage,
    uploadVideo,
    remove,
  };
}

/* ---- Shared memories ------------------------------------------------------ */

export interface MemoriesPanel {
  gallery: MemoryGalleryDTO | null;
  items: MemoryDTO[];
  kind: string;
  subEvent: string;
  loading: boolean;
  paging: boolean;
  adding: boolean;
  /** The server's reason the gallery is closed to the organizer, or ''. */
  off: string;
  error: string;
  say: string;
  sayWarn: boolean;
  viewing: number;
  setViewing: (index: number) => void;
  changeFilter: (kind: string, subEvent: string) => void;
  loadMore: () => void;
  reload: () => void;
  add: (how: 'library' | 'photo' | 'reel') => void;
}

/**
 * See and add — the organizer's whole part in the gallery. Settings,
 * moderation and deletion are the customer's, and the API has no organizer
 * route to them.
 */
export function useMemoriesPanel(
  bookingId: string,
  active: boolean,
): MemoriesPanel {
  const [gallery, setGallery] = useState<MemoryGalleryDTO | null>(null);
  const [items, setItems] = useState<MemoryDTO[]>([]);
  const [kind, setKind] = useState('all');
  const [subEvent, setSubEvent] = useState('all');
  const [loading, setLoading] = useState(false);
  const [paging, setPaging] = useState(false);
  const [adding, setAdding] = useState(false);
  const [off, setOff] = useState('');
  const [error, setError] = useState('');
  const [say, setSay] = useState('');
  const [sayWarn, setSayWarn] = useState(false);
  const [viewing, setViewing] = useState(-1);
  const ticket = useRef(0);

  const load = useCallback(
    async (nextKind: string, nextSubEvent: string) => {
      const mine = ++ticket.current;
      setLoading(true);
      setError('');
      try {
        const page = await getMemories(bookingId, {
          kind: nextKind,
          subEvent: nextSubEvent,
        });
        if (mine !== ticket.current) return;
        setGallery(page);
        setItems(page.items);
        setOff('');
      } catch (e) {
        if (mine !== ticket.current) return;
        const status = (e as { status?: number } | null)?.status;
        if (status === 403) setOff(errorText(e, COPY.memOffBody));
        else setError(errorText(e, COPY.memLoadFailed));
      } finally {
        if (mine === ticket.current) setLoading(false);
      }
    },
    [bookingId],
  );

  useEffect(() => {
    if (active) {
      load(kind, subEvent).catch(() => undefined);
    } else {
      ticket.current += 1;
      setViewing(-1);
      setSay('');
    }
    // Load once per opening; filters reload through changeFilter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const changeFilter = useCallback(
    (nextKind: string, nextSubEvent: string) => {
      setKind(nextKind);
      setSubEvent(nextSubEvent);
      load(nextKind, nextSubEvent).catch(() => undefined);
    },
    [load],
  );

  const reload = useCallback(() => {
    load(kind, subEvent).catch(() => undefined);
  }, [load, kind, subEvent]);

  const loadMore = useCallback(() => {
    const before = gallery?.nextCursor;
    if (!before || paging) return;
    const mine = ticket.current;
    setPaging(true);
    getMemories(bookingId, { kind, subEvent, before })
      .then(page => {
        if (mine !== ticket.current) return;
        setGallery(page);
        setItems(prev => [...prev, ...page.items]);
      })
      .catch(e => setError(errorText(e, COPY.memLoadFailed)))
      .finally(() => setPaging(false));
  }, [bookingId, gallery, paging, kind, subEvent]);

  const add = useCallback(
    (how: 'library' | 'photo' | 'reel') => {
      if (adding) return;
      (async () => {
        try {
          const picked =
            how === 'library'
              ? await pickMemoryFromLibrary()
              : await captureMemory(how);
          if (!picked) return;
          const problem = memoryProblem(picked);
          if (problem) {
            setSay(problem);
            setSayWarn(true);
            return;
          }
          setAdding(true);
          setSay('');
          const outcome = await uploadMemory(bookingId, picked, how === 'reel');
          setSay(outcome.message);
          setSayWarn(
            outcome.status === 'duplicate' || outcome.status === 'flagged',
          );
          if (outcome.status !== 'duplicate') reload();
        } catch (e) {
          setSay(errorText(e, COPY.memFailed));
          setSayWarn(true);
        } finally {
          setAdding(false);
        }
      })().catch(() => undefined);
    },
    [adding, bookingId, reload],
  );

  return {
    gallery,
    items,
    kind,
    subEvent,
    loading,
    paging,
    adding,
    off,
    error,
    say,
    sayWarn,
    viewing,
    setViewing,
    changeFilter,
    loadMore,
    reload,
    add,
  };
}
