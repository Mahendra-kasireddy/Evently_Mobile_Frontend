import { Platform, StyleSheet } from 'react-native';
import { fontWeights, spacing, typography } from '../../theme';
import { BAR_IDLE, ORG_ACCENT, ORG_INK, ORG_PAPER } from './design';

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

export const CHART_HEIGHT = 120;

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
  sectionTitle: { color: ORG_INK.ink, ...typography.h3 },
  card: { ...card, padding: spacing.md },
});

export const periodStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
  },
  chipOn: { backgroundColor: ORG_INK.ink, borderColor: ORG_INK.ink },
  text: {
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  textOn: { color: '#ffffff' },
});

export const heroStyles = StyleSheet.create({
  card: {
    marginTop: spacing.s12,
    marginHorizontal: spacing.md,
    borderRadius: 24,
    padding: spacing.lg,
    overflow: 'hidden',
    gap: 4,
  },
  glow: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(242,166,59,0.22)',
  },
  label: { color: 'rgba(255,255,255,0.72)', ...typography.bodySmall },
  amount: { color: '#ffffff', ...typography.display },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  hint: { color: 'rgba(255,255,255,0.6)', ...typography.caption },
  change: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(117,207,167,0.2)',
  },
  changeDown: { backgroundColor: 'rgba(255,138,138,0.2)' },
  changeText: {
    color: '#8fe0bd',
    ...typography.label,
    ...fontWeights.semibold,
  },
  changeTextDown: { color: '#ffb0a6' },
  split: { flexDirection: 'row', gap: spacing.s12, marginTop: spacing.md },
  pill: {
    flex: 1,
    borderRadius: 14,
    padding: spacing.s12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    gap: 2,
  },
  pillLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotPaid: { backgroundColor: '#75cfa7' },
  dotPending: { backgroundColor: '#f2a63b' },
  pillLabel: { color: 'rgba(255,255,255,0.7)', ...typography.caption },
  pillValue: { color: '#ffffff', ...typography.h3 },
});

export const tileStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.s12 },
  tile: { ...card, flex: 1, padding: spacing.md, gap: 4 },
  label: { color: ORG_INK.inkSoft, ...typography.caption },
  value: { color: ORG_INK.ink, ...typography.h2 },
});

export const chartStyles = StyleSheet.create({
  bars: {
    height: CHART_HEIGHT + 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.s12,
  },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  top: { color: ORG_ACCENT.saffron, ...typography.label, ...fontWeights.bold },
  bar: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: BAR_IDLE,
    overflow: 'hidden',
  },
  label: { color: ORG_INK.inkSoft, ...typography.label },
  labelOn: { color: ORG_INK.ink, ...fontWeights.bold },
  empty: {
    color: ORG_INK.inkSoft,
    ...typography.bodySmall,
    marginTop: spacing.sm,
  },
  mixBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginTop: spacing.s12,
    gap: 2,
  },
  legend: { marginTop: spacing.s12, gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  mixSlice: { height: '100%' },
  legendName: { flex: 1, color: ORG_INK.ink, ...typography.bodySmall },
  legendPct: {
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.bold,
  },
});

export const couponStyles = StyleSheet.create({
  card: {
    ...card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.roseSoft,
  },
  body: { flex: 1, minWidth: 0 },
  title: { color: ORG_INK.ink, ...typography.h3 },
  hint: { color: ORG_INK.inkSoft, ...typography.caption },
});

export const paymentStyles = StyleSheet.create({
  card: { ...card, paddingVertical: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.s12,
  },
  divider: { borderTopWidth: 1, borderTopColor: ORG_PAPER.hairline },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPaid: { backgroundColor: ORG_ACCENT.jadeSoft },
  iconPending: { backgroundColor: ORG_ACCENT.marigoldSoft },
  body: { flex: 1, minWidth: 0, gap: 2 },
  name: { color: ORG_INK.ink, ...typography.body, ...fontWeights.semibold },
  meta: { color: ORG_INK.inkSoft, ...typography.caption },
  side: { alignItems: 'flex-end', gap: 2 },
  amount: { color: ORG_INK.ink, ...typography.body, ...fontWeights.bold },
  net: { color: ORG_INK.inkSoft, ...typography.label },
  chip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  chipPaid: { backgroundColor: ORG_ACCENT.jadeSoft },
  chipPending: { backgroundColor: ORG_ACCENT.marigoldSoft },
  chipText: { ...typography.label, ...fontWeights.semibold },
  chipTextPaid: { color: ORG_ACCENT.jade },
  chipTextPending: { color: '#a8620f' },
  empty: { ...card, padding: spacing.lg, alignItems: 'center', gap: 4 },
  emptyTitle: {
    color: ORG_INK.ink,
    ...typography.body,
    ...fontWeights.semibold,
  },
});
