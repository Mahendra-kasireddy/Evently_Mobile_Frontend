import { createSlice } from '@reduxjs/toolkit';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  /** True once the persisted flag has been read from AsyncStorage at startup. */
  isHydrated: boolean;
}

const initialState: OnboardingState = { hasSeenOnboarding: false, isHydrated: false };

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setHasSeenOnboarding(state) {
      state.hasSeenOnboarding = true;
    },
    setOnboardingHydrated(state) {
      state.isHydrated = true;
    },
  },
});

export const { setHasSeenOnboarding, setOnboardingHydrated } = onboardingSlice.actions;
export const selectHasSeenOnboarding = (state: { onboarding: OnboardingState }): boolean =>
  state.onboarding.hasSeenOnboarding;
export const selectIsOnboardingHydrated = (state: { onboarding: OnboardingState }): boolean =>
  state.onboarding.isHydrated;
export default onboardingSlice.reducer;
