import Svg, { Circle, Rect } from 'react-native-svg';

// Ported verbatim from the web app's shared/reusable/OccasionArt/Confetti.tsx —
// same coordinates/colors, just RN SVG element names.
const SPECKS: Array<[number, number, string]> = [
  [22, 44, '#e8633a'],
  [44, 30, '#ffffff'],
  [150, 48, '#1d9e75'],
  [166, 92, '#f4d35e'],
  [30, 120, '#f4d35e'],
  [160, 150, '#ffffff'],
  [48, 205, '#e8633a'],
  [140, 212, '#1d9e75'],
  [26, 172, '#ffffff'],
  [172, 182, '#e8633a'],
  [62, 70, '#1d9e75'],
  [120, 40, '#f4d35e'],
  [92, 222, '#ffffff'],
  [112, 150, '#e8633a'],
  [78, 188, '#f4d35e'],
  [136, 110, '#ffffff'],
];

interface ConfettiProps {
  width?: number | string;
  height?: number | string;
}

export function Confetti({ width = '100%', height = '100%' }: ConfettiProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 188 250" preserveAspectRatio="xMidYMid slice">
      {SPECKS.map(([x, y, c], i) =>
        i % 2 === 0 ? (
          <Rect
            key={i}
            x={x}
            y={y}
            width={4}
            height={4}
            rx={1}
            fill={c}
            opacity={0.4}
            transform={`rotate(${i * 28} ${x} ${y})`}
          />
        ) : (
          <Circle key={i} cx={x} cy={y} r={2} fill={c} opacity={0.5} />
        ),
      )}
    </Svg>
  );
}

export default Confetti;
