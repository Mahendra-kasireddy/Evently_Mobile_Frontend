import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface CoverArtProps {
  /** Only the aspect the artwork is composed at; it stretches to its parent. */
  width: number;
  height: number;
  /** The two stops, dark on the left bleeding warm to the right. */
  from: string;
  to: string;
  /** Portfolio tiles want the wash without the circles. */
  plain?: boolean;
  style?: object;
}

/**
 * The drawn backdrop behind the cover and the placeholder portfolio tiles.
 *
 * Drawn rather than shipped as an image: this is the one gradient in the
 * design, it has to stretch to every screen width, and `react-native-svg` is
 * already a dependency — a PNG would be a second asset to keep in step with
 * the palette and would band on wide devices.
 *
 * Sized as "100% of whatever contains me" over a viewBox rather than from
 * measured pixels. A measured width is a frame behind the layout on rotate and
 * on a foldable, which shows as a bare strip of navy down one edge until the
 * next render.
 */
export function CoverArt({ width, height, from, to, plain, style }: CoverArtProps) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={style}
      pointerEvents="none"
    >
      <Defs>
        <LinearGradient id="cover" x1="0" y1="0" x2="1" y2="0.6">
          <Stop offset="0" stopColor={from} />
          <Stop offset="1" stopColor={to} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill="url(#cover)" />
      {/* The two soft discs that keep the wash from reading as a flat block. */}
      {plain ? null : (
        <>
          <Circle cx={width * 0.86} cy={height * 0.18} r={height * 0.62} fill={to} opacity={0.55} />
          <Circle cx={width * 0.62} cy={height * 0.06} r={height * 0.42} fill={from} opacity={0.5} />
        </>
      )}
    </Svg>
  );
}

export default CoverArt;
