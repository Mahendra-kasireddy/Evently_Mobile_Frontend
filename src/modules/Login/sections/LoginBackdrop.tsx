import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Ellipse, G, Path, Rect } from 'react-native-svg';

/** Soft shapes, one sprig and a few streamers of confetti — all decoration. */
const PEACH = '#fde3d4';
const PEACH_DEEP = '#f8cdb5';
const LAVENDER = '#ece6fb';
const CONFETTI = { violet: '#a58bf2', orange: '#f59a6a', yellow: '#f7c35a' };

/**
 * The page behind sign-in: warm blobs in three corners, a leaf sprig bottom
 * left, a scatter of confetti near the top.
 *
 * Drawn, not a picture: it scales to any screen without blurring and costs
 * nothing to download. Absolutely positioned behind everything and blind to
 * touches, so it can never get in the way of the field or the button.
 */
export function LoginBackdrop() {
  const { width: w, height: h } = useWindowDimensions();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={w} height={h}>
        {/* Top-left blob */}
        <Path
          d={`M0 0 H${w * 0.42} C${w * 0.36} ${h * 0.05} ${w * 0.22} ${h * 0.11} ${w * 0.08} ${h * 0.12} C${w * 0.03} ${h * 0.125} 0 ${h * 0.12} 0 ${h * 0.12} Z`}
          fill={PEACH}
          opacity={0.7}
        />
        {/* Bottom-left blob */}
        <Path
          d={`M0 ${h * 0.8} C${w * 0.16} ${h * 0.78} ${w * 0.36} ${h * 0.86} ${w * 0.46} ${h} H0 Z`}
          fill={PEACH}
          opacity={0.75}
        />
        {/* Bottom-right blob */}
        <Path
          d={`M${w} ${h * 0.78} C${w * 0.82} ${h * 0.8} ${w * 0.64} ${h * 0.9} ${w * 0.58} ${h} H${w} Z`}
          fill={LAVENDER}
        />

        {/* Leaf sprig, bottom left */}
        <G transform={`translate(${w * 0.07} ${h * 0.86}) rotate(-12)`} opacity={0.9}>
          <Path d="M0 70 C6 46 12 24 22 0" stroke={PEACH_DEEP} strokeWidth={2.5} fill="none" />
          <Ellipse cx={22} cy={4} rx={6} ry={13} fill={PEACH_DEEP} />
          <Ellipse cx={8} cy={22} rx={6} ry={13} fill={PEACH_DEEP} transform="rotate(-38 8 22)" />
          <Ellipse cx={26} cy={30} rx={6} ry={13} fill={PEACH_DEEP} transform="rotate(42 26 30)" />
          <Ellipse cx={2} cy={44} rx={6} ry={12} fill={PEACH_DEEP} transform="rotate(-42 2 44)" />
          <Ellipse cx={20} cy={52} rx={6} ry={12} fill={PEACH_DEEP} transform="rotate(46 20 52)" />
        </G>

        {/* Confetti */}
        <Rect x={w * 0.06} y={h * 0.15} width={18} height={6} rx={3} fill={CONFETTI.violet} transform={`rotate(18 ${w * 0.06} ${h * 0.15})`} />
        <Rect x={w * 0.19} y={h * 0.125} width={14} height={6} rx={3} fill={CONFETTI.orange} transform={`rotate(58 ${w * 0.19} ${h * 0.125})`} />
        <Rect x={w * 0.25} y={h * 0.1} width={8} height={8} rx={4} fill={CONFETTI.yellow} />
        <Rect x={w * 0.82} y={h * 0.255} width={10} height={6} rx={3} fill={CONFETTI.yellow} transform={`rotate(40 ${w * 0.82} ${h * 0.255})`} />
        <Rect x={w * 0.86} y={h * 0.28} width={18} height={6} rx={3} fill={CONFETTI.violet} transform={`rotate(-18 ${w * 0.86} ${h * 0.28})`} />
      </Svg>
    </View>
  );
}

export default LoginBackdrop;
