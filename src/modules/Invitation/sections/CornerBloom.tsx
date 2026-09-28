import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { INV_BLUSH_PETAL, INV_GOLD } from '../constants';

/**
 * A spray of blossom for the corner of a card.
 *
 * The same drawing the web invitation carries, in `react-native-svg` — which
 * the app already depends on and already draws with. Drawn rather than
 * shipped as artwork for the reason the web one is: an image would be
 * somebody's licensed floral on every customer's wedding, and one fixed
 * palette fighting whichever template the organizer picked.
 *
 * `flip` mirrors it for the opposite corner, so one shape serves both.
 */
export function CornerBloom({
  size = 96,
  flip = false,
  petal = INV_BLUSH_PETAL,
  stem = INV_GOLD,
}: {
  size?: number;
  flip?: boolean;
  petal?: string;
  stem?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96">
      <G opacity={0.5} scaleX={flip ? -1 : 1} x={flip ? 96 : 0}>
        {/* Stems, sweeping in from the corner. */}
        <Path
          d="M96 8C78 14 62 26 52 44M96 26C84 30 74 38 68 50M96 44c-8 2-14 7-18 13"
          stroke={stem}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.55}
          fill="none"
        />
        {/* Leaves. */}
        <Path
          d="M70 22c-6 1-10 5-11 11 6 1 11-3 11-11ZM84 40c-5 0-9 3-10 8 5 1 9-2 10-8Z"
          fill={stem}
          opacity={0.28}
        />
        <Bloom cx={78} cy={16} r={11} petal={petal} stem={stem} />
        <Bloom cx={58} cy={38} r={8} petal={petal} stem={stem} />
        <Bloom cx={82} cy={58} r={6.5} petal={petal} stem={stem} />
      </G>
    </Svg>
  );
}

/** One five-petal blossom. */
function Bloom({
  cx,
  cy,
  r,
  petal,
  stem,
}: {
  cx: number;
  cy: number;
  r: number;
  petal: string;
  stem: string;
}) {
  /* Five petals placed on a circle, so the flower still reads as a flower at
     12px as well as at 40px — a hand-placed path does not survive that range. */
  return (
    <G>
      {[0, 72, 144, 216, 288].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const ex = cx + Math.cos(rad) * r * 0.46;
        const ey = cy + Math.sin(rad) * r * 0.46;
        return (
          <Ellipse
            key={deg}
            cx={ex}
            cy={ey}
            rx={r * 0.54}
            ry={r * 0.36}
            fill={petal}
            origin={`${ex}, ${ey}`}
            rotation={deg}
          />
        );
      })}
      <Circle cx={cx} cy={cy} r={r * 0.22} fill={stem} opacity={0.5} />
    </G>
  );
}

export default CornerBloom;
