import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { WORKSPACE_ACCENT, WORKSPACE_ACCENT_SOFT, WORKSPACE_NAVY, WORKSPACE_NAVY_DEEP } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorText: { color: colors.danger, textAlign: 'center' },
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
  retryText: { color: WORKSPACE_ACCENT, fontWeight: '700' },
});

// The navy hero: progress ring, status and countdown.
export const heroStyles = StyleSheet.create({
  card: {
    backgroundColor: WORKSPACE_NAVY_DEEP,
    borderRadius: 20,
    margin: spacing.md,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  top: { ...globalStyles.row, gap: spacing.md },
  ringWrap: { width: 78, height: 78, alignItems: 'center', justifyContent: 'center' },
  ringText: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringPercent: { color: colors.onPrimary, fontSize: 17, fontWeight: '800' },
  ringCaption: { color: colors.onPrimaryMuted, fontSize: 10, marginTop: 1 },
  headText: { flex: 1 },
  eyebrow: {
    color: colors.onPrimaryMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: { color: colors.onPrimary, fontSize: 20, fontWeight: '800', marginTop: 2 },
  statusPill: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { color: colors.onPrimary, fontWeight: '700' },
  countdown: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  countdownCount: { color: colors.onPrimary, fontSize: 26, fontWeight: '800' },
  countdownLabel: { color: colors.onPrimaryMuted },
});

export const sectionStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  title: { color: WORKSPACE_NAVY, fontSize: 17, fontWeight: '800' },
  card: {
    ...globalStyles.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  emptyText: { color: colors.textMuted },
});

export const milestoneStyles = StyleSheet.create({
  row: { ...globalStyles.row, gap: spacing.sm, paddingVertical: spacing.sm - 2 },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#e6e9f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.success },
  label: { color: colors.textMuted, flex: 1 },
  labelDone: { color: WORKSPACE_NAVY, fontWeight: '700' },
});

export const factStyles = StyleSheet.create({
  row: { ...globalStyles.row, gap: spacing.sm, paddingVertical: spacing.sm },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: WORKSPACE_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  label: { color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '700' },
  value: { color: WORKSPACE_NAVY, fontWeight: '700', marginTop: 1 },
});

export const paymentStyles = StyleSheet.create({
  statusRow: { ...globalStyles.row, justifyContent: 'space-between' },
  statusLabel: { color: WORKSPACE_NAVY, fontWeight: '700' },
  total: { color: colors.textMuted },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: WORKSPACE_ACCENT, borderRadius: 4 },
  amounts: { ...globalStyles.row, justifyContent: 'space-between', marginTop: spacing.sm },
  amountLabel: { color: colors.textMuted },
  amountValue: { color: WORKSPACE_NAVY, fontWeight: '700' },
});

export const taskStyles = StyleSheet.create({
  row: { paddingVertical: spacing.sm },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  headRow: { ...globalStyles.row, justifyContent: 'space-between', gap: spacing.sm },
  title: { color: WORKSPACE_NAVY, fontWeight: '700', flexShrink: 1 },
  statusPill: { borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  statusText: { fontWeight: '700', fontSize: 11 },
  meta: { color: colors.textMuted, marginTop: 2 },
});

export const timelineStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  rail: { width: 20, alignItems: 'center' },
  dot: { width: 9, height: 9, borderRadius: 999, backgroundColor: WORKSPACE_ACCENT, marginTop: 5 },
  line: { flex: 1, width: 1, backgroundColor: colors.border, marginTop: 2 },
  body: { flex: 1, paddingBottom: spacing.md },
  label: { color: WORKSPACE_NAVY, fontWeight: '700' },
  note: { color: colors.textMuted, marginTop: 1 },
  at: { color: colors.textMuted, marginTop: 2 },
});

/**
 * The two "open something bigger" rows in the workspace: the ideas board and
 * the guest invitation. Both summarise real state and lead to their own
 * screen, so they share one layout.
 */
export const summaryRowStyles = StyleSheet.create({
  row: { ...globalStyles.row, gap: spacing.md },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: WORKSPACE_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  title: { color: WORKSPACE_NAVY, fontWeight: '700' },
  body: { color: colors.textMuted, marginTop: 2 },
  cta: {
    ...globalStyles.row,
    gap: 2,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: WORKSPACE_ACCENT,
  },
  ctaGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  ctaText: { color: colors.onPrimary, fontWeight: '700' },
  ctaGhostText: { color: WORKSPACE_NAVY, fontWeight: '700' },
  /** The organizer has not shared an invitation yet — a step, not an error. */
  pendingText: { color: colors.textMuted },
});

