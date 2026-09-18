import { useCallback, useEffect, useRef, useState } from 'react';
import { setActiveView, setSession } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { setHasSeenOnboarding } from '../../store/onboardingSlice';
import {
  DIAL_CODE,
  MOBILE_LENGTH,
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from './constants';
import { useSendOtp, useVerifyOtp } from './hooks';
import { isValidMobile, isValidOtpCode, sanitizeDigits } from './utils';
import type { LoginStep } from './types';

export interface LoginContainerResult {
  step: LoginStep;
  phone: string;
  dialCode: string;
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
  setDialCode: (value: string) => void;
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
 *
 */
export function useLoginContainer(): LoginContainerResult {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState<string>(DIAL_CODE);
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
    const id = setTimeout(() => setResendSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, resendSeconds]);

  const requestOtp = useCallback(() => {
    return sendOtpCall.execute(phone).then(response => {
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
      .then(response => {
        // Both halves of the session: the refresh token is what keeps the
        // person signed in past the access token's one-hour life.
        dispatch(
          setSession({
            token: response.token,
            refreshToken: response.refreshToken ?? null,
          }),
        );
        // This screen is the customer entry point, so land in the customer app
        // even for an account that also holds the organizer role. Organizers
        // switch from Profile.
        dispatch(setActiveView('customer'));
        dispatch(setHasSeenOnboarding());
      })
      .catch(() => {
        // error is already captured in verifyOtpCall.error
      });
  }, [requestId, isCodeValid, code, verifyOtpCall, dispatch]);

  /*
   * Submit as soon as the sixth digit lands, typed or autofilled — making
   * someone tap "Verify" after entering a code they were told to enter is a
   * step with no decision in it.
   *
   * The ref is what stops it from firing twice for one code: `submitCode` is a
   * new function on every render, so without it the effect would re-run on the
   * render caused by its own request starting. A wrong code stays recorded, so
   * a retry needs a changed digit — which is exactly what a retry is.
   */
  const autoSubmitted = useRef<string | null>(null);
  useEffect(() => {
    if (step !== 'otp' || !requestId || !isCodeValid) return;
    if (autoSubmitted.current === code) return;
    autoSubmitted.current = code;
    submitCode();
  }, [step, requestId, isCodeValid, code, submitCode]);

  /* Both setters sanitize rather than trust the field: an autofill or a paste
     can deliver "Your code is 445 912", and only digits may reach the API. */
  const setPhoneSafely = useCallback((value: string) => {
    setPhone(sanitizeDigits(value, MOBILE_LENGTH));
  }, []);

  const setCodeSafely = useCallback((value: string) => {
    setCode(sanitizeDigits(value, OTP_LENGTH));
  }, []);

  const changeNumber = useCallback(() => {
    setStep('phone');
    setCode('');
    setRequestId(null);
    setSentTo(null);
    setDevCode(null);
    setResendSeconds(0);
    autoSubmitted.current = null;
  }, []);

  return {
    step,
    phone,
    dialCode,
    code,
    sentTo,
    devCode,
    isPhoneValid,
    isCodeValid,
    isSubmittingPhone: sendOtpCall.loading,
    isSubmittingCode: verifyOtpCall.loading,
    errorMessage:
      sendOtpCall.error?.message ?? verifyOtpCall.error?.message ?? null,
    resendSeconds,
    canResend: resendSeconds <= 0,
    setPhone: setPhoneSafely,
    setDialCode,
    setCode: setCodeSafely,
    submitPhone,
    submitCode,
    resendCode,
    changeNumber,
  };
}
