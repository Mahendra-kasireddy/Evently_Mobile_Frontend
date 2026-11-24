import { apiClient } from '../../services/apiClient';
import { SEND_OTP_ENDPOINT, VERIFY_OTP_ENDPOINT } from './constants';
import type { SendOtpResponseDTO, VerifyOtpResponseDTO } from './types';

/**
 * `register` is the business sign-up: the server refuses (409) a number that
 * already has an account, so it can be sent to sign in instead.
 */
export async function sendOtp(
  mobile: string,
  purpose?: 'register',
): Promise<SendOtpResponseDTO> {
  const { data } = await apiClient.post<SendOtpResponseDTO>(SEND_OTP_ENDPOINT, {
    mobile,
    ...(purpose ? { purpose } : null),
  });
  return data;
}

export async function verifyOtp(
  requestId: string,
  code: string,
): Promise<VerifyOtpResponseDTO> {
  const { data } = await apiClient.post<VerifyOtpResponseDTO>(
    VERIFY_OTP_ENDPOINT,
    { requestId, code },
  );
  return data;
}
