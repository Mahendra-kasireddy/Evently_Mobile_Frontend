import { Dimensions, Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand } from '../../theme';
import { colors, spacing } from '../../theme';
import {
  BOOKED_CARD_PHOTO_BG,
  BOOKED_STEP_DONE_COLOR,
  BOOKED_STEP_PENDING_COLOR,
  CATEGORY_ICON_BADGE_COLOR,
  HERO_ACCENT_COLOR,
  HERO_ACCENT_WARM_COLOR,
  HERO_BACKGROUND_COLOR,
  HERO_DECOR_CIRCLE_COLOR,
  HERO_FIELD_ICON_BG,
  HOME_ACCENT_SOFT,
  HOME_CANVAS,
  HOME_GREEN,
  HOME_GREEN_SOFT,
  HOME_HAIRLINE,
  HOME_NAVY,
  HOME_NAVY_DEEP,
  HOME_TRACK,
} from './constants';

/**
 * How far the content sheet is pulled up over the photograph's bottom edge.
 *
 * Exported because two places have to agree on it — the sheet's negative
 * margin and the test that pins the lift — and a number typed twice is a
 * number that drifts.
 */
export const HERO_PHOTO_OVERLAP = 34;

export const styles = StyleSheet.create({
  /** Holds whichever state Home is in, plus the one name prompt. */
  root: { flex: 1, backgroundColor: HOME_CANVAS },
  container: { flex: 1, backgroundColor: HOME_CANVAS },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  /*
   * The opaque sheet every row below the photograph sits on, pulled up over
   * the picture's bottom edge. `flexGrow` so a short feed still covers the
   * fold rather than leaving the photo showing under it.
   */
  sheet: {
    flexGrow: 1,
    marginTop: -HERO_PHOTO_OVERLAP,
    paddingTop: spacing.sm,
    backgroundColor: HOME_CANVAS,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    /* Clips the page gradient to the sheet's rounded top. */
    overflow: 'hidden',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorText: { color: colors.danger, textAlign: 'center' },
});

export const homeHeroPhotoStyles = StyleSheet.create({
  wrap: {
    /* Deep enough for the sign in the photograph to read as a picture rather
       than as a texture behind the controls, and no deeper: this is a header,
       not a cover. */
    height: 268,
    backgroundColor: HOME_NAVY_DEEP,
    overflow: 'hidden',
  },
  /* Real dimensions, not absolute insets: an Image with nothing but
     top/left/right/bottom has no size to resize against, and `cover` then
     enlarges a corner of the source instead of fitting the whole frame. */
  photo: { width: '100%', height: '100%' },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16,26,49,0.18)',
  },
  /* The header floats over the picture; the safe-area inset pads the controls
     clear of the notch without insetting the image itself. */
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
});

