import { useId, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon } from '../EventlyIcon';
import { AppText } from '../AppText';
import { useReducedMotion } from '../Motion';
import { useLoop } from './useLoop';

import { typography } from '../../theme';
export type MetalTone = 'gold' | 'platinum' | 'silver';

/** Each metal as a run of highlights and shadows, left to right. */
const METAL: Record<MetalTone, { stops: string[]; ink: string; edge: string }> =
  {
    gold: {
      stops: ['#fff2c2', '#e8c063', '#b5852a', '#f5d98a', '#9a7222'],
      ink: '#3b2a06',
      edge: 'rgba(122,88,20,0.45)',
    },
    platinum: {
      stops: ['#f7f4ff', '#cfc7ee', '#958bc2', '#ece7ff', '#7f75ad'],
      ink: '#2a2346',
      edge: 'rgba(90,80,140,0.4)',
    },
    silver: {
      stops: ['#ffffff', '#dadde3', '#9ea5b1', '#f0f2f5', '#8a919d'],
      ink: '#2c3138',
      edge: 'rgba(80,88,100,0.35)',
    },
  };

interface MetalBadgeProps {
  label: string;
  tone: MetalTone;
  icon?: string;
}

/**
 * A small badge in polished metal, with a highlight that crosses it now and
 * then — Home's restrained take on libraries.dev's Metal FX.
 *
 * The web original is a WebGL liquid-metal shader; on a phone in a scrolling
 * carousel that is a GPU context per card. This is a five-stop SVG gradient
 * for the metal and one translucent band sliding over it on the native
 * driver, once every few seconds. It is only ever given to an organizer's
 * earned tier, so the shine means something.
 */
export function MetalBadge({ label, tone, icon = 'medal' }: MetalBadgeProps) {
  const reduced = useReducedMotion();
  const id = `metal${useId().replace(/:/g, '')}`;
  const [w, setW] = useState(0);
  const sweep = useLoop({
    duration: 1100,
    pause: 3800,
    running: !reduced && w > 0,
    easing: Easing.inOut(Easing.quad),
  });
  const metal = METAL[tone];
  const step = 1 / (metal.stops.length - 1);

  return (
    <View
      style={[s.badge, { borderColor: metal.edge }]}
      onLayout={e => setW(e.nativeEvent.layout.width)}
      accessibilityRole="text"
      accessibilityLabel={`${label} organizer`}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              {metal.stops.map((c, i) => (
                <Stop key={`${c}${i}`} offset={i * step} stopColor={c} />
              ))}
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${id})`} />
        </Svg>
      </View>
      {w > 0 && !reduced ? (
        <Animated.View
          pointerEvents="none"
          style={[
            s.sheen,
            {
              transform: [
                {
                  translateX: sweep.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-28, w + 8],
                  }),
                },
                { rotate: '18deg' },
              ],
            },
          ]}
        />
      ) : null}
      <EventlyIcon name={icon} size={11} color={metal.ink} />
      <AppText variant="label" style={[s.text, { color: metal.ink }]}>
        {label}
      </AppText>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    height: 20,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    top: -8,
    left: 0,
    width: 14,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  text: {
    ...typography.label,
  },
});

export default MetalBadge;
