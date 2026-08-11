export type { LocationCoordinates, LocationErrorCode } from '../../services/location';
export type { LocationStatus } from '../../store/locationSlice';

export interface LocationStatusCopy {
  title: string;
  message: string;
  actionLabel: string;
  action: 'retry' | 'openSettings';
}
