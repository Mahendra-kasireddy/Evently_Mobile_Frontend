import { useId } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useReducedMotion } from '../Motion';
import { useLoop } from './useLoop';

interface ThinkingOrbsProps {
  /** The whole cluster's width and height. */
  size?: number;
  colors: readonly [string, string, string];
  /** Read out in place of the animation. */
  label?: string;
}

/** Each orb's own phase in the pulse, so they breathe one after another. */
const PULSE: number[][] = [
  [0.82, 1.08, 0.9, 1.04, 0.82],
  [1.04, 0.82, 1.08, 0.9, 1.04],
  [0.9, 1.04, 0.82, 1.08, 0.9],
];

/**
 * Three soft lights circling each other — "we're working on it".
 *
 * Used only where something is genuinely being fetched or sent (Home's first
 * load, a brief going out), never as decoration. Each orb is a radial-gradient
 * disc that orbits and breathes on the native driver; under reduced motion
 * the cluster holds still and the label still says what is happening.
 */
export function ThinkingOrbs({
  size = 56,
  colors,
  label = 'Loading',
}: ThinkingOrbsProps) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const t = useLoop({
    duration: 2600,
    running: !reduced,
    easing: Easing.inOut(Easing.sin),
  });
  const orb = size * 0.62;
  const reach = size * 0.17;

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}
    >
      {colors.map((color, i) => {
        const gid = `orb${uid}${i}`;
        const dir = i === 1 ? -1 : 1;
        const start = i * 120;
        return (
          <Animated.View
            key={gid}
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                transform: [
                  {
                    rotate: t.interpolate({
                      inputRange: [0, 1],
                      outputRange: [`${start}deg`, `${start + dir * 360}deg`],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                s.orb,
                {
                  width: orb,
                  height: orb,
                  left: (size - orb) / 2 + reach,
                  top: (size - orb) / 2,
                  transform: [
                    {
                      scale: t.interpolate({
                        inputRange: [0, 0.25, 0.5, 0.75, 1],
                        outputRange: PULSE[i],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Svg width={orb} height={orb}>
                <Defs>
                  <RadialGradient id={gid} cx="50%" cy="50%" r="50%">
                    <Stop offset="0" stopColor={color} stopOpacity={0.95} />
                    <Stop offset="0.55" stopColor={color} stopOpacity={0.5} />
                    <Stop offset="1" stopColor={color} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Circle
                  cx={orb / 2}
                  cy={orb / 2}
                  r={orb / 2}
                  fill={`url(#${gid})`}
                />
              </Svg>
            </Animated.View>
          </Animated.View>
        );
      })}
      {/* A small bright core where the three meet. */}
      <View
        pointerEvents="none"
        style={[
          s.core,
          {
            width: size * 0.16,
            height: size * 0.16,
            borderRadius: size,
            left: size * 0.42,
            top: size * 0.42,
          },
        ]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  orb: { position: 'absolute', opacity: 0.9 },
  core: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.85)' },
});

export default ThinkingOrbs;
