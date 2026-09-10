import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import {
  COMPARE_ACCENT,
  COMPARE_ACCENT_SOFT,
  COMPARE_CANVAS,
  COMPARE_GREEN,
  COMPARE_GREEN_SOFT,
  COMPARE_NAVY,
} from './constants';

const HAIRLINE = '#efe9e5';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COMPARE_CANVAS },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COMPARE_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  emptyTitle: { color: COMPARE_NAVY, marginTop: spacing.md, textAlign: 'center' },
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
  retryText: { color: COMPARE_ACCENT, fontWeight: '700' },

  brief: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  briefTitle: { color: COMPARE_NAVY, fontSize: 21, fontWeight: '700', letterSpacing: -0.3 },
  briefFacts: { color: colors.textMuted, fontSize: 13.5, marginTop: 2, lineHeight: 19 },
  spread: { color: COMPARE_ACCENT, fontSize: 13.5, fontWeight: '600', marginTop: 6 },
  decidedNote: {
    color: COMPARE_GREEN,
    fontSize: 13.5,
    marginTop: 8,
    lineHeight: 19,
  },
  acceptError: { color: colors.danger, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
});

export const quoteCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: spacing.md,
    marginBottom: 14,
  },
  cardLowest: { borderColor: COMPARE_ACCENT, borderWidth: 1.5 },
  cardAccepted: { borderColor: COMPARE_GREEN, borderWidth: 1.5 },

  head: { ...globalStyles.row, gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.onPrimary, fontSize: 15, fontWeight: '700' },
  headText: { flex: 1 },
  name: { color: COMPARE_NAVY, fontSize: 16, fontWeight: '700', lineHeight: 22 },
  metaRow: { ...globalStyles.row, gap: 5, marginTop: 2 },
  meta: { color: colors.textMuted, fontSize: 13 },
  rating: { color: COMPARE_NAVY, fontSize: 13, fontWeight: '600' },
  chip: { flexShrink: 0, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  chipLowest: { backgroundColor: COMPARE_ACCENT_SOFT },
  chipAccepted: { backgroundColor: COMPARE_GREEN_SOFT },
  chipText: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.5 },
  chipTextLowest: { color: COMPARE_ACCENT },
  chipTextAccepted: { color: COMPARE_GREEN },

  totalRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  totalValue: { color: COMPARE_NAVY, fontSize: 23, fontWeight: '700', letterSpacing: -0.4 },
  advance: { color: colors.textMuted, fontSize: 13, marginTop: 2, textAlign: 'right' },

  breakdownToggle: { ...globalStyles.row, gap: 4, marginTop: 12 },
  breakdownToggleText: { color: COMPARE_ACCENT, fontSize: 14, fontWeight: '600' },
  line: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: 10,
  },
  lineText: { flex: 1 },
  lineTitle: { color: '#141c2b', fontSize: 14, fontWeight: '500' },
  lineSubtitle: { color: colors.textMuted, fontSize: 12.5, marginTop: 1, lineHeight: 17 },
  linePrice: { color: COMPARE_NAVY, fontSize: 14, fontWeight: '600' },

  accept: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: COMPARE_ACCENT,
    marginTop: 14,
  },
  acceptDisabled: { opacity: 0.5 },
  acceptText: { color: colors.onPrimary, fontSize: 15.5, fontWeight: '600' },
  acceptNote: { color: colors.textMuted, fontSize: 12, marginTop: 8, lineHeight: 17 },
});
