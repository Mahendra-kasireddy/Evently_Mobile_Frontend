import { Platform, StyleSheet } from 'react-native';
import { fontWeights, spacing, typography } from '../../theme';
import {
  ORG_ACCENT,
  ORG_INK,
  ORG_PAPER,
  SHORTCUT_LOOK,
  STATUS_TONE,
} from './design';
import type { StatusTone } from './types';

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

const card = {
  backgroundColor: ORG_PAPER.card,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: ORG_PAPER.hairline,
  ...cardShadow,
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORG_PAPER.canvas },
  content: { paddingBottom: spacing.xl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  title: { color: ORG_INK.ink, ...typography.h3, textAlign: 'center' },
  muted: { color: ORG_INK.inkSoft, ...typography.body, textAlign: 'center' },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.s12,
  },
  sectionHead: { gap: 2 },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: { color: ORG_INK.ink, ...typography.h3 },
  urgentTitle: { color: '#c2361f' },
  countBubble: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c2361f',
  },
  countText: { color: '#ffffff', ...typography.label, ...fontWeights.bold },
  sectionHint: { color: ORG_INK.inkSoft, ...typography.caption },
});

export const shortcutStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.s12,
    paddingHorizontal: spacing.md,
  },
  wrap: { flex: 1 },
  tile: { ...card, paddingVertical: spacing.s12, alignItems: 'center', gap: 6 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: ORG_INK.ink, ...typography.caption, ...fontWeights.semibold },
});

export const segmentStyles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    backgroundColor: ORG_PAPER.well,
  },
  item: {
    flex: 1,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  itemOn: { backgroundColor: ORG_PAPER.card, ...cardShadow },
  text: {
    color: ORG_INK.inkSoft,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  textOn: { color: ORG_INK.ink },
});

export const cardStyles = StyleSheet.create({
  card: { ...card, padding: spacing.md, gap: spacing.s12 },
  cardUrgent: { borderColor: '#f5c9a8', backgroundColor: '#fffaf4' },
  cardPast: { opacity: 0.85 },
  head: { flexDirection: 'row', gap: spacing.s12 },
  date: {
    width: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  dateMuted: { backgroundColor: ORG_PAPER.well },
  day: { color: ORG_ACCENT.saffron, ...typography.h2 },
  month: { color: ORG_ACCENT.saffron, ...typography.label },
  dateMutedText: { color: ORG_INK.inkSoft },
  body: { flex: 1, minWidth: 0, gap: 3 },
  title: { color: ORG_INK.ink, ...typography.h3 },
  meta: { color: ORG_INK.inkSoft, ...typography.caption },
  when: {
    color: ORG_ACCENT.saffron,
    ...typography.label,
    ...fontWeights.semibold,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chipText: { ...typography.label, ...fontWeights.semibold },
  respond: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.s12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  respondUrgent: { backgroundColor: '#fde4df' },
  respondText: {
    color: '#8a5410',
    ...typography.caption,
    ...fontWeights.semibold,
  },
  respondTextUrgent: { color: '#c2361f' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: ORG_PAPER.well,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3, backgroundColor: ORG_ACCENT.jade },
  tasks: { color: ORG_INK.inkSoft, ...typography.label },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingTop: spacing.s12,
    borderTopWidth: 1,
    borderTopColor: ORG_PAPER.hairline,
  },
  money: { flex: 1, minWidth: 0 },
  amount: { color: ORG_INK.ink, ...typography.h3 },
  paid: {
    color: ORG_ACCENT.jade,
    ...typography.label,
    ...fontWeights.semibold,
  },
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
    ...card,
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
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

/** A status chip's colours, one pair per tone. */
export const statusToneStyles = Object.fromEntries(
  (Object.keys(STATUS_TONE) as StatusTone[]).map(tone => [
    tone,
    StyleSheet.create({
      box: { backgroundColor: STATUS_TONE[tone].soft },
      text: { color: STATUS_TONE[tone].ink },
    }),
  ]),
) as Record<StatusTone, { box: object; text: object }>;

/** Each shortcut tile's icon tint. */
export const shortcutToneStyles = StyleSheet.create(
  Object.fromEntries(
    Object.entries(SHORTCUT_LOOK).map(([key, look]) => [
      key,
      { backgroundColor: look.soft },
    ]),
  ) as Record<keyof typeof SHORTCUT_LOOK, { backgroundColor: string }>,
);