export const homeHeaderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  topRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  /* A circle, not the rounded square Profile uses for the same monogram: on
     the photograph it is a face's shape, and it is the only round control in
     the row apart from the two icon discs it is balanced against. */
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    /* The brand's soft blush, not a solid navy disc: the header sits on a
       photograph and on a near-white canvas, and a dark plug in the corner
       read as a hole in both. Light fill, coral monogram — the same pairing
       the rest of Home uses for a tile. */
    backgroundColor: HOME_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  /* On the photo it needs an edge of its own, so a pale disc on a pale part
     of the picture still reads as a control. */
  avatarOnPhoto: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.92)',
  },
  avatarText: {
    color: HERO_ACCENT_COLOR,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  /* Where the customer is — the area big, the city under it. */
  location: { flex: 1, paddingVertical: 2 },
  locationRow: { ...globalStyles.row, gap: 4 },
  locationTitle: {
    flexShrink: 1,
    color: HOME_NAVY,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
  },
  locationSub: {
    color: '#5d5873',
    fontSize: 12.5,
    marginTop: 1,
    marginLeft: 22,
  },
  /* Over the photograph: white, with a soft shadow so it reads on any picture. */
  onPhotoText: {
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  onPhotoSub: {
    color: 'rgba(255,255,255,0.92)',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  actions: { ...globalStyles.row, gap: spacing.md },
  iconButton: { padding: 2 },
  iconButtonOnPhoto: {
    width: 40,
    height: 40,
    borderRadius: 999,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    /* White discs with coloured glyphs: brighter than a dark smoke over a
       wedding photo, and each control has its own colour. */
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 17,
    height: 17,
    borderRadius: 999,
    backgroundColor: HERO_ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
  },
});

/**
 * Home's "tell us the basics" block.
 *
 * On the page, not on a navy card. It used to be a dark hero with confetti and
 * a garland behind it, which put four form rows on top of a decorated
 * background — the form is the point of the block, and the decoration was
 * competing with it for the only thing the customer is meant to look at.
 */
export const basicsStyles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  /* Measured off the mockup: a 25pt face set solid-ish at 30, not the 26/34
     it was. The extra four points of leading were what made a two-line
     heading read as three. */
  heading: {
    color: HOME_NAVY,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headingAccent: { color: HERO_ACCENT_COLOR, fontStyle: 'italic' },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.sm,
  },

  dividerRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: HOME_HAIRLINE },
  dividerText: { color: colors.textMuted },

  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    overflow: 'hidden',
  },
  row: {
    ...globalStyles.row,
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  /* The question's colour, on a tile. `overflow: hidden` is what lets the
     gradient inside take the tile's own corner radius. */
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  rowDivided: { borderTopWidth: 1, borderTopColor: HOME_HAIRLINE },
  rowPressed: { backgroundColor: HOME_ACCENT_SOFT },
  rowText: { flex: 1 },
  rowLabel: { color: colors.textMuted, fontSize: 13, lineHeight: 17 },
  /* The value is the answer, so it carries the weight — the label above it is
     only there to say what the answer is to. */
  rowValue: {
    color: HOME_NAVY,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  rowValueEmpty: { color: brand.textPlaceholder, fontWeight: '400' },

  quickRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: HOME_HAIRLINE,
    paddingLeft: spacing.md,
    paddingVertical: 10,
  },
  quickLabel: { color: colors.textMuted },
  quickChips: { gap: spacing.sm, paddingRight: spacing.md },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    borderColor: 'transparent',
    /* The sweep is drawn inside; the radius has to clip it. */
    overflow: 'hidden',
  },
  chipText: {
    color: HOME_NAVY,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  chipTextActive: { color: colors.onPrimary, fontWeight: '700' },

  /*
   * One card, not two.
   *
   * The budget row used to be its own bordered box stacked under the toggle's,
   * which met it edge to edge — two hairlines against each other and four
   * rounded corners notching into the seam. It is a row inside the same card
   * now, divided the way the four basics rows are.
   */
  budgetCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  budgetOn: { borderColor: HERO_ACCENT_COLOR },
  budgetRow: {
    ...globalStyles.row,
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  budgetRowDivided: { borderTopWidth: 1, borderTopColor: HOME_HAIRLINE },
  budgetText: { flex: 1 },
  budgetTitle: {
    color: HOME_NAVY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  budgetLink: {
    color: HOME_NAVY,
    textDecorationLine: 'underline',
    marginTop: 1,
  },

  cta: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.sm,
    height: 54,
    borderRadius: 999,
    /* Under the gradient, and the whole of the button on a platform that
       cannot draw it — never a bare rectangle. */
    backgroundColor: HERO_ACCENT_COLOR,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  /* Behind the label, not around it: the icon and the text are siblings that
     follow this layer, so they paint over it. */
  ctaGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  /*
   * Faded, not grey.
   *
   * An unanswered form used to turn this into a grey track — which meant the
   * button a customer sees on a fresh Home was the one piece of the screen
   * carrying none of the brand at all, and the warm sweep only appeared after
   * four taps. Half opacity says "not yet" just as plainly and keeps the
   * colour on the page.
   */
  /* Still plainly not-yet-ready, but no longer washed out to near-cream: at
     0.45 a fresh Home's main button read as broken rather than as waiting. */
  ctaIdle: { opacity: 0.72 },
  ctaText: {
    color: colors.onPrimary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },

  errorText: { color: colors.danger, marginTop: spacing.sm },
  successCard: {
    backgroundColor: HOME_GREEN_SOFT,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  successText: { color: HOME_NAVY, textAlign: 'center' },
  successEdit: { color: HERO_ACCENT_COLOR, fontWeight: '700' },
});

export const bannerStyles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: HERO_BACKGROUND_COLOR,
    borderRadius: 20,
    margin: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -10,
    width: 130,
    height: 130,
    borderRadius: 999,
    backgroundColor: HERO_DECOR_CIRCLE_COLOR,
  },
  decorConfetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.25,
  },
  decorGarland: {
    position: 'absolute',
    top: -12,
    right: -46,
    width: 150,
    height: 130,
    opacity: 0.8,
  },
  content: { position: 'relative' },
  greeting: { color: colors.onPrimaryMuted },
  heading: { color: colors.onPrimary, marginTop: spacing.xs },
  accent: { color: HERO_ACCENT_WARM_COLOR },
  subtitle: { color: colors.onPrimaryMuted, marginTop: spacing.sm },
  // Single tappable "search" trigger — a solid floating white card (matching
  // web's actual solid-white search bar) with a bold accent CTA, replacing
  // both the boxed field grid and the earlier washed-out glass pill.
  searchTrigger: {
    ...globalStyles.row,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.sm,
    marginTop: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  searchIconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: HERO_FIELD_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTextWrap: { flex: 1, marginLeft: spacing.sm },
  searchLabel: {
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  searchSummary: {
    color: CATEGORY_ICON_BADGE_COLOR,
    marginTop: 2,
    fontWeight: '700',
  },
  searchArrowButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: HERO_ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  successText: {
    color: colors.onPrimary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  successEdit: {
    color: HERO_ACCENT_WARM_COLOR,
    marginTop: spacing.sm,
    textDecorationLine: 'underline',
  },
  formErrorText: {
    color: colors.danger,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  // Bottom sheet — chip pickers for all four fields plus the submit button.
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '82%',
  },
  sheetTitle: { color: colors.text },
  sheetSubtitle: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  chipGroup: { marginTop: spacing.md },
  chipGroupHeader: { ...globalStyles.row, marginBottom: spacing.sm },
  chipGroupIconChip: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: HERO_FIELD_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  chipGroupLabel: { color: colors.text, fontWeight: '700' },
  // Wraps now that the sheet shows one field at a time - every option is
  // visible at once instead of hidden off the right edge of a scroller.
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: CATEGORY_ICON_BADGE_COLOR,
    borderColor: CATEGORY_ICON_BADGE_COLOR,
  },
  chipText: { color: colors.text },
  chipTextActive: { color: colors.onPrimary, fontWeight: '700' },
  getQuotesButton: { marginTop: spacing.lg },
});

