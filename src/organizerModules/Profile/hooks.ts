import { useAsync } from '../../hooks/useAsync';
import { getPreview, getProfile, getServicesConfig } from './services';

export const useOrganizerProfile = () => useAsync(getProfile, []);
export const useProfilePreview = () => useAsync(getPreview, []);
export const useServicesConfig = () => useAsync(getServicesConfig, []);
