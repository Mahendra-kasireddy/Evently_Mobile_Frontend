import { apiClient } from '../../services/apiClient';
import {
  COUPONS_CREATE_ENDPOINT,
  COUPONS_MINE_ENDPOINT,
  COUPONS_USAGE_ENDPOINT,
  couponStatusEndpoint,
} from './constants';
import type {
  CouponDTO,
  CouponStatusDTO,
  CouponTermsBody,
  RedemptionDTO,
} from './types';

/** The signed-in organizer's coupons, newest first. No organizer id is sent: the server reads it from the session. */
export async function getMyCoupons(): Promise<CouponDTO[]> {
  const { data } = await apiClient.get<CouponDTO[]>(COUPONS_MINE_ENDPOINT);
  return Array.isArray(data) ? data : [];
}

/** Every redemption of this organizer's coupons. */
export async function getCouponUsage(): Promise<RedemptionDTO[]> {
  const { data } = await apiClient.get<RedemptionDTO[]>(COUPONS_USAGE_ENDPOINT);
  return Array.isArray(data) ? data : [];
}

/** Live as soon as it is created — organizer coupons need no approval. */
export async function createCoupon(body: CouponTermsBody): Promise<CouponDTO> {
  const { data } = await apiClient.post<CouponDTO>(
    COUPONS_CREATE_ENDPOINT,
    body,
  );
  return data;
}

export async function setCouponStatus(
  id: string,
  status: CouponStatusDTO,
): Promise<CouponDTO> {
  const { data } = await apiClient.patch<CouponDTO>(couponStatusEndpoint(id), {
    status,
  });
  return data;
}
