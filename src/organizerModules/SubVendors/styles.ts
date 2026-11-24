import { Platform, StyleSheet } from 'react-native';
import { fontWeights, spacing, typography } from '../../theme';
import { CHIP_TONE, ORG_ACCENT, ORG_INK, ORG_PAPER } from './design';
import type { ChipTone } from './types';

const cardShadow = Platform.select({
  ios: {
    shadowColor: ORG_INK.night,
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 2 },
  default: {},
}) as object;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORG_PAPER.canvas },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.s12,
  },
  /* The toolbar runs edge to edge; the list's side padding is for the cards. */
  listHeader: { marginHorizontal: -spacing.md },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  title: { color: ORG_INK.ink, ...typography.h3, textAlign: 'center' },
  muted: { color: ORG_INK.inkSoft, ...typography.body, textAlign: 'center' },
});

/** The one main action: a gradient pill, in the footer or the empty state. */
export const actionStyles = StyleSheet.create({
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.s12,
    paddingBottom: spacing.s12,
    borderTopWidth: 1,
    borderTopColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.canvas,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: 26,
    overflow: 'hidden',
  },
  buttonDisabled: { opacity: 0.6 },
  text: { color: '#ffffff', ...typography.button, ...fontWeights.bold },
});

export const toolbarStyles = StyleSheet.create({
  wrap: { gap: spacing.s12, paddingBottom: spacing.xs },
  summary: {
    marginHorizontal: spacing.md,
    color: ORG_INK.inkSoft,
    ...typography.bodySmall,
  },
  chips: { paddingHorizontal: spacing.md, gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
  },
  chipOn: { backgroundColor: ORG_INK.ink, borderColor: ORG_INK.ink },
  chipText: {
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  chipTextOn: { color: '#ffffff' },
  count: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_PAPER.well,
  },
  countOn: { backgroundColor: 'rgba(255,255,255,0.2)' },
  countText: { color: ORG_INK.inkSoft, ...typography.label },
  countTextOn: { color: '#ffffff' },
  notice: {
    marginHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.s12,
    borderRadius: 12,
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  noticeText: { flex: 1, color: '#8a5410', ...typography.caption },
});

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: ORG_PAPER.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ORG_PAPER.hairline,
    padding: spacing.md,
    gap: spacing.s12,
    ...cardShadow,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: { color: '#ffffff', ...typography.body, ...fontWeights.bold },
  headText: { flex: 1, minWidth: 0, gap: 2 },
  name: { color: ORG_INK.ink, ...typography.h3 },
  category: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  categoryText: { color: ORG_INK.inkSoft, ...typography.bodySmall },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chipText: { ...typography.label, ...fontWeights.semibold },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.md,
    rowGap: 6,
  },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  factText: { color: ORG_INK.ink, ...typography.bodySmall },
  factMuted: { color: ORG_INK.inkFaint },
  perf: { gap: 6 },
  perfRow: { flexDirection: 'row', alignItems: 'center' },
  perfLabel: { flex: 1, color: ORG_INK.inkSoft, ...typography.label },
  perfValue: { color: ORG_INK.ink, ...typography.label, ...fontWeights.bold },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: ORG_PAPER.well,
  },
  fill: { height: 8, borderRadius: 4 },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingTop: spacing.s12,
    borderTopWidth: 1,
    borderTopColor: ORG_PAPER.hairline,
  },
  events: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventsText: {
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  ghost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
  },
  ghostText: {
    color: ORG_ACCENT.sindoor,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
});

export const pendingStyles = StyleSheet.create({
  wrap: { gap: spacing.s12, marginTop: spacing.sm },
  heading: { color: ORG_INK.ink, ...typography.h3 },
  hint: { color: ORG_INK.inkSoft, ...typography.caption, marginTop: -6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#e8cfa6',
    backgroundColor: ORG_PAPER.card,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
  phone: {
    color: ORG_INK.ink,
    ...typography.body,
    ...fontWeights.semibold,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ago: { color: ORG_INK.inkFaint, ...typography.label },
  cancel: { paddingVertical: 6, paddingHorizontal: 4 },
  cancelText: {
    color: ORG_ACCENT.sindoor,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
});

export const emptyStyles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.s12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
    ...cardShadow,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  button: { alignSelf: 'stretch', marginTop: spacing.sm },
  link: {
    color: ORG_ACCENT.saffron,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
});

export const sheetStyles = StyleSheet.create({
  root: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(28,19,38,0.45)',
  },
  sheet: {
    backgroundColor: ORG_PAPER.canvas,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.s12,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: ORG_PAPER.hairline,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  title: { flex: 1, color: ORG_INK.ink, ...typography.h2 },
  body: { color: ORG_INK.inkSoft, ...typography.body },
  field: { gap: 6 },
  label: {
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
    overflow: 'hidden',
  },
  inputRowError: { borderColor: ORG_ACCENT.sindoor },
  prefix: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRightWidth: 1,
    borderRightColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.well,
  },
  prefixText: {
    color: ORG_INK.ink,
    ...typography.bodyLarge,
    ...fontWeights.semibold,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
    color: ORG_INK.ink,
    ...typography.bodyLarge,
    letterSpacing: 1,
  },
  error: { color: ORG_ACCENT.sindoor, ...typography.caption },
  actions: { gap: spacing.s12 },
  cancel: { alignSelf: 'center', paddingVertical: spacing.sm },
  cancelText: {
    color: ORG_INK.inkSoft,
    ...typography.body,
    ...fontWeights.semibold,
  },
});

/** The status chip's colours, one pair per tone. */
export const chipToneStyles = Object.fromEntries(
  (Object.keys(CHIP_TONE) as ChipTone[]).map(tone => [
    tone,
    StyleSheet.create({
      box: { backgroundColor: CHIP_TONE[tone].soft },
      text: { color: CHIP_TONE[tone].ink },
    }),
  ]),
) as Record<ChipTone, { box: object; text: object }>;