// ---------------------------------------------------------------------------
// The white card that floats at the foot of the hero: one row per fact, then
// the action. Reference layout — icon chip on the left, a small uppercase
// label above a bold value, and a chevron on the right whose direction is the
// affordance (right leaves for the event, down opens a picker in place).
// ---------------------------------------------------------------------------
export const eventSummaryStyles = StyleSheet.create({
  // Sits on the navy hero, so the heading above the card is light.
  wrap: { marginTop: spacing.lg },
  label: {
    color: colors.onPrimaryMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },

  card: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  row: {
    ...globalStyles.row,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // Nothing above the first row to divide it from.
  rowFirst: { borderTopWidth: 0 },
  iconChip: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: HERO_FIELD_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rowText: { flex: 1 },
  rowLabel: {
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  rowValue: {
    color: CATEGORY_ICON_BADGE_COLOR,
    marginTop: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  rowValueEmpty: { color: colors.textMuted, fontSize: 15, fontWeight: '400' },

  cta: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    backgroundColor: HERO_ACCENT_COLOR,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  ctaBusy: { opacity: 0.75 },
  ctaText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },

  // Neither a real event nor a draft to fall back on.
  emptyBody: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyIconChip: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: HERO_FIELD_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    color: CATEGORY_ICON_BADGE_COLOR,
    fontSize: 17,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Loading — four grey bars in the geometry of the four real rows, so the
  // card does not resize when the feed arrives.
  skeletonChip: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  skeletonLabel: {
    width: 64,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.surface,
  },
  skeletonValue: {
    width: '62%',
    height: 13,
    borderRadius: 6,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
  },

  errorBody: { padding: spacing.lg, alignItems: 'center' },
  errorTitle: { color: colors.text, fontWeight: '700', marginTop: spacing.sm },
  errorText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: HERO_ACCENT_COLOR, fontWeight: '700' },
});

// The trust strip under the card - "quotes in under a day", and so on.
export const heroTrustStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    rowGap: spacing.sm,
  },
  item: { ...globalStyles.row, marginRight: spacing.md, gap: spacing.xs },
  label: { color: colors.onPrimaryMuted },
});

// ---------------------------------------------------------------------------
// Home's "BOOKED" card. Single-column phone layout from the reference: a coral
// edge down the left, the progress ring in its wash disc, then the reference
// pill / title / sub-line / milestone chips, and a footer that puts the
// countdown and the action side by side.
// ---------------------------------------------------------------------------
/*
 * One card at full width; two or more in a swipeable row, each a little
 * narrower than the screen so the next one shows at the edge and the row
 * reads as a row rather than as a page that happens to end.
 */
export const BOOKED_CARD_WIDTH =
  Dimensions.get('window').width - spacing.md * 2 - 28;

const BOOKED_NODE = 28;

export const bookedEventStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  row: { marginTop: spacing.lg },
  rowContent: { paddingHorizontal: spacing.md, gap: 12 },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: BOOKED_CARD_PHOTO_BG,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    ...Platform.select({
      ios: {
        shadowColor: HOME_NAVY,
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 3 },
    }),
  },
  cardInRow: { width: BOOKED_CARD_WIDTH },

  /* The photo fills the head and dissolves into cream on the left, where the
     title and facts sit. */
  head: { padding: spacing.md, paddingBottom: spacing.lg, minHeight: 200 },
  photo: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '72%' },
  photoImage: { width: '100%', height: '100%' },
  photoFade: { position: 'absolute', top: 0, left: 0 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: HOME_ACCENT_SOFT,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: HERO_ACCENT_COLOR,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.6,
  },
  ref: { color: colors.textMuted, fontSize: 11, flexShrink: 1 },
  topSpacer: { flex: 1 },
  more: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: HOME_NAVY,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    marginTop: spacing.s12,
    maxWidth: '62%',
  },
  facts: { gap: 8, marginTop: spacing.sm, maxWidth: '56%' },
  fact: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  factText: { color: HOME_NAVY, fontSize: 12.5, lineHeight: 17, flex: 1 },

  /* The white panel over the photo's bottom edge. */
  body: {
    marginTop: -spacing.md,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.md,
    gap: spacing.md,
  },
  progressHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTitle: { color: HOME_NAVY, fontWeight: '800' },
  progressCountRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  progressCount: { color: HOME_NAVY },
  steps: { flexDirection: 'row' },
  step: { flex: 1, alignItems: 'center', gap: 4 },
  connector: {
    position: 'absolute',
    top: BOOKED_NODE / 2 - 0.75,
    left: '50%',
    right: '-50%',
    height: 1.5,
    backgroundColor: BOOKED_STEP_PENDING_COLOR,
  },
  connectorDone: { backgroundColor: BOOKED_STEP_DONE_COLOR },
  node: {
    width: BOOKED_NODE,
    height: BOOKED_NODE,
    borderRadius: BOOKED_NODE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef0f6',
  },
  nodeDone: { backgroundColor: BOOKED_STEP_DONE_COLOR },
  /* The step in progress wears a soft halo, so it reads as "now". */
  nodeNext: {
    backgroundColor: HERO_ACCENT_COLOR,
    borderWidth: 3,
    borderColor: HOME_ACCENT_SOFT,
  },
  stepLabel: {
    color: HOME_NAVY,
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center',
  },
  stepLabelDone: { color: HOME_NAVY },
  stepLabelNext: { color: HERO_ACCENT_COLOR, fontWeight: '700' },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    backgroundColor: '#fdf0ea',
    borderRadius: 14,
    padding: spacing.s12,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextCol: { flex: 1 },
  statusTitle: { color: HOME_NAVY, fontWeight: '700' },
  statusBody: { color: colors.textMuted, marginTop: 1 },

  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(14,26,51,0.45)',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  menu: {
    backgroundColor: colors.background,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 54,
    paddingHorizontal: spacing.md,
  },
  menuItemDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HOME_HAIRLINE,
  },
  menuText: { color: HOME_NAVY, fontWeight: '600' },
  menuCancel: { color: colors.textMuted, fontWeight: '600' },
});

export const currentEventStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  card: { ...globalStyles.card, padding: spacing.md },
  titleRow: { ...globalStyles.row },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: { color: colors.text, flexShrink: 1 },
  stageRow: { marginTop: spacing.sm },
  stagePill: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: spacing.xs,
  },
  stageDot: { width: 6, height: 6, borderRadius: 3 },
  stageText: { fontWeight: '700' },
  footerRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  daysToGoBadge: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  daysToGo: { color: colors.primary, fontWeight: '700' },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressLabel: { color: colors.textMuted },
});

// ---------------------------------------------------------------------------
// "Curated packages by budget". One full-width card per package: a gradient
// banner carrying the occasion art and the badge, then the details and a
// full-width action, as on web.
// ---------------------------------------------------------------------------
export const PACKAGE_BANNER_HEIGHT = 168;

