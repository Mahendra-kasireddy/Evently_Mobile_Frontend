import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { EventlyText } from '../../../Components';
import { LOGIN_BG, LOGIN_TAGLINE } from '../constants';
import { promoStyles, WAVE_HEIGHT } from '../styles';

/** Minimal brand header: wordmark + one-line tagline. No badge/features/proof — kept
 * deliberately light. Ends in an organic wave cut (drawn in the page background
 * color) instead of a hard rectangular edge, so it doesn't read as a boxed card. */
export function LoginPromo() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View style={[promoStyles.band, { opacity, transform: [{ translateY }] }]}>
      <View style={promoStyles.decorCircle} pointerEvents="none" />
      <Animated.View style={promoStyles.wordmarkRow}>
        <EventlyText style={promoStyles.wordmarkAccent}>e</EventlyText>
        <EventlyText style={promoStyles.wordmark}>vently</EventlyText>
      </Animated.View>
      <EventlyText variant="body" style={promoStyles.tagline}>
        {LOGIN_TAGLINE}
      </EventlyText>

      <Svg
        style={promoStyles.wave}
        width="100%"
        height={WAVE_HEIGHT + 1}
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        pointerEvents="none"
      >
        <Path d="M0,11 C 25,20 75,2 100,11 L100,20 L0,20 Z" fill={LOGIN_BG} />
      </Svg>
    </Animated.View>
  );
}

export default LoginPromo;
