import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { EventlyText, EventlyTextInput } from '../../../Components';
import type { TextInput } from 'react-native';
import { OTP_COPY, OTP_LENGTH } from '../constants';
import { otpStyles } from '../styles';
import {
  activeOtpIndex,
  formatCooldown,
  otpDigits,
  sanitizeDigits,
} from '../utils';

interface OtpEntryProps {
  code: string;
  onChangeCode: (value: string) => void;
  onResend: () => void;
  canResend: boolean;
  resendSeconds: number;
  devCode: string | null;
}

/**
 * Six cells over one real input.
 *
 * The cells are the picture; the field is a single transparent TextInput laid
 * across them. One input rather than six is what makes paste, SMS autofill and
 * backspace-across-cells behave the way the OS already does them — six
 * one-character inputs have to reimplement all three, and get them subtly
 * wrong.
 *
 * The cell that the next keystroke fills is outlined while the field has
 * focus: there is no visible caret, so without it people tap a cell in the
 * middle and wonder why their digit went elsewhere.
 */
export function OtpEntry({
  code,
  onChangeCode,
  onResend,
  canResend,
  resendSeconds,
  devCode,
}: OtpEntryProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const digits = otpDigits(code);
  const active = activeOtpIndex(code);

  return (
    <View>
      <Pressable
        style={otpStyles.boxRow}
        onPress={() => inputRef.current?.focus()}
        accessible={false}
        testID="otp-boxes"
      >
        {digits.map((digit, index) => (
          <View
            key={index}
            style={[
              otpStyles.box,
              digit ? otpStyles.boxFilled : null,
              focused && index === active && !digit
                ? otpStyles.boxActive
                : null,
            ]}
          >
            <EventlyText style={otpStyles.boxText}>{digit}</EventlyText>
          </View>
        ))}

        <EventlyTextInput
          ref={inputRef}
          style={otpStyles.hiddenInput}
          value={code}
          onChangeText={value =>
            onChangeCode(sanitizeDigits(value, OTP_LENGTH))
          }
          keyboardType="number-pad"
          returnKeyType="done"
          maxLength={OTP_LENGTH}
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
          caretHidden
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={
            code
              ? `One time code, ${code.split('').join(' ')}`
              : 'One time code, empty'
          }
          testID="otp-input"
        />
      </Pressable>

      {/* "Resend OTP in 0:28" while the cooldown runs, then the link. */}
      <View style={otpStyles.resendRow}>
        {canResend ? (
          <EventlyText variant="caption" style={otpStyles.resendLead}>
            {OTP_COPY.retryLead}
          </EventlyText>
        ) : null}
        <Pressable
          onPress={onResend}
          disabled={!canResend}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canResend }}
          accessibilityLabel={
            canResend
              ? 'Resend the code by S M S'
              : `Resend available in ${resendSeconds} seconds`
          }
          testID="otp-resend-sms"
        >
          <EventlyText
            variant="caption"
            style={canResend ? otpStyles.resendLink : otpStyles.resendWait}
          >
            {canResend
              ? OTP_COPY.retryChannel
              : `${OTP_COPY.retryWait} ${formatCooldown(resendSeconds)}`}
          </EventlyText>
        </Pressable>
      </View>

      {devCode ? (
        <EventlyText variant="caption" style={otpStyles.devHint}>
          Dev code: {devCode}
        </EventlyText>
      ) : null}
    </View>
  );
}

export default OtpEntry;
