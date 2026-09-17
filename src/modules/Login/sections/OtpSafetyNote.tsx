import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { brand } from '../../../theme';
import { OTP_COPY } from '../constants';
import { otpStyles } from '../styles';

export function OtpSafetyNote() {
  return (
    <View style={otpStyles.safetyRow}>
      <EventlyIcon name="shield-check-outline" size={14} color={brand.green} />
      <EventlyText variant="caption" style={otpStyles.safetyText}>
        {OTP_COPY.safetyNote}
      </EventlyText>
    </View>
  );
}

export default OtpSafetyNote;
