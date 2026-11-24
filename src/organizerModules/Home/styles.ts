import { Platform, StyleSheet } from 'react-native';
import { fontWeights, spacing, textColor, typography } from '../../theme';
import { ORG_ACCENT, ORG_INK, ORG_PAPER } from './design';

/** The customer Home's lifted white card. */
const cardShadow = Platform.select({
  ios: {
    shadowColor: ORG_INK.night,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  android: { elevation: 3 },
  default: {},
}) as object;

const card = {
  backgroundColor: ORG_PAPER.card,
  borderRadius: 22,
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
  loadingTitle: { color: ORG_INK.ink, marginTop: spacing.sm },
  muted: { color: ORG_INK.inkSoft, textAlign: 'center' },
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  /* A section whose content runs edge to edge (a sideways list). */
  sectionWide: { marginTop: spacing.lg },
  sectionPad: { paddingHorizontal: spacing.md },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s12,
  },
  sectionTitle: { color: textColor.textPrimary, ...typography.h3 },
  sectionAction: {
    color: ORG_ACCENT.saffron,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
});

export const headerStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
});

export const goLiveStyles = StyleSheet.create({
  card: { ...card, padding: spacing.md, gap: spacing.s12, overflow: 'hidden' },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headText: { flex: 1, minWidth: 0 },
  title: { color: ORG_INK.ink, ...typography.h3 },
  body: { color: ORG_INK.inkSoft, ...typography.bodySmall, marginTop: 2 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: ORG_PAPER.well,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4, overflow: 'hidden' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: { color: ORG_INK.inkSoft, ...typography.caption },
  next: {
    color: ORG_ACCENT.saffron,
    ...typography.caption,
    ...fontWeights.bold,
    flexShrink: 1,
  },
  percent: { color: ORG_INK.ink, ...typography.caption, ...fontWeights.bold },
});

export const needsStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.s12 },
  tileWrap: { flex: 1 },
  tile: {
    borderRadius: 20,
    padding: spacing.md,
    overflow: 'hidden',
    minHeight: 104,
    justifyContent: 'space-between',
  },
  number: { color: '#ffffff', ...typography.display },
  label: {
    color: 'rgba(255,255,255,0.92)',
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  arrow: { position: 'absolute', top: spacing.s12, right: spacing.s12 },
});

export const statStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s12 },
  tileWrap: { width: '47.9%' },
  tile: { ...card, padding: spacing.md, gap: 6 },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { color: ORG_INK.ink, ...typography.h1 },
  label: { color: ORG_INK.inkSoft, ...typography.caption },
  hint: { ...typography.caption, ...fontWeights.semibold },
  hintUp: { color: ORG_ACCENT.jade },
  hintDown: { color: ORG_ACCENT.sindoor },
});

export const taskStyles = StyleSheet.create({
  card: { ...card, paddingVertical: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.s12,
  },
  divider: { borderTopWidth: 1, borderTopColor: ORG_PAPER.hairline },
  box: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ORG_PAPER.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: ORG_ACCENT.jade, borderColor: ORG_ACCENT.jade },
  title: { flex: 1, color: ORG_INK.ink, ...typography.body },
  titleDone: { color: ORG_INK.inkFaint, textDecorationLine: 'line-through' },
  count: { color: ORG_INK.inkSoft, ...typography.caption },
});

export const weekStyles = StyleSheet.create({
  list: { gap: spacing.s12, paddingHorizontal: spacing.md },
  card: {
    ...card,
    width: 220,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.s12,
  },
  date: {
    width: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  day: { color: ORG_ACCENT.saffron, ...typography.h2 },
  month: { color: ORG_ACCENT.saffron, ...typography.label },
  body: { flex: 1, minWidth: 0, justifyContent: 'center', gap: 2 },
  when: { color: ORG_ACCENT.saffron, ...typography.label },
  title: { color: ORG_INK.ink, ...typography.body, ...fontWeights.semibold },
  customer: { color: ORG_INK.inkSoft, ...typography.caption },
  empty: {
    ...card,
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  emptyTitle: {
    color: ORG_INK.ink,
    ...typography.body,
    ...fontWeights.semibold,
  },
});

export const tierStyles = StyleSheet.create({
  card: {
    ...card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  medal: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  body: { flex: 1, minWidth: 0, gap: 6 },
  tier: { color: ORG_INK.ink, ...typography.h3 },
  line: { color: ORG_INK.inkSoft, ...typography.caption },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: ORG_PAPER.well,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
});
