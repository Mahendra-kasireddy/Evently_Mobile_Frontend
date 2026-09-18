import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand, colors, fontFor, spacing } from '../../theme';
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
const fill = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const;

const card = {
  backgroundColor: brand.surface,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: ORG_HAIRLINE,
} as const;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORG_CANVAS },
  content: { paddingBottom: spacing.s40 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorTitle: { color: ORG_NAVY, marginTop: spacing.md, textAlign: 'center' },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
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
  retryText: { color: ORG_ACCENT, fontWeight: '700' },

  /** Section headings sit in the gutter; the cards they head are inset the same. */
  sectionHead: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.s12,
  },
  sectionTitle: { color: ORG_NAVY, letterSpacing: -0.2 },
  sectionMeta: { color: brand.textMuted },
  note: {
    color: brand.textMuted,
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
  badgeText: { color: brand.onNavy },
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
  avatarText: { color: brand.onNavy, fontSize: 24, lineHeight: 30, fontWeight: '700' },
  headText: { flex: 1, gap: 6 },
  name: { color: ORG_NAVY, fontSize: 23, lineHeight: 29, letterSpacing: -0.4, fontWeight: '700' },
  tierChip: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: 5,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: brand.coolSoft,
  },
  tierText: { color: brand.textMuted },
  place: { color: brand.textMuted },

  divider: { height: 1, backgroundColor: ORG_HAIRLINE, marginVertical: spacing.md },

  stats: { ...globalStyles.row, justifyContent: 'space-between' },
  stat: { flex: 1, gap: 2 },
  statValue: { color: ORG_NAVY, fontSize: 21, lineHeight: 26, letterSpacing: -0.3, fontWeight: '700' },
  statLabel: { color: brand.textMuted },
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
  title: { color: '#1c3f33', fontWeight: '600' },
  detail: { color: '#476155' },
  hold: {
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    backgroundColor: brand.surface,
    borderWidth: 1,
    borderColor: '#cfe2d8',
  },
  holdText: { color: ORG_GREEN, fontWeight: '600' },
});

// ---------------------------------------------------------------------------
// Assurances
// ---------------------------------------------------------------------------

export const assuranceStyles = StyleSheet.create({
  card: { ...card, marginHorizontal: spacing.md, marginTop: spacing.s12 },
  row: { ...globalStyles.row, gap: spacing.s12, padding: spacing.md },
  divider: { height: 1, backgroundColor: ORG_HAIRLINE, marginHorizontal: spacing.md },
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
  score: { color: ORG_NAVY, fontSize: 46, lineHeight: 52, letterSpacing: -1.4, fontWeight: '700' },
  stars: { ...globalStyles.row, gap: 1 },
  reviews: { color: ORG_ACCENT, fontWeight: '600' },
  bars: { flex: 1, gap: 6, paddingTop: 6 },
  barRow: { ...globalStyles.row, gap: spacing.sm },
  barStars: { color: brand.textMuted, width: 10 },
  track: { flex: 1, height: 7, borderRadius: 999, backgroundColor: ORG_TRACK, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: ORG_BAR },
  barCount: { color: brand.textMuted, width: 26, textAlign: 'right' },

  emptyBody: { color: brand.textMuted, flex: 1 },
  completed: { color: brand.textMuted, marginTop: 2 },
});

/** The one review shown inline, as a taste of the full page. */
export const previewStyles = StyleSheet.create({
  card: { ...card, marginHorizontal: spacing.md, marginTop: spacing.s12, padding: spacing.md },
  head: { ...globalStyles.row, gap: spacing.s12 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: brand.onNavy },
  headText: { flex: 1, gap: 1 },
  name: { color: ORG_NAVY },
  context: { color: brand.textMuted },
  scoreRow: { ...globalStyles.row, gap: 3 },
  score: { color: ORG_NAVY, fontWeight: '600' },
  comment: { color: brand.textMuted, marginTop: spacing.s12 },
  all: { ...globalStyles.row, gap: 3, alignSelf: 'flex-start', marginTop: spacing.s12 },
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
  typicalLabel: { color: brand.textPlaceholder, letterSpacing: 0.6 },
  typicalValue: { color: ORG_NAVY, fontSize: 17, lineHeight: 22, fontWeight: '700' },
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
  ctaText: { color: brand.onAccent, fontSize: 17, lineHeight: 22, fontWeight: '600' },
  ctaNote: { color: 'rgba(255,255,255,0.86)' },
  ctaDoneText: { color: brand.textMuted },
  error: { color: colors.danger },
});

export const reviewsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORG_CANVAS },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#fdeee7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { color: ORG_NAVY, marginTop: spacing.md, textAlign: 'center' },
  emptyBody: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
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
  retryText: { color: ORG_ACCENT, fontWeight: '700' },
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
  moreText: { color: ORG_NAVY, fontSize: 15, fontWeight: '600' },
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
  score: { color: ORG_NAVY, fontSize: 42, fontWeight: '700', letterSpacing: -1.2 },
  total: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  bars: { flex: 1, gap: 7 },
  barRow: { ...globalStyles.row, gap: 10 },
  barStars: { color: colors.textMuted, fontSize: 13, width: 10 },
  track: { flex: 1, height: 8, borderRadius: 999, backgroundColor: ORG_TRACK, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: '#e8a33a' },
  barCount: { color: colors.textMuted, fontSize: 13, minWidth: 22, textAlign: 'right' },

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
  tagLabel: { color: ORG_NAVY, fontSize: 14.5, fontWeight: '500' },
  tagCount: { color: colors.textMuted, fontSize: 14 },
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
  avatar: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.onPrimary, fontSize: 15, fontWeight: '700' },
  headText: { flex: 1 },
  name: { color: ORG_NAVY, fontSize: 16, fontWeight: '700' },
  context: { color: colors.textMuted, fontSize: 13.5, marginTop: 1, lineHeight: 18 },
  stars: { ...globalStyles.row, gap: 3, flexShrink: 0 },
  comment: { color: '#25303f', fontSize: 15, lineHeight: 22, marginTop: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: { borderRadius: 999, backgroundColor: ORG_TRACK, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { color: '#5b6470', fontSize: 12 },
});

export const leaveReviewStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(14,26,51,0.45)', justifyContent: 'flex-end' },
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
  title: { color: ORG_NAVY, fontSize: 22, fontWeight: '700', paddingHorizontal: spacing.md, marginTop: spacing.md },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13.5,
    lineHeight: 19,
    paddingHorizontal: spacing.md,
    marginTop: 4,
  },
  groupLabel: {
    color: '#7b8595',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: 10,
  },
  starRow: { ...globalStyles.row, gap: 10, paddingHorizontal: spacing.md },
  starButton: { padding: 2 },
  starWord: { color: ORG_NAVY, fontSize: 15, fontWeight: '600', marginLeft: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: spacing.md },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: ORG_NAVY, borderColor: ORG_NAVY },
  chipText: { color: '#414b5c', fontSize: 13.5, fontWeight: '500' },
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
    color: colors.text,
    fontFamily: fontFor('400'),
  },
  permanence: {
    color: colors.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
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
  submitText: { color: colors.onPrimary, fontSize: 16, fontWeight: '600' },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center', marginTop: 8 },
});