/*
 * One card at a time, with the next one peeking in from the right so the row
 * reads as scrollable without needing a scrollbar. The snap interval below is
 * derived from these two, so they cannot drift apart.
 */
export const PACKAGE_CARD_WIDTH = Math.round(
  Dimensions.get('window').width * 0.84,
);
export const PACKAGE_CARD_SPACING = spacing.md;
export const PACKAGE_SNAP_INTERVAL = PACKAGE_CARD_WIDTH + PACKAGE_CARD_SPACING;

export const packagesStyles = StyleSheet.create({
  /** Sits over the banner's top-right, clear of the badge on the left. */
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14,26,51,0.35)',
  },
  section: { marginTop: spacing.lg },
  header: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  dots: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotOn: { width: 18, backgroundColor: HERO_ACCENT_COLOR },
  headText: { flex: 1, paddingRight: spacing.sm },
  title: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 20, fontWeight: '700' },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs, lineHeight: 20 },
  buildButton: { ...globalStyles.row, gap: 2, paddingTop: 2 },
  buildText: { color: HERO_ACCENT_COLOR, fontWeight: '700' },

  card: {
    ...globalStyles.card,
    width: PACKAGE_CARD_WIDTH,
    marginRight: PACKAGE_CARD_SPACING,
    borderRadius: 20,
    overflow: 'hidden',
  },
  banner: {
    height: PACKAGE_BANNER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bannerConfetti: { opacity: 0.35 },
  bannerArt: { width: 150, height: 120 },
  badge: {
    position: 'absolute',
    top: spacing.sm + 2,
    left: spacing.sm + 2,
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
  },
  badgeText: {
    color: CATEGORY_ICON_BADGE_COLOR,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  body: { padding: spacing.md },
  titleRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  packageTitle: {
    color: CATEGORY_ICON_BADGE_COLOR,
    fontSize: 18,
    fontWeight: '700',
    flexShrink: 1,
  },
  guests: { color: colors.textMuted },
  budget: {
    color: HERO_ACCENT_COLOR,
    fontSize: 21,
    fontWeight: '700',
    marginTop: spacing.xs,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm + 2,
    gap: spacing.sm,
  },
  tag: {
    color: colors.textMuted,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    overflow: 'hidden',
  },

  explore: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: HERO_ACCENT_COLOR,
    marginTop: spacing.md,
  },
  exploreText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
});

// ---------------------------------------------------------------------------
// "Top organizers near you" — one full-width card per organizer, as on web:
// avatar and tier badge, then the rating line, then the two actions.
// ---------------------------------------------------------------------------
export const topOrganizersStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  header: { ...globalStyles.row, justifyContent: 'space-between' },
  title: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 20, fontWeight: '700' },

  // Shown only when these organizers are not actually local — see `scope`.
  scopeNote: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.sm },
  scopeNoteText: { color: colors.textMuted, flex: 1 },

  card: {
    ...globalStyles.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  top: { ...globalStyles.row, gap: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.onPrimary, fontSize: 18, fontWeight: '700' },
  idCol: { flex: 1 },
  name: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 17, fontWeight: '700' },
  tierBadge: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: 999,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginTop: spacing.xs,
  },
  tierBadgeText: { fontWeight: '700' },

  ratingRow: {
    ...globalStyles.row,
    gap: 2,
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  ratingValue: {
    color: CATEGORY_ICON_BADGE_COLOR,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  ratingMuted: { color: colors.textMuted, marginLeft: 3 },
  // Stands in for the rating line when nobody has reviewed this organizer yet.
  noRating: { color: colors.textMuted, marginTop: spacing.md },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  tag: {
    color: colors.textMuted,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    overflow: 'hidden',
  },

  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionButton: {
    ...globalStyles.row,
    flex: 1,
    minHeight: 46,
    justifyContent: 'center',
    borderRadius: 12,
  },
  viewButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  viewButtonText: {
    color: CATEGORY_ICON_BADGE_COLOR,
    fontSize: 15,
    fontWeight: '700',
  },
  quoteButton: { backgroundColor: HERO_ACCENT_COLOR },
  quoteButtonText: { color: colors.onPrimary, fontSize: 15, fontWeight: '700' },
  quoteButtonBusy: { opacity: 0.7 },

  // Replaces the two actions once a request has been sent to this organizer.
  sentRow: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.md },
  sentText: { color: colors.success, fontWeight: '700' },
  errorText: { color: colors.danger, marginTop: spacing.sm },

  // No organizers at all — an empty list under a "near you" heading reads as a
  // broken screen, so the section becomes one honest prompt instead.
  emptyCard: {
    ...globalStyles.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: HERO_FIELD_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: CATEGORY_ICON_BADGE_COLOR,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  emptyBody: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  emptyCta: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  emptyCtaText: { color: HERO_ACCENT_COLOR, fontWeight: '700' },
});

