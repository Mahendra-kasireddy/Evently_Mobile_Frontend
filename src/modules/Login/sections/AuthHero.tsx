import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { brand, spacing } from '../../../theme';
import { LOGIN_TAGLINE, LOGIN_TRUST_CHIPS } from '../constants';
import { heroStyles } from '../styles';

interface AuthHeroProps {
  /** The status bar's height. Padding rather than a spacer above, so the navy
   * runs behind the clock and battery instead of starting below them. */
  topInset: number;
}

/**
 * The navy block the sign-in screen opens with: wordmark, one line of promise,
 * three chips. No illustration and no carousel — this screen is on the critical
 * path to using the app, and anything that has to load first delays it.
 */
export function AuthHero({ topInset }: AuthHeroProps) {
  return (
    <View style={[heroStyles.hero, { paddingTop: topInset + spacing.md }]}>
      <View style={heroStyles.glow} pointerEvents="none" />

      <View style={heroStyles.brandRow}>
        <View style={heroStyles.logoTile}>
          <EventlyIcon
            name="star-four-points"
            size={18}
            color={brand.onAccent}
          />
        </View>
        <EventlyText style={heroStyles.wordmark}>Evently</EventlyText>
      </View>

      <EventlyText variant="body" style={heroStyles.tagline}>
        {LOGIN_TAGLINE}
      </EventlyText>

      <View style={heroStyles.chipRow}>
        {LOGIN_TRUST_CHIPS.map(chip => (
          <View key={chip} style={heroStyles.chip}>
            <View style={heroStyles.chipDot} />
            <EventlyText style={heroStyles.chipText}>{chip}</EventlyText>
          </View>
        ))}
      </View>
    </View>
  );
}

export default AuthHero;