export const boardStyles = StyleSheet.create({
  content: { paddingBottom: spacing.xl },

  // Hero: the three figures are the server's own counts, so the banner cannot
  // claim more activity than the feed below it contains.
  hero: {
    backgroundColor: WORKSPACE_NAVY_DEEP,
    borderRadius: 20,
    margin: spacing.md,
    padding: spacing.lg,
  },
  heroPill: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  heroPillText: { color: colors.onPrimary, fontWeight: '700', letterSpacing: 0.8 },
  heroTitle: { color: colors.onPrimary, fontSize: 22, fontWeight: '800', marginTop: spacing.sm },
  heroSubtitle: { color: colors.onPrimaryMuted, marginTop: spacing.xs, lineHeight: 20 },
  stats: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  stat: { flex: 1 },
  statValue: { color: colors.onPrimary, fontSize: 22, fontWeight: '800' },
  statLabel: { color: colors.onPrimaryMuted, marginTop: 1 },

  // Composer.
  composer: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    padding: spacing.md,
  },
  composerTop: { flexDirection: 'row', gap: spacing.sm },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: WORKSPACE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSquare: { borderRadius: 12, backgroundColor: WORKSPACE_NAVY },
  avatarText: { color: colors.onPrimary, fontWeight: '800', fontSize: 13 },
  input: {
    flex: 1,
    minHeight: 62,
    maxHeight: 160,
    color: colors.text,
    fontSize: 15,
    padding: 0,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  thumbs: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  thumb: { width: 72, height: 72, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surface },
  thumbImage: { width: '100%', height: '100%' },
  thumbRemove: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  typeChip: {
    ...globalStyles.row,
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  typeChipText: { color: colors.textMuted, fontWeight: '700', fontSize: 12 },
  composerFoot: { ...globalStyles.row, justifyContent: 'space-between', marginTop: spacing.md },
  photoButton: { ...globalStyles.row, gap: spacing.xs, paddingVertical: spacing.xs },
  photoText: { color: colors.textMuted, fontWeight: '700' },
  postButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    borderRadius: 12,
    backgroundColor: WORKSPACE_ACCENT,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  postButtonDisabled: { opacity: 0.45 },
  postButtonText: { color: colors.onPrimary, fontWeight: '700' },
  secretNote: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.sm },
  secretNoteText: { color: colors.textMuted, flex: 1 },
  composerError: { color: colors.danger, marginTop: spacing.sm },
  counter: { color: colors.textMuted, textAlign: 'right', marginTop: spacing.xs },

  // Filters.
  filters: { paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.xs },
  filter: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    marginRight: spacing.xs,
  },
  filterOn: { backgroundColor: WORKSPACE_NAVY, borderColor: WORKSPACE_NAVY },
  filterText: { color: colors.textMuted, fontWeight: '700' },
  filterTextOn: { color: colors.onPrimary },

  // Feed.
  feed: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  card: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHead: { ...globalStyles.row, gap: spacing.sm },
  who: { flex: 1 },
  whoRow: { ...globalStyles.row, gap: spacing.xs },
  name: { color: WORKSPACE_NAVY, fontWeight: '700', flexShrink: 1 },
  youTag: {
    color: colors.textMuted,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
    fontSize: 11,
    overflow: 'hidden',
  },
  time: { color: colors.textMuted, marginTop: 1 },
  cardText: { color: colors.text, marginTop: spacing.sm, lineHeight: 21 },
  images: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  image: { width: 96, height: 96, borderRadius: 12, backgroundColor: colors.surface },
  secretChip: { ...globalStyles.row, gap: 4, marginTop: spacing.sm },
  secretChipText: { color: colors.textMuted },

  reply: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  replyHead: { ...globalStyles.row, justifyContent: 'space-between', gap: spacing.sm },
  replyTitle: { color: WORKSPACE_NAVY, fontWeight: '700' },
  statusChip: { ...globalStyles.row, gap: 5, borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontWeight: '700', fontSize: 11 },
  replyText: { color: colors.textMuted, marginTop: spacing.xs, lineHeight: 19 },

  approveRow: { ...globalStyles.row, justifyContent: 'space-between', gap: spacing.sm, marginTop: spacing.md },
  approvalLabel: { color: colors.accent, fontWeight: '700', flexShrink: 1 },
  approvedRow: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.md },
  approvedText: { color: colors.success, fontWeight: '700' },
  approveButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  approveText: { color: colors.onPrimary, fontWeight: '700' },

  // Vision.
  vision: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  visionTitle: { color: WORKSPACE_NAVY, fontSize: 17, fontWeight: '800' },
  visionSubtitle: { color: colors.textMuted, marginTop: 2 },
  visionEmpty: { color: colors.textMuted, marginTop: spacing.sm, lineHeight: 20 },
  visionRow: { ...globalStyles.row, gap: spacing.sm, marginTop: spacing.md },
  visionChip: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: WORKSPACE_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visionText: { flex: 1 },
  visionLabel: { color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '700' },
  visionValue: { color: WORKSPACE_NAVY, marginTop: 1 },
  visionValueEmpty: { color: colors.textMuted, fontStyle: 'italic', marginTop: 1 },

  // Empty feed.
  empty: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: WORKSPACE_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { color: WORKSPACE_NAVY, fontSize: 17, fontWeight: '700', marginTop: spacing.sm },
  emptyBody: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs, lineHeight: 20 },
});
