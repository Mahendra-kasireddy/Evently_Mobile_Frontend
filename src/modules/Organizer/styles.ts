import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
  brand,
  colors,
  spacing,
  fontWeights,
  textColor,
  typography,
} from '../../theme';
import {
  ORG_ACCENT,
  ORG_BAR,
  ORG_CANVAS,
  ORG_CHECK,
  ORG_GREEN,
  ORG_HAIRLINE,
  ORG_NAVY,
  ORG_NAVY_DEEP,
  ORG_NAVY_PANEL,
  ORG_TRACK,
} from './constants';

/** The cover is this tall before the identity card is pulled up over it. */
export const COVER_HEIGHT = 208;
/** How far the identity card overlaps the cover. */
const CARD_LIFT = 56;
/** Portfolio tile. Tall rather than square, as the design has it. */
export const WORK_TILE_WIDTH = 164;
export const WORK_TILE_HEIGHT = 208;

/** Every card on this screen shares one shape, so the column reads as one thing. */
/** RN's own absoluteFillObject isn't in this version's types; same thing. */
const fill = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

const card = {
  backgroundColor: brand.surface,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: ORG_HAIRLINE,
} as const;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORG_CANVAS },
  content: { paddingBottom: spacing.s40 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  loadingText: { color: textColor.textSecondary, marginTop: spacing.md },
  errorTitle: { color: ORG_NAVY, marginTop: spacing.md, textAlign: 'center' },
  errorText: {
    color: textColor.textError,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: ORG_ACCENT, ...fontWeights.bold },

  /** Section headings sit in the gutter; the cards they head are inset the same. */
  sectionHead: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.s12,
  },
  sectionTitle: { ...typography.h2, color: ORG_NAVY },
  sectionMeta: { color: textColor.textSecondary },
  note: {
    color: textColor.textSecondary,
    paddingHorizontal: spacing.md,
    marginTop: spacing.s12,
  },
  /** The rating block carries its own heading, so it needs the gap itself. */
  ratingSpacing: { marginTop: spacing.lg },
});

// ---------------------------------------------------------------------------
// Cover
// ---------------------------------------------------------------------------

export const coverStyles = StyleSheet.create({
  wrap: { height: COVER_HEIGHT, backgroundColor: ORG_NAVY_DEEP },
  art: { ...fill },
  photo: { ...fill },
  /** Keeps the controls and the badge legible over any uploaded photo. */
  scrim: { ...fill, backgroundColor: 'rgba(14,26,51,0.34)' },
  topRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.s12,
  },
  actions: { ...globalStyles.row, gap: spacing.sm },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(16,26,49,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    left: spacing.md,
    // Clear of the identity card, which is lifted over the cover's bottom edge.
    bottom: CARD_LIFT + spacing.s12,
    ...globalStyles.row,
    gap: 6,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: spacing.s12,
    backgroundColor: 'rgba(16,26,49,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  badgeText: { color: textColor.textOnPrimary },
});

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

export const identityStyles = StyleSheet.create({
  card: {
    ...card,
    marginHorizontal: spacing.md,
    marginTop: -CARD_LIFT,
    padding: spacing.md,
  },
  head: { ...globalStyles.row, alignItems: 'flex-start', gap: spacing.s12 },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // Lifts the monogram over the card's top edge, as the design has it.
    marginTop: -spacing.xl,
    borderWidth: 3,
    borderColor: brand.surface,
  },
  avatarText: { color: textColor.textOnPrimary, ...typography.h1 },
  headText: { flex: 1, gap: 6 },
  name: { color: ORG_NAVY, ...typography.h2 },
  tierChip: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: 5,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: brand.coolSoft,
  },
  tierText: { color: textColor.textSecondary },
  place: { color: brand.textMuted },

  divider: {
    height: 1,
    backgroundColor: ORG_HAIRLINE,
    marginVertical: spacing.md,
  },

  stats: { ...globalStyles.row, justifyContent: 'space-between' },
  stat: { flex: 1, gap: 2 },
  statValue: { color: ORG_NAVY, ...typography.h2 },
  statLabel: { color: textColor.textSecondary },
});

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

