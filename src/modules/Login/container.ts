import { useCallback, useEffect, useState } from 'react';
import { setToken } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { setHasSeenOnboarding } from '../../store/onboardingSlice';
import { RESEND_COOLDOWN_SECONDS } from './constants';
import { useSendOtp, useVerifyOtp } from './hooks';
import { isValidMobile, isValidOtpCode } from './utils';
import type { LoginStep } from './types';

export interface LoginContainerResult {
  step: LoginStep;
  phone: string;
  code: string;
  sentTo: string | null;
  devCode: string | null;
  isPhoneValid: boolean;
  isCodeValid: boolean;
  isSubmittingPhone: boolean;
  isSubmittingCode: boolean;
  errorMessage: string | null;
  resendSeconds: number;
  canResend: boolean;
  setPhone: (value: string) => void;
  setCode: (value: string) => void;
  submitPhone: () => void;
  submitCode: () => void;
  resendCode: () => void;
  changeNumber: () => void;
}

/**
 * Login's business logic: the phone -> OTP step machine, validation gating,
 * the resend-code cooldown (matches web's 30s window), and dispatching the
 * resulting token into the store on success. LoginScreen only renders
 * whichever step this returns.
 */
export function useLoginContainer(): LoginContainerResult {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);

  const sendOtpCall = useSendOtp();
  const verifyOtpCall = useVerifyOtp();

  const isPhoneValid = isValidMobile(phone);
  const isCodeValid = isValidOtpCode(code);

  useEffect(() => {
    if (step !== 'otp' || resendSeconds <= 0) return undefined;
    const id = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, resendSeconds]);

  const requestOtp = useCallback(() => {
    return sendOtpCall.execute(phone).then((response) => {
      setRequestId(response.requestId);
      setSentTo(response.sentTo);
      setDevCode(response.devCode ?? null);
      setResendSeconds(RESEND_COOLDOWN_SECONDS);
    });
  }, [phone, sendOtpCall]);

  const submitPhone = useCallback(() => {
    if (!isPhoneValid) return;
    requestOtp()
      .then(() => {
        setCode('');
        setStep('otp');
      })
      .catch(() => {
        // error is already captured in sendOtpCall.error
      });
  }, [isPhoneValid, requestOtp]);

  const resendCode = useCallback(() => {
    if (resendSeconds > 0) return;
    setCode('');
    requestOtp().catch(() => {
      // error is already captured in sendOtpCall.error
    });
  }, [resendSeconds, requestOtp]);

  const submitCode = useCallback(() => {
    if (!requestId || !isCodeValid) return;
    verifyOtpCall
      .execute(requestId, code)
      .then((response) => {
        dispatch(setToken(response.token));
        dispatch(setHasSeenOnboarding());
      })
      .catch(() => {
        // error is already captured in verifyOtpCall.error
      });
  }, [requestId, isCodeValid, code, verifyOtpCall, dispatch]);

  const changeNumber = useCallback(() => {
    setStep('phone');
    setCode('');
    setRequestId(null);
    setSentTo(null);
    setDevCode(null);
    setResendSeconds(0);
  }, []);

  return {
    step,
    phone,
    code,
    sentTo,
    devCode,
    isPhoneValid,
    isCodeValid,
    isSubmittingPhone: sendOtpCall.loading,
    isSubmittingCode: verifyOtpCall.loading,
    errorMessage: sendOtpCall.error?.message ?? verifyOtpCall.error?.message ?? null,
    resendSeconds,
    canResend: resendSeconds <= 0,
    setPhone,
    setCode,
    submitPhone,
    submitCode,
    resendCode,
    changeNumber,
  };
}
