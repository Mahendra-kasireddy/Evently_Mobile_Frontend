import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import {
  PAYMENTS_ACCENT,
  PAYMENTS_ACCENT_SOFT,
  PAYMENTS_CANVAS,
  PAYMENTS_GREEN,
  PAYMENTS_GREEN_SOFT,
  PAYMENTS_NAVY,
  PAYMENTS_NAVY_DEEP,
} from './constants';

const HAIRLINE = '#efe9e5';
const TRACK = '#f0ecea';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAYMENTS_CANVAS },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: PAYMENTS_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  emptyTitle: { color: PAYMENTS_NAVY, marginTop: spacing.md, textAlign: 'center' },
  emptyBody: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: PAYMENTS_ACCENT, fontWeight: '700' },

  /** The one figure worth leading with, and what it does not mean. */
  summary: {
    backgroundColor: PAYMENTS_NAVY_DEEP,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryLabel: {
    color: colors.onPrimaryMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  summaryValue: { color: colors.onPrimary, fontSize: 28, fontWeight: '700', marginTop: 4, letterSpacing: -0.5 },
  summaryNote: { color: colors.onPrimaryMuted, fontSize: 12.5, marginTop: 6, lineHeight: 18 },
  summarySettled: { ...globalStyles.row, gap: spacing.sm },
  summarySettledText: { color: colors.onPrimary, fontSize: 18, fontWeight: '700' },
});

export const paymentRowStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: spacing.md,
    marginBottom: 12,
  },
  head: { ...globalStyles.row, gap: spacing.sm },
  headText: { flex: 1 },
  title: { color: PAYMENTS_NAVY, fontSize: 16, fontWeight: '700', lineHeight: 22 },
  meta: { color: colors.textMuted, fontSize: 12.5, marginTop: 2, lineHeight: 18 },
  chip: { flexShrink: 0, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  chipSettled: { backgroundColor: PAYMENTS_GREEN_SOFT },
  chipDue: { backgroundColor: PAYMENTS_ACCENT_SOFT },
  chipText: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.4 },
  chipTextSettled: { color: PAYMENTS_GREEN },
  chipTextDue: { color: PAYMENTS_ACCENT },

  track: { height: 6, borderRadius: 3, backgroundColor: TRACK, overflow: 'hidden', marginTop: 14 },
  fill: { height: '100%', borderRadius: 3, backgroundColor: PAYMENTS_ACCENT },
  fillSettled: { backgroundColor: PAYMENTS_GREEN },

  figures: { flexDirection: 'row', marginTop: 12 },
  figure: { flex: 1 },
  figureLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  figureValue: { color: '#141c2b', fontSize: 14.5, fontWeight: '600', marginTop: 2 },
  figureValueDue: { color: PAYMENTS_ACCENT },
});
