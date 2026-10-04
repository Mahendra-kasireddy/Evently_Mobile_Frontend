import { Text, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { LOGIN_COPY } from '../constants';
import { AUTH_ACCENT, heroStyles } from '../styles';

/**
 * The sign-in step's heading: the mark, the wordmark, and one line saying what
 * this screen is for. Drawn with icons and type alone — nothing to download
 * before somebody can type their number.
 *
 * The serif lines use the platform's `Text` directly: the app's text component
 * always swaps in a Poppins face, and these two are meant to be the serif.
 */
export function AuthHero() {
  return (
    <View style={heroStyles.brand}>
      <EventlyIcon name="spa" size={34} color={AUTH_ACCENT} />
      <Text style={heroStyles.wordmark} accessibilityRole="header">
        {LOGIN_COPY.wordmark}
      </Text>
      <Text style={[heroStyles.title, heroStyles.titleGap]}>
        {LOGIN_COPY.title}
      </Text>
      <EventlyText variant="body" style={heroStyles.subtitle}>
        {LOGIN_COPY.subtitle}
      </EventlyText>
    </View>
  );
}

export default AuthHero;
