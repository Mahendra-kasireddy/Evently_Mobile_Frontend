import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

// Ported verbatim from the web app's shared/reusable/OccasionArt/OccasionArt.tsx —
// same viewBoxes/coordinates/gradient stops/colors per occasion, just RN SVG element names.
export type OccasionArtKey = 'wedding' | 'birthday' | 'housewarming' | 'naming' | 'anniversary' | 'corporate';

const FLOWER_PETALS: Array<[number, number]> = [
  [0, -3.3],
  [3.1, -1],
  [1.95, 2.7],
  [-1.95, 2.7],
  [-3.1, -1],
];

function Flower({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {FLOWER_PETALS.map(([px, py], i) => (
        <Circle key={i} cx={px} cy={py} r={2.5} fill={c} />
      ))}
      <Circle r={1.7} fill="#ffd24a" />
    </G>
  );
}

function Sparkle({ x, y, r = 3 }: { x: number; y: number; r?: number }) {
  const d = `M${x} ${y - r} L${x + r * 0.32} ${y - r * 0.32} L${x + r} ${y} L${x + r * 0.32} ${y + r * 0.32} L${x} ${y + r} L${x - r * 0.32} ${y + r * 0.32} L${x - r} ${y} L${x - r * 0.32} ${y - r * 0.32} Z`;
  return <Path d={d} fill="#fff" opacity={0.85} />;
}

interface OccasionArtProps {
  art: OccasionArtKey;
  width?: number | string;
  height?: number | string;
}

