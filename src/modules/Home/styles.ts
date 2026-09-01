import { Dimensions, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import {
  BOOKED_RING_DISC,
  BOOKED_STEP_PENDING_COLOR,
  CATEGORY_ICON_BADGE_COLOR,
  HERO_ACCENT_COLOR,
  HERO_ACCENT_WARM_COLOR,
  HERO_BACKGROUND_COLOR,
  HERO_DECOR_CIRCLE_COLOR,
  HERO_FIELD_ICON_BG,
} from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorText: { color: colors.danger, textAlign: 'center' },
});

export const homeHeaderStyles = StyleSheet.create({
  container: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  locationButton: { ...globalStyles.row, flexShrink: 1, marginRight: spacing.md },
  locationLabel: { color: colors.text, marginLeft: spacing.xs, flexShrink: 1 },
  bellButton: { padding: spacing.xs },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.onPrimary, fontSize: 10, lineHeight: 12 },
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
  decorConfetti: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.25 },
  decorGarland: { position: 'absolute', top: -12, right: -46, width: 150, height: 130, opacity: 0.8 },
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
  searchLabel: { color: colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
  searchSummary: { color: CATEGORY_ICON_BADGE_COLOR, marginTop: 2, fontWeight: '700' },
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
  successText: { color: colors.onPrimary, textAlign: 'center', marginTop: spacing.xs },
  successEdit: { color: HERO_ACCENT_WARM_COLOR, marginTop: spacing.sm, textDecorationLine: 'underline' },
  formErrorText: { color: colors.danger, marginTop: spacing.sm, textAlign: 'center' },
  // Bottom sheet — chip pickers for all four fields plus the submit button.
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '82%',
  },
  sheetTitle: { color: colors.text },
  sheetSubtitle: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.sm },
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
  chipActive: { backgroundColor: CATEGORY_ICON_BADGE_COLOR, borderColor: CATEGORY_ICON_BADGE_COLOR },
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
  rowValue: { color: CATEGORY_ICON_BADGE_COLOR, marginTop: 1, fontSize: 16, fontWeight: '700' },
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
  emptyBody: { paddingHorizontal: spacing.md, paddingVertical: spacing.lg, alignItems: 'center' },
  emptyIconChip: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: HERO_FIELD_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 17, fontWeight: '700' },
  emptyText: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs },

  // Loading — four grey bars in the geometry of the four real rows, so the
  // card does not resize when the feed arrives.
  skeletonChip: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.surface, marginRight: spacing.sm },
  skeletonLabel: { width: 64, height: 9, borderRadius: 5, backgroundColor: colors.surface },
  skeletonValue: { width: '62%', height: 13, borderRadius: 6, backgroundColor: colors.surface, marginTop: spacing.xs },

  errorBody: { padding: spacing.lg, alignItems: 'center' },
  errorTitle: { color: colors.text, fontWeight: '700', marginTop: spacing.sm },
  errorText: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs },
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
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md, rowGap: spacing.sm },
  item: { ...globalStyles.row, marginRight: spacing.md, gap: spacing.xs },
  label: { color: colors.onPrimaryMuted },
});

// ---------------------------------------------------------------------------
// Home's "BOOKED" card. Single-column phone layout from the reference: a coral
// edge down the left, the progress ring in its wash disc, then the reference
// pill / title / sub-line / milestone chips, and a footer that puts the
// countdown and the action side by side.
// ---------------------------------------------------------------------------
export const bookedEventStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  card: {
    ...globalStyles.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg - 4,
    paddingLeft: spacing.md + 5,
    paddingRight: spacing.md,
    // Clips the coral edge to the card's rounded corners.
    overflow: 'hidden',
  },
  // Inset rather than a left border, so the radius stays a true 20 on both sides.
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: HERO_ACCENT_COLOR },

  ringWrap: {
    width: BOOKED_RING_DISC,
    height: BOOKED_RING_DISC,
    borderRadius: 999,
    backgroundColor: HERO_FIELD_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringPercent: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 17, fontWeight: '800' },
  ringCaption: { color: colors.textMuted, fontSize: 10, marginTop: 2 },

  refPill: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    borderRadius: 999,
    backgroundColor: HERO_FIELD_ICON_BG,
    paddingHorizontal: spacing.sm + 1,
    paddingVertical: 3,
  },
  refText: { color: HERO_ACCENT_COLOR, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },

  title: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 19, fontWeight: '800', marginTop: spacing.sm + 1 },
  desc: { color: colors.textMuted, marginTop: spacing.xs, lineHeight: 20 },

  steps: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md, rowGap: spacing.sm },
  step: { ...globalStyles.row, gap: 6, marginRight: spacing.md },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: BOOKED_STEP_PENDING_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { color: colors.textMuted, fontSize: 12 },
  stepLabelDone: { color: CATEGORY_ICON_BADGE_COLOR, fontWeight: '700' },

  footer: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  days: { ...globalStyles.row, alignItems: 'baseline', gap: 6 },
  daysCount: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 26, fontWeight: '800' },
  daysLabel: { color: colors.textMuted, fontSize: 13 },
  cta: {
    ...globalStyles.row,
    gap: spacing.xs,
    backgroundColor: HERO_ACCENT_COLOR,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 3,
  },
  ctaText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
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
  footerRow: { ...globalStyles.row, justifyContent: 'space-between', marginTop: spacing.sm },
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
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  progressLabel: { color: colors.textMuted },
});

