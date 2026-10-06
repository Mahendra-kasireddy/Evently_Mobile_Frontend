import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Animated,
  Keyboard,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText, KeyboardAvoider } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { OTP_COPY, PHONE_COPY } from './constants';
import { useLoginContainer } from './container';
import { AuthCta } from './sections/AuthCta';
import { AuthHero } from './sections/AuthHero';
import { BusinessEntryCard } from './sections/BusinessEntryCard';
import { LoginBackdrop } from './sections/LoginBackdrop';
import { LoginCornerPhoto } from './sections/LoginCornerPhoto';
import { OtpArt } from './sections/OtpArt';
import { OtpEntry } from './sections/OtpEntry';
import { OtpSafetyNote } from './sections/OtpSafetyNote';
import { PhoneEntry } from './sections/PhoneEntry';
import { TermsNote } from './sections/TermsNote';
import { AUTH_NAVY, styles } from './styles';
import { formatSentTo } from './utils';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Space above the logo on the number step, below the status bar. */
const PHONE_STEP_TOP = 96;

/**
 * Sign in: a number, then the code that was texted to it.
 *
 * Both steps share one layout — back arrow, a heading block, the field and
 * its CTA, then a footer — so moving between them does not reflow the screen.
 * Behind both: a drawn backdrop of soft shapes and confetti. The number step
 * adds a round photo in the top-right corner cycling through the events
 * Evently plans; the code step keeps its own illustration, since by then the
 * person is mid-task.
 *
 * The footer is pushed to the bottom by a flexible spacer rather than sitting
 * wherever the content happens to end: with the keyboard down that fills what
 * would otherwise be a dead half-screen, and with the keyboard up the spacer
 * collapses to nothing and the footer follows the content. Either way the
 * field the person is typing into stays on screen, which is what the
 * KeyboardAvoidingView around the whole thing is for.
 */
export function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    step,
    phone,
    dialCode,
    code,
    sentTo,
    devCode,
    isPhoneValid,
    isCodeValid,
    isSubmittingPhone,
    isSubmittingCode,
    errorMessage,
    resendSeconds,
    canResend,
    setPhone,
    setDialCode,
    setCode,
    submitPhone,
    submitCode,
    resendCode,
    changeNumber,
  } = useLoginContainer();

  const isPhoneStep = step === 'phone';
  // The number step has no top bar; clear the status bar and the corner photo.
  const contentTop = isPhoneStep ? insets.top + PHONE_STEP_TOP : 0;

  const bodyOpacity = useRef(new Animated.Value(0)).current;
  const bodyTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    bodyOpacity.setValue(0);
    bodyTranslateY.setValue(10);
    Animated.parallel([
      Animated.timing(bodyOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(bodyTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step, bodyOpacity, bodyTranslateY]);

  return (
    <View style={styles.container}>
      {/* Dark glyphs on the light page. */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <LoginBackdrop />
      {isPhoneStep ? <LoginCornerPhoto /> : null}

      {/* Back only on the code step, where it returns to the number. The
          number step has no bar at all: its photos run to the top of the
          screen, under the status bar, and a bar above the scroll view would
          clip them (a scroll view cuts off whatever is pulled above it). */}
      {!isPhoneStep ? (
        <View style={[styles.topBar, { marginTop: insets.top }]}>
          <Pressable
            style={styles.back}
            onPress={changeNumber}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back and change number"
            testID="otp-back"
          >
            <EventlyIcon name="chevron-left" size={24} color={AUTH_NAVY} />
          </Pressable>
        </View>
      ) : null}

      <KeyboardAvoider style={styles.flex}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingTop: contentTop, paddingBottom: insets.bottom + 16 },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: bodyOpacity,
              transform: [{ translateY: bodyTranslateY }],
            }}
          >
            {isPhoneStep ? (
              <>
                <AuthHero />
                <PhoneEntry
                  phone={phone}
                  dialCode={dialCode}
                  onChangePhone={setPhone}
                  onChangeDialCode={setDialCode}
                />
                <AuthCta
                  idleLabel={PHONE_COPY.ctaIdle}
                  readyLabel={PHONE_COPY.ctaReady}
                  ready={isPhoneValid}
                  loading={isSubmittingPhone}
                  onPress={submitPhone}
                  testID="phone-cta"
                />
              </>
            ) : (
              <>
                <OtpArt sentTo={formatSentTo(sentTo, phone)} />
                <OtpEntry
                  code={code}
                  onChangeCode={setCode}
                  onResend={resendCode}
                  canResend={canResend}
                  resendSeconds={resendSeconds}
                  devCode={devCode}
                />
                <AuthCta
                  idleLabel={OTP_COPY.ctaIdle}
                  readyLabel={OTP_COPY.ctaReady}
                  ready={isCodeValid}
                  loading={isSubmittingCode}
                  onPress={submitCode}
                  testID="otp-cta"
                />
              </>
            )}

            {errorMessage ? (
              <View style={styles.errorBox} accessibilityLiveRegion="polite">
                <EventlyIcon
                  name="alert-circle-outline"
                  size={16}
                  color="#b3261e"
                />
                <EventlyText variant="body" style={styles.errorText}>
                  {errorMessage}
                </EventlyText>
              </View>
            ) : null}
          </Animated.View>

          {/* Tapping the gap puts the keyboard away, the way tapping off a
              field does everywhere else. */}
          <Pressable
            style={styles.spacer}
            onPress={Keyboard.dismiss}
            accessible={false}
          />

          <View style={styles.footer}>
            {isPhoneStep ? (
              <>
                <TermsNote />
                <BusinessEntryCard
                  onPress={() => navigation.navigate('Join')}
                />
              </>
            ) : (
              <OtpSafetyNote />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoider>
    </View>
  );
}

export default LoginScreen;
