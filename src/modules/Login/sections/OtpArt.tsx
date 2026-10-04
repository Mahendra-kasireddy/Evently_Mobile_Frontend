import { Text, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { OTP_COPY } from '../constants';
import { AUTH_ACCENT, AUTH_NAVY, heroStyles } from '../styles';

interface OtpArtProps {
  /** The number as the server says it texted it. */
  sentTo: string;
}

/** The verify step's heading: a phone with a message on it, and where it went. */
export function OtpArt({ sentTo }: OtpArtProps) {
  return (
    <View style={heroStyles.art}>
      <View style={heroStyles.artDisc} accessible={false}>
        <EventlyIcon name="cellphone-message" size={78} color={AUTH_NAVY} />
        <View style={heroStyles.artBubble}>
          <EventlyIcon
            name="message-processing-outline"
            size={20}
            color={AUTH_ACCENT}
          />
        </View>
        <View style={heroStyles.artLeaf}>
          <EventlyIcon name="leaf" size={22} color="#e9b49c" />
        </View>
      </View>
      <Text
        style={[heroStyles.title, heroStyles.titleGap]}
        accessibilityRole="header"
      >
        {OTP_COPY.title}
      </Text>
      <EventlyText variant="body" style={heroStyles.subtitle}>
        {OTP_COPY.sentToPrefix}
        {'\n'}
        <EventlyText variant="body" style={heroStyles.subtitleStrong}>
          {sentTo}
        </EventlyText>
      </EventlyText>
    </View>
  );
}

export default OtpArt;