// Narrow enough that the 2nd card shows fully and a sliver of the 3rd is
// visible too — a real, literal multi-card carousel, not a decorative peek.
export const CATEGORY_CARD_WIDTH = Dimensions.get('window').width * 0.42;
export const CATEGORY_CARD_SPACING = spacing.md;
const CATEGORY_CARD_HEIGHT = CATEGORY_CARD_WIDTH / 0.82;

// Web's reference card is 164x160 with an 11px/34px badge and a 92x74 art
// block starting 34px from the top — scaled by card width so the same
// relative geometry holds at our (larger, taller) card size.
const WEB_CARD_REFERENCE_WIDTH = 164;
const CATEGORY_SCALE = CATEGORY_CARD_WIDTH / WEB_CARD_REFERENCE_WIDTH;
export const CATEGORY_ICON_BADGE_SIZE = 34 * CATEGORY_SCALE;
export const CATEGORY_ICON_BADGE_OFFSET = 11 * CATEGORY_SCALE;
export const CATEGORY_ART_WIDTH = 92 * CATEGORY_SCALE;
export const CATEGORY_ART_HEIGHT = 74 * CATEGORY_SCALE;
export const CATEGORY_ART_TOP = 34 * CATEGORY_SCALE;

export const categoriesStyles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
  },
  header: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  title: { color: colors.text },
  seeAll: { color: colors.primary },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  card: {
    width: CATEGORY_CARD_WIDTH,
    height: CATEGORY_CARD_HEIGHT,
    borderRadius: 16,
    marginRight: CATEGORY_CARD_SPACING,
    overflow: 'hidden',
  },
  cardBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  confettiLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  artLayer: {
    position: 'absolute',
    top: CATEGORY_ART_TOP,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  iconBadge: {
    position: 'absolute',
    top: CATEGORY_ICON_BADGE_OFFSET,
    left: CATEGORY_ICON_BADGE_OFFSET,
    width: CATEGORY_ICON_BADGE_SIZE,
    height: CATEGORY_ICON_BADGE_SIZE,
    borderRadius: CATEGORY_ICON_BADGE_SIZE * 0.3,
    backgroundColor: colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaBlock: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  label: { color: colors.onPrimary },
  ctaRow: {
    ...globalStyles.row,
    marginTop: spacing.xs,
  },
  meta: { color: colors.onPrimaryMuted, marginRight: spacing.xs },
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
export const PACKAGE_CARD_WIDTH = Math.round(Dimensions.get('window').width * 0.84);
export const PACKAGE_CARD_SPACING = spacing.md;
export const PACKAGE_SNAP_INTERVAL = PACKAGE_CARD_WIDTH + PACKAGE_CARD_SPACING;

export const packagesStyles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  header: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  dots: { ...globalStyles.row, justifyContent: 'center', gap: 6, marginTop: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotOn: { width: 18, backgroundColor: HERO_ACCENT_COLOR },
  headText: { flex: 1, paddingRight: spacing.sm },
  title: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 20, fontWeight: '800' },
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
  banner: { height: PACKAGE_BANNER_HEIGHT, justifyContent: 'center', alignItems: 'center' },
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
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  body: { padding: spacing.md },
  titleRow: { ...globalStyles.row, justifyContent: 'space-between', gap: spacing.sm },
  packageTitle: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 18, fontWeight: '800', flexShrink: 1 },
  guests: { color: colors.textMuted },
  budget: { color: HERO_ACCENT_COLOR, fontSize: 21, fontWeight: '800', marginTop: spacing.xs },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm + 2, gap: spacing.sm },
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
  title: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 20, fontWeight: '800' },

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
  avatarText: { color: colors.onPrimary, fontSize: 18, fontWeight: '800' },
  idCol: { flex: 1 },
  name: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 17, fontWeight: '800' },
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

  ratingRow: { ...globalStyles.row, gap: 2, marginTop: spacing.md, flexWrap: 'wrap' },
  ratingValue: { color: CATEGORY_ICON_BADGE_COLOR, fontWeight: '800', marginLeft: spacing.xs },
  ratingMuted: { color: colors.textMuted, marginLeft: 3 },
  // Stands in for the rating line when nobody has reviewed this organizer yet.
  noRating: { color: colors.textMuted, marginTop: spacing.md },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm, gap: spacing.xs },
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
  viewButton: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  viewButtonText: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 15, fontWeight: '700' },
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
  emptyTitle: { color: CATEGORY_ICON_BADGE_COLOR, fontWeight: '700', marginTop: spacing.sm },
  emptyBody: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs },
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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
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
  avatar: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.onPrimary, fontSize: 18, fontWeight: '800' },
  headText: { flex: 1 },
  name: { color: CATEGORY_ICON_BADGE_COLOR, fontSize: 19, fontWeight: '800' },
  meta: { color: colors.textMuted, marginTop: 2 },
  centered: { alignItems: 'center', paddingVertical: spacing.xl },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },

  factRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  factLabel: { color: colors.textMuted },
  factValue: { color: CATEGORY_ICON_BADGE_COLOR, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
  facts: { marginTop: spacing.lg },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md, gap: spacing.xs },
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
  connector: { width: 2, flex: 1, marginTop: spacing.xs, marginBottom: spacing.xs },
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
