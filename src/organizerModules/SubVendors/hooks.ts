import { useAsync } from '../../hooks/useAsync';
import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { getSubVendors, inviteSubVendor, removeSubVendor } from './services';

export const useSubVendors = () => useAsync(getSubVendors, []);
export const useInviteSubVendor = () => useAsyncCallback(inviteSubVendor);
export const useRemoveSubVendor = () => useAsyncCallback(removeSubVendor);
