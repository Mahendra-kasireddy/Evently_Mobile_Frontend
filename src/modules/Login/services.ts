import { apiClient } from '../../services/apiClient';
import { SEND_OTP_ENDPOINT, VERIFY_OTP_ENDPOINT } from './constants';
import type { SendOtpResponseDTO, VerifyOtpResponseDTO } from './types';

export async function sendOtp(mobile: string): Promise<SendOtpResponseDTO> {
  const { data } = await apiClient.post<SendOtpResponseDTO>(SEND_OTP_ENDPOINT, { mobile });
  return data;
}

export async function verifyOtp(requestId: string, code: string): Promise<VerifyOtpResponseDTO> {
  const { data } = await apiClient.post<VerifyOtpResponseDTO>(VERIFY_OTP_ENDPOINT, { requestId, code });
  return data;
}
