import { useAsyncCallback } from '../../hooks/useAsyncCallback';
import { sendOtp, verifyOtp } from './services';

export function useSendOtp() {
  return useAsyncCallback(sendOtp);
}

export function useVerifyOtp() {
  return useAsyncCallback(verifyOtp);
}
