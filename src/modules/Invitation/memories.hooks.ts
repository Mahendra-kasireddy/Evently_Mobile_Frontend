import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type CameraOptions,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import { normalizeError } from '../../services/errors';
import { REEL_MAX_SECONDS } from './constants';
import {
  fetchMemories,
  fetchMemorySettings,
  saveMemorySettings,
  uploadMemory,
} from './memories.service';
import type {
  MemoryDTO,
  MemoryGalleryDTO,
  MemorySettingsDTO,
  UploadMemoryInput,
} from './types';

/**
 * Shared Memories, on the device.
 *
 * The picker is `react-native-image-picker`, already a dependency of this app
 * — it is the platform's own camera and library, so there is no recorder to
 * build and no permission prompt to invent. Nothing here decides what a file
 * is or where it belongs; the server does, and this only carries the answer.
 */

/** One picked file, held while the person confirms it. */
export interface PickedMedia {
  uri: string;
  fileName: string;
  mimeType: string;
  isClip: boolean;
  durationSec: number;
  /** Recorded through the reel action rather than picked from the library. */
  reel: boolean;
}

const COPY_PICK_FAILED =
  'We couldn’t open your camera. Check the app’s permissions and try again.';
const COPY_LIBRARY_FAILED =
  'We couldn’t open your photos. Check the app’s permissions and try again.';
const COPY_UPLOAD_FAILED =
  'That couldn’t be shared. Check your connection and try again.';

/** An asset from the picker, as the uploader needs it. */
function toPicked(asset: Asset, reel: boolean): PickedMedia | null {
  if (!asset.uri) return null;
  const mimeType = asset.type ?? (asset.duration ? 'video/mp4' : 'image/jpeg');
  const isClip = mimeType.startsWith('video/');
  return {
    uri: asset.uri,
    fileName: asset.fileName ?? (isClip ? 'memory.mp4' : 'memory.jpg'),
    mimeType,
    isClip,
    durationSec: Math.round(asset.duration ?? 0),
    reel: reel && isClip,
  };
}

/**
 * The gallery, its filters and its paging.
 *
 * Pages accumulate as the person scrolls and reset whenever a filter changes —
 * a cursor from the "all" list means nothing in the "reels" list, so carrying
 * the old rows forward would show reels above photographs and then fetch the
 * wrong next page.
 */
