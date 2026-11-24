import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppText } from '../../../Components';
import { RING_FILL, RING_TRACK } from '../design';
import { heroStyles as s } from '../styles';

/** A ring that fills to `percent`, the number in its middle. */
export function ProgressRing({
  percent,
  label,
  size = 96,
  stroke = 9,
}: {
  percent: number;
  label: string;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View
      style={[s.ring, { width: size, height: size }]}
      accessible
      accessibilityLabel={`${percent}% ${label}`}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={RING_TRACK}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={RING_FILL}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - percent / 100)}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={s.ringCenter}>
        <AppText variant="h2" style={s.ringValue}>
          {`${percent}%`}
        </AppText>
        <AppText variant="label" style={s.ringLabel}>
          {label}
        </AppText>
      </View>
    </View>
  );
}

export default ProgressRing;
