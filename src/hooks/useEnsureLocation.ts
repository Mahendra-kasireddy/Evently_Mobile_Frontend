import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { reverseGeocode } from '../services/geocoding';
import { getCurrentLocation, LocationServiceError } from '../services/location';
import { readCachedLocation, writeCachedLocation } from '../services/locationCache';
import {
  locationFailed,
  locationHydrated,
  locationRequested,
  locationSucceeded,
  placeResolved,
  selectLocationCoordinates,
  selectLocationErrorCode,
  selectLocationLastAttemptAt,
  selectLocationStatus,
} from '../store/locationSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

/**
 * The one read in flight, if any, across every mount of this hook.
 *
 * Module scope rather than a ref, because the point is to coordinate between
 * instances: Home's header and the Location screen both mount this hook and
 * reach the same decision in the same commit, before any dispatch either of
 * them makes has been reduced. A flag either of them can see beats a status in
 * the store that neither has read yet.
 *
 * The service layer already collapses simultaneous reads onto one native call,
 * so this is not what stops the device being asked twice. What it stops is the
 * bookkeeping either side of that call happening twice — two 'requested'
 * dispatches, two terminal dispatches, two geocoder lookups, two writes to
 * storage for a single position.
 */
let readInFlight = false;

/**
 * The shortest gap between two reads the app started by itself.
 *
 * Automatic reads are triggered by things the customer does incidentally —
 * opening a screen, switching tabs, coming back to the app — and those can
 * happen several times in a few seconds. The gap is what separates
 * "self-healing" from "retrying in a loop"; an explicit tap is not subject to
 * it, because that is the customer asking.
 */
const MIN_AUTO_ATTEMPT_GAP_MS = 10_000;

/**
 * Exposed for tests. The pacing policy is the whole defence against a read
 * loop, and it is worth asserting directly rather than through a rendered
 * screen that would have to simulate focus and app-state events to reach it.
 */
export const __shouldAttempt = (params: {
  status: string;
  errorCode: string | null;
  lastAttemptAt: number | null;
  fromForeground: boolean;
  now: number;
}): boolean => shouldAttempt(params);

/** Test seam: clears the module-level in-flight flag between cases. */
export function __resetReadInFlight(): void {
  readInFlight = false;
}

/**
 * Whether an automatic read is worth starting at all, given where we are.
 *
 * `fromForeground` matters because returning to the app is the single moment
 * when the answer can have changed for reasons the app cannot observe: it is
 * the only way back from the Settings app, and therefore the only chance to
 * notice a permission the customer has just granted or revoked. Every other
 * trigger must respect a refusal; this one has to be allowed to re-ask, or
 * "enable it in Settings" becomes advice the app then ignores.
 */
function shouldAttempt(params: {
  status: string;
  errorCode: string | null;
  lastAttemptAt: number | null;
  fromForeground: boolean;
  now: number;
}): boolean {
  const { status, errorCode, lastAttemptAt, fromForeground, now } = params;

  if (readInFlight || status === 'loading') return false;

  /*
   * The pacing floor binds every automatic read, with no exceptions.
   *
   * It sat below the foreground escape once, so that returning from Settings
   * would always re-check — which made the floor conditional, and a conditional
   * floor is not a floor. Every trigger here can fire more than once in quick
   * succession: AppState emits around transitions the customer never notices,
   * and a screen can regain focus repeatedly. With a way past the gap, each of
   * those starts a read, each read lands on a slightly different fix because
   * GPS jitters, and the resulting render re-arms the trigger. That is a loop,
   * and the only reliable way to not have one is for no caller to be able to
   * ask for a read sooner than this, whatever it thinks it knows.
   *
   * An explicit tap is not routed through here, so the customer is never made
   * to wait on it.
   */
  if (lastAttemptAt !== null && now - lastAttemptAt < MIN_AUTO_ATTEMPT_GAP_MS) return false;

  /* Past the floor, coming back from the foreground re-checks whatever the last
     answer was, including a success — a permission revoked in Settings must not
     leave a position on screen the app is no longer entitled to. */
  if (fromForeground) return true;

  if (status === 'success') return false;

  /*
   * A refusal is not something to retry into. The OS answers a re-request for
   * a blocked permission without showing the customer anything, so a screen
   * that keeps asking produces nothing but battery use and a error state that
   * flickers. It stays put until the foreground check above, which is the
   * moment it could legitimately have changed.
   */
  if (errorCode === 'permission_blocked' || errorCode === 'permission_denied') return false;

  if (lastAttemptAt !== null && now - lastAttemptAt < MIN_AUTO_ATTEMPT_GAP_MS) return false;

  return true;
}

