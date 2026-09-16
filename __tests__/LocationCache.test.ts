/**
 * @format
 *
 * Remembering the last position.
 *
 * The point of this cache is that a device which could answer once should not
 * show a spinner the next time its hardware is unhelpful — so what matters here
 * is that it survives, that it expires, and that a bad value can never reach a
 * screen.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearCachedLocation,
  readCachedLocation,
  writeCachedLocation,
} from '../src/services/locationCache';

jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn(async (k: string) => store[k] ?? null),
    setItem: jest.fn(async (k: string, v: string) => {
      store[k] = v;
    }),
    removeItem: jest.fn(async (k: string) => {
      delete store[k];
    }),
    __reset: () => {
      store = {};
    },
  };
});

const storage = AsyncStorage as unknown as {
  getItem: jest.Mock;
  setItem: jest.Mock;
  __reset: () => void;
};

const HYDERABAD = { latitude: 17.4469, longitude: 78.3808 };
const PLACE = { locality: 'Hyderabad', region: 'Telangana', label: 'Hyderabad, Telangana' };

beforeEach(() => {
  storage.__reset();
  jest.clearAllMocks();
});

it('gives back the position it was given, with its name', async () => {
  await writeCachedLocation(HYDERABAD, PLACE);

  await expect(readCachedLocation()).resolves.toMatchObject({
    coordinates: HYDERABAD,
    place: PLACE,
  });
});

it('has nothing to give before anything is stored', async () => {
  await expect(readCachedLocation()).resolves.toBeNull();
});

it('forgets a position older than a week', async () => {
  const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
  storage.getItem.mockResolvedValueOnce(
    JSON.stringify({ coordinates: HYDERABAD, place: PLACE, savedAt: eightDaysAgo }),
  );

  await expect(readCachedLocation()).resolves.toBeNull();
});

it('keeps a position from yesterday', async () => {
  const yesterday = Date.now() - 24 * 60 * 60 * 1000;
  storage.getItem.mockResolvedValueOnce(
    JSON.stringify({ coordinates: HYDERABAD, place: PLACE, savedAt: yesterday }),
  );

  await expect(readCachedLocation()).resolves.toMatchObject({ coordinates: HYDERABAD });
});

describe('values a screen must never be handed', () => {
  // Storage can hold anything an older build wrote. A screen that renders
  // `undefined.toFixed(4)` is worse than one that starts from nothing.
  it.each([
    ['not JSON at all', '}{'],
    ['a bare string', '"hello"'],
    ['no coordinates', JSON.stringify({ place: PLACE, savedAt: Date.now() })],
    [
      'coordinates that are not numbers',
      JSON.stringify({ coordinates: { latitude: 'x', longitude: 1 }, savedAt: Date.now() }),
    ],
    [
      'NaN coordinates',
      JSON.stringify({ coordinates: { latitude: null, longitude: null }, savedAt: Date.now() }),
    ],
    ['no timestamp', JSON.stringify({ coordinates: HYDERABAD })],
  ])('rejects %s', async (_label, raw) => {
    storage.getItem.mockResolvedValueOnce(raw);
    await expect(readCachedLocation()).resolves.toBeNull();
  });
});

it('survives storage throwing, because it is a convenience not state', async () => {
  storage.getItem.mockRejectedValueOnce(new Error('disk full'));
  await expect(readCachedLocation()).resolves.toBeNull();

  storage.setItem.mockRejectedValueOnce(new Error('disk full'));
  await expect(writeCachedLocation(HYDERABAD, PLACE)).resolves.toBeUndefined();
});

it('can be forgotten', async () => {
  await writeCachedLocation(HYDERABAD, PLACE);
  await clearCachedLocation();

  await expect(readCachedLocation()).resolves.toBeNull();
});
