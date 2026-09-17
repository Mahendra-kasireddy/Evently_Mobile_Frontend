/**
 * Evently's brand tokens, sampled from the signed-off auth designs.
 *
 * These are deliberately separate from `colors`, which is the app's neutral
 * product palette (indigo primary, grey surfaces) used by the authenticated
 * screens. The pre-auth surfaces — login, OTP, business registration — are
 * brand surfaces: they carry the navy/terracotta identity the marketing site
 * uses, and they need to match it exactly rather than approximately.
 *
 * One file rather than a `LOGIN_*` / `JOIN_*` block per module, because the
 * two screens are one flow and drifted apart last time they were duplicated.
 */
export const brand = {
  /** Page background behind every pre-auth screen. */
  bg: '#f8f8f6',
  /** Cards, keypad keys, inputs. */
  surface: '#ffffff',

  /** The hero/header block, and the colour of primary text on light. */
  navy: '#101a31',
  /** Chips sitting on navy — one step lighter so they separate without a border. */
  navySoft: '#262f44',
  /** The plum glow behind the hero wordmark. Warm, so navy doesn't read as flat. */
  navyPlum: '#2e2634',

  /** Terracotta. Logo tile, active borders, primary CTA. */
  accent: '#d86b46',
  /** Terracotta at text contrast — `accent` on white fails AA below 18pt. */
  accentDeep: '#b5592f',
  /** Tinted fill behind accent icons. */
  accentSoft: '#fbefe8',
  /** The hairline on cards that need to read as selectable. */
  accentBorder: '#e8a184',

  /** Cool tint behind the sub-vendor icon, so the two role cards differ at a glance. */
  coolSoft: '#eff1f6',

  /** Hairlines on neutral cards. */
  border: '#e9e7e3',
  /** Keypad key edge — a shade stronger, since keys sit on the same near-white. */
  borderStrong: '#dedcd9',

  /** A CTA that is not yet actionable: filled, legible, obviously inert. */
  disabledBg: '#efede8',
  /** Secondary copy, and the label on a disabled CTA. */
  textMuted: '#5d6674',
  /** Placeholder text — lighter than `textMuted`, which is real content. */
  textPlaceholder: '#9ba1ab',

  /** Reassurance notes ("never share your code"). */
  green: '#2d5f4c',
  /** The verification dot on the hero chips. */
  mint: '#75cfa7',

  onNavy: '#ffffff',
  onNavyMuted: 'rgba(255,255,255,0.72)',
  onAccent: '#ffffff',
} as const;

export type Brand = typeof brand;
