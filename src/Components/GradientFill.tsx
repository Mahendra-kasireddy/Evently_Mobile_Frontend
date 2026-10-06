import { useId } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface GradientFillProps {
  /** From, to. Two stops is all any surface in this app uses. */
  colors: readonly [string, string];
  /**
   * Which way it runs. 'across' is left to right, 'down' is top to bottom,
   * 'diagonal' is the corner-to-corner sweep a tile reads best in.
   */
  direction?: 'across' | 'down' | 'diagonal';
  /**
   * Opacity at each end, for a gradient that fades to see-through (a scrim
   * over a photo). Use this rather than rgba colours: SVG stops do not
   * reliably honour an rgba alpha, and draw the colour solid instead.
   */
  opacities?: readonly [number, number];
  /** Laid over the parent, so the parent's radius clips it. */
  style?: StyleProp<ViewStyle>;
}

const ENDS: Record<string, { x2: string; y2: string }> = {
  across: { x2: '100%', y2: '0%' },
  down: { x2: '0%', y2: '100%' },
  diagonal: { x2: '100%', y2: '100%' },
};

/**
 * A gradient behind whatever it is dropped into.
 *
 * Absolutely positioned and `pointerEvents="none"`, so it fills its parent and
 * never eats a tap meant for the thing on top of it. The parent needs
 * `overflow: 'hidden'` for its own corner radius to clip this.
 *
 * One component rather than the block of Svg/Defs/LinearGradient/Rect that was
 * being written out at every call site — five copies of it before this, each
 * with its own hand-picked gradient id. `useId` is what makes that safe: two
 * gradients with the same id on one screen are one gradient, and the second
 * silently takes the first's colours.
 */
export function GradientFill({
  colors,
  direction = 'diagonal',
  opacities = [1, 1],
  style,
}: GradientFillProps) {
  const id = `g${useId().replace(/:/g, '')}`;
  const end = ENDS[direction] ?? ENDS.diagonal;

  return (
    <View
      style={[{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }, style]}
      pointerEvents="none"
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0%" y1="0%" x2={end.x2} y2={end.y2}>
            <Stop offset="0" stopColor={colors[0]} stopOpacity={opacities[0]} />
            <Stop offset="1" stopColor={colors[1]} stopOpacity={opacities[1]} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={100} height={100} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

export default GradientFill;