export const availabilityStyles = StyleSheet.create({
  card: {
    ...globalStyles.row,
    gap: spacing.s12,
    marginHorizontal: spacing.md,
    marginTop: spacing.s12,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: '#e9f3ee',
    borderWidth: 1,
    borderColor: '#d7e8df',
  },
  text: { flex: 1, gap: 3 },
  title: { color: textColor.textPrimary, ...fontWeights.semibold },
  detail: { color: '#476155' },
  hold: {
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    backgroundColor: brand.surface,
    borderWidth: 1,
    borderColor: '#cfe2d8',
  },
  holdText: { color: ORG_GREEN, ...fontWeights.semibold },
});

// ---------------------------------------------------------------------------
// Assurances
// ---------------------------------------------------------------------------

export const assuranceStyles = StyleSheet.create({
  card: { ...card, marginHorizontal: spacing.md, marginTop: spacing.s12 },
  row: { ...globalStyles.row, gap: spacing.s12, padding: spacing.md },
  divider: {
    height: 1,
    backgroundColor: ORG_HAIRLINE,
    marginHorizontal: spacing.md,
  },
  text: { flex: 1, color: ORG_NAVY },
});

// ---------------------------------------------------------------------------
// Recent work
// ---------------------------------------------------------------------------

export const workStyles = StyleSheet.create({
  strip: { paddingHorizontal: spacing.md, gap: spacing.s12 },
  tile: {
    width: WORK_TILE_WIDTH,
    height: WORK_TILE_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: ORG_NAVY_PANEL,
  },
  photo: { ...fill, borderRadius: 16 },
  art: { ...fill },
});

// ---------------------------------------------------------------------------
// What they handle
// ---------------------------------------------------------------------------

export const chipStyles = StyleSheet.create({
  wrap: {
    ...globalStyles.row,
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chip: {
    ...globalStyles.row,
    gap: 6,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: spacing.s12,
    backgroundColor: brand.surface,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
  },
  chipText: { color: ORG_NAVY },
  check: { color: ORG_CHECK },
});

// ---------------------------------------------------------------------------
// Rating
// ---------------------------------------------------------------------------

export const ratingStyles = StyleSheet.create({
  card: {
    ...card,
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: spacing.md,
    marginHorizontal: spacing.md,
    padding: spacing.md,
  },
  left: { alignItems: 'flex-start', gap: 4, minWidth: 92 },
  score: { color: ORG_NAVY, ...typography.display },
  stars: { ...globalStyles.row, gap: 1 },
  reviews: { color: ORG_ACCENT, ...fontWeights.semibold },
  bars: { flex: 1, gap: 6, paddingTop: 6 },
  barRow: { ...globalStyles.row, gap: spacing.sm },
  barStars: { color: brand.textMuted, width: 10 },
  track: {
    flex: 1,
    height: 7,
    borderRadius: 999,
    backgroundColor: ORG_TRACK,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 999, backgroundColor: ORG_BAR },
  barCount: { color: textColor.textSecondary, width: 26, textAlign: 'right' },

  emptyBody: { ...typography.body, color: textColor.textSecondary, flex: 1 },
  completed: { color: brand.textMuted, marginTop: 2 },
});

/** The one review shown inline, as a taste of the full page. */
export const previewStyles = StyleSheet.create({
  card: {
    ...card,
    marginHorizontal: spacing.md,
    marginTop: spacing.s12,
    padding: spacing.md,
  },
  head: { ...globalStyles.row, gap: spacing.s12 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: textColor.textOnPrimary },
  headText: { flex: 1, gap: 1 },
  name: { color: ORG_NAVY },
  context: { color: textColor.textSecondary },
  scoreRow: { ...globalStyles.row, gap: 3 },
  score: { color: ORG_NAVY, ...fontWeights.semibold },
  comment: { color: brand.textMuted, marginTop: spacing.s12 },
  all: {
    ...globalStyles.row,
    gap: 3,
    alignSelf: 'flex-start',
    marginTop: spacing.s12,
  },
  allText: { color: ORG_ACCENT },
});

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export const footerStyles = StyleSheet.create({
  bar: {
    backgroundColor: brand.surface,
    borderTopWidth: 1,
    borderTopColor: ORG_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.s12,
    paddingBottom: spacing.s12,
    gap: spacing.s12,
  },
  row: { ...globalStyles.row, justifyContent: 'space-between' },
  typicalRow: { ...globalStyles.row, gap: 6 },
  typicalLabel: { color: textColor.textDisabled },
  typicalValue: { color: ORG_NAVY, ...typography.h3 },
  replyRow: { ...globalStyles.row, gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: ORG_CHECK },
  reassurance: { color: brand.textMuted },

  actions: { ...globalStyles.row, gap: spacing.s12 },
  message: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.surface,
  },
  cta: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT,
  },
  ctaBusy: { opacity: 0.7 },
  ctaDone: { backgroundColor: brand.disabledBg },
  ctaText: { color: textColor.textOnPrimary, ...typography.button },
  ctaNote: { color: 'rgba(255,255,255,0.86)' },
  ctaDoneText: { color: textColor.textSecondary },
  error: { color: textColor.textError },
});