export function OccasionArt({ art, width = '100%', height = '100%' }: OccasionArtProps) {
  switch (art) {
    case 'wedding': {
      const flowers: Array<[number, number, string, number]> = [
        [18, 92, '#f4a6c0', 1],
        [20, 75, '#ffffff', 1.05],
        [26, 60, '#f4d35e', 1],
        [36, 49, '#7bc4a4', 1.05],
        [48, 43, '#e8633a', 1],
        [60, 41, '#ffffff', 1.1],
        [72, 43, '#f4a6c0', 1],
        [84, 49, '#f4d35e', 1.05],
        [94, 60, '#7bc4a4', 1],
        [100, 75, '#e8633a', 1.05],
        [102, 92, '#ffffff', 1],
      ];
      return (
        <Svg width={width} height={height} viewBox="0 0 120 100">
          <Defs>
            <RadialGradient id="wedGlow" cx="50%" cy="45%" r="55%">
              <Stop offset="0%" stopColor="#ffd9e4" stopOpacity={0.22} />
              <Stop offset="100%" stopColor="#ffd9e4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={60} cy={64} rx={52} ry={40} fill="url(#wedGlow)" />
          <Path d="M18 92 A46 50 0 0 1 102 92" stroke="rgba(255,255,255,0.14)" strokeWidth={2} fill="none" />
          {flowers.map(([x, y, c, s], i) => (
            <Flower key={i} x={x} y={y} c={c} s={s} />
          ))}
        </Svg>
      );
    }
    case 'birthday': {
      const balloons: Array<[number, number, string]> = [
        [30, 33, '#e8633a'],
        [47, 24, '#ffffff'],
        [64, 27, '#f4d35e'],
        [82, 33, '#7bc4a4'],
        [56, 39, '#d23b46'],
      ];
      return (
        <Svg width={width} height={height} viewBox="0 0 120 100">
          <Defs>
            <RadialGradient id="balHi" cx="36%" cy="28%" r="75%">
              <Stop offset="0%" stopColor="#fff" stopOpacity={0.6} />
              <Stop offset="45%" stopColor="#fff" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          {balloons.map(([x, y, c], i) => (
            <G key={i}>
              <Line x1={x} y1={y + 13} x2={57} y2={74} stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
              <Ellipse cx={x} cy={y} rx={8.6} ry={11} fill={c} />
              <Ellipse cx={x} cy={y} rx={8.6} ry={11} fill="url(#balHi)" />
              <Path d={`M${x} ${y + 11} l-2 3 h4 z`} fill={c} />
            </G>
          ))}
          <Rect x={45} y={74} width={27} height={16} rx={2} fill="#e8633a" />
          <Rect x={45} y={74} width={27} height={5.5} rx={2} fill="#f4d35e" />
          <Rect x={56} y={74} width={5} height={16} fill="#f4d35e" />
          <Path d="M55 74 q3.5 -7 3.5 0 q0 -7 3.5 0" fill="none" stroke="#f4d35e" strokeWidth={1.6} />
        </Svg>
      );
    }
    case 'housewarming':
      return (
        <Svg width={width} height={height} viewBox="0 0 120 100">
          <Defs>
            <LinearGradient id="hRoof" x1="0" y1="0" x2="0" y2="1">
              <Stop offset={0} stopColor="#ffffff" />
              <Stop offset={1} stopColor="#d4d9e6" />
            </LinearGradient>
            <LinearGradient id="hWall" x1="0" y1="0" x2="0" y2="1">
              <Stop offset={0} stopColor="#f3f5f9" />
              <Stop offset={1} stopColor="#dde1ea" />
            </LinearGradient>
            <RadialGradient id="hGlow" cx="50%" cy="42%" r="60%">
              <Stop offset={0} stopColor="#ffe6a3" stopOpacity={0.3} />
              <Stop offset={1} stopColor="#ffe6a3" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={60} cy={60} rx={50} ry={40} fill="url(#hGlow)" />
          <Rect x={72} y={34} width={7} height={14} fill="#c6cdda" />
          <Polygon points="60,28 101,64 19,64" fill="url(#hRoof)" />
          <Rect x={34} y={64} width={52} height={28} fill="url(#hWall)" />
          <Rect x={53} y={74} width={15} height={18} rx={1} fill="#e8633a" />
          <Circle cx={65} cy={83} r={1} fill="#fff" />
          <Rect x={39} y={70} width={11} height={11} rx={1} fill="#1d9e75" />
        </Svg>
      );
    case 'naming':
      return (
        <Svg width={width} height={height} viewBox="0 0 120 100">
          <Defs>
            <LinearGradient id="nMoon" x1="0" y1="0" x2="1" y2="1">
              <Stop offset={0} stopColor="#ffe79a" />
              <Stop offset={1} stopColor="#f3b63f" />
            </LinearGradient>
          </Defs>
          <Path d="M46 24 a18 18 0 1 0 16 29 A15 15 0 1 1 46 24Z" fill="url(#nMoon)" />
          <Line x1={78} y1={36} x2={78} y2={52} stroke="rgba(255,255,255,0.4)" strokeWidth={1.2} />
          <Circle cx={78} cy={55} r={3.2} fill="#e8633a" />
          <Path
            d="M38 70 a23 13 0 0 0 44 0"
            stroke="rgba(255,255,255,0.78)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
          <Sparkle x={28} y={44} r={3.4} />
          <Sparkle x={94} y={64} r={3} />
          <Sparkle x={60} y={84} r={2.6} />
          {(
            [
              [40, 36],
              [86, 30],
              [30, 64],
              [70, 86],
            ] as const
          ).map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={1.1} fill="#fff" opacity={0.7} />
          ))}
        </Svg>
      );
    case 'anniversary':
      return (
        <Svg width={width} height={height} viewBox="0 0 120 100">
          <Defs>
            <LinearGradient id="aGold" x1="0" y1="0" x2="1" y2="1">
              <Stop offset={0} stopColor="#ffeaa8" />
              <Stop offset={0.5} stopColor="#e6c25c" />
              <Stop offset={1} stopColor="#c79a36" />
            </LinearGradient>
          </Defs>
          <Circle cx={50} cy={56} r={18} stroke="url(#aGold)" strokeWidth={5} fill="none" />
          <Circle cx={70} cy={56} r={18} stroke="url(#aGold)" strokeWidth={5} opacity={0.92} fill="none" />
          <Ellipse cx={44} cy={49} rx={3} ry={6} fill="#fff" opacity={0.4} transform="rotate(-30 44 49)" />
          {(
            [
              [34, 30, '#e8633a'],
              [86, 34, '#1d9e75'],
              [60, 22, '#e8633a'],
              [96, 60, '#f4a6c0'],
            ] as const
          ).map(([x, y, c], i) => (
            <Path
              key={i}
              d={`M${x} ${y + 3.4} l-3.4 -3.4 a2.2 2.2 0 0 1 3.4 -3.4 a2.2 2.2 0 0 1 3.4 3.4 z`}
              fill={c}
              opacity={0.9}
            />
          ))}
        </Svg>
      );
    case 'corporate':
      return (
        <Svg width={width} height={height} viewBox="0 0 120 100">
          <Defs>
            <LinearGradient id="cBa" x1="0" y1="0" x2="0" y2="1">
              <Stop offset={0} stopColor="#eef1f6" />
              <Stop offset={1} stopColor="#c2c9d6" />
            </LinearGradient>
            <LinearGradient id="cBb" x1="0" y1="0" x2="0" y2="1">
              <Stop offset={0} stopColor="#ff8b5e" />
              <Stop offset={1} stopColor="#e8633a" />
            </LinearGradient>
            <LinearGradient id="cBc" x1="0" y1="0" x2="0" y2="1">
              <Stop offset={0} stopColor="#3fc497" />
              <Stop offset={1} stopColor="#1d9e75" />
            </LinearGradient>
            <RadialGradient id="cStar" cx="50%" cy="50%" r="50%">
              <Stop offset={0} stopColor="#ffe79a" stopOpacity={0.5} />
              <Stop offset={1} stopColor="#ffe79a" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={33} y={58} width={15} height={32} rx={3} fill="url(#cBa)" />
          <Rect x={52} y={44} width={15} height={46} rx={3} fill="url(#cBb)" />
          <Rect x={71} y={52} width={15} height={38} rx={3} fill="url(#cBc)" />
          <Circle cx={98} cy={30} r={14} fill="url(#cStar)" />
          <Path
            d="M98 20 l3 6.2 6.8 1 -4.9 4.8 1.2 6.8 -6.1 -3.2 -6.1 3.2 1.2 -6.8 -4.9 -4.8 6.8 -1 z"
            fill="#f4d35e"
          />
        </Svg>
      );
    default:
      return null;
  }
}

export default OccasionArt;
