import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import {
  FadeInUp,
  RevealImage,
  useReducedMotion,
  AppText,
} from '../../../Components';
import { LOOPS_ENABLED } from '../../../Components/effects';
import { HOME_INK, greetingFor } from '../design';
import { homeHeroPhotoStyles as s } from '../styles';

/*
 * Bundled rather than fetched: this is the app's own artwork, not an
 * organizer's upload. A remote hero would leave the first screen of the app
 * blank on a cold start, which is the one moment it cannot afford to.
 */
/*
 * One photograph per kind of celebration, in turn — a single wedding couple
 * told every visitor this is a wedding app. Each slide brings its own line,
 * so the words change with the picture.
 */
const SLIDES = [
  {
    key: 'wedding',
    tag: 'Weddings',
    photo: require('../../../assets/images/MrandMrs.jpg'),
    lead: 'Make your big day',
    accent: 'unforgettable.',
  },
  {
    key: 'birthday',
    tag: 'Birthdays',
    photo: require('../../../assets/images/login_hero_birthday.jpg'),
    lead: 'Birthdays they’ll',
    accent: 'talk about for years.',
  },
  {
    key: 'naming',
    tag: 'Naming ceremonies',
    photo: require('../../../assets/images/login_hero_naming.jpg'),
    lead: 'Welcome your little one',
    accent: 'in style.',
  },
  {
    key: 'corporate',
    tag: 'Corporate events',
    photo: require('../../../assets/images/Corporate.jpeg'),
    lead: 'Events your team',
    accent: 'will remember.',
  },
] as const;

/** How long each slide stays before the next one fades in. */
const SLIDE_MS = 5000;
const FADE_MS = 900;

interface HomeHeroPhotoProps {
  /** The header, drawn over the photo. */
  children: ReactNode;
  /** The customer's name as the feed has it; only the first word is used. */
  displayName?: string;
}

/**
 * The top of Home: a photograph lit like a celebration at dusk, the header
 * floating on it, and one editorial line that says what the app is for.
 *
 * Built in layers, back to front: the photograph (developing in rather than
 * popping in — see RevealImage), a night scrim that is heavy only where type
 * sits, a warm marigold light from the top corner, then the words.
 *
 * The band is a fixed height and the content sheet below is pulled up over
 * its foot (HERO_PHOTO_OVERLAP), so the picture is always exactly at the top
 * and never shows through further down the feed.
 */
export function HomeHeroPhoto({
  children,
  displayName = '',
}: HomeHeroPhotoProps) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const first = displayName.trim().split(/\s+/)[0] ?? '';
  const greeting = first ? `${greetingFor()}, ${first}` : greetingFor();

  /*
   * `current` is what the words say; `fade` crossfades the next picture in
   * over it. One shared value, so picture and words always agree.
   */
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const words = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!LOOPS_ENABLED) return undefined;
    const t = setTimeout(() => {
      const upcoming = (current + 1) % SLIDES.length;
      if (reduced) {
        setCurrent(upcoming);
        return;
      }
      setNext(upcoming);
      fade.setValue(0);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: FADE_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        // The words dip out and back as the picture changes under them.
        Animated.sequence([
          Animated.timing(words, {
            toValue: 0,
            duration: FADE_MS / 2,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(words, {
            toValue: 1,
            duration: FADE_MS / 2,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      // Swap the words at the dip, the picture underneath at the end.
      setTimeout(() => setCurrent(upcoming), FADE_MS / 2);
      setTimeout(() => setNext(null), FADE_MS);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [current, reduced, fade, words]);

  const base =
    next === null ? current : (next + SLIDES.length - 1) % SLIDES.length;
  const slide = SLIDES[current];

  return (
    <View style={s.wrap}>
      <RevealImage
        key={SLIDES[base].key}
        source={SLIDES[base].photo}
        style={StyleSheet.absoluteFill}
        tint={HOME_INK.night}
        settle={base === 0}
      />
      {next !== null ? (
        <Animated.Image
          source={SLIDES[next].photo}
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: fade,
              transform: [
                {
                  scale: fade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.06, 1],
                  }),
                },
              ],
            },
          ]}
          resizeMode="cover"
        />
      ) : null}

      {/* Night above and below, clear in the middle: the photograph keeps its
          faces, the controls and the headline keep their contrast. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="heroNight" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={HOME_INK.night} stopOpacity={0.6} />
              <Stop
                offset="0.26"
                stopColor={HOME_INK.night}
                stopOpacity={0.06}
              />
              <Stop offset="0.4" stopColor={HOME_INK.night} stopOpacity={0.3} />
              <Stop
                offset="0.62"
                stopColor={HOME_INK.night}
                stopOpacity={0.72}
              />
              <Stop offset="1" stopColor={HOME_INK.night} stopOpacity={0.96} />
            </LinearGradient>
            <RadialGradient id="heroGlow" cx="88%" cy="6%" r="70%">
              <Stop offset="0" stopColor="#ffb85c" stopOpacity={0.42} />
              <Stop offset="0.45" stopColor="#f28b54" stopOpacity={0.12} />
              <Stop offset="1" stopColor="#f28b54" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill="url(#heroNight)" />
          <Rect x={0} y={0} width="100%" height="100%" fill="url(#heroGlow)" />
        </Svg>
      </View>

      <View style={[s.overlay, { paddingTop: insets.top }]}>
        {children}
        <FadeInUp delay={220} distance={10} style={s.copy}>
          <AppText variant="overline" style={s.eyebrow} numberOfLines={1}>
            {greeting}
          </AppText>
          <Animated.View
            style={{
              opacity: words,
              transform: [
                {
                  translateY: words.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, 0],
                  }),
                },
              ],
            }}
          >
            <AppText
              variant="display"
              style={s.headline}
              accessibilityRole="header"
            >
              {slide.lead}
              {'\n'}
              <AppText style={s.headlineAccent}>{slide.accent}</AppText>
            </AppText>
          </Animated.View>
        </FadeInUp>
      </View>
    </View>
  );
}

export default HomeHeroPhoto;
