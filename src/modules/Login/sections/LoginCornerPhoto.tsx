import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '../../../Components';
import { cornerStyles } from '../styles';

/** What Evently plans, one celebration at a time. */
const SLIDES = [
  { key: 'wedding', source: require('../../../assets/images/login_hero.jpg') },
  { key: 'birthday', source: require('../../../assets/images/login_hero_birthday.jpg') },
  { key: 'naming', source: require('../../../assets/images/login_hero_naming.jpg') },
  // Shared with Home's booked-event card — one file, not a second copy.
  { key: 'corporate', source: require('../../../assets/images/Corporate.jpeg') },
] as const;

/** How long each photo shows before the next fades in. */
const SLIDE_MS = 4000;
const FADE_MS = 700;

/**
 * A round window onto the events Evently plans, tucked into the top-right
 * corner and partly off the screen — a wedding, a birthday, a naming
 * ceremony, a corporate evening, cross-fading on their own.
 *
 * Cross-fade rather than a slide: the circle is a picture frame, not a
 * carousel to be swiped, so it never competes with the field below it. Purely
 * decorative — hidden from screen readers — and still with Reduce Motion on.
 */
export function LoginCornerPhoto() {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const indexRef = useRef(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = setInterval(() => {
      const current = indexRef.current;
      const next = (current + 1) % SLIDES.length;
      indexRef.current = next;
      setPrevious(current);
      setIndex(next);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  // Each new photo fades in over the one before it.
  useEffect(() => {
    if (previous === null) return;
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: FADE_MS, useNativeDriver: true }).start();
  }, [index, previous, fade]);

  return (
    <View
      style={[cornerStyles.ring, { top: insets.top - 80 }]}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={cornerStyles.circle}>
        {previous !== null ? (
          <Animated.Image source={SLIDES[previous].source} style={cornerStyles.image} resizeMode="cover" />
        ) : null}
        <Animated.Image
          key={SLIDES[index].key}
          source={SLIDES[index].source}
          style={[cornerStyles.image, { opacity: fade }]}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

export default LoginCornerPhoto;