// The "View Profile" sheet. Mobile has no organizer route of its own yet, so
// the profile opens over Home rather than the button leading nowhere.
export const organizerSheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: '86%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  head: { ...globalStyles.row, gap: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.onPrimary, fontSize: 18, fontWeight: '700' },
  headText: { flex: 1 },
  name: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 19, fontWeight: '700' },
  meta: { color: colors.textMuted, marginTop: 2 },
  centered: { alignItems: 'center', paddingVertical: spacing.xl },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  factRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  factLabel: { color: colors.textMuted },
  factValue: {
    color: CATEGORY_ICON_BADGE_COLOR,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  facts: { marginTop: spacing.lg },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  tag: {
    color: colors.textMuted,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    overflow: 'hidden',
  },

  closeButton: {
    ...globalStyles.row,
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  closeText: { color: CATEGORY_ICON_BADGE_COLOR, fontWeight: '700' },
  /** Asking this organizer for a quote — the action moved off the list row. */
  quoteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: HERO_ACCENT_COLOR,
    marginTop: spacing.lg,
  },
  quoteButtonBusy: { opacity: 0.6 },
  quoteText: { color: colors.onPrimary, fontSize: 16, fontWeight: '600' },
  requestedRow: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: '#e8f6ef',
    marginTop: spacing.lg,
  },
  requestedText: { color: HOME_GREEN, fontWeight: '600' },
  requestError: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export const howItWorksStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  title: { color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs },
  list: { marginTop: spacing.lg },
  // A connected timeline: an icon "node" per step, linked by a vertical
  // line, with the step content beside it — reads as a guided journey
  // rather than a stack of identical boxes.
  stepRow: { flexDirection: 'row' },
  timelineCol: { width: 56, alignItems: 'center' },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadge: {
    position: 'absolute',
    bottom: -4,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: { fontWeight: '700', fontSize: 10, lineHeight: 12 },
  connector: {
    width: 2,
    flex: 1,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  stepContent: { flex: 1, paddingLeft: spacing.md, paddingBottom: spacing.xl },
  cardTitle: { color: colors.text, marginBottom: spacing.xs },
  cardDesc: { color: colors.textMuted },
});

export const planSmarterStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  title: { color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs },
  // A 2x2 grid of colorful tiles reads as a set of distinct tools at a
  // glance, rather than four identical bordered boxes stacked vertically.
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  card: {
    ...globalStyles.card,
    width: '48%',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: { color: colors.text, marginBottom: spacing.xs },
  cardDesc: { color: colors.textMuted },
});

// ---------------------------------------------------------------------------
// The redesigned home sections.
// ---------------------------------------------------------------------------

