import { useId, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type ImageResizeMode,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useReducedMotion } from '../Motion';
import { LOOPS_ENABLED, useLoop } from './useLoop';

interface RevealImageProps {
  source: ImageSourcePropType;
  /** The frame: size, radius. The image fills it. */
  style?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
  /** The colour the frame holds while the picture is on its way. */
  tint: string;
  /** Drawn instead of the picture if it fails to load. */
  fallback?: ReactNode;
  /** Slow drift after the reveal — for a hero, not for a thumbnail. */
  settle?: boolean;
}

/**
 * A photograph that develops rather than pops in.
 *
 * libraries.dev's Image Generation FX reveals a picture the way an image
 * model renders one. Here it does a job: while a remote photo is downloading
 * the frame shows a soft travelling light instead of an empty box or a
 * spinner, and when it lands a band of light passes down it as it sharpens
 * from a slight zoom. Native-driver opacity and transforms only. Reduced
 * motion gets a plain short fade.
 */
export function RevealImage({
  source,
  style,
  resizeMode = 'cover',
  tint,
  fallback = null,
  settle = false,
}: RevealImageProps) {
  const reduced = useReducedMotion();
  const id = `rv${useId().replace(/:/g, '')}`;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });
  /* Under Jest (and the review dumps) there is no load event to wait for:
     draw the settled picture. */
  const shown = useRef(new Animated.Value(LOOPS_ENABLED ? 0 : 1)).current;
  const scan = useRef(new Animated.Value(0)).current;
  const shimmer = useLoop({
    duration: 1500,
    running: !loaded && !failed && !reduced && box.w > 0,
  });

  const onLoad = () => {
    setLoaded(true);
    if (reduced || !LOOPS_ENABLED) {
      Animated.timing(shown, {
        toValue: 1,
        duration: reduced ? 180 : 0,
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.parallel([
      Animated.timing(shown, {
        toValue: 1,
        duration: settle ? 1400 : 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scan, {
        toValue: 1,
        duration: settle ? 1100 : 750,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const band = Math.max(60, box.h * 0.45);

  return (
    <View
      style={[s.frame, { backgroundColor: tint }, style]}
      onLayout={e =>
        setBox({
          w: e.nativeEvent.layout.width,
          h: e.nativeEvent.layout.height,
        })
      }
    >
      {failed ? (
        fallback
      ) : (
        <Animated.Image
          source={source}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onError={() => setFailed(true)}
          style={[
            s.fill,
            {
              opacity: shown,
              transform: [
                {
                  scale: shown.interpolate({
                    inputRange: [0, 1],
                    outputRange: [settle ? 1.1 : 1.05, 1],
                  }),
                },
              ],
            },
          ]}
        />
      )}

      {/* Waiting: a soft light travels across the empty frame. */}
      {!loaded && !failed && box.w > 0 && !reduced ? (
        <Animated.View
          pointerEvents="none"
          style={[
            s.shimmer,
            {
              width: box.w * 0.6,
              transform: [
                {
                  translateX: shimmer.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-box.w * 0.6, box.w],
                  }),
                },
              ],
            },
          ]}
        >
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#ffffff" stopOpacity={0} />
                <Stop offset="0.5" stopColor="#ffffff" stopOpacity={0.28} />
                <Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${id}s)`} />
          </Svg>
        </Animated.View>
      ) : null}

      {/* Landed: one band of light passes down as it sharpens. */}
      {loaded && box.h > 0 && !reduced ? (
        <Animated.View
          pointerEvents="none"
          style={[
            s.scan,
            {
              height: band,
              opacity: scan.interpolate({
                inputRange: [0, 0.15, 0.85, 1],
                outputRange: [0, 1, 1, 0],
              }),
              transform: [
                {
                  translateY: scan.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-band, box.h],
                  }),
                },
              ],
            },
          ]}
        >
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#fff4dc" stopOpacity={0} />
                <Stop offset="0.6" stopColor="#fff4dc" stopOpacity={0.32} />
                <Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${id}b)`} />
          </Svg>
        </Animated.View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  frame: { overflow: 'hidden' },
  fill: { width: '100%', height: '100%' },
  shimmer: { position: 'absolute', top: 0, bottom: 0, left: 0 },
  scan: { position: 'absolute', left: 0, right: 0, top: 0 },
});

export default RevealImage;
