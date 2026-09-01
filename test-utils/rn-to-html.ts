/**
 * Renders a react-test-renderer host tree to standalone HTML.
 *
 * This exists so a layout can be reviewed as a picture without a device or a
 * simulator, and — the point — so that picture comes from the component's own
 * resolved StyleSheet values rather than from a hand-copied approximation that
 * can quietly drift from the code it claims to show.
 *
 * It is a review aid, not a rendering engine: it covers the subset of React
 * Native the Home screen uses (View, Text, react-native-svg circles and
 * groups) and approximates shadows. It is never imported by the app.
 */

type Json = any;

// Note: `lineHeight` is NOT here. React Native measures it in pixels, so
// emitting it unitless would multiply it by the font size.
const UNITLESS = new Set(['flex', 'flexGrow', 'flexShrink', 'opacity', 'zIndex', 'fontWeight']);

/** React Native shorthands with no CSS equivalent. */
const AXIS: Record<string, string[]> = {
  paddingVertical: ['padding-top', 'padding-bottom'],
  paddingHorizontal: ['padding-left', 'padding-right'],
  marginVertical: ['margin-top', 'margin-bottom'],
  marginHorizontal: ['margin-left', 'margin-right'],
};

const ESCAPES: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;' };

/** MaterialCommunityIcons stand-ins, by glyph name. */
const ICONS: Record<string, string> = {
  'chevron-right': 'M9 6l6 6-6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  check: 'M5 13l4 4L19 7',
  'heart-outline': 'M12 20s-7-4.4-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.6-7 9-7 9z',
  'calendar-blank-outline': 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  'map-marker-outline': 'M12 21s6-5.7 6-10a6 6 0 10-12 0c0 4.3 6 10 6 10zM12 11h.01',
  'account-group-outline': 'M4 19a4 4 0 018 0M8 11a3 3 0 100-6 3 3 0 000 6M14 19a4 4 0 016-3.4M17 11a2.5 2.5 0 100-5',
  'calendar-plus': 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M12 13v4M10 15h4',
  'cloud-off-outline': 'M4 4l16 16M7 18a4 4 0 01-.6-8A6 6 0 0117 8M19 12a4 4 0 01-2 6',
  refresh: 'M20 12a8 8 0 11-2.3-5.7M20 4v5h-5',
  'account-tie-outline': 'M12 4a3 3 0 100 6 3 3 0 000-6M10 10l2 3 2-3M12 13l-1 7M12 13l1 7M6 20a6 6 0 0112 0',
  pound: 'M6 9h13M5 15h13M11 4l-2 16M17 4l-2 16',
  creation: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z',
  'lightbulb-on-outline': 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9V16h7v-2.1A6 6 0 0012 3z',
  'image-outline': 'M4 5h16v14H4zM8 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3M4 16l5-4 4 3 3-2 4 3',
  'help-circle-outline': 'M12 3a9 9 0 100 18 9 9 0 000-18zM9.6 9.5a2.5 2.5 0 114.4 2c-.9.9-2 1.4-2 2.8M12 17h.01',
  'gift-outline': 'M3 11h18v9H3zM3 7h18v4H3zM12 7v13M12 7S9.5 3 7.5 4.5 10 7 12 7zM12 7s2.5-4 4.5-2.5S14 7 12 7z',
  'bullhorn-outline': 'M4 10v4h3l7 4V6l-7 4zM18 10a3 3 0 010 4',
  'camera-outline': 'M4 8h3l2-2h6l2 2h3v11H4zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  'palette-outline': 'M12 3a9 9 0 000 18c1.1 0 1.5-.8 1.5-1.5 0-1.4 1-2 2-2H18a3 3 0 003-3c0-6-4-11.5-9-11.5M7.5 12a1 1 0 100-2 1 1 0 000 2M10 8.5a1 1 0 100-2 1 1 0 000 2M14.5 8a1 1 0 100-2 1 1 0 000 2',
  'silverware-fork-knife': 'M5 3v7a2 2 0 004 0V3M7 10v11M16 3c-1.5 1.5-2 3-2 5s.5 2 1.5 2H17V3zM17 10v11',
  'filter-variant': 'M4 6h16M7 12h10M10 18h4',
  'lock-outline': 'M6 11h12v9H6zM9 11V8a3 3 0 016 0v3',
  'clock-outline': 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3.5 2',
  'email-heart-outline': 'M3 6h18v12H3zM3 7l9 6 9-6',
  reply: 'M9 7L4 12l5 5M4 12h9a6 6 0 016 6v1',
  send: 'M4 12l16-8-6 8 6 8z',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z',
  'star-outline': 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z',
  'medal-outline': 'M12 3a4 4 0 100 8 4 4 0 000-8zM9 11l-2 9 5-3 5 3-2-9',
  'check-circle': 'M12 3a9 9 0 100 18 9 9 0 000-18zM8 12l3 3 5-6',
  'compass-outline': 'M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z',
};

/** Glyphs the app draws as a solid mark rather than an outline. */
const FILLED_ICONS = new Set(['star', 'check-circle']);

