import { __clearPlaceCache, reverseGeocode } from '../src/services/geocoding';

const HYDERABAD = { latitude: 17.385, longitude: 78.4867 };

function respondWith(body: unknown, ok = true) {
  return jest.fn().mockResolvedValue({
    ok,
    json: async () => body,
  });
}

describe('reverseGeocode', () => {
  const realFetch = globalThis.fetch;

  beforeEach(() => {
    __clearPlaceCache();
    jest.useRealTimers();
  });

  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it('names the city and its region', async () => {
    globalThis.fetch = respondWith({
      address: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
    }) as unknown as typeof fetch;

    await expect(reverseGeocode(HYDERABAD)).resolves.toEqual({
      locality: 'Hyderabad',
      region: 'Telangana',
      label: 'Hyderabad, Telangana',
    });
  });

  it('falls back through coarser names when there is no city', async () => {
    globalThis.fetch = respondWith({
      address: { village: 'Shamirpet', state: 'Telangana' },
    }) as unknown as typeof fetch;

    await expect(reverseGeocode(HYDERABAD)).resolves.toMatchObject({
      locality: 'Shamirpet',
      label: 'Shamirpet, Telangana',
    });
  });

  it('asks the network only once for coordinates in the same place', async () => {
    const fetchMock = respondWith({ address: { city: 'Hyderabad', state: 'Telangana' } });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await reverseGeocode(HYDERABAD);
    // Same room, four decimal places apart — inside the cache's ~110m key.
    await reverseGeocode({ latitude: 17.38504, longitude: 78.48672 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('resolves null rather than throwing when the lookup fails', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(reverseGeocode(HYDERABAD)).resolves.toBeNull();
  });

  it('resolves null on a non-OK response', async () => {
    globalThis.fetch = respondWith({}, false) as unknown as typeof fetch;

    await expect(reverseGeocode(HYDERABAD)).resolves.toBeNull();
  });

  it('identifies the app, as Nominatim requires', async () => {
    const fetchMock = respondWith({ address: { city: 'Hyderabad' } });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await reverseGeocode(HYDERABAD);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers['User-Agent']).toContain('Evently');
  });
});
