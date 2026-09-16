import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Place } from '../services/geocoding';
import type { LocationCoordinates, LocationErrorCode } from '../services/location';

export type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

interface LocationState {
  status: LocationStatus;
  coordinates: LocationCoordinates | null;
  errorCode: LocationErrorCode | null;
  errorMessage: string | null;
  /*
   * The geocoded name for `coordinates`, once one arrives.
   *
   * Deliberately not part of `status`: the place name is a decoration on a
   * position the app already has, and a screen that has coordinates is not
   * loading, not failed, and not waiting. Keeping it separate means a geocoder
   * that is slow, rate-limited or offline costs the customer a line of text
   * rather than the screen.
   */
  place: Place | null;
  /**
   * When a read was last started, or null if none ever has been.
   *
   * Recorded because the decision to start one is made by several places at
   * once — a screen mounting, a screen regaining focus, the app returning to
   * the foreground — and none of them can see the others. Without a shared
   * record of when the last attempt happened, two of those firing together
   * means two reads, and a screen that fails then regains focus means a read
   * per frame.
   */
  lastAttemptAt: number | null;
}

/**
 * Whether two fixes are far enough apart to need a different place name.
 *
 * Not equality. A stationary handset returns a position that wanders in the
 * fourth decimal place and beyond — ten metres of drift between two reads taken
 * seconds apart is ordinary, and treating that as movement means every read
 * discards a correct place name and asks the geocoder for the same answer
 * again. Three decimal places is roughly 110 metres, and deliberately the same
 * precision the geocoder caches on: inside one of its cells the answer cannot
 * change, so there is nothing to re-fetch.
 */
function movedFarEnoughToRename(
  previous: LocationCoordinates | null,
  next: LocationCoordinates,
): boolean {
  if (!previous) return true;
  return (
    previous.latitude.toFixed(3) !== next.latitude.toFixed(3) ||
    previous.longitude.toFixed(3) !== next.longitude.toFixed(3)
  );
}

const initialState: LocationState = {
  status: 'idle',
  coordinates: null,
  errorCode: null,
  errorMessage: null,
  place: null,
  lastAttemptAt: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    /*
     * A remembered position, restored before any read has run.
     *
     * Deliberately leaves `status` alone. Status describes the read, and at
     * this point no read has happened — moving it to 'success' here would tell
     * useEnsureLocation the work was done and stop the fresh read from ever
     * starting, leaving the customer on last week's position forever.
     */
    locationHydrated(
      state,
      action: PayloadAction<{ coordinates: LocationCoordinates; place: Place | null }>,
    ) {
      /* A live read that finished first outranks anything from storage. */
      if (state.coordinates) return;
      state.coordinates = action.payload.coordinates;
      state.place = action.payload.place;
    },
    /*
     * The clock is read in `prepare`, not in the reducer.
     *
     * A reducer that calls Date.now() is not a function of its inputs: the same
     * action replayed gives a different state, which costs the store its
     * testability and its devtools. RTK's prepare step is where an action is
     * allowed to be impure, so the timestamp is stamped onto the action there
     * and every existing `dispatch(locationRequested())` call site is unchanged.
     */
    locationRequested: {
      reducer(state, action: PayloadAction<number>) {
        state.status = 'loading';
        state.errorCode = null;
        state.errorMessage = null;
        state.lastAttemptAt = action.payload;
      },
      prepare() {
        return { payload: Date.now() };
      },
    },
    locationSucceeded(state, action: PayloadAction<LocationCoordinates>) {
      state.status = 'success';
      const renamed = movedFarEnoughToRename(state.coordinates, action.payload);
      state.coordinates = action.payload;
      state.errorCode = null;
      state.errorMessage = null;
      /* The old name belonged to the old position, so it is dropped when the
         position changes — captioning a fresh fix with where the customer used
         to be is worse than a moment with no name. A read that lands in the
         same place keeps the name it already resolved, which is what stops
         Refresh from blanking the title it is about to re-fetch identically. */
      if (renamed) state.place = null;
    },
    placeResolved(state, action: PayloadAction<Place | null>) {
      state.place = action.payload;
    },
    locationFailed(state, action: PayloadAction<{ code: LocationErrorCode; message: string }>) {
      state.status = 'error';
      state.errorCode = action.payload.code;
      state.errorMessage = action.payload.message;
    },
  },
});

export const {
  locationHydrated,
  locationRequested,
  locationSucceeded,
  locationFailed,
  placeResolved,
} = locationSlice.actions;

interface RootStateSlice {
  location: LocationState;
}

export const selectLocationStatus = (state: RootStateSlice): LocationStatus => state.location.status;
export const selectLocationCoordinates = (state: RootStateSlice): LocationCoordinates | null => state.location.coordinates;
export const selectLocationErrorCode = (state: RootStateSlice): LocationErrorCode | null => state.location.errorCode;
export const selectLocationErrorMessage = (state: RootStateSlice): string | null => state.location.errorMessage;
export const selectLocationPlace = (state: RootStateSlice): Place | null => state.location.place;
export const selectLocationLastAttemptAt = (state: RootStateSlice): number | null =>
  state.location.lastAttemptAt;

export default locationSlice.reducer;
