import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import {
  completeOnboarding,
  getOnboardingConfig,
  getProfile,
  getServicesConfig,
  getStatus,
} from './services';

export const useSetupProfile = () => useAsync(getProfile, []);
export const useSetupStatus = () => useAsync(getStatus, []);
export const useOnboardingConfig = () => useAsync(getOnboardingConfig, []);
export const useServicesConfig = () => useAsync(getServicesConfig, []);
export const useCompleteOnboarding = () => useAsyncCallback(completeOnboarding);
