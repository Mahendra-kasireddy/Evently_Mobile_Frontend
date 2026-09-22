import { Dimensions, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand } from '../../theme';
import { colors, spacing } from '../../theme';
import {
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
  HOME_NAVY_PANEL,
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
  },
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
  actions: { ...globalStyles.row, gap: spacing.md },
  iconButton: { padding: 2 },
  iconButtonOnPhoto: {
    width: 40,
    height: 40,
    borderRadius: 999,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16,26,49,0.42)',
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
    borderColor: HERO_ACCENT_COLOR,
    backgroundColor: HOME_ACCENT_SOFT,
  },
  chipText: {
    color: HOME_NAVY,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  chipTextActive: { color: HERO_ACCENT_COLOR },

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
  ctaIdle: { opacity: 0.45 },
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

export const bookedEventStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  row: { marginTop: spacing.lg },
  rowContent: { paddingHorizontal: spacing.md, gap: 12 },
  card: {
    ...globalStyles.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    /* The head is painted to the card's edge, so the padding moved onto the
       two halves rather than sitting on the card. */
    padding: 0,
    overflow: 'hidden',
  },
  cardInRow: { width: BOOKED_CARD_WIDTH },

  /*
   * The head carries the warm sweep — the same one the Get quotes button runs,
   * so the two warmest things on Home are the action and the live booking.
   * Everything on it is reversed out; everything below it is on white.
   */
  head: { paddingHorizontal: spacing.md, paddingTop: 14, paddingBottom: 16 },
  headGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },

  /* Status, reference and countdown on one line: three facts about the same
     booking, none of them worth a row of its own. */
  topRow: { ...globalStyles.row, alignItems: 'center', gap: 10 },
  statusPill: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    /* Glass on the gradient rather than the mint pill it was: a pale green
       chip on coral is two unrelated colours arguing in one corner. */
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: colors.onPrimary,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  ref: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    letterSpacing: 0.4,
    flexShrink: 1,
  },
  /* Pushed right on its own, so the reference can be any length without the
     countdown drifting off the edge. */
  days: {
    ...globalStyles.row,
    alignItems: 'baseline',
    gap: 5,
    marginLeft: 'auto',
    flexShrink: 0,
  },
  daysCount: { color: colors.onPrimary, fontSize: 19, fontWeight: '700' },
  daysLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 13 },

  title: {
    color: colors.onPrimary,
    fontSize: 23,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 12,
  },
  facts: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
  },

  /* Everything the customer acts on, on white, under the head. */
  body: { padding: spacing.md },

  /* The organizer sits in their own panel: they are a party to the event, not
     another fact about it. */
  organizer: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    backgroundColor: HOME_CANVAS,
    padding: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  organizerText: { flex: 1 },
  organizerName: { color: HOME_NAVY_DEEP, fontSize: 15.5, fontWeight: '700' },
  organizerNote: { color: colors.textMuted, fontSize: 13.5, marginTop: 1 },
  chat: {
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  progressHead: { ...globalStyles.row, alignItems: 'center', marginTop: 18 },
  progressTitle: { color: HOME_NAVY_DEEP, fontSize: 15.5, fontWeight: '700' },
  progressCount: {
    color: colors.textMuted,
    fontSize: 13.5,
    marginLeft: 'auto',
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: HOME_TRACK,
    marginTop: 10,
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: 999, backgroundColor: HERO_ACCENT_COLOR },

  /* One column per milestone, equal width, so the dots line up with the bar
     above them rather than bunching under the longest label. */
  steps: { flexDirection: 'row', marginTop: 12 },
  step: { flex: 1, paddingRight: 8 },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: BOOKED_STEP_PENDING_COLOR,
  },
  stepDotDone: { backgroundColor: BOOKED_STEP_DONE_COLOR },
  stepDotNext: { backgroundColor: HERO_ACCENT_COLOR },
  stepLabel: {
    color: colors.textMuted,
    fontSize: 12.5,
    marginTop: 7,
    lineHeight: 16,
  },
  stepLabelDone: { color: HOME_NAVY_DEEP },
  /* The one still to do is the only thing on this card worth acting on, so it
     is the only label in the accent colour. */
  stepLabelNext: { color: HERO_ACCENT_COLOR, fontWeight: '600' },

  /* Navy, not coral. The head is already the warm colour, and a coral button
     under a coral gradient is one card wearing the same note twice. */
  cta: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HOME_NAVY_DEEP,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 18,
  },
  ctaText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
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

