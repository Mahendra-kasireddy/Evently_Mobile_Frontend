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
import { OtpEntry } from './sections/OtpEntry';
import { OtpHeader } from './sections/OtpHeader';
import { OtpSafetyNote } from './sections/OtpSafetyNote';
import { PhoneEntry } from './sections/PhoneEntry';
import { TermsNote } from './sections/TermsNote';
import { styles } from './styles';
import { formatSentTo } from './utils';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Sign in: a number, then the code that was texted to it.
 *
 * Both steps share one layout — navy block, the field and its CTA, then a
 * footer — so moving between them does not reflow the screen.
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
      {/* Light glyphs, drawing under the bar: the navy header runs to the top
          edge, so the clock and battery sit on it. */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {isPhoneStep ? (
        <AuthHero topInset={insets.top} />
      ) : (
        <OtpHeader
          sentTo={formatSentTo(sentTo, phone)}
          onBack={changeNumber}
          topInset={insets.top}
        />
      )}

      <KeyboardAvoider style={styles.flex}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 16 },
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
                <BusinessEntryCard
                  onPress={() => navigation.navigate('Join')}
                />
                <TermsNote />
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
