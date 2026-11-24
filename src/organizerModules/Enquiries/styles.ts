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

export const toolbarStyles = StyleSheet.create({
  wrap: { gap: spacing.s12, paddingBottom: spacing.s12 },
  search: {
    marginHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 46,
    paddingHorizontal: spacing.s12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
  },
  input: {
    flex: 1,
    color: ORG_INK.ink,
    ...typography.body,
    paddingVertical: 0,
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
  head: { flexDirection: 'row', gap: spacing.s12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: { color: '#ffffff', ...typography.bodySmall, ...fontWeights.bold },
  headText: { flex: 1, minWidth: 0, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flexShrink: 1, color: ORG_INK.ink, ...typography.h3 },
  where: { color: ORG_INK.inkSoft, ...typography.caption },
  side: { alignItems: 'flex-end', gap: 6 },
  ago: { color: ORG_INK.inkFaint, ...typography.label },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  chipText: { ...typography.label, ...fontWeights.semibold },
  occasion: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: ORG_ACCENT.roseSoft,
  },
  occasionText: {
    color: ORG_ACCENT.rose,
    ...typography.label,
    ...fontWeights.semibold,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.md,
    rowGap: 6,
  },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  factText: { color: ORG_INK.ink, ...typography.bodySmall },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: ORG_PAPER.well,
  },
  tagText: { color: ORG_INK.inkSoft, ...typography.label },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingTop: spacing.s12,
    borderTopWidth: 1,
    borderTopColor: ORG_PAPER.hairline,
  },
  quote: { flex: 1, minWidth: 0 },
  quoteLabel: { color: ORG_INK.inkSoft, ...typography.label },
  quoteValue: { color: ORG_INK.ink, ...typography.h3 },
  spacer: { flex: 1 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonGhost: {
    borderWidth: 1.5,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
  },
  buttonText: {
    color: '#ffffff',
    ...typography.bodySmall,
    ...fontWeights.bold,
  },
  buttonTextGhost: { color: ORG_INK.ink },
});

export const emptyStyles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  link: {
    color: ORG_ACCENT.saffron,
    ...typography.bodySmall,
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
