import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LocationCoordinates, LocationErrorCode } from '../services/location';

export type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

interface LocationState {
  status: LocationStatus;
  coordinates: LocationCoordinates | null;
  errorCode: LocationErrorCode | null;
  errorMessage: string | null;
}

const initialState: LocationState = {
  status: 'idle',
  coordinates: null,
  errorCode: null,
  errorMessage: null,
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
    },
    locationFailed(state, action: PayloadAction<{ code: LocationErrorCode; message: string }>) {
      state.status = 'error';
      state.errorCode = action.payload.code;
      state.errorMessage = action.payload.message;
    },
  },
});

export const { locationRequested, locationSucceeded, locationFailed } = locationSlice.actions;

interface RootStateSlice {
  location: LocationState;
}

export const selectLocationStatus = (state: RootStateSlice): LocationStatus => state.location.status;
export const selectLocationCoordinates = (state: RootStateSlice): LocationCoordinates | null => state.location.coordinates;
export const selectLocationErrorCode = (state: RootStateSlice): LocationErrorCode | null => state.location.errorCode;
export const selectLocationErrorMessage = (state: RootStateSlice): string | null => state.location.errorMessage;

export default locationSlice.reducer;
