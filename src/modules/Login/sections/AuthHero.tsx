import { Image, Text, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { LOGIN_COPY } from '../constants';
import { AUTH_ACCENT, heroStyles } from '../styles';

const LOGO_MARK = require('../../../assets/images/logo_mark.png');

/**
 * The sign-in step's heading: the app's mark beside the wordmark, a lotus
 * between two rules, then the greeting and one line saying what this screen
 * is for.
 *
 * The greeting uses the platform's `Text` directly: the app's text component
 * always swaps in a Poppins face, and this line is meant to be the serif. The
 * wordmark wants Poppins, so it goes through the app's component.
 */
export function AuthHero() {
  return (
    <View style={heroStyles.brand}>
      <View style={heroStyles.logoRow} accessible accessibilityRole="header" accessibilityLabel={LOGIN_COPY.wordmark}>
        <Image source={LOGO_MARK} style={heroStyles.logoMark} resizeMode="contain" />
        <EventlyText style={heroStyles.wordmark}>{LOGIN_COPY.wordmark}</EventlyText>
      </View>

      <View style={heroStyles.divider} importantForAccessibility="no-hide-descendants">
        <View style={heroStyles.rule} />
        <EventlyIcon name="spa" size={20} color={AUTH_ACCENT} />
        <View style={heroStyles.rule} />
      </View>

      <Text style={heroStyles.title}>{LOGIN_COPY.title}</Text>
      <EventlyText variant="body" style={heroStyles.subtitle}>
        {LOGIN_COPY.subtitle}
      </EventlyText>
    </View>
  );
}

export default AuthHero;
