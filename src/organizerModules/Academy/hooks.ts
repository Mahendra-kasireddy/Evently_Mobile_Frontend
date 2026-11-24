import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { getAcademy, runAcademyAction } from './services';

export const useAcademy = () => useAsync(getAcademy, []);
export const useAcademyAction = () => useAsyncCallback(runAcademyAction);
