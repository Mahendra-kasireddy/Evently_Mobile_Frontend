import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Place } from './geocoding';
import type { LocationCoordinates } from './location';

/**
 * The last position this device successfully read, and what it was called.
 *
 * Kept because a device that could answer once can usually answer again, and
 * the gap between those two moments is the only thing the customer ever sees
 * go wrong. A fused read refused indoors, a handset with no fix since its last
 * reboot, a provider that takes eight seconds to admit it has nothing — each
 * of them turns a working screen into a spinner, and none of them means the
 * app has stopped knowing roughly where it is.
 *
 * So the position outlives the process. It is a starting point to show
 * immediately and correct in the background, never the final answer: `savedAt`
 * is kept so a consumer can tell how old it is, and every hydrate is followed
 * by a real read.
 */
export interface CachedLocation {
  coordinates: LocationCoordinates;
  place: Place | null;
  savedAt: number;
}

const STORAGE_KEY = 'evently:lastKnownLocation';

/**
 * How stale a remembered position may be before it is discarded outright.
 *
 * A week, because the failure this guards against is a device that cannot get
 * a fix right now, and somewhere the customer was last week is a far better
 * answer to "where are you" than nothing at all. Beyond that the odds of a
 * move outweigh the value of the guess.
 */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function isCoordinates(value: unknown): value is LocationCoordinates {
  if (typeof value !== 'object' || value === null) return false;
  const { latitude, longitude } = value as Partial<LocationCoordinates>;
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
}

/**
 * The remembered position, or null if there is none worth having.
 *
 * Never throws and never returns something half-parsed. Storage can hold a
 * value written by an older build of the app whose shape has since changed,
 * and a screen that renders `undefined.toFixed(4)` is a worse outcome than one
 * that starts from nothing — so anything that does not look like a coordinate
 * pair is treated as absent.
 */
export async function readCachedLocation(): Promise<CachedLocation | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const { coordinates, place, savedAt } = parsed as Partial<CachedLocation>;
    if (!isCoordinates(coordinates)) return null;
    if (typeof savedAt !== 'number') return null;
    if (Date.now() - savedAt > MAX_AGE_MS) return null;

    return { coordinates, place: place ?? null, savedAt };
  } catch {
    return null;
  }
}

/** Remembers a position. Failure is ignored: this is a convenience, not state. */
export async function writeCachedLocation(
  coordinates: LocationCoordinates,
  place: Place | null,
): Promise<void> {
  try {
    const entry: CachedLocation = { coordinates, place, savedAt: Date.now() };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // Nothing actionable — the app works without it, just less smoothly.
  }
}

/** Test seam, and the hook for a "forget my location" control if one is added. */
export async function clearCachedLocation(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // As above.
  }
}