export const eventHeroStyles = StyleSheet.create({
  card: {
    backgroundColor: HOME_NAVY_DEEP,
    borderRadius: 22,
    margin: spacing.md,
    marginBottom: 0,
    padding: spacing.md + 2,
    overflow: 'hidden',
  },
  /** The soft disc the confetti sits in, top-right. */
  decor: {
    position: 'absolute',
    top: -46,
    right: -34,
    width: 190,
    height: 190,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorArt: {
    position: 'absolute',
    top: -18,
    right: -4,
    width: 150,
    height: 130,
  },

  stageRow: { ...globalStyles.row, gap: 7 },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: HOME_GREEN,
  },
  stageText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.onPrimary,
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginTop: 10,
  },
  facts: {
    color: 'rgba(255,255,255,0.66)',
    fontSize: 14.5,
    marginTop: 6,
    lineHeight: 20,
  },

  progressRow: { ...globalStyles.row, gap: 14, marginTop: 18 },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3, backgroundColor: HERO_ACCENT_COLOR },
  progressLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13.5,
    fontWeight: '500',
  },

  /** "Closes in 4 days" — the one thing on this card with a clock on it. */
  closesPill: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    borderRadius: 999,
    backgroundColor: HERO_ACCENT_COLOR,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  closesText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },

  /* One panel per reply. Each is a row the customer compares against the
     others, so they share a width and differ only in what they say. */
  quoteRow: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 12,
    backgroundColor: HOME_NAVY_PANEL,
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
  },
  quoteAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quoteAvatarText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  quoteText: { flex: 1, minWidth: 0 },
  quoteName: { color: colors.onPrimary, fontSize: 15.5, fontWeight: '600' },
  quoteMeta: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 },
  quoteMoney: { alignItems: 'flex-end', flexShrink: 0 },
  quoteTotal: { color: colors.onPrimary, fontSize: 16.5, fontWeight: '700' },
  /* Green on the cheapest, muted on the rest: the delta is information, not a
     warning, and colouring every row would say all of them are notable. */
  quoteDelta: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 },
  quoteDeltaLowest: { color: HOME_GREEN, fontWeight: '600' },

  /* The organizers still to answer, drawn as an empty seat rather than a row
     — there is nothing to compare yet, and it should not look like there is. */
  awaitingRow: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  awaitingSlot: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.28)',
    flexShrink: 0,
  },
  awaitingText: { color: 'rgba(255,255,255,0.58)', fontSize: 14, flex: 1 },

  /** The quote-spread panel, a step lighter than the card it sits on. */
  panel: {
    ...globalStyles.row,
    gap: 12,
    backgroundColor: HOME_NAVY_PANEL,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
  },
  panelIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: HERO_ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelText: { flex: 1 },
  panelTitle: {
    color: colors.onPrimary,
    fontSize: 15.5,
    fontWeight: '600',
    lineHeight: 21,
  },
  panelBody: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13.5,
    marginTop: 2,
    lineHeight: 19,
  },

  cta: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: HERO_ACCENT_COLOR,
    marginTop: 16,
  },
  ctaText: { color: colors.onPrimary, fontSize: 16.5, fontWeight: '600' },
  link: { alignItems: 'center', paddingVertical: 14 },
  linkText: { color: 'rgba(255,255,255,0.72)', fontSize: 14.5 },
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
export const packageCardStyles = StyleSheet.create({
  card: {
    width: 268,
    borderRadius: 22,
    backgroundColor: HOME_NAVY_DEEP,
    overflow: 'hidden',
  },
  /* Tall, because it is now the card rather than its header. */
  banner: { height: 196, justifyContent: 'flex-end' },
  bannerLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  bannerArt: {
    position: 'absolute',
    top: 18,
    right: 8,
    width: 118,
    height: 100,
    opacity: 0.85,
  },
  bannerNote: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12.5,
    fontWeight: '500',
    padding: 12,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 999,
    backgroundColor: colors.background,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  badgeText: {
    color: HERO_ACCENT_COLOR,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  /* On the photograph, opposite the badge: a rating is about the organizer,
     not the package, so it does not belong in the panel with the price. */
  ratingChip: {
    ...globalStyles.row,
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(12,18,32,0.62)',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  rating: { color: colors.onPrimary, fontSize: 12.5, fontWeight: '700' },
  reviews: { color: 'rgba(255,255,255,0.72)', fontSize: 12 },

  /* The panel. Solid, not a scrim: white type over a photograph is legible
     only for as long as nobody uploads a pale one. */
  body: { backgroundColor: HOME_NAVY_DEEP, padding: 14, paddingTop: 13 },
  title: {
    color: colors.onPrimary,
    fontSize: 16.5,
    fontWeight: '700',
    lineHeight: 21,
    /* Clear of the heart, which floats over this row. */
    paddingRight: 44,
  },
  metaRow: { ...globalStyles.row, gap: 5, marginTop: 5 },
  meta: { color: 'rgba(255,255,255,0.76)', fontSize: 13, flexShrink: 1 },

  priceRow: { ...globalStyles.row, gap: 10, marginTop: 12 },
  priceText: { flex: 1 },
  priceCaption: { color: 'rgba(255,255,255,0.6)', fontSize: 11.5 },
  price: {
    color: colors.onPrimary,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  listPrice: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12.5,
    textDecorationLine: 'line-through',
  },
  /* The action the card is for, in the brand accent — the one warm thing on
     the panel, so there is no question what to press. */
  cta: {
    borderRadius: 999,
    backgroundColor: HERO_ACCENT_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexShrink: 0,
  },
  ctaText: { color: colors.onPrimary, fontSize: 13.5, fontWeight: '700' },

  /*
   * Over the seam, top-right, as in the reference.
   *
   * Measured from the top rather than the bottom: the banner is a fixed 196
   * and the panel is not — a two-line title makes it taller — so anchoring to
   * the bottom would slide the heart up and down with the wording.
   */
  heart: {
    position: 'absolute',
    top: 178,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.background,
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
export const organizerRowStyles = StyleSheet.create({
  card: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HOME_HAIRLINE,
    padding: 10,
    marginHorizontal: spacing.md,
    marginTop: 10,
  },
  /*
   * The reference has a photograph here. An organizer has no cover image in
   * the feed, so the tile is their own monogram on their own colour — which
   * is what every other surface in the app identifies them by.
   */
  avatar: {
    width: 92,
    height: 84,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: colors.onPrimary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  text: { flex: 1, minHeight: 84 },
  /* The quiet line above the name, where the reference puts its date. */
  metaRow: { ...globalStyles.row, gap: 4 },
  rating: { color: HOME_NAVY, fontSize: 13, fontWeight: '700' },
  reviews: { color: colors.textMuted, fontSize: 12.5 },
  dot: { color: colors.textMuted, fontSize: 12.5 },
  tier: { fontSize: 12.5, fontWeight: '700' },
  name: {
    color: HOME_NAVY,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    letterSpacing: -0.2,
    marginTop: 3,
  },

  /* The foot of the card: what they have done lately on the left, what they
     start at on the right — the reference's "200+ registered" and "Public". */
  factRow: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
    paddingTop: 8,
  },
  booked: { color: colors.textMuted, fontSize: 12.5, flexShrink: 1 },
  right: { ...globalStyles.row, alignItems: 'baseline', gap: 4, marginLeft: 'auto', flexShrink: 0 },
  fromLabel: { color: colors.textMuted, fontSize: 11.5 },
  fromValue: { color: HOME_NAVY, fontSize: 14.5, fontWeight: '700' },
  replies: { color: HOME_GREEN, fontSize: 12.5 },
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
