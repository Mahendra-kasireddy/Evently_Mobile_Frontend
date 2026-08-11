import { useRef } from 'react';
import { TouchableOpacity, View, type NativeSyntheticEvent, type TextInput, type TextInputKeyPressEventData } from 'react-native';
import { EventlyButton, EventlyIcon, EventlyText, EventlyTextInput } from '../../../Components';
import { LOGIN_ACCENT, LOGIN_TEXT_MUTED, OTP_LENGTH } from '../constants';
import { formCardStyles, otpEntryStyles } from '../styles';

interface OtpEntryProps {
  code: string;
  onChangeCode: (value: string) => void;
  onSubmit: () => void;
  onChangeNumber: () => void;
  onResend: () => void;
  isSubmitting: boolean;
  devCode: string | null;
  sentTo: string | null;
  resendSeconds: number;
  canResend: boolean;
}

export function OtpEntry({
  code,
  onChangeCode,
  onSubmit,
  onChangeNumber,
  onResend,
  isSubmitting,
  devCode,
  sentTo,
  resendSeconds,
  canResend,
}: OtpEntryProps) {
  const boxRefs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => code[i] ?? '');

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = digits.slice();
    next[index] = clean;
    onChangeCode(next.join(''));
    if (clean && index < OTP_LENGTH - 1) {
      boxRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      boxRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View>
      <TouchableOpacity style={otpEntryStyles.backRow} onPress={onChangeNumber} accessibilityLabel="Change mobile number">
        <EventlyIcon name="arrow-left" size={15} color={LOGIN_TEXT_MUTED} />
        <EventlyText variant="body" style={otpEntryStyles.backText}>
          Change number
        </EventlyText>
      </TouchableOpacity>

      <EventlyText variant="h2" style={formCardStyles.title}>
        Verify your number
      </EventlyText>
      <EventlyText variant="body" style={formCardStyles.subtitle}>
        Enter the 6-digit code sent to <EventlyText variant="subtitle" style={otpEntryStyles.sentToText}>{sentTo ?? 'your phone'}</EventlyText>.
      </EventlyText>

      <View style={otpEntryStyles.container}>
        <View style={otpEntryStyles.boxRow}>
          {digits.map((digit, index) => (
            <EventlyTextInput
              key={index}
              ref={(el) => {
                boxRefs.current[index] = el;
              }}
              style={[otpEntryStyles.box, digit && otpEntryStyles.boxFilled]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => setDigit(index, value)}
              onKeyPress={(event) => handleKeyPress(index, event)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {devCode ? (
          <EventlyText variant="caption" style={otpEntryStyles.devHint}>
            Dev code: {devCode}
          </EventlyText>
        ) : null}

        <EventlyButton
          title="Verify & continue"
          onPress={onSubmit}
          disabled={code.length < OTP_LENGTH}
          loading={isSubmitting}
          accentColor={LOGIN_ACCENT}
          style={otpEntryStyles.button}
        />

        <View style={otpEntryStyles.resendRow}>
          {canResend ? (
            <TouchableOpacity onPress={onResend} accessibilityLabel="Resend code">
              <EventlyText variant="body" style={otpEntryStyles.resendActive}>
                Resend code
              </EventlyText>
            </TouchableOpacity>
          ) : (
            <EventlyText variant="body" style={otpEntryStyles.resendText}>
              Resend code in 0:{String(resendSeconds).padStart(2, '0')}
            </EventlyText>
          )}
        </View>
      </View>
    </View>
  );
}

export default OtpEntry;
