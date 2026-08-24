import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyButton, EventlyIcon, EventlyText, EventlyTextInput } from '../../../Components';
import { isValidMobile, isValidOtpCode } from '../../Login/utils';
import { useSendOtp, useVerifyOtp } from '../../Login/hooks';
import { setToken } from '../../../store/authSlice';
import { useAppDispatch } from '../../../store/hooks';
import { ONB_COPY, ORG_ACCENT, ORG_GREEN } from '../constants';
import { authGateStyles } from '../styles';

/**
 * Inline OTP gate for organizer onboarding, mirroring web's AuthGate: reuses the
 * exact same /auth/sendOtp + /auth/verifyOtp calls as the customer Login module
 * (no separate auth system), so an unauthenticated visitor can verify their
 * mobile in place and continue straight into the wizard on the same screen.
 */
export function AuthGateSection() {
  const dispatch = useAppDispatch();
  const sendOtpCall = useSendOtp();
  const verifyOtpCall = useVerifyOtp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);

  const isPhoneValid = isValidMobile(phone);
  const isCodeValid = isValidOtpCode(code);
  const errorMessage = sendOtpCall.error?.message ?? verifyOtpCall.error?.message ?? null;

  useEffect(() => {
    if (step !== 'otp' || resendSeconds <= 0) return undefined;
    const id = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, resendSeconds]);

  const requestOtp = () =>
    sendOtpCall.execute(phone).then((response) => {
      setRequestId(response.requestId);
      setSentTo(response.sentTo);
      setDevCode(response.devCode ?? null);
      setResendSeconds(30);
    });

  const submitPhone = () => {
    if (!isPhoneValid) return;
    requestOtp()
      .then(() => {
        setCode('');
        setStep('otp');
      })
      .catch(() => undefined);
  };

  const resendCode = () => {
    if (resendSeconds > 0) return;
    setCode('');
    requestOtp().catch(() => undefined);
  };

  const submitCode = () => {
    if (!requestId || !isCodeValid) return;
    verifyOtpCall
      .execute(requestId, code)
      .then((response) => {
        dispatch(setToken(response.token));
        // No manual navigation — RootNavigator swaps to the authenticated stack,
        // which still contains this same screen name, so the wizard renders next.
      })
      .catch(() => undefined);
  };

  const changeNumber = () => {
    setStep('phone');
    setCode('');
    setRequestId(null);
    setSentTo(null);
    setDevCode(null);
    setResendSeconds(0);
  };

  const boxRefs = useRef<Array<import('react-native').TextInput | null>>([]);
  const digits = Array.from({ length: 6 }, (_, i) => code[i] ?? '');
  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = digits.slice();
    next[index] = clean;
    setCode(next.join(''));
    if (clean && index < 5) boxRefs.current[index + 1]?.focus();
  };

  return (
    <KeyboardAvoidingView style={authGateStyles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={authGateStyles.content} keyboardShouldPersistTaps="handled">
        <View style={authGateStyles.badge}>
          <EventlyIcon name="shield-check-outline" size={26} color={ORG_ACCENT} />
        </View>
        <EventlyText variant="h1" style={authGateStyles.title}>
          {ONB_COPY.authTitle}
        </EventlyText>
        <EventlyText variant="body" style={authGateStyles.subtitle}>
          {ONB_COPY.authSubtitle}
        </EventlyText>

        {step === 'phone' ? (
          <View style={authGateStyles.form}>
            <EventlyText variant="subtitle" style={authGateStyles.label}>
              Mobile number
            </EventlyText>
            <View style={authGateStyles.phoneRow}>
              <EventlyText variant="subtitle" style={authGateStyles.dialCode}>
                +91
              </EventlyText>
              <EventlyTextInput
                style={authGateStyles.phoneInput}
                placeholder="98765 43210"
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                autoFocus
              />
            </View>
            {errorMessage ? (
              <EventlyText variant="body" style={authGateStyles.error}>
                {errorMessage}
              </EventlyText>
            ) : null}
            <EventlyButton
              title="Send code"
              onPress={submitPhone}
              disabled={!isPhoneValid}
              loading={sendOtpCall.loading}
              accentColor={ORG_ACCENT}
              style={authGateStyles.button}
            />
          </View>
        ) : (
          <View style={authGateStyles.form}>
            <TouchableOpacity onPress={changeNumber} style={authGateStyles.backRow} accessibilityLabel="Change mobile number">
              <EventlyIcon name="arrow-left" size={15} color={ORG_ACCENT} />
              <EventlyText variant="body" style={authGateStyles.backText}>
                Change number
              </EventlyText>
            </TouchableOpacity>
            <EventlyText variant="body" style={authGateStyles.sentTo}>
              Code sent to {sentTo ?? 'your phone'}
            </EventlyText>

            <View style={authGateStyles.otpRow}>
              {digits.map((digit, index) => (
                <EventlyTextInput
                  key={index}
                  ref={(el) => {
                    boxRefs.current[index] = el;
                  }}
                  style={[authGateStyles.otpBox, digit ? authGateStyles.otpBoxFilled : null]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => setDigit(index, value)}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {devCode ? (
              <EventlyText variant="caption" style={authGateStyles.devHint}>
                Dev code: {devCode}
              </EventlyText>
            ) : null}

            {errorMessage ? (
              <EventlyText variant="body" style={authGateStyles.error}>
                {errorMessage}
              </EventlyText>
            ) : null}

            <EventlyButton
              title="Verify & continue"
              onPress={submitCode}
              disabled={!isCodeValid}
              loading={verifyOtpCall.loading}
              accentColor={ORG_ACCENT}
              style={authGateStyles.button}
            />

            {resendSeconds > 0 ? (
              <EventlyText variant="body" style={authGateStyles.resendMuted}>
                Resend code in 0:{String(resendSeconds).padStart(2, '0')}
              </EventlyText>
            ) : (
              <TouchableOpacity onPress={resendCode} accessibilityLabel="Resend code">
                <EventlyText variant="body" style={[authGateStyles.resendActive, { color: ORG_GREEN }]}>
                  Resend code
                </EventlyText>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AuthGateSection;
