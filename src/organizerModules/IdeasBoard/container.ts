import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { chooseImageSource } from '../Shared';
import { IDEAS_COPY as COPY, PHOTO_MAX } from './constants';
import { useIdeaBoard } from './hooks';
import {
  pickPhotos,
  postIdea,
  replyToIdea,
  updateVision,
  uploadIdeaPhoto,
} from './services';
import type {
  BoardVisionDTO,
  FilterChip,
  IdeaBoardDTO,
  IdeaCardModel,
  IdeaDTO,
  IdeaImageDTO,
  IdeasFilter,
  OrganizerPostType,
  PhotoModel,
  ProgressModel,
  ReplyForm,
  ReplyFormErrors,
  VisionForm,
  VisionFormErrors,
  VisionRowModel,
} from './types';
import {
  buildPostBody,
  buildReplyBody,
  buildVisionBody,
  errorMessage,
  filterChips,
  filterIdeas,
  hasErrors,
  isNotFound,
  mapIdea,
  mapPhotos,
  mergeIdea,
  photosLeft,
  progressModel,
  replyFormFor,
  validateReplyForm,
  validateVisionForm,
  visionFormFrom,
  visionRows,
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

export interface IdeasContainerResult {
  board: IdeaBoardDTO | null;
  progress: ProgressModel | null;
  vision: BoardVisionDTO | null;
  visionRows: VisionRowModel[];
  filter: IdeasFilter;
  setFilter: (filter: IdeasFilter) => void;
  chips: FilterChip[];
  /** The cards in the selected filter. */
  cards: IdeaCardModel[];
  hasAnyPosts: boolean;
  notice: Notice | null;
  setNotice: (notice: Notice | null) => void;
  dismissNotice: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
  notFound: boolean;
  errorMessage: string | null;
  refresh: () => void;
  /** A post the server returned, folded in. */
  applyIdea: (idea: IdeaDTO) => void;
  /** A whole board the server returned, taken as the new state. */
  applyBoard: (board: IdeaBoardDTO) => void;
  ideaById: (ideaId: string) => IdeaDTO | null;
}

/**
 * The board for one booking. Every mutation's response becomes the new state
 * at once: a post or reply is folded into the feed (counts recomputed the way
 * the server does), and a vision save returns the whole board.
 */
export function useIdeasContainer(bookingId: string): IdeasContainerResult {
  const board = useIdeaBoard(bookingId);

  const [latest, setLatest] = useState<IdeaBoardDTO | null>(null);
  const [filter, setFilter] = useState<IdeasFilter>('all');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pulling, setPulling] = useState(false);

  // A fresh fetch supersedes whatever a mutation handed back.
  const [latestFor, setLatestFor] = useState(board.data);
  if (latestFor !== board.data) {
    setLatestFor(board.data);
    setLatest(null);
  }
  const data = latest ?? board.data;
  const dataRef = useRef(data);
  dataRef.current = data;

  useRefetchOnFocus(board.refetch);

  const refetch = board.refetch;
  const refresh = useCallback(() => {
    setPulling(true);
    setNotice(null);
    refetch();
  }, [refetch]);
  if (pulling && !board.loading) setPulling(false);

  const applyIdea = useCallback((idea: IdeaDTO) => {
    setLatest(prev => {
      const base = prev ?? dataRef.current;
      return base ? mergeIdea(base, idea) : base;
    });
  }, []);
  const applyBoard = useCallback((next: IdeaBoardDTO) => setLatest(next), []);
  const ideaById = useCallback(
    (ideaId: string) =>
      dataRef.current?.items.find(i => i.id === ideaId) ?? null,
    [],
  );

  const items = useMemo(() => data?.items ?? [], [data]);
  const chips = useMemo(() => filterChips(items, filter), [items, filter]);
  const cards = useMemo(() => {
    const now = Date.now();
    return filterIdeas(items, filter).map(i => mapIdea(i, now));
  }, [items, filter]);

  const notFound = !data && isNotFound(board.error);

  return {
    board: data,
    progress: useMemo(
      () => (data ? progressModel(data.counts, data.items) : null),
      [data],
    ),
    vision: data?.vision ?? null,
    visionRows: useMemo(() => (data ? visionRows(data.vision) : []), [data]),
    filter,
    setFilter,
    chips,
    cards,
    hasAnyPosts: items.length > 0,
    notice,
    setNotice,
    dismissNotice: useCallback(() => setNotice(null), []),
    isLoading: board.loading && !data,
    isRefreshing: pulling,
    notFound,
    errorMessage:
      !data && !notFound && board.error ? board.error.message : null,
    refresh,
    applyIdea,
    applyBoard,
    ideaById,
  };
}

