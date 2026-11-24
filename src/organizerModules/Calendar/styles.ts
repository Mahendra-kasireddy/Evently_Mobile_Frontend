import { Platform, StyleSheet } from 'react-native';
import { fontWeights, spacing, typography } from '../../theme';
import {
  DAY_LOOK,
  ORG_ACCENT,
  ORG_INK,
  ORG_PAPER,
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
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
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
    padding: spacing.s12,
    borderRadius: 12,
    backgroundColor: '#fde4df',
  },
  noticeText: { color: '#a3301c', ...typography.caption },
  sectionTitle: { color: ORG_INK.ink, ...typography.h3 },
});

export const monthStyles = StyleSheet.create({
  card: { ...card, padding: spacing.s12, gap: spacing.sm },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1, color: ORG_INK.ink, ...typography.h2, paddingLeft: 4 },
  todayChip: {
    height: 40,
    paddingHorizontal: spacing.s12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  todayText: {
    color: ORG_ACCENT.saffron,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_PAPER.well,
  },
  weekRow: { flexDirection: 'row', paddingTop: 4 },
  weekday: {
    flex: 1,
    textAlign: 'center',
    color: ORG_INK.inkFaint,
    ...typography.label,
    ...fontWeights.semibold,
  },
  gridRow: { flexDirection: 'row' },
});

export const cellStyles = StyleSheet.create({
  wrap: { flex: 1 },
  cell: {
    aspectRatio: 1,
    margin: 2,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { borderColor: DAY_LOOK.selected },
  blocked: { backgroundColor: DAY_LOOK.blocked },
  picked: {
    backgroundColor: DAY_LOOK.picked,
    borderColor: DAY_LOOK.pickedInk,
  },
  faded: { opacity: 0.4 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotBooked: { backgroundColor: DAY_LOOK.booked },
  dotToday: { borderWidth: 2, borderColor: DAY_LOOK.todayRing },
  text: { color: ORG_INK.ink, ...typography.body, ...fontWeights.medium },
  textBooked: { color: DAY_LOOK.bookedText, ...fontWeights.bold },
  textBlocked: {
    color: DAY_LOOK.blockedInk,
    textDecorationLine: 'line-through',
  },
  textPicked: { color: DAY_LOOK.pickedInk, ...fontWeights.bold },
  textOutside: { color: ORG_INK.inkFaint },
  corner: { position: 'absolute', top: 3, right: 3 },
});

export const legendStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: ORG_PAPER.hairline,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  booked: { backgroundColor: DAY_LOOK.booked },
  blocked: { backgroundColor: DAY_LOOK.blocked, borderRadius: 4 },
  free: {
    backgroundColor: ORG_PAPER.card,
    borderWidth: 1,
    borderColor: ORG_PAPER.hairline,
  },
  today: { borderWidth: 2, borderColor: DAY_LOOK.todayRing },
  label: { color: ORG_INK.inkSoft, ...typography.caption },
});

export const dayStyles = StyleSheet.create({
  section: { gap: spacing.s12 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headText: { flex: 1, minWidth: 0, gap: 2 },
  title: { color: ORG_INK.ink, ...typography.h2 },
  sub: { color: ORG_INK.inkSoft, ...typography.caption },
  stateCard: {
    ...card,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  stateIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.jadeSoft,
  },
  stateIconBlocked: { backgroundColor: DAY_LOOK.blocked },
  stateIconPast: { backgroundColor: ORG_PAPER.well },
  stateTitle: { color: ORG_INK.ink, ...typography.h3, textAlign: 'center' },
  stateBody: {
    color: ORG_INK.inkSoft,
    ...typography.body,
    textAlign: 'center',
  },
  action: { alignSelf: 'stretch', marginTop: spacing.sm },
});

export const bookingStyles = StyleSheet.create({
  card: { ...card, padding: spacing.md, gap: spacing.s12 },
  head: { flexDirection: 'row', gap: spacing.s12 },
  date: {
    width: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  day: { color: ORG_ACCENT.saffron, ...typography.h2 },
  month: { color: ORG_ACCENT.saffron, ...typography.label },
  body: { flex: 1, minWidth: 0, gap: 3 },
  title: { color: ORG_INK.ink, ...typography.h3 },
  meta: { color: ORG_INK.inkSoft, ...typography.caption },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chipText: { ...typography.label, ...fontWeights.semibold },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingTop: spacing.s12,
    borderTopWidth: 1,
    borderTopColor: ORG_PAPER.hairline,
  },
  amount: { flex: 1, color: ORG_INK.ink, ...typography.h3 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
  },
  buttonText: {
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.bold,
  },
});

export const selectStyles = StyleSheet.create({
  card: {
    ...card,
    borderColor: '#f5c9a8',
    backgroundColor: '#fffaf4',
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: { color: ORG_INK.ink, ...typography.h3 },
  hint: { color: ORG_INK.inkSoft, ...typography.caption },
  count: {
    color: DAY_LOOK.pickedInk,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  row: { flexDirection: 'row', gap: spacing.s12, marginTop: spacing.xs },
  button: { flex: 1 },
});

export const upcomingStyles = StyleSheet.create({
  wrap: { gap: spacing.s12 },
  card: { ...card, paddingVertical: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  divider: { borderTopWidth: 1, borderTopColor: ORG_PAPER.hairline },
  tile: {
    width: 44,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  tileDay: { color: ORG_ACCENT.saffron, ...typography.h3 },
  tileWeekday: { color: ORG_ACCENT.saffron, ...typography.label },
  body: { flex: 1, minWidth: 0 },
  title: { color: ORG_INK.ink, ...typography.body, ...fontWeights.semibold },
  more: { color: ORG_INK.inkSoft, ...typography.caption },
  empty: {
    color: ORG_INK.inkSoft,
    ...typography.body,
    padding: spacing.md,
    textAlign: 'center',
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
