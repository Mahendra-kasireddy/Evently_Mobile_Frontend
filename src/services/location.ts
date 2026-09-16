import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

export type LocationErrorCode =
  | 'permission_denied'
  | 'permission_blocked'
  | 'position_unavailable'
  | 'unavailable'
  | 'timeout'
  | 'unknown';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export class LocationServiceError extends Error {
  code: LocationErrorCode;

  /** The platform's own message, where there was one. Diagnostic, not copy. */
  detail?: string;

  constructor(code: LocationErrorCode, message: string, detail?: string) {
    super(message);
    this.code = code;
    this.detail = detail;
  }
}

/*
 * react-native-permissions owns the prompt; the geolocation library must not.
 *
 * Left unconfigured, @react-native-community/geolocation runs its own
 * CLLocationManager authorization request the first time a position is asked
 * for — so two libraries ask iOS for the same permission, and the fix that
 * should have answered the first request never arrives. `skipPermissionRequests`
 * makes it a reader only, and `ensurePermission` below stays the single place
 * permission is decided.
 *
 * `whenInUse` is stated rather than left to `auto` because that is the only
 * usage description in Info.plist — asking for `always` against a plist that
 * does not describe it is refused by iOS without an error anyone can see.
 *
 * Configured at module load so it is set before the first read, whichever
 * screen gets there first.
 */
/*
 * `locationProvider` is 'playServices', not 'auto', because 'auto' does not
 * mean what its name says.
 *
 * GeolocationModule constructs an AndroidLocationManager — the legacy
 * android.location.LocationManager — and its onConfigurationChange only ever
 * swaps that for the fused PlayServicesLocationManager on the literal string
 * 'playServices'. 'auto' matches neither branch, so it silently leaves the
 * legacy manager in place: there is no detection behind the name.
 *
 * That matters because the legacy manager satisfies a read by asking one
 * provider for a single update and waiting. getValidProvider hands it
 * GPS_PROVIDER for a high-accuracy read and NETWORK_PROVIDER otherwise, and on
 * a modern handset indoors the first rarely returns and the second is often not
 * registered at all — so the request sits there, the screen stays on its
 * spinner, and nothing distinguishes that from the app having never asked.
 * Play Services' fused provider is the one that answers.
 *
 * Play Services missing (some devices sold outside GMS markets) leaves the
 * legacy manager in place, which is the only fallback available and no worse
 * than what this line replaces.
 */
type AndroidProvider = 'playServices' | 'android';

function configureProvider(locationProvider: AndroidProvider): void {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: true,
    authorizationLevel: 'whenInUse',
    locationProvider,
  });
}

/* Set before the first read, whichever screen gets there first. */
configureProvider('playServices');

const LOCATION_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  default: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
});

/*
 * Android 12 split one permission into two. The system dialog offers Precise
 * and Approximate, and choosing Approximate grants ACCESS_COARSE_LOCATION while
 * leaving ACCESS_FINE_LOCATION denied — permanently, as far as this app is
 * concerned, because the dialog does not offer to upgrade a choice already
 * made. Checking only the fine permission therefore reads a customer who
 * granted location as one who refused it, and the re-request that follows is
 * answered by the system without ever reaching the screen.
 *
 * Approximate location is the right accuracy for this app anyway: the fix is
 * shown to four decimal places and used to order nearby events, neither of
 * which needs a street-level position. So coarse counts as granted, and only
 * the absence of both is a refusal.
 */
const COARSE_FALLBACK = Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION : null;

function isGranted(status: string): boolean {
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
}

async function hasCoarseFallback(): Promise<boolean> {
  if (!COARSE_FALLBACK) return false;
  return isGranted(await check(COARSE_FALLBACK));
}

async function ensurePermission(): Promise<void> {
  const status = await check(LOCATION_PERMISSION);

  if (isGranted(status)) return;

  if (status === RESULTS.BLOCKED) {
    if (await hasCoarseFallback()) return;
    throw new LocationServiceError('permission_blocked', 'Location permission is permanently denied.');
  }

  if (status === RESULTS.UNAVAILABLE) {
    throw new LocationServiceError('unavailable', 'Location is not available on this device.');
  }

  // DENIED — not yet asked, previously denied but still re-askable, or granted
  // only as Approximate on Android 12+.
  if (await hasCoarseFallback()) return;

  const requested = await request(LOCATION_PERMISSION);
  if (isGranted(requested)) return;

  // The dialog that just closed may have granted Approximate rather than
  // Precise, which comes back here as a refusal of the fine permission.
  if (await hasCoarseFallback()) return;

  if (requested === RESULTS.BLOCKED) {
    throw new LocationServiceError('permission_blocked', 'Location permission is permanently denied.');
  }
  throw new LocationServiceError('permission_denied', 'Location permission was denied.');
}

