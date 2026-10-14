import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useReducedMotion } from '../Motion';
import { GradientFill } from '../GradientFill';
import { LOOPS_ENABLED, useLoop } from './useLoop';

interface BorderBeamProps {
  children: ReactNode;
  /** Beam on. Off, the border rests as a plain hairline. */
  active: boolean;
  /** The card's corner radius. */
  radius: number;
  /** Width of the border the beam travels in. */
  width?: number;
  /** Head first: the brightest colour leads, the rest trail behind it. */
  colors: readonly string[];
  /** The hairline under the beam. */
  baseColor: string;
  /** The card itself, inside the border. */
  fill: string;
  /** One lap, in ms. */
  duration?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

/** Half the wedge's opening angle, in radians — about 70° of light. */
const HALF = (35 * Math.PI) / 180;

/**
 * A ray of light that travels round a card's edge.
 *
 * libraries.dev's Border Beam animates a CSS conic gradient, which React
 * Native cannot draw. This is the native equivalent: a wedge of gradient,
 * pointing out from the card's centre, turns under a card inset by the border
 * width — so only the ring of border shows it, and the light appears to run
 * along the edge. One rotating view on the native driver: no per-frame SVG,
 * no JS work while it runs.
 *
 * Under reduced motion it holds still as a gradient border.
 */
export function BorderBeam({
  children,
  active,
  radius,
  width = 1.5,
  colors,
  baseColor,
  fill,
  duration = 4200,
  style,
  contentStyle,
}: BorderBeamProps) {
  const reduced = useReducedMotion();
  const id = `beam${useId().replace(/:/g, '')}`;
  const [size, setSize] = useState({ w: 0, h: 0 });
  const turn = useLoop({ duration, running: active && !reduced });
  const shown = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    if (!LOOPS_ENABLED) {
      shown.setValue(active ? 1 : 0);
      return;
    }
    Animated.timing(shown, {
      toValue: active ? 1 : 0,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [active, shown]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    if (Math.abs(w - size.w) > 0.5 || Math.abs(h - size.h) > 0.5) {
      setSize({ w, h });
    }
  };

  // The wedge has to reach every corner from the centre, whatever it turns to.
  const D = Math.ceil(Math.hypot(size.w, size.h)) + 4;
  const c = D / 2;
  const tip = (a: number) =>
    `${(c + c * Math.cos(a)).toFixed(1)} ${(c + c * Math.sin(a)).toFixed(1)}`;
  const wedge = `M ${c} ${c} L ${tip(-HALF)} A ${c} ${c} 0 0 1 ${tip(HALF)} Z`;
  const step = colors.length > 1 ? 0.5 / (colors.length - 1) : 0;

  return (
    /* The halo lives on an unclipped outer view — iOS clips a shadow to the
       same view's overflow. */
    <View style={[{ borderRadius: radius }, active && s.glow, style]}>
      <View
        onLayout={onLayout}
        style={[
          { borderRadius: radius, padding: width, backgroundColor: baseColor },
          s.clip,
        ]}
      >
        {size.w > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { opacity: shown }]}
          >
            {reduced ? (
              <GradientFill
                colors={[colors[0], colors[colors.length - 1]]}
                direction="diagonal"
              />
            ) : (
              <Animated.View
                style={[
                  s.spinner,
                  {
                    width: D,
                    height: D,
                    left: (size.w - D) / 2,
                    top: (size.h - D) / 2,
                    transform: [
                      {
                        rotate: turn.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Svg width={D} height={D}>
                  <Defs>
                    {/* Down the wedge: the tail (top) fades out, the head
                      (bottom, the side it is turning towards) is brightest. */}
                    <LinearGradient
                      id={id}
                      x1={c}
                      y1={c - c * Math.sin(HALF)}
                      x2={c}
                      y2={c + c * Math.sin(HALF)}
                      gradientUnits="userSpaceOnUse"
                    >
                      {[
                        <Stop
                          key="tail"
                          offset="0"
                          stopColor={colors[colors.length - 1]}
                          stopOpacity={0}
                        />,
                        ...[...colors]
                          .reverse()
                          .map((color, i) => (
                            <Stop
                              key={`${color}${i}`}
                              offset={0.5 + i * step}
                              stopColor={color}
                              stopOpacity={
                                0.35 + (0.65 * (i + 1)) / colors.length
                              }
                            />
                          )),
                      ]}
                    </LinearGradient>
                  </Defs>
                  <Path d={wedge} fill={`url(#${id})`} />
                </Svg>
              </Animated.View>
            )}
          </Animated.View>
        ) : null}

        <View
          style={[
            {
              borderRadius: Math.max(0, radius - width),
              backgroundColor: fill,
            },
            s.clip,
            contentStyle,
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  spinner: { position: 'absolute' },
  clip: { overflow: 'hidden' },
  /* A warm halo on iOS. Android elevation cannot be tinted, so it relies on
     the beam alone there rather than drawing a grey shadow under a light. */
  glow: Platform.select({
    ios: {
      backgroundColor: '#ffffff',
      shadowColor: '#f28b54',
      shadowOpacity: 0.28,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
    },
    default: {},
  }) as ViewStyle,
});

export default BorderBeam;