/**
 * Owns the device-location lifecycle for whatever screen mounts it.
 *
 * One read is shared by every consumer through the store, so Home's header and
 * the Location screen never ask the device separately. The read starts itself:
 * on first mount, whenever a screen holding this hook regains focus, and
 * whenever the app returns to the foreground — so a customer who grants
 * permission, or turns location services on, or comes back from Settings,
 * arrives at a screen that has already gone and looked again. `retry` is for an
 * explicit tap and is the only path that bypasses the pacing above.
 *
 * The two kinds of read are not the same read. An automatic one will take a
 * recent cached fix, because several screens want a location at once and a
 * minute-old one is the same street. An explicit one will not: the reason
 * somebody taps Refresh is that they believe what is on screen is stale, and
 * handing them the cached position back answers the wrong question.
 *
 * Must be mounted inside a navigation screen — it observes focus.
 */
export function useEnsureLocation() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectLocationStatus);
  const errorCode = useAppSelector(selectLocationErrorCode);
  const lastAttemptAt = useAppSelector(selectLocationLastAttemptAt);
  const coordinates = useAppSelector(selectLocationCoordinates);

  /*
   * Read by callbacks that outlive the render they were created in — the
   * AppState subscription and the focus effect. Going through refs keeps those
   * subscriptions from being torn down and rebuilt on every status change,
   * which is itself a source of missed events.
   */
  const stateRef = useRef({ status, errorCode, lastAttemptAt });
  stateRef.current = { status, errorCode, lastAttemptAt };

  const load = useCallback(
    (fresh: boolean) => {
      if (readInFlight) return;
      readInFlight = true;

      dispatch(locationRequested());

      getCurrentLocation({ fresh })
        .then((next) => {
          dispatch(locationSucceeded(next));

          /*
           * Not awaited, and its failure is not this read's failure.
           *
           * The position is already in the store and the screens are already
           * showing it; the name is an improvement on that, arriving when the
           * geocoder gets round to it. reverseGeocode resolves null rather
           * than rejecting, so there is nothing here that could turn a working
           * location screen into an error one.
           */
          reverseGeocode(next).then((place) => {
            dispatch(placeResolved(place));
            /* Remembered together, so a restored position arrives already
               named and the header does not flicker through 'Set your city'
               on every cold start while the geocoder is asked again. */
            writeCachedLocation(next, place);
          });
        })
        .catch((error: unknown) => {
          const code = error instanceof LocationServiceError ? error.code : 'unknown';
          const detail = error instanceof LocationServiceError ? error.detail : undefined;
          const message = error instanceof Error ? error.message : 'Could not get your location.';
          dispatch(locationFailed({ code, message: detail ? `${message} (${detail})` : message }));
        })
        .finally(() => {
          readInFlight = false;
        });
    },
    [dispatch],
  );

  /** Starts a read if the current state warrants one. Safe to call often. */
  const ensure = useCallback(
    (fromForeground: boolean) => {
      const { status: s, errorCode: e, lastAttemptAt: t } = stateRef.current;
      if (!shouldAttempt({ status: s, errorCode: e, lastAttemptAt: t, fromForeground, now: Date.now() })) {
        return;
      }
      load(false);
    },
    [load],
  );

  /** The customer asked. Bypasses pacing, but never starts a second read. */
  const retry = useCallback(() => load(true), [load]);

  /*
   * Storage is read once per process, not once per mount: the position it
   * restores is global, and a second consumer mounting later has nothing to
   * add. Guarded by a ref rather than status so that it still happens when the
   * first read has already failed.
   */
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    /*
     * The remembered position goes in before the read starts, not instead of
     * it. Whatever the hardware does next — refuse indoors, take eight seconds
     * to admit it has nothing, or answer immediately — the screen already has
     * something true-ish to show, and the read that follows either confirms it
     * or replaces it.
     */
    readCachedLocation().then((cached) => {
      if (!cached) return;
      dispatch(locationHydrated({ coordinates: cached.coordinates, place: cached.place }));
    });
  }, [dispatch]);

  /*
   * Returning to the app. Registered once and never re-registered, because a
   * subscription that is torn down and rebuilt whenever status changes can
   * miss the very transition it exists to catch.
   */
  useEffect(() => {
    const onAppStateChange = (next: AppStateStatus) => {
      if (next === 'active') ensure(true);
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [ensure]);

  /*
   * Arriving at, or coming back to, a screen that wants a location.
   *
   * This is what makes a failed read recoverable without a tap. The previous
   * design started a read only from the 'idle' status, which a process passes
   * through exactly once — so a first attempt that failed left every later
   * visit to the screen showing the same stale error, and the only ways out
   * were the Refresh button or backgrounding the app.
   */
  useFocusEffect(
    useCallback(() => {
      ensure(false);
    }, [ensure]),
  );

  return { retry, hasCoordinates: coordinates !== null };
}