/**
 * How old a cached fix may be, for a read the customer did not ask for.
 *
 * Worth having on the passive first read: several screens want the location at
 * once, and a minute-old fix is the same street. Worth nothing on a Refresh —
 * see `fresh` below.
 */
const CACHE_MAX_AGE_MS = 60_000;

function getCurrentPosition(fresh: boolean): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      },
      (error) => {
        /*
         * The platform's own wording, carried through rather than replaced.
         *
         * Android reports six distinct failures under POSITION_UNAVAILABLE and
         * distinguishes them only in this string — "…/settings" is the settings
         * check refusing the request, "…/lastLocation" is the fused provider
         * having no fix to give. They need different answers, and nothing else
         * that crosses the bridge tells them apart, so the text is kept as
         * `detail` for diagnosis instead of being thrown away at the boundary.
         */
        const detail = error.message || undefined;

        if (error.code === error.TIMEOUT) {
          reject(new LocationServiceError('timeout', 'Getting your location timed out.', detail));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          /*
           * Not "location is off", though that is one of the six things the
           * Android library reports through this single code. The others are
           * all forms of "not right now": the fused provider answering
           * onLocationAvailability(false) because it has no usable fix source
           * yet, or returning a null location, which is ordinary indoors and in
           * the first seconds after location is switched on. Telling somebody
           * to turn on a setting they can see is already on is worse than
           * saying nothing, so the code carries no claim about the cause and
           * the copy does not name one.
           */
          reject(new LocationServiceError('position_unavailable', 'No location is available right now.', detail));
        } else {
          reject(new LocationServiceError('unknown', error.message || 'Could not get your location.', detail));
        }
      },
      {
        /*
         * High accuracy only when the customer asked.
         *
         * `maximumAge: 0` forbids the cached fix, so the platform has to go and
         * acquire a new one. At balanced accuracy on Android that means the
         * network provider, which indoors frequently never returns at all — the
         * request just sits until the timeout. So a read that refuses the cache
         * must also ask for the provider that can actually satisfy it (GPS /
         * fused), and must be given long enough to get a first fix from cold.
         * The passive read keeps the cheap settings: it is allowed the cached
         * fix, so it is answered immediately and costs no radio.
         */
        enableHighAccuracy: fresh,
        timeout: fresh ? 30_000 : 15_000,
        maximumAge: fresh ? 0 : CACHE_MAX_AGE_MS,
      },
    );
  });
}

/**
 * Rejects if `promise` has not settled within `budgetMs`.
 *
 * The `timeout` option passed to getCurrentPosition is honoured by the legacy
 * Android manager and ignored outright by the Play Services one — it reads the
 * value and never applies it to the LocationRequest, so nothing on that path
 * can end a wait. Worse, its getLastLocation() call registers an
 * addOnSuccessListener with no addOnFailureListener, so a failed Task invokes
 * neither callback and the JS promise is simply never settled.
 *
 * Both faults present identically: a spinner that runs until the screen is
 * closed. A watchdog on this side is the only thing that can end them, because
 * it does not depend on the native layer calling back at all.
 */