export const sectionStyles = StyleSheet.create({
  block: { marginTop: spacing.lg },
  headRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  /* The badge and the title, kept together on the left. */
  headLeft: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  /*
   * One size for every heading on Home, a step under the design system's
   * `sectionTitle`.
   *
   * Home stacks six of these — the occasions, the events, the offers, the
   * packages, the organizers — and at 18 they competed with the titles inside
   * the cards under them. Set here rather than on the token, because the token
   * is shared with screens that have one heading and room for it. It is the
   * one place all six are drawn, so they cannot drift apart.
   */
  title: {
    color: HOME_NAVY,
    fontSize: 16.5,
    lineHeight: 21,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  /* The section's colour and icon, as a small badge in front of its name.
     A mark to find the section by, not a banner. */
  toneBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    marginRight: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** The trailing "See all" — the design system's button token. */
  action: { color: HERO_ACCENT_COLOR },
  /** The line under a section heading. Size from the `body` token. */
  subtitle: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
});

export const seeAllStyles = StyleSheet.create({
  list: { paddingTop: spacing.sm, paddingBottom: spacing.xl, flexGrow: 1 },
  count: {
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyTitle: { color: HOME_NAVY, textAlign: 'center' },
  emptyBody: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  /* The carousel's card, given a row of its own. Its width comes from the
     horizontal list it was built for, so it is padded into the column rather
     than left floating at its carousel size. */
  offerRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
});

/**
 * The compact row every event after the leading one uses.
 *
 * Light, not navy: a screen of navy cards is what made ten events unreadable,
 * and the contrast is what tells the customer which one Home thinks is urgent.
 */
/*
 * One live event, after the reference: a picture with its date on it, and
 * beside it what the event is, where it stands, and the one thing to do
 * about it.
 *
 * It used to be a line of text with a chevron — legible, but three of them
 * read as a settings menu rather than as three celebrations. The thumbnail is
 * the occasion's own illustration over its gradient (an event has no
 * photograph of its own), and the date rides on it as a chip, which is the
 * fact people scan a list of events for.
 */
export const eventRowStyles = StyleSheet.create({
  row: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    padding: 12,
    marginHorizontal: spacing.md,
    marginTop: 10,
  },

  thumb: {
    width: 96,
    height: 112,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  thumbLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  thumbArt: { width: 84, height: 72, opacity: 0.92 },
  /* White, top-left, over the picture — the reference's one strong detail. */
  dateChip: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 10,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
  },
  dateMonth: {
    color: HERO_ACCENT_COLOR,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 12,
  },
  dateDay: {
    color: HOME_NAVY,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
  },

  body: { flex: 1 },
  title: {
    color: HOME_NAVY,
    fontSize: 16.5,
    fontWeight: '700',
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  stageRow: { ...globalStyles.row, gap: 6, marginTop: 4 },
  stageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: HOME_GREEN,
  },
  stageText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  /* The one fact worth its own weight — how many have replied, when it
     closes, or failing both, where it is. */
  fact: {
    color: HOME_NAVY,
    fontSize: 13.5,
    fontWeight: '700',
    marginTop: 6,
  },

  actionRow: { ...globalStyles.row, gap: 8, marginTop: 10 },
  cta: {
    borderRadius: 999,
    backgroundColor: HERO_ACCENT_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexShrink: 1,
  },
  ctaText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  /* A 34pt disc: the icon is what you see, the target is what you hit. */
  edit: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});

/*
 * The current-event card: a light blush-to-lavender card where the colour is
 * carried by gradients — the title, the icon discs, the pills, the button —
 * rather than by a dark ground.
 */
const HERO_INK = '#1a2e5a';
const HERO_MUTED = '#5d6683';
const HERO_HAIRLINE = 'rgba(124,92,219,0.14)';

export const eventHeroStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff6f0',
    borderRadius: 20,
    margin: spacing.md,
    marginBottom: 0,
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(232,99,58,0.12)',
    ...Platform.select({
      ios: {
        shadowColor: '#c08aa0',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 3 },
    }),
  },
  /* Two soft glows for depth — decoration, not content. */
  glow: { position: 'absolute', borderRadius: 999 },
  glowOne: {
    top: -80,
    right: -60,
    width: 230,
    height: 230,
    backgroundColor: 'rgba(160,132,255,0.22)',
  },
  glowTwo: {
    bottom: -90,
    left: -70,
    width: 210,
    height: 210,
    backgroundColor: 'rgba(255,138,92,0.16)',
  },
  decorArt: {
    position: 'absolute',
    top: -22,
    right: -10,
    width: 120,
    height: 104,
    opacity: 0.75,
  },

  topRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  stagePill: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    overflow: 'hidden',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  stageDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },
  stageText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  daysBadge: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  daysText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  titleWrap: { marginTop: 10, paddingRight: 36 },
  title: {
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 27,
    letterSpacing: -0.3,
  },
  factRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 6,
    marginTop: 8,
  },
  factChip: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
  },
  factText: {
    color: HERO_INK,
    fontSize: 12.5,
    fontWeight: '600',
    flexShrink: 1,
  },
  iconDisc: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reach: { color: HERO_MUTED, fontSize: 13, lineHeight: 18, marginTop: 8 },

  /* Waiting on replies: the brief's journey, on a white panel. */
  panel: { marginTop: 14 },
  journey: { flexDirection: 'row' },
  journeyStep: { flex: 1, alignItems: 'center' },
  journeyMarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  journeyLine: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ece7f8',
  },
  journeyLineOn: { backgroundColor: '#8fe0c4' },
  journeyLineSpacer: { flex: 1 },
  journeyMark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyMarkTodo: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d9d1f1',
    backgroundColor: '#ffffff',
  },
  journeyLabel: {
    color: '#9a94b3',
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 2,
  },
  journeyLabelOn: { color: HERO_INK, fontWeight: '600' },
  panelFoot: { marginTop: 10, gap: 6 },
  panelLine: { ...globalStyles.row, alignItems: 'center', gap: 8 },
  panelLineText: { color: HERO_MUTED, fontSize: 12.5, lineHeight: 17, flex: 1 },
  panelLineStrong: { color: '#c2620f', fontWeight: '700' },

  /* Any other stage with nothing to compare: how far along it is. */
  progressBlock: { marginTop: 12 },
  progressHead: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressCaption: { color: HERO_MUTED, fontSize: 12, fontWeight: '600' },
  progressPercent: { color: HERO_INK, fontSize: 12.5, fontWeight: '700' },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ece7f8',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4, overflow: 'hidden' },
  progressLabel: { color: HERO_MUTED, fontSize: 13, marginTop: 8 },

  /** "Closes in 4 days" — the one thing on this card with a clock on it. */
  closesPill: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden',
    marginTop: 8,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  closesText: { color: colors.onPrimary, fontSize: 12, fontWeight: '700' },

  /* One white card per reply; the cheapest gets a green edge and a tag. */
  quoteRow: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: HERO_HAIRLINE,
  },
  quoteRowBest: {},
  quoteAvatar: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quoteAvatarText: {
    color: colors.onPrimary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  quoteText: { flex: 1, minWidth: 0 },
  quoteNameRow: { ...globalStyles.row, alignItems: 'center', gap: 6 },
  quoteName: {
    color: HERO_INK,
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  bestTag: {
    overflow: 'hidden',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  bestTagText: { color: '#ffffff', fontSize: 10.5, fontWeight: '800' },
  quoteMeta: { color: HERO_MUTED, fontSize: 12, marginTop: 1 },
  quoteMoney: { alignItems: 'flex-end', flexShrink: 0 },
  quoteTotal: { color: HERO_INK, fontSize: 14.5, fontWeight: '700' },
  /* Green on the cheapest, muted on the rest: the delta is information, not a
     warning, and colouring every row would say all of them are notable. */
  quoteDelta: { color: HERO_MUTED, fontSize: 12, marginTop: 1 },
  quoteDeltaLowest: { color: HOME_GREEN, fontWeight: '700' },

  /* The organizers still to answer, drawn as an empty seat rather than a row
     — there is nothing to compare yet, and it should not look like there is. */
  awaitingRow: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 10,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: HERO_HAIRLINE,
  },
  awaitingSlot: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#d9d1f1',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  awaitingText: { color: HERO_MUTED, fontSize: 13, flex: 1 },

  cta: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: HERO_ACCENT_COLOR,
    marginTop: 14,
  },
  ctaText: { color: colors.onPrimary, fontSize: 15, fontWeight: '700' },
  ctaArrow: { position: 'absolute', right: 16 },
  link: {
    ...globalStyles.row,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingTop: 10,
  },
  linkText: { color: '#7c5cdb', fontSize: 13.5, fontWeight: '600' },
});

/*
 * The offer card, after the reference: one wide card per screen, the figure
 * set large, the action beneath it, and an art block holding the right-hand
 * third.
 *
 * It was a row of narrow cards before that, and before that two solid slabs of
 * paint. Narrow meant the discount — the only reason anybody reads a coupon —
 * was set at the same size as its conditions. One card at a time gives the
 * number room and gives the customer one thing to decide about.
 */
const OFFER_CARD_WIDTH = Dimensions.get('window').width - spacing.md * 2;

export const offersStyles = StyleSheet.create({
  list: { paddingHorizontal: spacing.md, paddingTop: 12, gap: 12 },
  card: {
    width: OFFER_CARD_WIDTH,
    minHeight: 156,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    backgroundColor: HOME_CANVAS,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  /* Room kept clear on the right for the art, so a long title wraps before it
     reaches the disc rather than under it. */
  body: { paddingVertical: 16, paddingLeft: 16, paddingRight: 132 },

  /* The code, where the reference puts its category line. It is the part the
     customer carries to a checkout. */
  code: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: HOME_NAVY,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.3,
    marginTop: 6,
  },

  /* The figure, and only the figure, in the accent. */
  /* Wraps rather than shrinks: the figure is the one thing on this card that
     must never come out clipped. */
  valueRow: {
    ...globalStyles.row,
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 6,
  },
  value: {
    color: HERO_ACCENT_COLOR,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.6,
    flexShrink: 0,
  },
  valueNote: { color: colors.textMuted, fontSize: 12.5, flexShrink: 1 },

  terms: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 6,
  },
  cta: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: HERO_ACCENT_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 12,
  },
  ctaText: { color: colors.onPrimary, fontSize: 13.5, fontWeight: '700' },

  /*
   * The reference has a photograph here. A platform coupon has no picture of
   * its own and inventing one would be decorating a discount with somebody
   * else's event, so the block is the offer's own mark: a soft disc running
   * off the card's edge with the ticket glyph on it.
   */
  art: {
    position: 'absolute',
    right: -34,
    top: -18,
    bottom: -18,
    width: 168,
    borderRadius: 999,
    backgroundColor: HOME_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artInner: { paddingRight: 30 },

  /* Which of them is on screen. Drawn only when there is more than one — a
     single dot under a single card says nothing. */
  dots: {
    ...globalStyles.row,
    alignSelf: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: HOME_TRACK,
  },
  dotActive: { width: 18, backgroundColor: HERO_ACCENT_COLOR },
});

