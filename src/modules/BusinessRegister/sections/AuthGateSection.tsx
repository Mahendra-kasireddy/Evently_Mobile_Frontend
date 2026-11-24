import { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import {
  EventlyButton,
  EventlyIcon,
  AppText,
  EventlyTextInput,
  KeyboardAvoider,
} from '../../../Components';
import { isValidMobile, isValidOtpCode } from '../../Login/utils';
import { useSendOtp, useVerifyOtp } from '../../Login/hooks';
import { setSession } from '../../../store/authSlice';
import { useAppDispatch } from '../../../store/hooks';
import { setHasSeenOnboarding } from '../../../store/onboardingSlice';
import {
  REG_ACCENT,
  GATE_COPY,
  VERIFY_HERO_COPY,
  type AuthGateCopy,
} from '../constants';
import { TermsNote } from '../../Login/sections/TermsNote';
import { authGateStyles } from '../styles';
import { VerifyHero } from './VerifyHero';

/** The number as typed, so a mistake is easy to spot: "+91 98765 43210". */
function formatFullNumber(phone: string) {
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

/**
 * Inline OTP gate for business registration, mirroring web's OnboardingGate:
 * the exact same /auth/sendOtp + /auth/verifyOtp calls as the customer Login
 * module (no separate auth system), so a signed-out visitor verifies their
 * mobile in place and the registration continues on the same screen.
 */
export function AuthGateSection({
  copy,
  onBack,
  onSignIn,
}: {
  copy: AuthGateCopy;
  /** Leaves the sign-up — the hero carries the back arrow now. */
  onBack: () => void;
  /** To the ordinary sign-in, for a number that already has an account. */
  onSignIn: () => void;
}) {
  const dispatch = useAppDispatch();
  const sendOtpCall = useSendOtp();
  const verifyOtpCall = useVerifyOtp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);

  const isPhoneValid = isValidMobile(phone);
  const isCodeValid = isValidOtpCode(code);
  // Registration is for new numbers only; the server answers 409 for one
  // that already has an account, and that number belongs on the sign-in.
  // Editing the number clears it, so a different one can be tried.
  const [checkedPhone, setCheckedPhone] = useState('');
  const alreadyRegistered =
    sendOtpCall.error?.status === 409 && phone === checkedPhone;
  const errorMessage = alreadyRegistered
    ? null
    : sendOtpCall.error?.message ?? verifyOtpCall.error?.message ?? null;

  useEffect(() => {
    if (step !== 'otp' || resendSeconds <= 0) return undefined;
    const id = setTimeout(() => setResendSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, resendSeconds]);

  const requestOtp = () =>
    sendOtpCall.execute(phone, 'register').then(response => {
      setRequestId(response.requestId);
      setDevCode(response.devCode ?? null);
      setResendSeconds(30);
    });

  const submitPhone = () => {
    if (!isPhoneValid) return;
    setCheckedPhone(phone);
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
        <VerifyHero
          titleLead={
            step === 'phone' ? copy.titleLead : VERIFY_HERO_COPY.otpLead
          }
          titleAccent={
            step === 'phone' ? copy.titleAccent : VERIFY_HERO_COPY.otpAccent
          }
          subtitle={
            step === 'phone' ? copy.heroSubtitle : VERIFY_HERO_COPY.otpSubtitle
          }
          onBack={step === 'otp' ? changeNumber : onBack}
        />

        <View style={authGateStyles.sheet}>
          {step === 'phone' ? (
            <View style={authGateStyles.form}>
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
              {alreadyRegistered ? (
                <View style={authGateStyles.registeredCard}>
                  <EventlyIcon
                    name="account-check-outline"
                    size={20}
                    color={REG_ACCENT}
                  />
                  <AppText variant="body" style={authGateStyles.registeredText}>
                    {GATE_COPY.alreadyRegistered}
                  </AppText>
                </View>
              ) : null}
              {alreadyRegistered ? (
                <EventlyButton
                  title={GATE_COPY.signIn}
                  onPress={onSignIn}
                  accentColor={REG_ACCENT}
                  style={authGateStyles.button}
                />
              ) : (
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
              )}
              <TermsNote />
              {alreadyRegistered ? null : (
                <View style={authGateStyles.signInRow}>
                  <AppText variant="body" style={authGateStyles.signInMuted}>
                    {GATE_COPY.haveAccount}
                  </AppText>
                  <TouchableOpacity
                    onPress={onSignIn}
                    accessibilityRole="button"
                    accessibilityLabel={GATE_COPY.signIn}
                    hitSlop={8}
                  >
                    <AppText variant="body" style={authGateStyles.signInLink}>
                      {GATE_COPY.signIn}
                    </AppText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={authGateStyles.form}>
              {/* Where the code went, with the way to fix a mistyped number
                  right beside it. */}
              <View style={authGateStyles.sentRow}>
                <View style={authGateStyles.flex}>
                  <AppText variant="caption" style={authGateStyles.sentLabel}>
                    {VERIFY_HERO_COPY.sentBySms}
                  </AppText>
                  <AppText
                    variant="h3"
                    style={authGateStyles.sentNumber}
                    numberOfLines={1}
                  >
                    {formatFullNumber(phone)}
                  </AppText>
                </View>
                <TouchableOpacity
                  onPress={changeNumber}
                  style={authGateStyles.editButton}
                  accessibilityRole="button"
                  accessibilityLabel="Edit mobile number"
                  hitSlop={8}
                >
                  <EventlyIcon
                    name="pencil-outline"
                    size={16}
                    color={REG_ACCENT}
                  />
                  <AppText variant="body" style={authGateStyles.editText}>
                    Edit
                  </AppText>
                </TouchableOpacity>
              </View>

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

              <View style={authGateStyles.resendRow}>
                <AppText variant="body" style={authGateStyles.resendMuted}>
                  {VERIFY_HERO_COPY.noCode}
                </AppText>
                {resendSeconds > 0 ? (
                  <AppText variant="body" style={authGateStyles.resendWait}>
                    Resend in {resendSeconds}s
                  </AppText>
                ) : (
                  <TouchableOpacity
                    onPress={resendCode}
                    accessibilityRole="button"
                    accessibilityLabel="Resend code"
                    hitSlop={8}
                  >
                    <AppText variant="body" style={authGateStyles.resendActive}>
                      Resend code
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoider>
  );
}

export default AuthGateSection;