/** The marker the icon mock emits as an element's only text child. */
export const ICON_MARKER = ' icon:';

function flatten(style: Json, into: Record<string, Json> = {}): Record<string, Json> {
  if (!style) {
    return into;
  }
  if (Array.isArray(style)) {
    style.forEach((s) => flatten(s, into));
    return into;
  }
  Object.assign(into, style);
  return into;
}

function css(style: Record<string, Json>): string {
  const decls: string[] = [];

  Object.entries(style).forEach(([key, value]) => {
    if (value == null || key.startsWith('shadow') || key === 'elevation') {
      return;
    }
    const px = typeof value === 'number' ? `${value}px` : String(value);
    if (AXIS[key]) {
      AXIS[key].forEach((prop) => decls.push(`${prop}:${px}`));
      return;
    }
    const prop = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    decls.push(`${prop}:${UNITLESS.has(key) ? String(value) : px}`);
  });

  /*
   * React Native's border style defaults to solid; CSS defaults to none, which
   * would silently drop every divider drawn with a width alone. Set it per
   * side that actually declares a width — a blanket `border-style:solid` would
   * give the other three sides CSS's `medium` default and box the element in.
   */
  Object.keys(style)
    .filter((k) => k.startsWith('border') && k.endsWith('Width'))
    .forEach((k) => {
      const side = k.slice('border'.length, -'Width'.length).toLowerCase();
      decls.push(side ? `border-${side}-style:solid` : 'border-style:solid');
    });

  if (style.shadowOpacity) {
    const y = style.shadowOffset?.height ?? 2;
    decls.push(`box-shadow:0 ${y}px ${style.shadowRadius ?? 8}px rgba(0,0,0,${style.shadowOpacity})`);
  }
  return decls.join(';');
}

/**
 * react-native-svg hands colors down as packed ARGB integers, and a
 * `fill="url(#id)"` as a brush reference instead.
 */
/* eslint-disable no-bitwise -- unpacking an ARGB integer is what this does. */
function svgColor(value: Json): string {
  if (value == null) {
    return 'none';
  }
  if (typeof value.brushRef === 'string') {
    return `url(#${value.brushRef})`;
  }
  const payload = typeof value === 'number' ? value : value?.payload;
  if (typeof payload !== 'number') {
    return 'none';
  }
  const argb = payload >>> 0;
  const a = (argb >>> 24) & 0xff;
  const hex = argb.toString(16).padStart(8, '0').slice(2);
  // Alpha lives in the top byte. Dropping it renders a translucent highlight
  // as an opaque one — which is how the balloon gradients turned solid white.
  if (a === 0xff) {
    return `#${hex}`;
  }
  const [r, g, b] = [(argb >> 16) & 0xff, (argb >> 8) & 0xff, argb & 0xff];
  return `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`;
}
/* eslint-enable no-bitwise */

/** Gradient stops arrive flattened as [offset, packedARGB, offset, packedARGB, ...]. */
function gradientStops(p: Json): string {
  const raw: number[] = p.gradient ?? [];
  const out: string[] = [];
  for (let i = 0; i + 1 < raw.length; i += 2) {
    out.push(`<stop offset="${raw[i]}" stop-color="${svgColor(raw[i + 1])}"/>`);
  }
  return out.join('');
}

/** Shared presentation attributes, in the spelling SVG expects. */
function svgAttrs(p: Json): string {
  const out: string[] = [];
  const paint = (key: 'fill' | 'stroke') => {
    if (p[key] !== undefined) {
      out.push(`${key}="${svgColor(p[key])}"`);
    }
  };
  paint('fill');
  paint('stroke');
  if (p.strokeWidth != null) out.push(`stroke-width="${p.strokeWidth}"`);
  if (p.strokeLinecap) out.push('stroke-linecap="round"');
  if (p.strokeDasharray) out.push(`stroke-dasharray="${p.strokeDasharray.join(' ')}"`);
  if (p.strokeDashoffset != null) out.push(`stroke-dashoffset="${p.strokeDashoffset}"`);
  if (p.opacity != null && p.opacity !== 1) out.push(`opacity="${p.opacity}"`);
  return out.length ? ` ${out.join(' ')}` : '';
}

/** RN gives align and meetOrSlice separately; "none" takes no qualifier. */
function aspect(p: Json): string {
  const align = p.align || 'xMidYMid';
  if (align === 'none') {
    return 'none';
  }
  return `${align} ${p.meetOrSlice === 1 ? 'slice' : 'meet'}`;
}

