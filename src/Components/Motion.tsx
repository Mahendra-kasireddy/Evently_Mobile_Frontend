import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

/**
 * The app's motion, in two pieces: things arriving, and things being pressed.
 *
 * Both are quiet on purpose — a short rise and fade, a slight squeeze — and
 * both stand down when the phone asks for less motion. Everything runs on the
 * native driver, so neither costs the JavaScript thread a frame.
 */

/** True when the person has asked the OS for reduced motion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(on => {
        if (alive) setReduced(on);
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      setReduced,
    );
    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

/** Above this, a long list's later items arrive together rather than one by one. */
const MAX_STAGGER_MS = 360;

interface FadeInUpProps {
  children: ReactNode;
  /** Wait before starting, for a stagger. Capped so a long list is not slow. */
  delay?: number;
  /** How far it rises, in points. */
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Content that rises gently into place when it first mounts.
 *
 * Mount-only: it does not re-run on re-render, so a list that refreshes does
 * not replay its entrance.
 */
export function FadeInUp({
  children,
  delay = 0,
  distance = 14,
  duration = 380,
  style,
}: FadeInUpProps) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay: Math.min(delay, MAX_STAGGER_MS),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
    // Mount-only, by design — see above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reduced) return <Animated.View style={style}>{children}</Animated.View>;

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  /** The card's own look — applied to the part that scales. */
  style?: StyleProp<ViewStyle>;
  /** Layout for the touch area itself, e.g. `flex: 1` to fill a parent. */
  containerStyle?: StyleProp<ViewStyle>;
  /** How far it squeezes while held. */
  scaleTo?: number;
}

/**
 * A card that gives under the finger: a slight squeeze on press, a spring back
 * on release. Every Pressable prop passes straight through, so roles, labels
 * and handlers work exactly as on the Pressable it wraps.
 */
export function PressableScale({
  children,
  style,
  containerStyle,
  scaleTo = 0.97,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;

  const to = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      friction: 6,
      tension: 180,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable
      {...rest}
      style={containerStyle}
      onPressIn={e => {
        if (!reduced) to(scaleTo);
        onPressIn?.(e);
      }}
      onPressOut={e => {
        if (!reduced) to(1);
        onPressOut?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

/**
 * A pop: from small to full size with a little overshoot. For the one moment
 * on a screen that should land — a success tick, a badge appearing.
 */
export function PopIn({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(reduced ? 1 : 0.4)).current;
  const opacity = useRef(new Animated.Value(reduced ? 1 : 0)).current;

  useEffect(() => {
    if (reduced) return undefined;
    const anim = Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        delay,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}
