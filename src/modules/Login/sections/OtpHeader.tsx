import { Pressable, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { brand, spacing } from '../../../theme';
import { OTP_COPY } from '../constants';
import { otpHeaderStyles } from '../styles';

interface OtpHeaderProps {
  sentTo: string;
  onBack: () => void;
  /** See AuthHero — the navy runs behind the status bar on this step too. */
  topInset: number;
}

/** Navy header for the verify step. Back and Edit do the same thing, on purpose:
 * back is the gesture people reach for, Edit is the one they read. */
export function OtpHeader({ sentTo, onBack, topInset }: OtpHeaderProps) {
  return (
    <View
      style={[otpHeaderStyles.header, { paddingTop: topInset + spacing.sm }]}
    >
      <Pressable
        style={otpHeaderStyles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back and change number"
        testID="otp-back"
      >
        <EventlyIcon name="chevron-left" size={20} color={brand.onNavy} />
      </Pressable>

      <View style={otpHeaderStyles.titleBlock}>
        <EventlyText variant="h2" style={otpHeaderStyles.title}>
          {OTP_COPY.title}
        </EventlyText>
        <EventlyText
          variant="caption"
          style={otpHeaderStyles.sentTo}
          numberOfLines={1}
        >
          {OTP_COPY.sentToPrefix} {sentTo}
        </EventlyText>
      </View>

      <Pressable
        style={otpHeaderStyles.editPill}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Edit mobile number"
        testID="otp-edit"
      >
        <EventlyIcon name="pencil-outline" size={13} color={brand.accent} />
        <EventlyText style={otpHeaderStyles.editText}>
          {OTP_COPY.edit}
        </EventlyText>
      </Pressable>
    </View>
  );
}

export default OtpHeader;
