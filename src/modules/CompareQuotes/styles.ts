import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import {
  COMPARE_ACCENT,
  COMPARE_ACCENT_SOFT,
  COMPARE_CANVAS,
  COMPARE_GREEN,
  COMPARE_GREEN_SOFT,
  COMPARE_LINE_HAIRLINE,
  COMPARE_LOWER_GREEN,
  COMPARE_NAVY,
  COMPARE_NAVY_DEEP,
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

export const compareEntryStyles = StyleSheet.create({
  /* Offered only with two priced quotes to put side by side. Sits under the
     brief, above the cards, because it is a way of reading them. */
  button: {
    ...globalStyles.row,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginHorizontal: spacing.md,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COMPARE_ACCENT,
    paddingVertical: 12,
  },
  label: { color: COMPARE_ACCENT, fontSize: 14.5, fontWeight: '700' },
});

export const lineByLineStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  /* Just the chevron. The disc behind it was a second shape to notice for a
     control every screen has in the same corner, and the touch target is the
     box, not the paint. */
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  title: { color: COMPARE_NAVY, fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },

  /* The two organizers stay above the rows: a price column means nothing once
     its heading has scrolled away. */
  columns: {
    ...globalStyles.row,
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COMPARE_LINE_HAIRLINE,
  },
  columnSpacer: { flex: 1.25 },
  column: { flex: 1, alignItems: 'center' },
  columnAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnAvatarText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  columnName: { color: colors.textMuted, fontSize: 14, marginTop: 8 },
  columnTotal: { color: COMPARE_NAVY, fontSize: 17, fontWeight: '700', marginTop: 2 },

  list: { paddingBottom: spacing.lg },
  row: {
    ...globalStyles.row,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COMPARE_LINE_HAIRLINE,
  },
  rowLabel: { flex: 1.25, paddingRight: 10 },
  rowTitle: { color: COMPARE_NAVY, fontSize: 15.5, fontWeight: '700', lineHeight: 21 },
  rowSubtitle: { color: colors.textMuted, fontSize: 13, marginTop: 3, lineHeight: 18 },
  cell: { flex: 1, alignItems: 'center' },
  cellPrice: { color: COMPARE_NAVY, fontSize: 16, fontWeight: '600' },
  cellLower: { color: COMPARE_LOWER_GREEN },
  /* Stated, not left blank: a line one organizer did not quote is a difference
     in what you get, and a blank cell reads as a price of nothing. */
  cellMissing: { color: colors.textMuted, fontSize: 13.5, fontStyle: 'italic' },
  lowerTag: {
    color: COMPARE_LOWER_GREEN,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 3,
  },

  note: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 10,
    margin: spacing.md,
    borderRadius: 14,
    backgroundColor: '#fdf6e7',
    padding: 14,
  },
  noteText: { color: '#7a5d1f', flex: 1, fontSize: 13.5, lineHeight: 19 },

  foot: {
    ...globalStyles.row,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COMPARE_LINE_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: spacing.md,
  },
  accept: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  acceptLeft: { backgroundColor: COMPARE_ACCENT },
  acceptRight: { backgroundColor: COMPARE_NAVY_DEEP },
  acceptDisabled: { opacity: 0.5 },
  acceptText: { color: colors.onPrimary, fontSize: 15.5, fontWeight: '700' },
  error: { color: colors.danger, fontSize: 13, paddingHorizontal: spacing.md, paddingBottom: 6 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredText: { color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
});
