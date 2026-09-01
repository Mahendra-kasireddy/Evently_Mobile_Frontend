import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { BOOKING_ACCENT, BOOKING_ACCENT_SOFT, BOOKING_NAVY } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: BOOKING_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
  emptyTitle: { color: BOOKING_NAVY, marginTop: spacing.md, textAlign: 'center' },
  emptySubtitle: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
  emptyCta: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.lg,
    borderRadius: 14,
    backgroundColor: BOOKING_ACCENT,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
  },
  emptyCtaText: { color: colors.onPrimary, fontWeight: '700' },
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
  retryText: { color: BOOKING_ACCENT, fontWeight: '700' },

  // One row of tabs, shown only when there is something in both.
  tabs: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  tab: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  tabOn: { backgroundColor: BOOKING_NAVY, borderColor: BOOKING_NAVY },
  tabText: { color: colors.textMuted, fontWeight: '700' },
  tabTextOn: { color: colors.onPrimary },
});

export const bookingRowStyles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  // A coral edge, inset inside the rounded corners.
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: BOOKING_ACCENT },
  body: { padding: spacing.md, paddingLeft: spacing.md + 4 },

  head: { ...globalStyles.row, gap: spacing.sm },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: BOOKING_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1 },
  title: { color: BOOKING_NAVY, fontSize: 16, fontWeight: '800' },
  ref: { color: colors.textMuted, marginTop: 1, letterSpacing: 0.4 },
  statusChip: { borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  statusText: { fontWeight: '700', fontSize: 11 },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  meta: { ...globalStyles.row, gap: spacing.xs },
  metaText: { color: colors.textMuted },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: BOOKING_ACCENT, borderRadius: 3 },
  progressRow: { ...globalStyles.row, justifyContent: 'space-between', marginTop: spacing.xs },
  progressLabel: { color: colors.textMuted },
  daysToGo: { color: BOOKING_NAVY, fontWeight: '700' },

  organizerRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  avatar: { width: 30, height: 30, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.onPrimary, fontWeight: '800', fontSize: 11 },
  organizerName: { color: colors.text, flex: 1 },
  open: { ...globalStyles.row, gap: 2 },
  openText: { color: BOOKING_ACCENT, fontWeight: '700' },
});