export const reviewsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORG_CANVAS },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#fdeee7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...typography.h2,
    color: ORG_NAVY,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.body,
    color: textColor.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    color: textColor.textError,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: ORG_ACCENT, ...fontWeights.bold },
  more: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    backgroundColor: colors.background,
    marginTop: 4,
  },
  moreText: { color: ORG_NAVY, ...typography.h3 },
});

export const summaryCardStyles = StyleSheet.create({
  card: {
    ...globalStyles.row,
    gap: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    padding: spacing.md,
    marginBottom: 14,
  },
  left: { alignItems: 'center', flexShrink: 0 },
  score: { color: ORG_NAVY, ...typography.display },
  total: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    marginTop: 2,
  },
  bars: { flex: 1, gap: 7 },
  barRow: { ...globalStyles.row, gap: 10 },
  barStars: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    width: 10,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: ORG_TRACK,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 999, backgroundColor: '#e8a33a' },
  barCount: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    minWidth: 22,
    textAlign: 'right',
  },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  tag: {
    ...globalStyles.row,
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tagLabel: { color: ORG_NAVY, ...typography.body, ...fontWeights.medium },
  tagCount: { color: textColor.textSecondary, ...typography.body },
});

export const reviewCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    padding: spacing.md,
    marginBottom: 12,
  },
  head: { ...globalStyles.row, gap: 12 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: textColor.textOnPrimary, ...typography.h3 },
  headText: { flex: 1 },
  name: { color: ORG_NAVY, ...typography.h3 },
  context: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    marginTop: 1,
  },
  stars: { ...globalStyles.row, gap: 3, flexShrink: 0 },
  comment: {
    color: textColor.textPrimary,
    ...typography.bodyLarge,
    marginTop: 12,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: {
    borderRadius: 999,
    backgroundColor: ORG_TRACK,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: textColor.textSecondary, ...typography.label },
});

export const leaveReviewStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(14,26,51,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: ORG_CANVAS,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: spacing.lg,
    maxHeight: '90%',
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: ORG_TRACK,
    alignSelf: 'center',
    marginTop: 10,
  },
  title: {
    color: ORG_NAVY,
    ...typography.h2,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  subtitle: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    paddingHorizontal: spacing.md,
    marginTop: 4,
  },
  groupLabel: {
    color: textColor.textSecondary,
    ...typography.overline,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: 10,
  },
  starRow: { ...globalStyles.row, gap: 10, paddingHorizontal: spacing.md },
  starButton: { padding: 2 },
  starWord: { color: ORG_NAVY, ...typography.h3, marginLeft: 6 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: ORG_NAVY, borderColor: ORG_NAVY },
  chipText: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    ...fontWeights.medium,
  },
  chipTextOn: { color: colors.onPrimary },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    backgroundColor: colors.background,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    minHeight: 110,
    textAlignVertical: 'top',
    color: textColor.textPrimary,
    ...fontWeights.regular,
  },
  permanence: {
    color: textColor.textSecondary,
    ...typography.caption,
    paddingHorizontal: spacing.md,
    marginTop: 12,
  },
  submit: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: ORG_ACCENT,
    marginHorizontal: spacing.md,
    marginTop: 12,
  },
  submitDisabled: { opacity: 0.45 },
  submitText: { color: textColor.textOnPrimary, ...typography.h3 },
  error: {
    color: textColor.textError,
    ...typography.caption,
    textAlign: 'center',
    marginTop: 8,
  },
});