function withDeadline<T>(promise: Promise<T>, budgetMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new LocationServiceError('timeout', 'Getting your location timed out.'));
    }, budgetMs);

    promise.then(
      (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

interface Attempt {
  provider: AndroidProvider;
  fresh: boolean;
  budgetMs: number;
}

/**
 * The reads to try, in order, until one of them yields a position.
 *
 * Each step drops a requirement the one before it could not meet, so the
 * sequence ends at the cheapest question the device is most likely to answer:
 * fused GPS, then fused from cache or Wi-Fi, then the legacy provider. The
 * legacy step is last and is worth having despite being the weaker API — it is
 * a different code path in the library, so a device where the fused one hangs
 * or fails silently still has somewhere to go.
 */
function attemptsFor(fresh: boolean): Attempt[] {
  if (fresh) {
    return [
      { provider: 'playServices', fresh: true, budgetMs: 20_000 },
      { provider: 'playServices', fresh: false, budgetMs: 8_000 },
      { provider: 'android', fresh: false, budgetMs: 10_000 },
    ];
  }
  return [
    { provider: 'playServices', fresh: false, budgetMs: 10_000 },
    { provider: 'android', fresh: false, budgetMs: 10_000 },
  ];
}

/** Whether a failed attempt is worth following with the next one. */
function isWorthRetrying(error: unknown): boolean {
  if (!(error instanceof LocationServiceError)) return true;
  /* A refused permission is the same refusal whichever provider asks, and
     asking again only delays the screen that tells the customer about it. */
  return error.code !== 'permission_denied' && error.code !== 'permission_blocked';
}

/*
 * What the last read actually did, step by step.
 *
 * Kept after the bug it was written to find, because the thing that made that
 * bug expensive is permanent: a release build forwards no console output
 * anywhere a developer can read it, the handset is not always on a cable, and
 * every failure in this file looks identical from outside — a screen with no
 * position on it. Reading this back beats inferring which attempt was reached,
 * and it costs one array per read.
 *
 * Nothing renders it today. Surface it behind a debug gate, or log it from a
 * catch, when a device is misbehaving in someone else's hands.
 */
let lastTrace: string[] = [];

export function getLocationTrace(): string[] {
  return lastTrace;
}

function describe(error: unknown): string {
  if (error instanceof LocationServiceError) {
    return error.detail ? `${error.code}: ${error.detail}` : error.code;
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

async function readPosition(fresh: boolean): Promise<LocationCoordinates> {
  const trace: string[] = [];
  lastTrace = trace;
  const startedAt = Date.now();
  const at = () => `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;

  trace.push(`platform ${Platform.OS} ${String(Platform.Version)}`);

  try {
    /*
     * The permission check gets a deadline of its own, because it is the one
     * step whose stalling would leave nothing to show. Everything after it is
     * traced as it happens, but a check() or request() that never resolves
     * takes the whole read down before the first line is written — which is
     * indistinguishable, on screen, from the app having never tried.
     */
    await withDeadline(ensurePermission(), 15_000);
    trace.push(`${at()} permission ok`);
  } catch (error) {
    trace.push(`${at()} permission FAILED — ${describe(error)}`);
    throw error;
  }

  const attempts = attemptsFor(fresh);
  let lastError: unknown = new LocationServiceError(
    'position_unavailable',
    'No location is available right now.',
  );

  for (const attempt of attempts) {
    const label = `${attempt.provider}/${attempt.fresh ? 'fresh' : 'cached'}`;
    configureProvider(attempt.provider);
    trace.push(`${at()} try ${label} (${attempt.budgetMs / 1000}s)`);

    try {
      const coordinates = await withDeadline(
        getCurrentPosition(attempt.fresh),
        attempt.budgetMs,
      );
      trace.push(`${at()} ${label} OK`);
      return coordinates;
    } catch (error) {
      trace.push(`${at()} ${label} — ${describe(error)}`);
      if (!isWorthRetrying(error)) throw error;
      lastError = error;
    }
  }

  /* Back to the provider the next read should start on, so one bad patch of
     sky does not leave the app on the weaker API for the rest of the session. */
  configureProvider('playServices');
  trace.push(`${at()} all attempts exhausted`);
  throw lastError;
}

/*
 * The read in progress, if any, so that simultaneous callers share one.
 *
 * Two screens mount the location hook — Home's header and the Location screen —
 * and on a cold start both reach this function in the same commit, while the
 * status they all guard on is still 'idle'. Without this, that is two
 * overlapping permission requests: Android delivers one dialog, routes its
 * single result to whichever request registered last, and leaves the other
 * promise pending forever. The visible symptom is the one that matters — the
 * customer taps Allow and the screen never leaves its blank first state,
 * because the dispatch that would have moved it is attached to the promise
 * that was dropped.
 *
 * `fresh` is part of the decision, not just the key: a passive read may be
 * answered by a fresh one already running, but a fresh read must never be
 * answered by a passive one — that is the cached fix Refresh exists to refuse.
 */
let pendingRead: { fresh: boolean; promise: Promise<LocationCoordinates> } | null = null;

/**
 * Single-shot current position — no background or continuous tracking.
 *
 * `fresh` decides whether a recent cached fix will do. Pass it for anything
 * the customer initiated.
 */
export function getCurrentLocation(
  { fresh = false }: { fresh?: boolean } = {},
): Promise<LocationCoordinates> {
  if (pendingRead && (pendingRead.fresh || !fresh)) return pendingRead.promise;

  const entry = { fresh, promise: readPosition(fresh) };
  pendingRead = entry;

  return entry.promise.finally(() => {
    if (pendingRead === entry) pendingRead = null;
  });
}
