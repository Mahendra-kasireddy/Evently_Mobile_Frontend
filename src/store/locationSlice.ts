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
}

const initialState: LocationState = {
  status: 'idle',
  coordinates: null,
  errorCode: null,
  errorMessage: null,
  place: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    locationRequested(state) {
      state.status = 'loading';
      state.errorCode = null;
      state.errorMessage = null;
    },
    locationSucceeded(state, action: PayloadAction<LocationCoordinates>) {
      state.status = 'success';
      state.coordinates = action.payload;
      state.errorCode = null;
      state.errorMessage = null;
      /* The old name belonged to the old position. Holding it while the new one
         resolves would caption a fresh fix with where the customer used to be,
         which is worse than showing nothing for a second. */
      state.place = null;
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

export const { locationRequested, locationSucceeded, locationFailed, placeResolved } =
  locationSlice.actions;

interface RootStateSlice {
  location: LocationState;
}

export const selectLocationStatus = (state: RootStateSlice): LocationStatus => state.location.status;
export const selectLocationCoordinates = (state: RootStateSlice): LocationCoordinates | null => state.location.coordinates;
export const selectLocationErrorCode = (state: RootStateSlice): LocationErrorCode | null => state.location.errorCode;
export const selectLocationErrorMessage = (state: RootStateSlice): string | null => state.location.errorMessage;
export const selectLocationPlace = (state: RootStateSlice): Place | null => state.location.place;

export default locationSlice.reducer;
