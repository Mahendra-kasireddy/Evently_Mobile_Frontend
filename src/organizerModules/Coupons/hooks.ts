import { useAsync } from '../../hooks/useAsync';
import { getCouponUsage, getMyCoupons } from './services';

export const useMyCoupons = () => useAsync(getMyCoupons, []);
export const useCouponUsage = () => useAsync(getCouponUsage, []);
