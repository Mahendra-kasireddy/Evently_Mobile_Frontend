import { Platform, StyleSheet } from 'react-native';
import { fontWeights, spacing, typography } from '../../theme';
import { ORG_ACCENT, ORG_INK, ORG_PAPER, TIER_LOOK } from './design';

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
  padding: spacing.md,
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
  card,
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s12,
  },
  cardTitle: { color: ORG_INK.ink, ...typography.h3 },
  cardMeta: { color: ORG_INK.inkSoft, ...typography.caption },
});

export const heroStyles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: spacing.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  shine: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  medal: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0, gap: 3 },
  label: { color: 'rgba(255,255,255,0.85)', ...typography.overline },
  tier: { color: '#ffffff', ...typography.h1 },
  sub: { color: 'rgba(255,255,255,0.92)', ...typography.caption },
  rate: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  rateText: { color: '#ffffff', ...typography.label, ...fontWeights.semibold },
});

export const ladderStyles = StyleSheet.create({
  title: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  step: { width: 80, alignItems: 'center', gap: 6 },
  /* Joins two dots at their centres (dot height 44 → 21 down). */
  line: {
    flex: 1,
    height: 3,
    marginTop: 21,
    borderRadius: 2,
    backgroundColor: ORG_PAPER.well,
  },
  lineDone: { backgroundColor: ORG_ACCENT.jade },
  dot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: ORG_PAPER.well,
  },
  dotCurrent: { borderWidth: 3, borderColor: '#ffffff', ...cardShadow },
  name: {
    color: ORG_INK.inkSoft,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  nameCurrent: { color: ORG_INK.ink, ...fontWeights.bold },
  rate: { color: ORG_INK.inkFaint, ...typography.label },
  you: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: ORG_INK.ink,
  },
  youText: { color: '#ffffff', ...typography.label, ...fontWeights.bold },
});

export const reqStyles = StyleSheet.create({
  row: { paddingVertical: spacing.s12, gap: 8 },
  divider: { borderTopWidth: 1, borderTopColor: ORG_PAPER.hairline },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: ORG_PAPER.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: ORG_ACCENT.jade, borderColor: ORG_ACCENT.jade },
  label: { flex: 1, color: ORG_INK.ink, ...typography.body },
  value: {
    color: ORG_INK.inkSoft,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  valueOn: { color: ORG_ACCENT.jade },
  track: {
    marginLeft: 38,
    height: 6,
    borderRadius: 3,
    backgroundColor: ORG_PAPER.well,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: ORG_ACCENT.saffron,
  },
  fillOn: { backgroundColor: ORG_ACCENT.jade },
  action: { marginLeft: 38, alignSelf: 'flex-start' },
  actionText: {
    color: ORG_ACCENT.saffron,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
});

export const perkStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  perk: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.s12,
    borderRadius: 14,
    backgroundColor: ORG_PAPER.well,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    color: ORG_INK.ink,
    ...typography.caption,
    ...fontWeights.semibold,
  },
  title: { marginBottom: spacing.s12 },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.s12,
  },
  footText: { color: ORG_INK.inkSoft, ...typography.caption },
});

export const helpStyles = StyleSheet.create({
  card: {
    ...card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.jadeSoft,
  },
  body: { flex: 1, minWidth: 0 },
  title: { color: ORG_INK.ink, ...typography.body, ...fontWeights.semibold },
  sub: { color: ORG_INK.inkSoft, ...typography.caption },
  cta: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.jade,
  },
  ctaText: { color: '#ffffff', ...typography.bodySmall, ...fontWeights.bold },
});

/** Each tier's tint for a perk icon tile. */
export const tierSoftStyles = StyleSheet.create(
  Object.fromEntries(
    Object.entries(TIER_LOOK).map(([tier, look]) => [
      tier,
      { backgroundColor: look.soft },
    ]),
  ) as Record<string, { backgroundColor: string }>,
);
