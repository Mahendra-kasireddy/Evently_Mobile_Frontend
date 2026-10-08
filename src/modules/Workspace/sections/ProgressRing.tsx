import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useReducedMotion } from '../../../Components';
import { ringStyles } from '../premium.styles';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  /** 0–100. */
  percent: number;
  size: number;
  stroke: number;
  /** The filled arc's gradient. */
  colors: readonly [string, string];
  /** The unfilled track. */
  trackColor: string;
  children?: ReactNode;
}

/**
 * A ring that fills to a percentage, drawing itself in when it appears.
 *
 * Used for the countdown and the three stats: a number you can read and a
 * shape you can take in at a glance, which a bar of text cannot be. The arc
 * sweeps in once on mount (and on any change), and simply sits at its value
 * with Reduce Motion on.
 */
export function ProgressRing({ percent, size, stroke, colors, trackColor, children }: ProgressRingProps) {
  const id = `ring${useId().replace(/:/g, '')}`;
  const reduceMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useRef(new Animated.Value(reduceMotion ? clamped : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(clamped);
      return undefined;
    }
    const anim = Animated.timing(progress, {
      toValue: clamped,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [clamped, reduceMotion, progress]);

  const dashOffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[ringStyles.box, { width: size, height: size }]}>
      <Svg width={size} height={size} style={ringStyles.svg}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
        />
      </Svg>
      {children}
    </View>
  );
}

export default ProgressRing;
