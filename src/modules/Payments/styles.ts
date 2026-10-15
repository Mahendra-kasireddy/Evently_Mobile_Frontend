import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
  colors,
  spacing,
  fontWeights,
  textColor,
  typography,
} from '../../theme';
import {
  PAYMENTS_ACCENT,
  PAYMENTS_ACCENT_SOFT,
  PAYMENTS_CANVAS,
  PAYMENTS_GREEN,
  PAYMENTS_GREEN_SOFT,
  PAYMENTS_NAVY_DEEP,
} from './constants';

const HAIRLINE = '#efe9e5';
const TRACK = '#f0ecea';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAYMENTS_CANVAS },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
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
    backgroundColor: PAYMENTS_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: textColor.textSecondary, marginTop: spacing.md },
  emptyTitle: {
    ...typography.h2,
    color: textColor.textPrimary,
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
    borderColor: HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: PAYMENTS_ACCENT, ...fontWeights.bold },

  /** The one figure worth leading with, and what it does not mean. */
  summary: {
    backgroundColor: PAYMENTS_NAVY_DEEP,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryLabel: {
    color: colors.onPrimaryMuted,
    ...typography.overline,
  },
  summaryValue: {
    color: textColor.textOnPrimary,
    ...typography.h1,
    marginTop: 4,
  },
  summaryNote: {
    color: colors.onPrimaryMuted,
    ...typography.caption,
    marginTop: 6,
  },
  summarySettled: { ...globalStyles.row, gap: spacing.sm },
  summarySettledText: { color: textColor.textOnPrimary, ...typography.h3 },
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
  title: { color: textColor.textPrimary, ...typography.h3 },
  meta: { color: textColor.textSecondary, ...typography.caption, marginTop: 2 },
  chip: {
    flexShrink: 0,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipSettled: { backgroundColor: PAYMENTS_GREEN_SOFT },
  chipDue: { backgroundColor: PAYMENTS_ACCENT_SOFT },
  chipText: { ...typography.label },
  chipTextSettled: { color: PAYMENTS_GREEN },
  chipTextDue: { color: PAYMENTS_ACCENT },

  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: TRACK,
    overflow: 'hidden',
    marginTop: 14,
  },
  fill: { height: '100%', borderRadius: 3, backgroundColor: PAYMENTS_ACCENT },
  fillSettled: { backgroundColor: PAYMENTS_GREEN },

  figures: { flexDirection: 'row', marginTop: 12 },
  figure: { flex: 1 },
  figureLabel: {
    color: textColor.textSecondary,
    ...typography.overline,
  },
  figureValue: {
    color: textColor.textPrimary,
    ...typography.body,
    ...fontWeights.semibold,
    marginTop: 2,
  },
  figureValueDue: { color: PAYMENTS_ACCENT },
});
