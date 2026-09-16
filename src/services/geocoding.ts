import { env } from './env';
import type { LocationCoordinates } from './location';

/**
 * A place, as much of one as the customer needs to recognise where they are.
 *
 * `locality` is the city, town or village; `region` the state or province.
 * Either can be missing — an offshore fix has no locality, a city-state no
 * region — so `label` is built from what came back rather than assumed.
 */
export interface Place {
  locality: string | null;
  region: string | null;
  label: string;
}

/*
 * Nominatim is OpenStreetMap's own geocoder: free, no key, no billing.
 *
 * Its usage policy is the constraint, and it is a real one rather than a
 * formality — an app that ignores it gets its IP blocked rather than throttled.
 * Two rules bind here: no more than one request per second, and a User-Agent
 * that identifies the application so an operator can get in touch. Both are
 * honoured below. If this app ever serves enough people that one request per
 * second is a queue rather than a ceiling, this is the file to swap for a paid
 * geocoder — the rest of the app only knows about `Place`.
 */
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';
const USER_AGENT = `${env.appName}/1.0 (React Native app; reverse geocoding for event discovery)`;
const MIN_REQUEST_GAP_MS = 1100;
const REQUEST_TIMEOUT_MS = 8_000;

/*
 * Zoom 10 asks for the city rather than the building.
 *
 * A street-level answer would be both slower to render and wrong for what it
 * is used for: the label sits next to "events near you", which is a question
 * about a city, and naming somebody's street in a header reads as surveillance
 * rather than helpfulness.
 */
const ZOOM_CITY = 10;

/**
 * How finely a coordinate is rounded before it is used as a cache key.
 *
 * Three decimal places is about 110 metres. Two reads from the same room
 * differ in the fourth, so they share an entry and the second costs nothing;
 * a genuine move across town does not, and is looked up afresh.
 */
function cacheKey({ latitude, longitude }: LocationCoordinates): string {
  return `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
}

const cache = new Map<string, Place>();

/*
 * The tail of the request queue, so the next call can wait its turn.
 *
 * Kept as a promise chain rather than a timestamp check because concurrent
 * callers must queue behind each other, not all read the same stale timestamp
 * and decide together that enough time has passed.
 */
let requestChain: Promise<unknown> = Promise.resolve();

function schedule<T>(work: () => Promise<T>): Promise<T> {
  const result = requestChain.then(work, work);
  /* The chain must not inherit this call's rejection, or one failed lookup
     would reject every lookup queued behind it. */
  const gap = (): Promise<void> =>
    new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, MIN_REQUEST_GAP_MS);
      /* This timer only spaces out requests that may never come. Under Node —
         which is to say under Jest — an armed timer holds the event loop open,
         so a test that geocoded once would hang for the full gap after its last
         assertion. React Native's setTimeout returns a number with no unref, so
         it is called only where it exists. */
      (timer as unknown as { unref?: () => void }).unref?.();
    });
  requestChain = result.then(gap, gap);
  return result;
}

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  suburb?: string;
  county?: string;
  state?: string;
  state_district?: string;
  country?: string;
}

/**
 * The most specific name Nominatim returned for the place itself.
 *
 * The fields are tried in the order a person would answer "where are you" — a
 * city if there is one, then progressively coarser administrative units, so
 * that somewhere rural still gets a name rather than nothing.
 */
function pickLocality(address: NominatimAddress): string | null {
  return (
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.suburb ??
    address.county ??
    null
  );
}

function toPlace(address: NominatimAddress): Place | null {
  const locality = pickLocality(address);
  const region = address.state ?? address.state_district ?? null;

  /* A result naming neither the place nor its region is not worth showing: the
     coordinates already say more than a bare country name does. */
  if (!locality && !region) return null;

  const label = [locality, region].filter(Boolean).join(', ');
  return { locality, region, label };
}

/**
 * Turns coordinates into a place name, or null if none can be had.
 *
 * This never throws. A geocoder is a convenience over a position the app
 * already has: if the lookup fails, is rate-limited, or the device is offline,
 * the right outcome is the coordinates on their own — not an error state
 * replacing a screen that was working.
 */
export async function reverseGeocode(
  coordinates: LocationCoordinates,
): Promise<Place | null> {
  const key = cacheKey(coordinates);
  const cached = cache.get(key);
  if (cached) return cached;

  try {
    const place = await schedule(async () => {
      const url =
        `${NOMINATIM_ENDPOINT}?format=jsonv2&addressdetails=1&zoom=${ZOOM_CITY}` +
        `&lat=${encodeURIComponent(coordinates.latitude)}` +
        `&lon=${encodeURIComponent(coordinates.longitude)}`;

      /*
       * AbortController rather than a Promise.race: a race leaves the request
       * running and the socket open after the timeout has already been
       * reported, which on a flaky connection stacks up requests the rate
       * limiter above has no idea about.
       */
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) return null;

        const body: { address?: NominatimAddress } = await response.json();
        return body.address ? toPlace(body.address) : null;
      } finally {
        clearTimeout(timer);
      }
    });

    if (place) cache.set(key, place);
    return place;
  } catch {
    return null;
  }
}

/** Test seam. Clears the in-memory cache so a case starts from nothing. */
export function __clearPlaceCache(): void {
  cache.clear();
}
