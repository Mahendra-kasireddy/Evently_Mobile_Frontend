import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { EventlyIcon, EventlyText } from '../Components';

/*
 * The + menu's bubbles, made of liquid.
 *
 * Each bubble is drawn as a circle plus a "metaball" neck joining it to the
 * button: two curves that bulge between the circles while they are close,
 * thin as they part, and snap once the bubble has pulled far enough away.
 * Closing runs the same frames backwards, so the bubbles melt back in.
 *
 * Plain SVG, recomputed per frame from one number `t` — the app has no Skia,
 * and blur-and-threshold filters are not something react-native-svg renders
 * on device. Three paths a frame is cheap.
 */

type Point = { x: number; y: number };

export interface GooAction {
  key: string;
  label: string;
  icon: string;
  /** Where the bubble lands, relative to the button's centre. */
  dx: number;
  dy: number;
}

const BUBBLE_R = 29;
/** The liquid under the button: a little smaller, so the neck grows from under its ring. */
const SOURCE_R = 26;
/** Each bubble's slot in the opening: one, then two, then three. */
const STAGGER = 0.25;
const WINDOW = 0.5;

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
const along = (p: Point, angle: number, r: number): Point => ({
  x: p.x + r * Math.cos(angle),
  y: p.y + r * Math.sin(angle),
});
const pt = (p: Point) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;

/**
 * The neck between two circles, as an SVG path — or null once they are too
 * far apart to touch. The classic metaball construction: tangent-ish points
 * on each circle, joined by curves whose handles shorten as the gap grows.
 */
export function metaballPath(
  c1: Point,
  r1: number,
  c2: Point,
  r2: number,
  handle = 2.4,
  spread = 0.5,
): string | null {
  const d = dist(c1, c2);
  const maxDist = r1 + r2 * 2.4;
  if (r1 <= 0 || r2 <= 0 || d > maxDist || d <= Math.abs(r1 - r2)) return null;

  let u1 = 0;
  let u2 = 0;
  if (d < r1 + r2) {
    // Overlapping: start from where the circles cross.
    u1 = Math.acos((r1 * r1 + d * d - r2 * r2) / (2 * r1 * d));
    u2 = Math.acos((r2 * r2 + d * d - r1 * r1) / (2 * r2 * d));
  }
  const between = Math.atan2(c2.y - c1.y, c2.x - c1.x);
  const maxSpread = Math.acos((r1 - r2) / d);

  const a1 = between + u1 + (maxSpread - u1) * spread;
  const a2 = between - u1 - (maxSpread - u1) * spread;
  const a3 = between + Math.PI - u2 - (Math.PI - u2 - maxSpread) * spread;
  const a4 = between - Math.PI + u2 + (Math.PI - u2 - maxSpread) * spread;

  const p1 = along(c1, a1, r1);
  const p2 = along(c1, a2, r1);
  const p3 = along(c2, a3, r2);
  const p4 = along(c2, a4, r2);

  const total = r1 + r2;
  const d2 =
    Math.min(spread * handle, dist(p1, p3) / total) *
    Math.min(1, (d * 2) / total);
  const h1 = along(p1, a1 - Math.PI / 2, r1 * d2);
  const h2 = along(p2, a2 + Math.PI / 2, r1 * d2);
  const h3 = along(p3, a3 + Math.PI / 2, r2 * d2);
  const h4 = along(p4, a4 - Math.PI / 2, r2 * d2);

  return [
    `M ${pt(p1)}`,
    `C ${pt(h1)} ${pt(h3)} ${pt(p3)}`,
    `A ${r2} ${r2} 0 ${d > r1 ? 1 : 0} 0 ${pt(p4)}`,
    `C ${pt(h4)} ${pt(h2)} ${pt(p2)}`,
    'Z',
  ].join(' ');
}

/** Out past the mark and back — the little bounce as a bubble lands. */
function easeOutBack(x: number): number {
  const c1 = 1.6;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/**
 * One bubble's own progress, from the menu's `t` (0 → 1 over the opening).
 * Each has its own slot, so they leave one after another — and, with `t`
 * running backwards on close, come home in reverse order.
 */
function bubbleProgress(t: number, index: number): number {
  const local = Math.max(0, Math.min(1, (t - index * STAGGER) / WINDOW));
  return local <= 0 ? 0 : easeOutBack(local);
}

function bubbleAt(fab: Point, action: GooAction, p: number) {
  return {
    center: { x: fab.x + action.dx * p, y: fab.y + action.dy * p },
    r: BUBBLE_R * Math.min(1, 0.45 + 0.55 * Math.min(p, 1)),
  };
}

export function GooeyBubbles({
  t,
  fab,
  actions,
  colors,
  onPick,
}: {
  /** 0 = closed, 1 = open, linear in time; each bubble eases within it. */
  t: number;
  /** The button's centre, in window coordinates. */
  fab: Point;
  actions: GooAction[];
  colors: [string, string];
  onPick: (key: string) => void;
}) {
  const { width, height } = useWindowDimensions();

  return (
    <>
      <Svg
        width={width}
        height={height}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="goo" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors[0]} stopOpacity={1} />
            <Stop offset="1" stopColor={colors[1]} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        {t > 0.01 ? (
          <Circle cx={fab.x} cy={fab.y} r={SOURCE_R} fill="url(#goo)" />
        ) : null}
        {actions.map((action, i) => {
          const p = bubbleProgress(t, i);
          if (p <= 0) return null;
          const { center, r } = bubbleAt(fab, action, p);
          const neck = metaballPath(fab, SOURCE_R, center, r);
          // Separate shapes, not one path: overlapping sub-paths can wind
          // against each other and punch a hole where they meet.
          return (
            <G key={action.key}>
              {neck ? <Path d={neck} fill="url(#goo)" /> : null}
              <Circle cx={center.x} cy={center.y} r={r} fill="url(#goo)" />
            </G>
          );
        })}
      </Svg>

      {/* What is tapped and read: an icon over each blob, its name below. */}
      {actions.map((action, i) => {
        const p = bubbleProgress(t, i);
        if (p <= 0) return null;
        const { center } = bubbleAt(fab, action, p);
        // Words arrive once the bubble has nearly landed, not mid-flight.
        const settle = Math.max(0, Math.min(1, (p - 0.6) / 0.4));
        return (
          <View
            key={action.key}
            style={[
              s.slot,
              { left: center.x - SLOT_W / 2, top: center.y - BUBBLE_R },
            ]}
          >
            <Pressable
              style={s.hit}
              onPress={() => onPick(action.key)}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              testID={`create-${action.key}`}
            >
              <View style={{ opacity: Math.min(1, p * 1.6) }}>
                <EventlyIcon name={action.icon} size={24} color="#ffffff" />
              </View>
            </Pressable>
            <EventlyText
              variant="caption"
              style={[s.label, { opacity: settle }]}
              numberOfLines={1}
            >
              {action.label}
            </EventlyText>
          </View>
        );
      })}
    </>
  );
}

const SLOT_W = 100;

const s = StyleSheet.create({
  slot: { position: 'absolute', width: SLOT_W, alignItems: 'center' },
  hit: {
    width: BUBBLE_R * 2,
    height: BUBBLE_R * 2,
    borderRadius: BUBBLE_R,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { marginTop: 6, color: '#ffffff', fontSize: 12, fontWeight: '600' },
});
