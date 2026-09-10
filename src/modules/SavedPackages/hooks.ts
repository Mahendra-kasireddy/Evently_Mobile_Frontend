import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { fetchSavedPackages, savePackage, unsavePackage } from './services';

export function useSavedPackages() {
  return useAsync(fetchSavedPackages, []);
}

export function useSaveAction() {
  return useAsyncCallback(savePackage);
}

export function useUnsaveAction() {
  return useAsyncCallback(unsavePackage);
}
