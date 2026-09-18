/**
 * The spacing scale: 4, 8, 12, 16, 20, 24, 32, 40.
 *
 * The t-shirt names are what the app already writes and keep their values; the
 * three steps that never had a name are spelled with theirs. A number in a
 * style that is not one of these eight is a value nobody chose.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  /** 12 — the gap between cards in a list. */
  s12: 12,
  md: 16,
  /** 20 — between 16 and 24, where neither is right. */
  s20: 20,
  lg: 24,
  xl: 32,
  /** 40 — the largest step, for the space above a lone action. */
  s40: 40,
} as const;

/**
 * Component measurements the design system fixes, so a header on one screen is
 * the same height as a header on another.
 */
export const layout = {
  /** Header bar, below the safe-area inset. */
  headerHeight: 56,
  headerPadding: 16,
  /** The back chevron itself. */
  backIcon: 20,
  /** Its touch target — the icon is 20, the tappable area is not. */
  backTouch: 44,
  /** Gap between the back button and the title. */
  headerGap: 8,
  /** A trailing action in the header. */
  headerActionIcon: 22,

  screenPadding: 16,
  cardPadding: 16,
  cardGap: 12,
  sectionGap: 24,

  inputHeight: 48,
  buttonHeight: 48,
  buttonRadius: 12,
} as const;

export type Spacing = typeof spacing;
export type Layout = typeof layout;