// ---- Composer ----------------------------------------------------------------

export interface ComposerResult {
  text: string;
  setText: (text: string) => void;
  type: OrganizerPostType;
  setType: (type: OrganizerPostType) => void;
  images: IdeaImageDTO[];
  photos: PhotoModel[];
  removeImage: (index: number) => void;
  addPhotos: () => Promise<void>;
  uploading: boolean;
  posting: boolean;
  canPost: boolean;
  error: string | null;
  submit: () => Promise<boolean>;
}

/** Posting an update or a question, with photos uploaded as they are picked. */
export function useComposer(
  bookingId: string,
  c: Pick<IdeasContainerResult, 'applyIdea' | 'setNotice'>,
): ComposerResult {
  const [text, setTextValue] = useState('');
  const [type, setType] = useState<OrganizerPostType>('update');
  const [images, setImages] = useState<IdeaImageDTO[]>([]);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { applyIdea, setNotice } = c;

  const setText = useCallback((value: string) => {
    setTextValue(value);
    setError(null);
  }, []);

  const addPhotos = async () => {
    if (uploading || posting) return;
    setError(null);
    const left = photosLeft(images.length, PHOTO_MAX);
    if (left === 0) {
      setError(COPY.composer.photoLimit(PHOTO_MAX));
      return;
    }
    const source = await chooseImageSource(COPY.composer.pickTitle);
    if (!source) return;
    setUploading(true);
    try {
      const picked = await pickPhotos(source, left);
      for (const file of picked) {
        // One at a time, kept as each lands — a failure keeps the ones before it.
        const stored = await uploadIdeaPhoto(file);
        setImages(prev => [...prev, stored]);
      }
    } catch (err) {
      setError(errorMessage(err, COPY.composer.photoFailed));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const submit = async (): Promise<boolean> => {
    if (posting || uploading) return false;
    const built = buildPostBody({ text, type, images });
    if (!built.body) {
      setError(built.error);
      return false;
    }
    setPosting(true);
    setError(null);
    try {
      applyIdea(await postIdea(bookingId, built.body));
      setTextValue('');
      setImages([]);
      setType('update');
      setNotice({ text: COPY.composer.posted, tone: 'ok' });
      return true;
    } catch (err) {
      setError(errorMessage(err, COPY.composer.postFailed));
      return false;
    } finally {
      setPosting(false);
    }
  };

  return {
    text,
    setText,
    type,
    setType,
    images,
    photos: useMemo(() => mapPhotos(images), [images]),
    removeImage,
    addPhotos,
    uploading,
    posting,
    canPost: text.trim().length > 0 && !posting && !uploading,
    error,
    submit,
  };
}

// ---- Reply sheet -------------------------------------------------------------

export interface ReplySheetResult {
  visible: boolean;
  idea: IdeaDTO | null;
  form: ReplyForm;
  errors: ReplyFormErrors;
  saving: boolean;
  error: string | null;
  open: (ideaId: string) => void;
  close: () => void;
  setField: <K extends keyof ReplyForm>(key: K, value: ReplyForm[K]) => void;
  save: () => Promise<boolean>;
}

export function useReplySheet(
  c: Pick<IdeasContainerResult, 'applyIdea' | 'ideaById' | 'setNotice'>,
): ReplySheetResult {
  const [visible, setVisible] = useState(false);
  const [idea, setIdea] = useState<IdeaDTO | null>(null);
  const [form, setForm] = useState<ReplyForm>(() => ({
    status: 'planned',
    text: '',
    askApproval: false,
    approvalLabel: '',
  }));
  const [errors, setErrors] = useState<ReplyFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { applyIdea, ideaById, setNotice } = c;

  const open = (ideaId: string) => {
    const found = ideaById(ideaId);
    if (!found) return;
    setIdea(found);
    setForm(replyFormFor(found));
    setErrors({});
    setError(null);
    setVisible(true);
  };
  const close = useCallback(() => setVisible(false), []);

  const setField = useCallback(
    <K extends keyof ReplyForm>(key: K, value: ReplyForm[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
      setErrors(prev =>
        key in prev ? { ...prev, [key as string]: undefined } : prev,
      );
      setError(null);
    },
    [],
  );

  const save = async (): Promise<boolean> => {
    if (!idea || saving) return false;
    const found = validateReplyForm(form);
    if (hasErrors(found)) {
      setErrors(found);
      return false;
    }
    setSaving(true);
    setError(null);
    try {
      applyIdea(await replyToIdea(idea.id, buildReplyBody(form)));
      setVisible(false);
      setNotice({ text: COPY.reply.sent, tone: 'ok' });
      return true;
    } catch (err) {
      setError(errorMessage(err, COPY.reply.failed));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    visible,
    idea,
    form,
    errors,
    saving,
    error,
    open,
    close,
    setField,
    save,
  };
}

// ---- Vision sheet ------------------------------------------------------------

export interface VisionSheetResult {
  visible: boolean;
  form: VisionForm;
  errors: VisionFormErrors;
  dirty: boolean;
  saving: boolean;
  error: string | null;
  open: () => void;
  close: () => void;
  setField: <K extends keyof VisionForm>(key: K, value: VisionForm[K]) => void;
  save: () => Promise<boolean>;
}

const EMPTY_VISION: VisionForm = {
  theme: '',
  vibe: '',
  surprise: '',
  food: '',
  surpriseConfidential: true,
};

export function useVisionSheet(
  bookingId: string,
  c: Pick<IdeasContainerResult, 'vision' | 'applyBoard' | 'setNotice'>,
): VisionSheetResult {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<VisionForm>(EMPTY_VISION);
  const [errors, setErrors] = useState<VisionFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { vision, applyBoard, setNotice } = c;

  const open = () => {
    if (!vision) return;
    setForm(visionFormFrom(vision));
    setErrors({});
    setError(null);
    setVisible(true);
  };
  const close = useCallback(() => setVisible(false), []);

  const setField = useCallback(
    <K extends keyof VisionForm>(key: K, value: VisionForm[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
      setErrors(prev =>
        key in prev ? { ...prev, [key as string]: undefined } : prev,
      );
      setError(null);
    },
    [],
  );

  const body = vision ? buildVisionBody(form, vision) : {};
  const dirty = Object.keys(body).length > 0;

  const save = async (): Promise<boolean> => {
    if (!vision || saving) return false;
    const found = validateVisionForm(form);
    if (hasErrors(found)) {
      setErrors(found);
      return false;
    }
    if (!dirty) {
      setVisible(false);
      return true;
    }
    setSaving(true);
    setError(null);
    try {
      applyBoard(await updateVision(bookingId, body));
      setVisible(false);
      setNotice({ text: COPY.vision.saved, tone: 'ok' });
      return true;
    } catch (err) {
      setError(errorMessage(err, COPY.vision.saveFailed));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    visible,
    form,
    errors,
    dirty,
    saving,
    error,
    open,
    close,
    setField,
    save,
  };
}

// ---- Photo viewer ------------------------------------------------------------

export interface PhotoViewerResult {
  photos: PhotoModel[];
  index: number;
  visible: boolean;
  open: (photos: PhotoModel[], index: number) => void;
  close: () => void;
}

export function usePhotoViewer(): PhotoViewerResult {
  const [photos, setPhotos] = useState<PhotoModel[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  return {
    photos,
    index,
    visible,
    open: useCallback((next: PhotoModel[], at: number) => {
      setPhotos(next);
      setIndex(at);
      setVisible(true);
    }, []),
    close: useCallback(() => setVisible(false), []),
  };
}