export function useMemories(bookingId: string) {
  const [settings, setSettings] = useState<MemorySettingsDTO | null>(null);
  const [gallery, setGallery] = useState<MemoryGalleryDTO | null>(null);
  const [items, setItems] = useState<MemoryDTO[]>([]);
  const [kind, setKind] = useState('all');
  const [subEvent, setSubEvent] = useState('all');
  const [loading, setLoading] = useState(true);
  const [paging, setPaging] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(
    async (nextKind = kind, nextSubEvent = subEvent) => {
      if (!bookingId) return;
      setLoading(true);
      setError('');
      try {
        const [s, g] = await Promise.all([
          fetchMemorySettings(bookingId),
          fetchMemories(bookingId, { kind: nextKind, subEvent: nextSubEvent }),
        ]);
        setSettings(s);
        setGallery(g);
        setItems(g.items);
      } catch (e) {
        /* A 404 is the ordinary early state — the organizer has not shared an
           invitation yet — and reads as "no gallery", not as a failure. */
        const normalized = normalizeError(e);
        if (normalized.status !== 404) setError(normalized.message);
        setSettings(null);
        setGallery(null);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [bookingId, kind, subEvent],
  );

  /*
   * Fetch once the screen has a booking to fetch for.
   *
   * `load` is rebuilt whenever the filters change, so depending on it here
   * would re-run this on every filter change and race `changeFilter`, which
   * already fetches. The ref keeps the effect keyed to the booking alone.
   */
  const loadRef = useRef(load);
  loadRef.current = load;
  useEffect(() => {
    if (!bookingId) return;
    loadRef.current().catch(() => undefined);
  }, [bookingId]);

  const changeFilter = useCallback(
    (nextKind: string, nextSubEvent: string) => {
      setKind(nextKind);
      setSubEvent(nextSubEvent);
      load(nextKind, nextSubEvent).catch(() => undefined);
    },
    [load],
  );

  /** The next page, appended. Silent on failure: the list is still readable. */
  const loadMore = useCallback(async () => {
    const cursor = gallery?.nextCursor;
    if (!cursor || paging || !bookingId) return;
    setPaging(true);
    try {
      const next = await fetchMemories(bookingId, {
        kind,
        subEvent,
        before: cursor,
      });
      setItems(current => [...current, ...next.items]);
      setGallery(next);
    } catch {
      /* Keeping what is on screen beats replacing it with an error. */
    } finally {
      setPaging(false);
    }
  }, [bookingId, gallery?.nextCursor, kind, subEvent, paging]);

  /**
   * Whether the section exists for this person at all.
   *
   * The server's answer, not a local guess — and the upload action is gated
   * separately, because a gallery stays readable after uploads have closed.
   */
  /**
   * Switching the feature on from here.
   *
   * The customer owns this setting and this is the customer's app, so the
   * answer to "why is there no gallery" is a switch rather than an
   * instruction to go and find another screen.
   */
  const enable = useCallback(async () => {
    if (!bookingId) return;
    setError('');
    try {
      const next = await saveMemorySettings(bookingId, { enabled: true });
      setSettings(next);
      await load();
    } catch (e) {
      setError(normalizeError(e).message);
    }
  }, [bookingId, load]);

  const canView = Boolean(settings?.enabled && settings.guestView);
  const canUpload = Boolean(
    settings?.enabled && settings.guestUpload && settings.window.open,
  );
  const canDownload = Boolean(settings?.enabled && settings.guestDownload);

  return {
    settings,
    gallery,
    items,
    kind,
    subEvent,
    loading,
    paging,
    error,
    canView,
    canUpload,
    canDownload,
    /* True once the server has answered at all — the difference between "no
       gallery" and "we have not asked yet", which decides whether the card
       offering to switch it on is drawn. */
    known: settings !== null,
    enabled: Boolean(settings?.enabled),
    load,
    enable,
    changeFilter,
    loadMore,
  };
}

/** The three ways to add one, and the upload itself. */
export function useMemoryUpload(bookingId: string) {
  const [picked, setPicked] = useState<PickedMedia | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const photoOptions = useMemo<CameraOptions>(
    () => ({
      mediaType: 'photo',
      /* Long edge, so a 12MP phone photo does not spend a minute on a hotel
         network before the server resizes it anyway. */
      maxWidth: 2560,
      maxHeight: 2560,
      quality: 0.9,
      saveToPhotos: true,
    }),
    [],
  );

  const handle = useCallback(
    (message: string, assets: Asset[] | undefined, reel: boolean) => {
      const asset = assets?.[0];
      const next = asset ? toPicked(asset, reel) : null;
      if (!next) {
        setError(message);
        return;
      }
      setError('');
      setPicked(next);
    },
    [],
  );

  /** The camera, for a photograph. */
  const takePhoto = useCallback(async () => {
    try {
      const result = await launchCamera(photoOptions);
      if (result.didCancel) return;
      handle(result.errorMessage ?? COPY_PICK_FAILED, result.assets, false);
    } catch {
      setError(COPY_PICK_FAILED);
    }
  }, [photoOptions, handle]);

  /** The library, for a photograph or a clip already on the phone. */
  const pickFromLibrary = useCallback(async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      maxWidth: 2560,
      maxHeight: 2560,
      quality: 0.9,
      selectionLimit: 1,
    };
    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) return;
      handle(result.errorMessage ?? COPY_LIBRARY_FAILED, result.assets, false);
    } catch {
      setError(COPY_LIBRARY_FAILED);
    }
  }, [handle]);

  /**
   * The camera, in video mode, capped at a minute.
   *
   * `durationLimit` is the platform's own recorder stopping itself — no editor
   * and no trimming UI, which is what the spec asked for and what the phone
   * already does well. The server still decides whether the result is a reel.
   */
  const recordReel = useCallback(async () => {
    try {
      const result = await launchCamera({
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: REEL_MAX_SECONDS,
        saveToPhotos: true,
      });
      if (result.didCancel) return;
      handle(result.errorMessage ?? COPY_PICK_FAILED, result.assets, true);
    } catch {
      setError(COPY_PICK_FAILED);
    }
  }, [handle]);

  const clear = useCallback(() => {
    setPicked(null);
    setProgress(0);
    setError('');
  }, []);

  /** Sends it, and hands back the server's own sentence about what happened. */
  const send = useCallback(
    async (subEventId: string, caption: string) => {
      if (!picked) return null;
      setBusy(true);
      setProgress(0);
      setError('');
      try {
        const input: UploadMemoryInput = {
          uri: picked.uri,
          fileName: picked.fileName,
          mimeType: picked.mimeType,
          ...(subEventId ? { subEventId } : {}),
          ...(caption ? { caption } : {}),
          ...(picked.isClip
            ? { durationSec: picked.durationSec, reel: picked.reel }
            : {}),
        };
        const outcome = await uploadMemory(bookingId, input, setProgress);
        setPicked(null);
        return outcome;
      } catch (e) {
        /* The server's own wording when it sent one — it is already written
           for a person — and a plain fallback when it did not. */
        const normalized = normalizeError(e);
        setError(normalized.message || COPY_UPLOAD_FAILED);
        return null;
      } finally {
        setBusy(false);
      }
    },
    [bookingId, picked],
  );

  return {
    picked,
    progress,
    busy,
    error,
    takePhoto,
    pickFromLibrary,
    recordReel,
    clear,
    send,
    setError,
  };
}
