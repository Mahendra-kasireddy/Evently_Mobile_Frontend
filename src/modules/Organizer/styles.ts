import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, fontFor, spacing } from '../../theme';
import {
  ORG_ACCENT,
  ORG_CANVAS,
  ORG_GREEN,
  ORG_HAIRLINE,
  ORG_NAVY,
  ORG_NAVY_DEEP,
  ORG_NAVY_PANEL,
  ORG_TRACK,
} from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORG_CANVAS },
  content: { paddingBottom: spacing.xl },
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

  sectionTitle: {
    color: ORG_NAVY,
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: -0.3,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: spacing.md,
    marginTop: 12,
  },
});

export const heroStyles = StyleSheet.create({
  hero: { backgroundColor: ORG_NAVY_DEEP, paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  topRow: { ...globalStyles.row, justifyContent: 'space-between', paddingTop: spacing.sm },
  back: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allReviews: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  allReviewsText: { color: colors.onPrimary, fontSize: 14.5, fontWeight: '600' },

  identity: { ...globalStyles.row, gap: 14, marginTop: spacing.lg },
  avatar: { width: 76, height: 76, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.onPrimary, fontSize: 25, fontWeight: '700' },
  identityText: { flex: 1 },
  name: { color: colors.onPrimary, fontSize: 25, fontWeight: '700', letterSpacing: -0.4, lineHeight: 32 },
  metaRow: { ...globalStyles.row, gap: spacing.sm, marginTop: 6, flexWrap: 'wrap' },
  tierChip: {
    ...globalStyles.row,
    gap: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  tierText: { color: colors.onPrimary, fontSize: 13, fontWeight: '600' },
  place: { color: 'rgba(255,255,255,0.72)', fontSize: 14.5, flexShrink: 1 },
  headline: { color: ORG_ACCENT, fontSize: 14.5, fontWeight: '600', marginTop: 8 },

  stats: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  stat: { flex: 1, backgroundColor: ORG_NAVY_PANEL, borderRadius: 14, padding: 14 },
  /*
   * A lone stat sizes to its content instead of spanning the row. Stretched,
   * "24h / avg reply" in a full-width box reads as a panel that failed to
   * fill rather than as the one figure this organizer has published.
   */
  statAlone: { flex: 0, minWidth: 132 },
  statValue: { color: colors.onPrimary, fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12.5, marginTop: 2 },
});

export const workStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: spacing.md,
    marginTop: 14,
  },
  /*
    * No flexGrow. With it, a lone photo stretched to the full row and
    * aspectRatio then made it as tall as the screen was wide — one upload
    * filled the whole page and pushed everything under it out of sight.
    * A fixed share keeps three to a row however many there are.
    */
  tile: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: ORG_TRACK,
  },
  photo: { width: '100%', height: '100%' },
});

export const chipStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: spacing.md,
    marginTop: 14,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  chipText: { color: ORG_NAVY, fontSize: 15, fontWeight: '500' },
});

export const ratingCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: 14,
  },
  head: { ...globalStyles.row, justifyContent: 'space-between' },
  title: { color: ORG_NAVY, fontSize: 18, fontWeight: '700' },
  reviewsLink: { color: ORG_ACCENT, fontSize: 14.5, fontWeight: '600' },
  body: { ...globalStyles.row, gap: 14, marginTop: 12 },
  score: { color: ORG_NAVY, fontSize: 40, fontWeight: '700', letterSpacing: -1 },
  stars: { ...globalStyles.row, gap: 3 },
  completed: { color: colors.textMuted, fontSize: 14, marginTop: 4 },
  emptyBody: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 8 },
});

export const footerStyles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    borderTopColor: ORG_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: spacing.md,
  },
  row: { ...globalStyles.row, justifyContent: 'space-between', gap: spacing.sm },
  typicalRow: { ...globalStyles.row, gap: 8 },
  typicalLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  typicalValue: { color: ORG_NAVY, fontSize: 19, fontWeight: '700', letterSpacing: -0.3 },
  reassurance: { color: ORG_GREEN, fontSize: 14, fontWeight: '500', flexShrink: 1, textAlign: 'right' },
  actions: { ...globalStyles.row, gap: 12, marginTop: 12 },
  /** Square, so the quote button keeps the width it needs for its label. */
  message: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ORG_HAIRLINE,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cta: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: ORG_ACCENT,
  },
  ctaBusy: { opacity: 0.6 },
  ctaDone: { backgroundColor: '#e8f6ef' },
  ctaText: { color: colors.onPrimary, fontSize: 17, fontWeight: '600' },
  ctaDoneText: { color: ORG_GREEN },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center', marginTop: 8 },
});

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

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