export const couponSheetStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(10,16,28,0.45)' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: spacing.xl,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#e0dbd7',
    marginBottom: 14,
  },
  head: { ...globalStyles.row, alignItems: 'flex-start', gap: 12 },
  headText: { flex: 1 },
  code: {
    color: HERO_ACCENT_COLOR,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: HOME_NAVY,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 28,
  },
  close: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#f2efed',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  description: {
    color: '#414b5c',
    fontSize: 14.5,
    marginTop: 10,
    lineHeight: 21,
  },
  rows: { marginTop: 18, borderTopWidth: 1, borderTopColor: '#efe9e5' },
  row: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#efe9e5',
  },
  rowLabel: { color: colors.textMuted, fontSize: 14 },
  rowValue: {
    color: HOME_NAVY,
    fontSize: 14.5,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  note: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
  },
  noteText: { color: '#5b6470', fontSize: 13, lineHeight: 19, flex: 1 },
});

/** The illustration inside an occasion tile. */
export const OCCASION_TILE_ART = 34;

/** Four across, two down — the most this section may ever be tall. */
export const OCCASION_COLUMNS = 4;
export const OCCASION_ROWS = 2;
export const OCCASIONS_PER_PAGE = OCCASION_COLUMNS * OCCASION_ROWS;

/*
 * A quarter of the usable width, in points rather than a percentage.
 *
 * The grid scrolls horizontally, and a percentage inside a horizontal scroll
 * view measures against the content — which is as wide as the content is —
 * so every tile would collapse. Four of these fill the screen exactly, which
 * is what makes eight items look like a static grid and the ninth the first
 * thing off the edge.
 */
const OCCASION_PAGE_WIDTH = Dimensions.get('window').width - spacing.md * 2;
const OCCASION_COLUMN_WIDTH = OCCASION_PAGE_WIDTH / OCCASION_COLUMNS;

export const occasionGridStyles = StyleSheet.create({
  /*
   * Four to a row, wrapping. Each tile takes a fixed share of the width
   * rather than a fixed number of points, so the columns stay even on a small
   * phone and a large one without a second breakpoint to maintain.
   */
  /* Without flexGrow: 0 the scroll view claims the column's leftover height
     and stretches its tiles down the page. */
  scroll: { flexGrow: 0, marginTop: 14 },
  scrollContent: { paddingHorizontal: spacing.md },
  /*
   * One page is exactly the usable width, so four tiles fill a row and the
   * ninth starts the next page rather than dangling off the edge.
   */
  page: {
    width: OCCASION_PAGE_WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.md,
  },
  tile: { width: OCCASION_COLUMN_WIDTH, alignItems: 'center', gap: spacing.sm },
  tileArt: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    /* A warm near-white on a warm canvas: the tile should read as a raised
       square, not as a panel cut out of the page. */
    backgroundColor: '#fffdf7',
    borderWidth: 1,
    borderColor: '#f3e7d2',
  },
  tilePhoto: { width: '100%', height: '100%' },
  tileLabel: {
    color: HOME_NAVY,
    textAlign: 'center',
    /* A quarter of a phone is about 85pt of text. "Housewarming" fits that at
       11 and breaks mid-word at 12, which reads as a typo rather than a wrap. */
    fontSize: 11,
    lineHeight: 15,
    /* Room for two lines at every tile, so a one-line neighbour does not sit
       at a different height from a two-line one. */
    minHeight: 30,
    paddingHorizontal: 1,
  },
});

/*
 * The package card, after the reference: one photograph with a dark panel
 * across its foot.
 *
 * It used to be a picture with a white body under it, and the body kept
 * growing — title, organizer, rating, price, "booked this month" — until the
 * card was a list with a header image. The panel takes the three things a
 * customer picks a package on (what it is, who runs it, what it starts at)
 * and the one thing they can do about it, and lets the photograph have the
 * rest of the card.
 */
/*
 * Curated packages: tall photo cards. The picture fills the card, a dark wash
 * rises from the foot, and everything written sits on it in white.
 */
/*
 * The front card's share of the screen in the stacked packages carousel. The
 * rest is where the neighbours peek out on either side.
 */
export const PACKAGE_STACK_RATIO = 0.66;

/*
 * Curated packages: poster cards in a stacked carousel. The picture fills the
 * card, a dark wash rises from the foot, and everything written sits on it.
 */
