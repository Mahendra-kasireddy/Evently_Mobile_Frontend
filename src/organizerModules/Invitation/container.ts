import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { INVITATION_COPY as COPY, SECTION_META } from './constants';
import {
  useArtworkEditor,
  useCountdownEditor,
  useDatesEditor,
  useDetailsEditor,
  useMemoriesPanel,
  useStoryEditor,
  type ArtworkEditor,
  type CountdownEditor,
  type DatesEditor,
  type DetailsEditor,
  type EditorDeps,
  type MemoriesPanel,
  type StoryEditor,
} from './editors';
import {
  useOrganizerInvitation,
  useResolveRequest,
  useSendInvitation,
} from './hooks';
import type {
  HubModel,
  Notice,
  OrganizerInvitationDTO,
  SectionId,
} from './types';
import { errorText, isNotFound, mapHub } from './utils';

export interface InvitationEditorResult {
  invitation: OrganizerInvitationDTO | null;
  hub: HubModel | null;
  isLoading: boolean;
  notFound: boolean;
  errorMessage: string | null;
  refreshing: boolean;
  refresh: () => void;
  notice: Notice | null;
  clearNotice: () => void;

  sending: boolean;
  send: () => void;
  resolvingId: string | null;
  resolve: (requestId: string) => void;

  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;

  section: SectionId | null;
  openSection: (id: SectionId) => void;
  closeSection: () => void;
  /** The open editor has edits that would be lost by leaving it. */
  dirty: boolean;
  /** The open editor is writing — leaving is not asked about. */
  busy: boolean;

  artwork: ArtworkEditor;
  details: DetailsEditor;
  story: StoryEditor;
  dates: DatesEditor;
  countdown: CountdownEditor;
  memories: MemoriesPanel;
}

/** Refetch whenever the screen comes back into focus, but not on first focus. */
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

/**
 * The invitation hub and its section editors, on one route. The hub reads
 * `GET /invitation/organizer/:bookingId`; every save, send and resolve
 * answers with the whole invitation, which becomes the screen's state.
 */
export function useInvitationEditor(bookingId: string): InvitationEditorResult {
  const query = useOrganizerInvitation(bookingId);
  const sender = useSendInvitation();
  const resolver = useResolveRequest();

  // The freshest copy: the last fetch, or the last mutation's answer.
  const [latest, setLatest] = useState<OrganizerInvitationDTO | null>(null);
  useEffect(() => {
    if (query.data) setLatest(query.data);
  }, [query.data]);

  const [section, setSection] = useState<SectionId | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const refetch = query.refetch;
  useRefetchOnFocus(refetch);

  const refresh = useCallback(() => {
    setNotice(null);
    refetch();
  }, [refetch]);

  const onSaved = useCallback<EditorDeps['onSaved']>((dto, id) => {
    if (dto) {
      setLatest(dto);
      setNotice({ text: COPY.saved(SECTION_META[id].title), tone: 'ok' });
    }
    setSection(null);
  }, []);

  const deps = (id: SectionId): EditorDeps => ({
    bookingId,
    invitation: latest,
    active: section === id,
    onSaved,
  });

  const artwork = useArtworkEditor(
    bookingId,
    latest,
    section === 'artwork',
    setLatest,
  );
  const details = useDetailsEditor(deps('details'));
  const story = useStoryEditor(deps('story'));
  const dates = useDatesEditor(deps('dates'));
  const countdown = useCountdownEditor(deps('countdown'));
  const memories = useMemoriesPanel(bookingId, section === 'memories');

  const openSection = useCallback((id: SectionId) => {
    setNotice(null);
    setSection(id);
  }, []);
  const closeSection = useCallback(() => setSection(null), []);

  const { execute: runSend, loading: sending } = sender;
  const send = useCallback(() => {
    if (sending) return;
    setNotice(null);
    runSend(bookingId)
      .then(dto => {
        setLatest(dto);
        setNotice({ text: COPY.sent, tone: 'ok' });
      })
      .catch(e =>
        setNotice({ text: errorText(e, COPY.sendFailed), tone: 'error' }),
      );
  }, [sending, runSend, bookingId]);

  const { execute: runResolve } = resolver;
  const resolve = useCallback(
    (requestId: string) => {
      if (resolvingId) return;
      setResolvingId(requestId);
      setNotice(null);
      runResolve(bookingId, requestId)
        .then(dto => {
          setLatest(dto);
          setNotice({ text: COPY.resolved, tone: 'ok' });
        })
        .catch(e =>
          setNotice({ text: errorText(e, COPY.resolveFailed), tone: 'error' }),
        )
        .finally(() => setResolvingId(null));
    },
    [resolvingId, runResolve, bookingId],
  );

  const hub = useMemo(() => (latest ? mapHub(latest) : null), [latest]);

  const dirty =
    section === 'details'
      ? details.dirty
      : section === 'story'
      ? story.dirty || story.uploading
      : section === 'dates'
      ? dates.dirty || dates.sheetDirty
      : section === 'countdown'
      ? countdown.dirty
      : false;
  const busy =
    section === 'details'
      ? details.saving
      : section === 'story'
      ? story.saving
      : section === 'dates'
      ? dates.saving
      : section === 'countdown'
      ? countdown.saving
      : section === 'artwork'
      ? artwork.busy !== null
      : false;

  const notFound = !latest && !query.loading && isNotFound(query.error);

  return {
    invitation: latest,
    hub,
    isLoading: !latest && query.loading,
    notFound,
    errorMessage:
      latest || notFound || query.loading
        ? null
        : query.error
        ? errorText(query.error, COPY.error)
        : null,
    refreshing: !!latest && query.loading,
    refresh,
    notice,
    clearNotice: useCallback(() => setNotice(null), []),

    sending,
    send,
    resolvingId,
    resolve,

    previewOpen,
    setPreviewOpen,

    section,
    openSection,
    closeSection,
    dirty,
    busy,

    artwork,
    details,
    story,
    dates,
    countdown,
    memories,
  };
}
