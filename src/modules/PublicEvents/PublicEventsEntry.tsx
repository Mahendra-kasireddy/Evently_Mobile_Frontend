import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../navigation/types';
import { PublicEventsScreen } from './PublicEventsScreen';

const INTRO_IMAGE = require('../../assets/images/events_intro.jpg');

// Decode the poster before anyone taps Events, so the first intro has it.
const introUri = Image.resolveAssetSource(INTRO_IMAGE)?.uri;
if (introUri) Image.prefetch(introUri).catch(() => undefined);

/** The poster sits still, exactly as designed, for this long. */
const HOLD_MS = 450;
/** Then the push into the logo and the reveal of the list. */
const ZOOM_MS = 950;
/** How far the camera pushes in. */
const END_SCALE = 2.2;
/** The logo's centre in the artwork, as a share of its height (circle mark). */
const LOGO_Y = 0.38;
/** Start anyway if the image has not reported loaded by then. */
const LOAD_TIMEOUT_MS = 700;
/** The artwork's darkest tone, shown only if the image is still decoding. */
const BACKDROP = '#2b2a31';

type Nav = BottomTabNavigationProp<MainTabParamList, 'Events'>;

/**
 * The Events tab, entered through its poster.
 *
 * 1. The "MY EVENTS" poster fills the screen exactly as designed.
 * 2. The camera pushes into the logo — it grows in place, never drifts.
 * 3. The poster dissolves and the events list settles in from a slight zoom.
 *
 * Plays on the first visit and on every tap of the Events tab from another
 * tab (not when coming back from an event's detail page). A tap skips it;
 * Reduce Motion skips it entirely. Transform + opacity only, on the native
 * driver.
 */
export function PublicEventsEntry() {
  const navigation = useNavigation<Nav>();
  const { width, height } = useWindowDimensions();

  /** 0 → 1 over the zoom; the hold happens before it starts. */
  const zoom = useRef(new Animated.Value(0)).current;
  const anim = useRef<Animated.CompositeAnimation | null>(null);
  const pending = useRef(true);
  const imageLoaded = useRef(false);
  const wantsPlay = useRef(false);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [covering, setCovering] = useState(true);

  const finish = useCallback(() => {
    if (safety.current) clearTimeout(safety.current);
    safety.current = null;
    wantsPlay.current = false;
    setCovering(false);
  }, []);

  const tryStart = useCallback(
    (force = false) => {
      if (!wantsPlay.current) return;
      if (!imageLoaded.current && !force) return;
      wantsPlay.current = false;
      anim.current = Animated.sequence([
        Animated.delay(HOLD_MS),
        Animated.timing(zoom, {
          toValue: 1,
          duration: ZOOM_MS,
          // Eases out of the hold, long soft landing — iOS app-open feel.
          easing: Easing.bezier(0.55, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]);
      anim.current.start(({ finished }) => {
        if (finished) finish();
      });
      if (safety.current) clearTimeout(safety.current);
      safety.current = setTimeout(finish, HOLD_MS + ZOOM_MS + 600);
    },
    [zoom, finish],
  );

  // Tapping the tab from elsewhere queues the intro. The cover goes up here,
  // before the tab switches, so the list never flashes first.
  useEffect(
    () =>
      navigation.addListener('tabPress', () => {
        if (navigation.isFocused()) return;
        anim.current?.stop();
        zoom.setValue(0);
        pending.current = true;
        imageLoaded.current = false; // the poster remounts with the cover
        setCovering(true);
      }),
    [navigation, zoom],
  );

  useFocusEffect(
    useCallback(() => {
      if (!pending.current) return undefined;
      pending.current = false;
      let cancelled = false;
      let loadTimer: ReturnType<typeof setTimeout> | undefined;

      AccessibilityInfo.isReduceMotionEnabled()
        .catch(() => false)
        .then(reduce => {
          if (cancelled) return;
          if (reduce) {
            zoom.setValue(1);
            finish();
            return;
          }
          wantsPlay.current = true;
          tryStart();
          loadTimer = setTimeout(() => tryStart(true), LOAD_TIMEOUT_MS);
        });

      return () => {
        cancelled = true;
        if (loadTimer) clearTimeout(loadTimer);
        anim.current?.stop();
        // Still focused = React dev-mode's double-run of effects, not a real
        // blur. Re-arm so the second run plays the intro.
        if (navigation.isFocused()) {
          pending.current = true;
          wantsPlay.current = false;
          zoom.setValue(0);
          return;
        }
        zoom.setValue(1);
        finish();
      };
    }, [navigation, zoom, finish, tryStart]),
  );

  useEffect(
    () => () => {
      if (safety.current) clearTimeout(safety.current);
    },
    [],
  );

  const skip = () => {
    anim.current?.stop();
    anim.current = Animated.timing(zoom, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    anim.current.start(() => finish());
  };

  // --- Poster ---------------------------------------------------------------
  const scale = zoom.interpolate({
    inputRange: [0, 1],
    outputRange: [1, END_SCALE],
  });
  // Scaling happens around the screen centre; this shift keeps the logo
  // exactly where it is. Logo offset from centre d grows to d·s, so move by
  // d·(1 − s). It is linear in s, so a straight interpolation is exact.
  const logoFromCentre = (LOGO_Y - 0.5) * height;
  const shiftY = zoom.interpolate({
    inputRange: [0, 1],
    outputRange: [0, logoFromCentre * (1 - END_SCALE)],
  });
  const posterOpacity = zoom.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  // --- The list underneath ----------------------------------------------------
  const contentOpacity = zoom.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  const contentScale = zoom.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1.06, 1.06, 1],
    extrapolate: 'clamp',
  });

  const fullScreen = { position: 'absolute' as const, top: 0, left: 0, width, height };

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.root,
          { opacity: contentOpacity, transform: [{ scale: contentScale }] },
        ]}
      >
        <PublicEventsScreen />
      </Animated.View>

      {covering ? (
        <Pressable
          style={fullScreen}
          onPress={skip}
          accessibilityRole="button"
          accessibilityLabel="Skip intro"
        >
          <StatusBar barStyle="light-content" />
          {/* Fades with the poster, so the list shows through as it goes. */}
          <Animated.View
            pointerEvents="none"
            style={[fullScreen, styles.backdrop, { opacity: posterOpacity }]}
          />
          {/* Outer layer moves, inner layer scales — kept apart so the two
              never compound and the logo stays put. */}
          <Animated.View
            pointerEvents="none"
            style={[
              fullScreen,
              { opacity: posterOpacity, transform: [{ translateY: shiftY }] },
            ]}
          >
            <Animated.View style={[fullScreen, { transform: [{ scale }] }]}>
              <Image
                source={INTRO_IMAGE}
                style={{ width, height }}
                resizeMode="cover"
                fadeDuration={0}
                onError={e =>
                  console.warn('Events intro image failed', e.nativeEvent)
                }
                onLoad={() => {
                  imageLoaded.current = true;
                  tryStart();
                }}
              />
            </Animated.View>
          </Animated.View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdrop: { backgroundColor: BACKDROP },
});

export default PublicEventsEntry;
