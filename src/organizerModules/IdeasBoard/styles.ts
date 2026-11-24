import { StyleSheet } from 'react-native';
import {
  colors,
  fontWeights,
  spacing,
  textColor,
  typography,
} from '../../theme';
import {
  BOARD_ACCENT,
  BOARD_ACCENT_SOFT,
  BOARD_GREEN,
  BOARD_GREEN_SOFT,
  BOARD_VIOLET,
  BOARD_VIOLET_SOFT,
  DANGER,
  DANGER_SOFT,
  IDEA_TYPE_META,
  OK_INK,
  ORG_ACCENT,
  ORG_INK,
  ORG_PAPER,
  OVERLAY,
  VIEWER_BG,
  WHITE,
} from './design';

/*
 * Cards, composer, chips and feed come from the customer board
 * (modules/Workspace/styles → boardStyles) so both sides look like one app.
 * What is here is only what the organizer side adds.
 */

const card = {
  backgroundColor: colors.background,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: colors.border,
  padding: spacing.md,
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingTop: spacing.xs, paddingBottom: spacing.s40 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  title: { color: ORG_INK.ink, ...typography.h3, textAlign: 'center' },
  muted: { color: ORG_INK.inkSoft, ...typography.body, textAlign: 'center' },

  notice: {
    marginTop: spacing.s12,
    marginHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.s12,
    borderRadius: 14,
  },
  noticeOk: { backgroundColor: ORG_ACCENT.jadeSoft },
  noticeError: { backgroundColor: DANGER_SOFT },
  noticeText: { flex: 1, ...typography.bodySmall, ...fontWeights.medium },
  noticeTextOk: { color: OK_INK },
  noticeTextError: { color: DANGER },
});

/** Progress + vision, on top. */
export const topStyles = StyleSheet.create({
  card: { ...card, marginHorizontal: spacing.md, marginTop: spacing.md },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headText: { flex: 1 },
  title: { color: textColor.textPrimary, ...typography.h3 },
  subtitle: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 2,
  },
  stats: { flexDirection: 'row', gap: 8, marginTop: spacing.s12 },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: BOARD_GREEN_SOFT,
    marginTop: spacing.s12,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: BOARD_GREEN },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  summary: { flex: 1, color: textColor.textSecondary, ...typography.caption },
  approved: {
    color: BOARD_GREEN,
    ...typography.caption,
    ...fontWeights.semibold,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    backgroundColor: BOARD_VIOLET_SOFT,
    paddingHorizontal: spacing.s12,
    paddingVertical: 7,
  },
  editText: {
    color: BOARD_VIOLET,
    ...typography.label,
    ...fontWeights.semibold,
  },
  lock: { marginLeft: 4 },
  valueRow: { flexDirection: 'row', alignItems: 'center' },
});

/** The feed card's organizer additions: photo tiles, chips, the reply row. */
export const feedStyles = StyleSheet.create({
  photo: { borderRadius: 12, overflow: 'hidden' },
  more: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  moreText: { color: WHITE, ...typography.h3 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.s12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    maxWidth: '100%',
  },
  chipText: { ...typography.label, ...fontWeights.semibold, flexShrink: 1 },
  waiting: { backgroundColor: BOARD_ACCENT_SOFT },
  waitingText: { color: BOARD_ACCENT },
  approved: { backgroundColor: BOARD_GREEN_SOFT },
  approvedText: { color: BOARD_GREEN },
  planned: { backgroundColor: BOARD_ACCENT_SOFT },
  plannedText: { color: BOARD_ACCENT },
  done: { backgroundColor: BOARD_GREEN_SOFT },
  doneText: { color: BOARD_GREEN },
  replyTime: { color: textColor.textSecondary, ...typography.caption },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.s12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.s12,
    paddingVertical: 10,
  },
  replyPlaceholder: {
    flex: 1,
    color: colors.textMuted,
    ...typography.bodySmall,
  },
  customerTag: {
    color: BOARD_VIOLET,
    backgroundColor: BOARD_VIOLET_SOFT,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
    ...typography.label,
    overflow: 'hidden',
  },
});

/** One tint per post type — the customer board's IDEA_TYPE_META colours. */
export const typeTint = StyleSheet.create({
  idea: { backgroundColor: IDEA_TYPE_META.idea.bg },
  inspiration: { backgroundColor: IDEA_TYPE_META.inspiration.bg },
  question: { backgroundColor: IDEA_TYPE_META.question.bg },
  surprise: { backgroundColor: IDEA_TYPE_META.surprise.bg },
  update: { backgroundColor: IDEA_TYPE_META.update.bg },
});

export const typeInk = StyleSheet.create({
  idea: { color: IDEA_TYPE_META.idea.color },
  inspiration: { color: IDEA_TYPE_META.inspiration.color },
  question: { color: IDEA_TYPE_META.question.color },
  surprise: { color: IDEA_TYPE_META.surprise.color },
  update: { color: IDEA_TYPE_META.update.color },
});

/** Bottom sheets (reply, vision) — the organizer sheet pattern. */
export const sheetStyles = StyleSheet.create({
  root: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: OVERLAY },
  sheetWrap: { maxHeight: '92%' },
  sheet: {
    flexShrink: 1,
    backgroundColor: ORG_PAPER.canvas,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.s12,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: ORG_PAPER.hairline,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.s12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BOARD_VIOLET_SOFT,
  },
  title: { flex: 1, color: ORG_INK.ink, ...typography.h2 },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_PAPER.well,
  },
  scroll: { flexGrow: 0, flexShrink: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  body: { color: ORG_INK.inkSoft, ...typography.body },
  quote: {
    color: ORG_INK.inkSoft,
    ...typography.bodySmall,
    backgroundColor: ORG_PAPER.well,
    borderRadius: 12,
    padding: spacing.s12,
    overflow: 'hidden',
  },
  field: { gap: 6 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  counter: { color: ORG_INK.inkFaint, ...typography.label },
  input: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.s12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
    color: ORG_INK.ink,
    ...typography.body,
  },
  inputMulti: { minHeight: 110, textAlignVertical: 'top' },
  inputError: { borderColor: ORG_ACCENT.sindoor },
  error: { color: ORG_ACCENT.sindoor, ...typography.caption },
  hint: { color: ORG_INK.inkSoft, ...typography.caption },
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    backgroundColor: ORG_PAPER.well,
  },
  segmentItem: {
    flex: 1,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentOn: { backgroundColor: ORG_PAPER.card },
  segmentText: {
    color: ORG_INK.inkSoft,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  segmentTextOn: { color: ORG_INK.ink },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  switchText: { flex: 1, gap: 2 },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  cancel: { alignItems: 'center', paddingVertical: spacing.s12 },
  cancelText: {
    color: ORG_INK.inkSoft,
    ...typography.body,
    ...fontWeights.semibold,
  },
});

/** Full-screen photo viewer. */
export const viewerStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: VIEWER_BG },
  safe: { flex: 1 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  count: { color: WHITE, ...typography.bodySmall, ...fontWeights.semibold },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  pager: { flex: 1 },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
});