export const packageCardStyles = StyleSheet.create({
  stackList: { paddingTop: 14, paddingBottom: 8 },
  card: {
    borderRadius: 22,
    backgroundColor: HOME_NAVY_DEEP,
    ...Platform.select({
      ios: {
        shadowColor: '#0b0f24',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
      android: { elevation: 3 },
    }),
  },
  pressArea: { flex: 1 },
  press: { flex: 1, borderRadius: 22, overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  art: {
    position: 'absolute',
    top: 32,
    alignSelf: 'center',
    width: 136,
    height: 112,
    opacity: 0.95,
  },
  /* Frosted, the way a pill on a poster is. */
  badge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(20,22,40,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingLeft: 5,
    paddingRight: 11,
    paddingVertical: 5,
    maxWidth: '80%',
  },
  badgeIcon: {
    width: 20,
    height: 20,
    borderRadius: 7,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 11,
    lineHeight: 15,
  },
  content: { flex: 1, justifyContent: 'flex-end', padding: 12, gap: 4 },
  title: { color: '#ffffff', fontSize: 15, lineHeight: 20, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 11, lineHeight: 15 },
  meta: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10.5,
    lineHeight: 15,
    marginTop: 1,
  },
  priceLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 2,
  },
  priceCaption: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10.5,
    lineHeight: 14,
  },
  price: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    flexShrink: 1,
  },
  listPrice: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  /* "View Package": a wide frosted button, leaving room on its right for the
     square heart that sits beside it. */
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 38,
    marginTop: 8,
    marginRight: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ctaText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12.5,
    lineHeight: 17,
  },
  heart: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/*
 * The organizer row, after the reference: a tile on the left, and on the
 * right a quiet line, the name, and the two facts that decide anything —
 * how busy they are and what they start at.
 *
 * The old row put the rating, the tier, the bookings, the starting price and
 * the reply time on one card in five sizes, and the name — the thing a
 * customer is actually reading — was set at the same weight as the rest of it.
 */
const ORGANIZER_CARD_WIDTH = 200;
const ORGANIZER_LOGO = 42;
/** The gradient ring around the logo, and the gap it leaves inside. */
const ORGANIZER_RING = ORGANIZER_LOGO + 6;

export const organizerRowStyles = StyleSheet.create({
  rowContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.s12,
    paddingBottom: spacing.sm,
    gap: spacing.s12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.s12,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.s12,
  },
  card: {
    width: ORGANIZER_CARD_WIDTH,
    borderRadius: 20,
    backgroundColor: colors.background,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: HOME_NAVY,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
      },
      android: { elevation: 3 },
    }),
  },
  cardInGrid: { width: '48.5%' },
  /* In the grid the touch area takes the column; the card fills it. */
  cardFill: { width: '100%' },
  cover: { height: 124 },
  coverImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverShade: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  /* Frosted, so it reads on a light photo and a dark one. */
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(11,15,36,0.32)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* The ring straddles the photo's bottom edge. */
  logoRing: {
    position: 'absolute',
    left: spacing.s12,
    bottom: -ORGANIZER_RING / 2,
    width: ORGANIZER_RING,
    height: ORGANIZER_RING,
    borderRadius: ORGANIZER_RING / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: ORGANIZER_LOGO,
    height: ORGANIZER_LOGO,
    borderRadius: ORGANIZER_LOGO / 2,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: { width: '100%', height: '100%' },
  logoText: { color: colors.onPrimary, fontWeight: '800', fontSize: 13 },
  body: {
    paddingHorizontal: spacing.s12,
    paddingTop: ORGANIZER_RING / 2 + 8,
    paddingBottom: spacing.s12,
    gap: 7,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: {
    color: HOME_NAVY,
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 19,
    flexShrink: 1,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fff6e0',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  rating: {
    color: '#9a6a08',
    fontWeight: '800',
    fontSize: 11.5,
    lineHeight: 15,
  },
  reviews: { color: colors.textMuted, fontSize: 11, lineHeight: 15 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  location: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    flexShrink: 1,
  },
  ratingLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tagRow: { flexDirection: 'row', gap: 5, overflow: 'hidden' },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 1,
  },
  tagText: { fontSize: 10.5, lineHeight: 14, fontWeight: '600' },
  emptyText: {
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    marginTop: 12,
    lineHeight: 20,
  },
});

export const trustStripStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    backgroundColor: colors.background,
    padding: 12,
  },
  label: { color: '#414b5c', fontSize: 12.5, marginTop: 10, lineHeight: 17 },
});

/** The warm cream the "other events" banner's photo fades into. */
export const OTHER_EVENT_CARD_BG = '#fbf1ea';
/** Side margin of the banner, matching every Home section's heading. */
export const OTHER_EVENT_GUTTER = spacing.md;

/*
 * "Your other events" — a banner per event: pill, title, date / city / guests,
 * a "View plan" button on the left, the occasion's photo on the right.
 */
export const otherEventCardStyles = StyleSheet.create({
  listContent: {
    paddingHorizontal: OTHER_EVENT_GUTTER,
    paddingTop: spacing.s12,
  },
  separator: { width: OTHER_EVENT_GUTTER / 2 },
  card: {
    height: 188,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: OTHER_EVENT_CARD_BG,
    borderWidth: 1,
    borderColor: 'rgba(232,99,58,0.14)',
  },
  photo: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '62%' },
  photoImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  /* The bouquet sits on the right of a 3:2 image; pin its right edge. */
  photoImageFloral: {
    position: 'absolute',
    top: -10,
    right: -30,
    bottom: -10,
    width: 320,
  },
  artLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  photoFade: { position: 'absolute', top: 0, left: 0 },
  content: { flex: 1, padding: spacing.md, justifyContent: 'space-between' },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '78%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillDot: { width: 7, height: 7, borderRadius: 4 },
  pillText: { color: HERO_ACCENT_COLOR, fontWeight: '700', fontSize: 11.5 },
  countdown: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: HOME_NAVY,
  },
  countdownText: { color: '#ffffff', fontWeight: '700', fontSize: 11 },
  title: {
    color: HOME_NAVY,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    maxWidth: '70%',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.s12,
    rowGap: 4,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: HOME_NAVY, fontWeight: '500' },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  ctaText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: 'rgba(26,46,90,0.08)',
  },
  progressFill: {
    height: 4,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  edit: {
    position: 'absolute',
    top: spacing.s12,
    right: spacing.s12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.s12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(26,46,90,0.18)',
  },
  dotActive: { width: 18, backgroundColor: HOME_NAVY },
});
