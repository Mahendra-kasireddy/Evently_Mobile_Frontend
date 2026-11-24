import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { blockDays, getCalendar, setDateBlocked } from './services';

export const useOrganizerCalendar = () => useAsync(getCalendar, []);
export const useSetDateBlocked = () => useAsyncCallback(setDateBlocked);
export const useBlockDays = () => useAsyncCallback(blockDays);
