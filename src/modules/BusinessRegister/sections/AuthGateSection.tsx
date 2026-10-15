import { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import {
  EventlyButton,
  EventlyIcon,
  AppText,
  EventlyTextInput,
  GradientFill,
  KeyboardAvoider,
} from '../../../Components';
import { isValidMobile, isValidOtpCode } from '../../Login/utils';
import { useSendOtp, useVerifyOtp } from '../../Login/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setSession } from '../../../store/authSlice';
import { useAppDispatch } from '../../../store/hooks';
import { setHasSeenOnboarding } from '../../../store/onboardingSlice';
import { REG_ACCENT, REG_GREEN, type AuthGateCopy } from '../constants';
import { TermsNote } from '../../Login/sections/TermsNote';

const HERO_GRADIENT: [string, string] = ['#141d3a', '#3a1f5c'];
import { authGateStyles } from '../styles';

/**
 * Inline OTP gate for business registration, mirroring web's OnboardingGate:
 * the exact same /auth/sendOtp + /auth/verifyOtp calls as the customer Login
 * module (no separate auth system), so a signed-out visitor verifies their
 * mobile in place and the registration continues on the same screen.
 */
export function AuthGateSection({
  copy,
  onBack,
}: {
  copy: AuthGateCopy;
  /** Leaves the sign-up — the hero carries the back arrow now. */
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
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
  const errorMessage =
    sendOtpCall.error?.message ?? verifyOtpCall.error?.message ?? null;

  useEffect(() => {
    if (step !== 'otp' || resendSeconds <= 0) return undefined;
    const id = setTimeout(() => setResendSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, resendSeconds]);

  const requestOtp = () =>
    sendOtpCall.execute(phone).then(response => {
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
      .then(response => {
        dispatch(
          setSession({
            token: response.token,
            refreshToken: response.refreshToken ?? null,
          }),
        );
        // Registering is a deliberate first visit; don't show the intro next time.
        dispatch(setHasSeenOnboarding());
        // No manual navigation — RootNavigator swaps to the authenticated stack,
        // which still contains this same screen name, so registration continues.
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
    <KeyboardAvoider style={authGateStyles.flex}>
      <ScrollView
        contentContainerStyle={authGateStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* The same night-sky hero as the business picker — one flow. */}
        <View style={[authGateStyles.hero, { paddingTop: insets.top + 8 }]}>
          <GradientFill colors={HERO_GRADIENT} direction="diagonal" />
          <View style={authGateStyles.heroGlow} pointerEvents="none" />
          <TouchableOpacity
            style={authGateStyles.heroBack}
            onPress={step === 'otp' ? changeNumber : onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <EventlyIcon name="arrow-left" size={20} color="#ffffff" />
          </TouchableOpacity>
          <View style={authGateStyles.heroStepChip}>
            <AppText variant="label" style={authGateStyles.heroStepText}>
              {copy.step}
            </AppText>
          </View>
          <AppText variant="h1" style={authGateStyles.title}>
            {step === 'phone' ? copy.title : 'Enter the 6-digit code'}
          </AppText>
          <AppText variant="body" style={authGateStyles.subtitle}>
            {step === 'phone'
              ? copy.subtitle
              : `We sent it by SMS to ${sentTo ?? 'your phone'}.`}
          </AppText>
        </View>

        <View style={authGateStyles.sheet}>
          {step === 'phone' ? (
            <View style={authGateStyles.infoCard}>
              <EventlyIcon
                name="account-sync-outline"
                size={18}
                color="#4b3bd6"
              />
              <AppText variant="caption" style={authGateStyles.infoText}>
                {copy.sameNumber}
              </AppText>
            </View>
          ) : null}

          {step === 'phone' ? (
            <View style={authGateStyles.form}>
              <AppText
                variant="body"
                weight="medium"
                style={authGateStyles.label}
              >
                Mobile number
              </AppText>
              <View style={authGateStyles.phoneRow}>
                <AppText
                  variant="body"
                  weight="medium"
                  style={authGateStyles.dialCode}
                >
                  🇮🇳 +91
                </AppText>
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
                <AppText variant="body" style={authGateStyles.error}>
                  {errorMessage}
                </AppText>
              ) : null}
              <EventlyButton
                title={
                  isPhoneValid ? 'Send code' : 'Enter your 10-digit number'
                }
                onPress={submitPhone}
                disabled={!isPhoneValid}
                loading={sendOtpCall.loading}
                accentColor={REG_ACCENT}
                style={authGateStyles.button}
              />
              <TermsNote />
            </View>
          ) : (
            <View style={authGateStyles.form}>
              <TouchableOpacity
                onPress={changeNumber}
                style={authGateStyles.backRow}
                accessibilityLabel="Change mobile number"
              >
                <EventlyIcon name="arrow-left" size={15} color={REG_ACCENT} />
                <AppText variant="body" style={authGateStyles.backText}>
                  Change number
                </AppText>
              </TouchableOpacity>

              <View style={authGateStyles.otpRow}>
                {digits.map((digit, index) => (
                  <EventlyTextInput
                    key={index}
                    ref={el => {
                      boxRefs.current[index] = el;
                    }}
                    style={[
                      authGateStyles.otpBox,
                      digit ? authGateStyles.otpBoxFilled : null,
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={value => setDigit(index, value)}
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              {devCode ? (
                <AppText variant="caption" style={authGateStyles.devHint}>
                  Dev code: {devCode}
                </AppText>
              ) : null}

              {errorMessage ? (
                <AppText variant="body" style={authGateStyles.error}>
                  {errorMessage}
                </AppText>
              ) : null}

              <EventlyButton
                title="Verify & continue"
                onPress={submitCode}
                disabled={!isCodeValid}
                loading={verifyOtpCall.loading}
                accentColor={REG_ACCENT}
                style={authGateStyles.button}
              />

              {resendSeconds > 0 ? (
                <AppText variant="body" style={authGateStyles.resendMuted}>
                  Resend code in 0:{String(resendSeconds).padStart(2, '0')}
                </AppText>
              ) : (
                <TouchableOpacity
                  onPress={resendCode}
                  accessibilityLabel="Resend code"
                >
                  <AppText
                    variant="body"
                    style={[authGateStyles.resendActive, { color: REG_GREEN }]}
                  >
                    Resend code
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoider>
  );
}

export default AuthGateSection;
