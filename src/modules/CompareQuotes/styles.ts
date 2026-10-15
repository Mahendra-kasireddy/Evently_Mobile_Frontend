import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
  colors,
  spacing,
  fontWeights,
  textColor,
  typography,
} from '../../theme';
import {
  COMPARE_ACCENT,
  COMPARE_ACCENT_SOFT,
  COMPARE_CANVAS,
  COMPARE_GREEN,
  COMPARE_GREEN_SOFT,
  COMPARE_LINE_HAIRLINE,
  COMPARE_LOWER_GREEN,
  COMPARE_NAVY_DEEP,
} from './constants';

const HAIRLINE = '#efe9e5';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COMPARE_CANVAS },
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
    backgroundColor: COMPARE_ACCENT_SOFT,
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
  retryText: { color: COMPARE_ACCENT, ...fontWeights.bold },

  brief: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  briefTitle: {
    color: textColor.textPrimary,
    ...typography.h2,
  },
  briefFacts: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    marginTop: 2,
  },
  spread: {
    color: COMPARE_ACCENT,
    ...typography.bodySmall,
    ...fontWeights.semibold,
    marginTop: 6,
  },
  decidedNote: {
    color: COMPARE_GREEN,
    ...typography.bodySmall,
    marginTop: 8,
  },
  acceptError: {
    color: textColor.textError,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
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
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: textColor.textOnPrimary, ...typography.h3 },
  headText: { flex: 1 },
  name: {
    color: textColor.textPrimary,
    ...typography.h3,
  },
  metaRow: { ...globalStyles.row, gap: 5, marginTop: 2 },
  meta: { color: textColor.textSecondary, ...typography.bodySmall },
  rating: {
    color: textColor.textPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  chip: {
    flexShrink: 0,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipLowest: { backgroundColor: COMPARE_ACCENT_SOFT },
  chipAccepted: { backgroundColor: COMPARE_GREEN_SOFT },
  chipText: { ...typography.label },
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
    color: textColor.textSecondary,
    ...typography.overline,
  },
  totalValue: {
    color: textColor.textPrimary,
    ...typography.h2,
  },
  advance: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    marginTop: 2,
    textAlign: 'right',
  },

  breakdownToggle: { ...globalStyles.row, gap: 4, marginTop: 12 },
  breakdownToggleText: {
    color: COMPARE_ACCENT,
    ...typography.body,
    ...fontWeights.semibold,
  },
  line: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: 10,
  },
  lineText: { flex: 1 },
  lineTitle: {
    color: textColor.textPrimary,
    ...typography.body,
    ...fontWeights.medium,
  },
  lineSubtitle: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 1,
  },
  linePrice: {
    color: textColor.textPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },

  accept: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: COMPARE_ACCENT,
    marginTop: 14,
  },
  acceptDisabled: { opacity: 0.5 },
  acceptText: { color: textColor.textOnPrimary, ...typography.h3 },
  acceptNote: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 8,
  },
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
  label: { color: COMPARE_ACCENT, ...typography.body, ...fontWeights.semibold },
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
  title: {
    color: textColor.textPrimary,
    ...typography.h2,
  },

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
  columnAvatarText: {
    color: textColor.textOnPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },
  columnName: {
    color: textColor.textSecondary,
    ...typography.body,
    marginTop: 8,
  },
  columnTotal: {
    color: textColor.textPrimary,
    ...typography.h3,
    marginTop: 2,
  },

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
  rowTitle: {
    color: textColor.textPrimary,
    ...typography.h3,
  },
  rowSubtitle: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    marginTop: 3,
  },
  cell: { flex: 1, alignItems: 'center' },
  cellPrice: { color: textColor.textPrimary, ...typography.h3 },
  cellLower: { color: COMPARE_LOWER_GREEN },
  /* Stated, not left blank: a line one organizer did not quote is a difference
     in what you get, and a blank cell reads as a price of nothing. */
  cellMissing: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    fontStyle: 'italic',
  },
  lowerTag: {
    color: COMPARE_LOWER_GREEN,
    ...typography.label,
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
  noteText: { color: '#7a5d1f', flex: 1, ...typography.bodySmall },

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
  acceptText: { color: textColor.textOnPrimary, ...typography.h3 },
  error: {
    color: textColor.textError,
    ...typography.caption,
    paddingHorizontal: spacing.md,
    paddingBottom: 6,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  centeredText: {
    color: textColor.textSecondary,
    textAlign: 'center',
  },
});

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#1a2e5a',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 2 },
});

/* A request with no quotes yet: confirmation, brief, what happens next. */
export const waitingStyles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  badgeHalo: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f6ee',
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: textColor.textPrimary,
    ...typography.h1,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  lead: {
    color: textColor.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: spacing.md,
  },

  card: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: colors.background,
    ...CARD_SHADOW,
  },
  cardHead: { ...globalStyles.row, justifyContent: 'space-between' },
  cardLabel: {
    color: textColor.textDisabled,
    ...typography.label,
  },
  statusPill: {
    ...globalStyles.row,
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#fff4e5',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#f0a020',
  },
  statusText: { color: '#a86400', ...typography.label },
  cardTitle: { color: textColor.textPrimary, marginTop: 6 },
  facts: { marginTop: spacing.sm, gap: 12 },
  fact: { ...globalStyles.row, alignItems: 'center', gap: 12 },
  factIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COMPARE_ACCENT_SOFT,
  },
  factText: { flex: 1 },
  factLabel: { color: textColor.textDisabled, ...typography.label },
  factValue: { color: textColor.textPrimary, ...typography.bodyLarge },

  sentToCount: { color: textColor.textPrimary, ...fontWeights.bold },
  recipient: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
  },
  recipientFirst: { marginTop: spacing.sm, borderTopWidth: 0, paddingTop: 0 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOpen: { backgroundColor: COMPARE_ACCENT_SOFT },
  avatarText: {
    color: textColor.textOnPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },
  recipientText: { flex: 1 },
  recipientName: { color: textColor.textPrimary, ...typography.bodyLarge },
  recipientMeta: { color: textColor.textSecondary, marginTop: 2 },
  waitingPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#fff4e5',
  },
  waitingText: { color: '#a86400', ...typography.label },
  moreText: {
    color: textColor.textSecondary,
    marginTop: 8,
    ...fontWeights.semibold,
  },

  steps: { marginTop: spacing.sm },
  step: { flexDirection: 'row', gap: 12 },
  rail: { alignItems: 'center', width: 24 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2dde8',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { borderColor: '#13a06f', backgroundColor: '#13a06f' },
  dotNow: { borderColor: '#f0a020' },
  dotPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f0a020',
  },
  line: {
    flex: 1,
    width: 2,
    minHeight: 18,
    backgroundColor: '#ece8f1',
    marginVertical: 3,
  },
  lineDone: { backgroundColor: '#13a06f' },
  stepText: { flex: 1, paddingBottom: spacing.md },
  stepTitle: { color: textColor.textPrimary, ...typography.bodyLarge },
  stepTitleNext: { color: '#8f8a9c' },
  stepBody: { color: textColor.textSecondary, marginTop: 2 },

  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
    backgroundColor: COMPARE_CANVAS,
  },
  cta: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    minHeight: 54,
    borderRadius: 27,
    overflow: 'hidden',
  },
  ctaText: { color: textColor.textOnPrimary, ...typography.button },
});
