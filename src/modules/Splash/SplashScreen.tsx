import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, View } from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  GradientFill,
  useReducedMotion,
} from '../../Components';
import {
  SPLASH_BG,
  SPLASH_MIN_MS,
  SPLASH_TAGLINE,
  SPLASH_WORDMARK,
} from './constants';
import { styles } from './styles';

const LOGO = require('../../assets/images/logo_mark.png');
const FRIENDS = require('../../assets/images/splash_friends.png');

interface SplashScreenProps {
  /** Called once the intro has played, so the app can move on. */
  onDone?: () => void;
}

/**
 * Shown at cold start while auth/onboarding state hydrates from disk. No data,
 * no navigation of its own: the mark pops in, the name and tagline rise after
 * it, and the friends slide up from the bottom. Then `onDone`.
 */
export function SplashScreen({ onDone }: SplashScreenProps) {
  const reduced = useReducedMotion();
  const logo = useRef(new Animated.Value(0)).current;
  const word = useRef(new Animated.Value(0)).current;
  const tag = useRef(new Animated.Value(0)).current;
  const art = useRef(new Animated.Value(0)).current;
  const twinkle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rise = (v: Animated.Value, delay: number, duration = 520) =>
      Animated.timing(v, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
    const intro = Animated.parallel([
      Animated.spring(logo, {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }),
      rise(word, 280),
      rise(tag, 520),
      rise(art, 380, 820),
    ]);
    const sparkle = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(twinkle, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    if (reduced) {
      [logo, word, tag, art].forEach(v => v.setValue(1));
    } else {
      intro.start();
      sparkle.start();
    }
    const timer = setTimeout(() => onDone?.(), SPLASH_MIN_MS);
    return () => {
      clearTimeout(timer);
      intro.stop();
      sparkle.stop();
    };
  }, [reduced, logo, word, tag, art, twinkle, onDone]);

  const up = (v: Animated.Value, by: number) => ({
    opacity: v,
    transform: [
      {
        translateY: v.interpolate({ inputRange: [0, 1], outputRange: [by, 0] }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: logo,
              transform: [
                {
                  scale: logo.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={[styles.wordRow, up(word, 14)]}>
          <EventlyText style={styles.wordmark}>{SPLASH_WORDMARK}</EventlyText>
          {/* Little bursts over the end of the name. */}
          <Animated.View
            style={[
              styles.sparks,
              {
                opacity: twinkle.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.65, 1],
                }),
              },
            ]}
            pointerEvents="none"
          >
            <View style={styles.spark1}>
              <EventlyIcon name="star-four-points" size={14} color="#f5b942" />
            </View>
            <View style={styles.spark2}>
              <EventlyIcon name="star-four-points" size={10} color="#ff5f8f" />
            </View>
            <View style={styles.spark3}>
              <EventlyIcon name="star-four-points" size={9} color="#7b5cff" />
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View style={up(tag, 10)}>
          <EventlyText style={styles.tagline}>{SPLASH_TAGLINE}</EventlyText>
        </Animated.View>
      </View>

      <Animated.View style={[styles.artWrap, up(art, 60)]} pointerEvents="none">
        <Image source={FRIENDS} style={styles.art} resizeMode="cover" />
        {/* The photo's dark top fades into the page. */}
        <View style={styles.artFade}>
          <GradientFill
            colors={[SPLASH_BG, SPLASH_BG]}
            direction="down"
            opacities={[1, 0]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

export default SplashScreen;
