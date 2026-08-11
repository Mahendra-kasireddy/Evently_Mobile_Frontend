import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { JOIN_LINK_COPY, LOGIN_TEXT_MUTED, LOGIN_TRUST_NOTE } from './constants';
import { useLoginContainer } from './container';
import { LoginPromo } from './sections/LoginPromo';
import { OtpEntry } from './sections/OtpEntry';
import { PhoneEntry } from './sections/PhoneEntry';
import { formCardStyles, styles } from './styles';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Renders whichever step the container is on. No fetching or step logic here. */
export function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();
  const {
    step,
    phone,
    code,
    sentTo,
    devCode,
    isSubmittingPhone,
    isSubmittingCode,
    errorMessage,
    resendSeconds,
    canResend,
    setPhone,
    setCode,
    submitPhone,
    submitCode,
    resendCode,
    changeNumber,
  } = useLoginContainer();

  const bodyOpacity = useRef(new Animated.Value(0)).current;
  const bodyTranslateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    bodyOpacity.setValue(0);
    bodyTranslateY.setValue(12);
    Animated.parallel([
      Animated.timing(bodyOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(bodyTranslateY, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [step, bodyOpacity, bodyTranslateY]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <LoginPromo />

          <Animated.View style={[styles.body, { opacity: bodyOpacity, transform: [{ translateY: bodyTranslateY }] }]}>
            {step === 'phone' ? (
              <PhoneEntry phone={phone} onChangePhone={setPhone} onSubmit={submitPhone} isSubmitting={isSubmittingPhone} />
            ) : (
              <OtpEntry
                code={code}
                onChangeCode={setCode}
                onSubmit={submitCode}
                onChangeNumber={changeNumber}
                onResend={resendCode}
                isSubmitting={isSubmittingCode}
                devCode={devCode}
                sentTo={sentTo}
                resendSeconds={resendSeconds}
                canResend={canResend}
              />
            )}

            {errorMessage ? (
              <View style={styles.errorBox}>
                <EventlyIcon name="alert-circle-outline" size={16} color={colors.danger} />
                <EventlyText variant="body" style={styles.errorText}>
                  {errorMessage}
                </EventlyText>
              </View>
            ) : null}
          </Animated.View>

          {step === 'phone' ? (
            <View style={styles.joinRow}>
              <EventlyText variant="body" style={styles.joinText}>
                {JOIN_LINK_COPY.label}
              </EventlyText>
              <TouchableOpacity onPress={() => navigation.navigate('Join')} accessibilityLabel="Create an organizer or sub-vendor account">
                <EventlyText variant="subtitle" style={styles.joinCta}>
                  {JOIN_LINK_COPY.cta}
                </EventlyText>
              </TouchableOpacity>
            </View>
          ) : null}

          <EventlyText variant="caption" style={formCardStyles.terms}>
            By continuing you agree to Evently&apos;s <EventlyText variant="caption" style={formCardStyles.termsBold}>Terms</EventlyText> &{' '}
            <EventlyText variant="caption" style={formCardStyles.termsBold}>Privacy Policy</EventlyText>.
          </EventlyText>

          <View style={styles.trustRow}>
            <EventlyIcon name="shield-check-outline" size={14} color={LOGIN_TEXT_MUTED} />
            <EventlyText variant="caption" style={styles.trustText}>
              {LOGIN_TRUST_NOTE}
            </EventlyText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;