function svgNode(node: Json): string {
  const p = node.props ?? {};
  const kids = (Array.isArray(node.children) ? node.children : []).map(svgNode).join('');
  const a = svgAttrs(p);

  switch (node.type) {
    case 'RNSVGSvgView':
      return `<svg width="${p.width}" height="${p.height}" viewBox="${p.minX != null ? `${p.minX} ${p.minY} ${p.vbWidth} ${p.vbHeight}` : `0 0 ${p.bbWidth ?? p.width} ${p.bbHeight ?? p.height}`}" preserveAspectRatio="${aspect(p)}">${kids}</svg>`;
    case 'RNSVGGroup':
      // Carries through whatever transform react-native-svg resolved.
      return p.matrix ? `<g${a} transform="matrix(${p.matrix.join(',')})">${kids}</g>` : `<g${a}>${kids}</g>`;
    case 'RNSVGDefs':
      return `<defs>${kids}</defs>`;
    case 'RNSVGLinearGradient':
      return `<linearGradient id="${p.name}" x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}">${gradientStops(p)}</linearGradient>`;
    case 'RNSVGRadialGradient':
      return `<radialGradient id="${p.name}" cx="${p.cx}" cy="${p.cy}" r="${p.rx ?? p.r}">${gradientStops(p)}</radialGradient>`;
    case 'RNSVGCircle':
      return `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}"${a}/>`;
    case 'RNSVGEllipse':
      return `<ellipse cx="${p.cx}" cy="${p.cy}" rx="${p.rx}" ry="${p.ry}"${a}/>`;
    case 'RNSVGRect':
      return `<rect x="${p.x}" y="${p.y}" width="${p.width}" height="${p.height}"${p.rx ? ` rx="${p.rx}"` : ''}${a}/>`;
    case 'RNSVGLine':
      return `<line x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"${a}/>`;
    case 'RNSVGPath':
      return `<path d="${p.d}"${a}/>`;
    default:
      return kids;
  }
}

export function toHtml(node: Json): string {
  if (node == null || node === false) {
    return '';
  }
  if (typeof node === 'string') {
    return node.replace(/[<>&]/g, (c) => ESCAPES[c]);
  }
  if (Array.isArray(node)) {
    return node.map(toHtml).join('');
  }
  if (String(node.type).startsWith('RNSVG')) {
    return svgNode(node);
  }

  const style = flatten(node.props?.style);
  const kids: Json[] = node.children ?? [];
  const first = Array.isArray(kids) ? kids[0] : kids;

  if (typeof first === 'string' && first.startsWith(ICON_MARKER)) {
    const name = first.slice(ICON_MARKER.length);
    const size = style.fontSize ?? 20;
    const d = ICONS[name] ?? 'M6 12h12';
    const color = style.color ?? '#111827';
    const fill = FILLED_ICONS.has(name) ? color : 'none';
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="${d}"/></svg>`;
  }

  /*
   * A horizontal ScrollView lays its content out in a row through React
   * Native's own internals rather than through a style this tree carries, so
   * without this the cards of a carousel stack vertically in the picture.
   */
  const isHorizontalScroller = node.props?.horizontal === true;
  const scroller = isHorizontalScroller ? 'flex-direction:row;overflow-x:auto' : '';

  /*
   * A TextInput's content lives in props, not children, so without this a
   * composer renders as an empty gap in the picture.
   */
  if (node.type === 'TextInput') {
    const shown = node.props?.value || node.props?.placeholder || '';
    const muted = !node.props?.value;
    return `<div style="${css(style)};${muted ? `color:${node.props?.placeholderTextColor ?? '#6B7280'}` : ''}">${toHtml(
      String(shown),
    )}</div>`;
  }

  const isText = node.type === 'Text';
  const clip =
    isText && node.props?.numberOfLines === 1
      ? 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0'
      : '';
  const box = isText
    ? 'display:block'
    : 'display:flex;flex-direction:column;align-items:stretch;min-width:0;position:relative';
  const inner = (Array.isArray(kids) ? kids : [kids])
    .map(toHtml)
    .join('')
    // The content container is that scroller's only child.
    .replace(/^<div style="display:flex;flex-direction:column/, '<div style="display:flex;flex-direction:row');
  return `<div style="${[box, css(style), clip, scroller].filter(Boolean).join(';')}">${
    isHorizontalScroller ? inner : (Array.isArray(kids) ? kids : [kids]).map(toHtml).join('')
  }</div>`;
}

interface PageOptions {
  title: string;
  /** Phone width in px. */
  width?: number;
  /** Behind the panel — the hero's navy, or the screen's white. */
  background?: string;
  padding?: number;
}

export function page(panels: Array<[string, string]>, opts: PageOptions): string {
  const body = panels
    .map(
      ([label, html]) =>
        `<figure class="phone"><figcaption>${label}</figcaption><div class="screen">${html}</div></figure>`,
    )
    .join('\n');

  return `<!doctype html><meta charset="utf-8"><title>${opts.title}</title>
<style>
  body{margin:0;padding:28px;background:#eef0f4;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;
       display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start}
  .phone{margin:0}
  figcaption{font:600 12px/1.4 inherit;color:#4b5563;margin-bottom:8px;max-width:${opts.width ?? 390}px}
  .screen{width:${opts.width ?? 390}px;background:${opts.background ?? '#fff'};border-radius:20px;
          padding:${opts.padding ?? 20}px;box-shadow:0 10px 30px rgba(0,0,0,.15);overflow:hidden}
  .screen *{box-sizing:border-box}
</style>
${body}`;
}
