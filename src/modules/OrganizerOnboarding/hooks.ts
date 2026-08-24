import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { fetchOnboardingConfig, fetchServicesConfig } from './services';

export function useOnboardingConfig() {
  return useAsync(fetchOnboardingConfig);
}

export function useServicesConfig() {
  return useAsync(fetchServicesConfig);
}

export function useOnboardingCallback<Args extends unknown[], R>(fn: (...args: Args) => Promise<R>) {
  return useAsyncCallback(fn);
}
