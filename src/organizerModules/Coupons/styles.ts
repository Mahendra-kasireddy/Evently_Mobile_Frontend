import { Platform, StyleSheet } from 'react-native';
import { fontWeights, spacing, typography } from '../../theme';
import {
  ORG_ACCENT,
  ORG_INK,
  ORG_PAPER,
  TICKET_EDGE,
  TICKET_FILL,
  TICKET_INK,
} from './design';

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

const ERROR_RED = '#c2361f';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORG_PAPER.canvas },
  content: { paddingTop: spacing.sm, paddingBottom: spacing.xl },
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
  notice: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.s12,
    borderRadius: 12,
    backgroundColor: '#fde4df',
  },
  noticeText: { color: '#a3301c', ...typography.caption },
});

export const summaryStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md },
  tile: { ...card, flex: 1, padding: spacing.s12, gap: 2, borderRadius: 16 },
  value: { color: ORG_INK.ink, ...typography.h2 },
  label: { color: ORG_INK.inkSoft, ...typography.caption },
});

export const createStyles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.md, marginTop: spacing.md, gap: 6 },
  button: {
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  text: { color: '#ffffff', ...typography.button, ...fontWeights.semibold },
  note: { color: ORG_INK.inkSoft, ...typography.caption, textAlign: 'center' },
});

export const cardStyles = StyleSheet.create({
  card: { ...card, padding: spacing.md, gap: spacing.s12 },
  cardMuted: { backgroundColor: '#fcfaf7' },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  ticket: {
    flexShrink: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: TICKET_EDGE,
    backgroundColor: TICKET_FILL,
  },
  // The two bites out of the stub that make it read as a ticket.
  notch: {
    position: 'absolute',
    top: '50%',
    width: 12,
    height: 12,
    marginTop: -6,
    borderRadius: 6,
    backgroundColor: ORG_PAPER.card,
    borderWidth: 1.5,
    borderColor: TICKET_EDGE,
  },
  notchLeft: { left: -7 },
  notchRight: { right: -7 },
  code: {
    color: TICKET_INK,
    ...typography.h2,
    ...fontWeights.bold,
    letterSpacing: 1.5,
  },
  spacer: { flex: 1 },
  title: { color: ORG_INK.inkSoft, ...typography.bodySmall },
  discount: { color: ORG_INK.ink, ...typography.h3 },
  metaList: { gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  metaText: { flex: 1, color: ORG_INK.inkSoft, ...typography.bodySmall },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.s12,
    borderTopWidth: 1,
    borderTopColor: ORG_PAPER.hairline,
  },
  footerText: {
    flex: 1,
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  footerTextOff: { color: ORG_INK.inkSoft },
});

/** One chip shape, a tone per state. */
export const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { ...typography.label, ...fontWeights.semibold },
});

export const chipTone = StyleSheet.create({
  active: { backgroundColor: ORG_ACCENT.jadeSoft },
  scheduled: { backgroundColor: '#e3e9f7' },
  paused: { backgroundColor: ORG_PAPER.well },
  usedUp: { backgroundColor: ORG_ACCENT.marigoldSoft },
  expired: { backgroundColor: '#f1ecef' },
});

export const chipInk = StyleSheet.create({
  active: { color: ORG_ACCENT.jade },
  scheduled: { color: ORG_ACCENT.lapis },
  paused: { color: ORG_INK.inkSoft },
  usedUp: { color: '#a8620f' },
  expired: { color: ORG_INK.inkFaint },
});

export const chipDot = StyleSheet.create({
  active: { backgroundColor: ORG_ACCENT.jade },
  scheduled: { backgroundColor: ORG_ACCENT.lapis },
  paused: { backgroundColor: ORG_INK.inkSoft },
  usedUp: { backgroundColor: '#a8620f' },
  expired: { backgroundColor: ORG_INK.inkFaint },
});

export const usageStyles = StyleSheet.create({
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
    backgroundColor: ORG_ACCENT.marigoldSoft,
  },
  iconReversed: { backgroundColor: ORG_PAPER.well },
  body: { flex: 1, minWidth: 0, gap: 2 },
  name: { color: ORG_INK.ink, ...typography.body, ...fontWeights.semibold },
  meta: { color: ORG_INK.inkSoft, ...typography.caption },
  side: { alignItems: 'flex-end', gap: 2 },
  amount: { color: ORG_ACCENT.jade, ...typography.body, ...fontWeights.bold },
  amountReversed: {
    color: ORG_INK.inkFaint,
    textDecorationLine: 'line-through',
  },
  date: { color: ORG_INK.inkSoft, ...typography.label },
});

export const emptyStyles = StyleSheet.create({
  card: {
    ...card,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ORG_ACCENT.marigoldSoft,
    marginBottom: spacing.xs,
  },
  title: { color: ORG_INK.ink, ...typography.h2, textAlign: 'center' },
  body: { color: ORG_INK.inkSoft, ...typography.body, textAlign: 'center' },
  action: { alignSelf: 'stretch', marginTop: spacing.sm },
});

export const formStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: ORG_PAPER.canvas },
  flex: { flex: 1 },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
    gap: spacing.lg,
  },
  field: { gap: 6 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  counter: { color: ORG_INK.inkFaint, ...typography.label },
  input: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
    paddingHorizontal: spacing.s12,
    paddingVertical: 12,
    color: ORG_INK.ink,
    ...typography.body,
  },
  inputCode: {
    ...typography.h3,
    ...fontWeights.bold,
    letterSpacing: 1.5,
  },
  inputMulti: { minHeight: 96, textAlignVertical: 'top' },
  inputError: { borderColor: '#d9462f' },
  hint: { color: ORG_INK.inkSoft, ...typography.caption },
  error: { color: ERROR_RED, ...typography.caption },
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    backgroundColor: ORG_PAPER.well,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentOn: { backgroundColor: ORG_PAPER.card, ...cardShadow },
  segmentText: {
    color: ORG_INK.inkSoft,
    ...typography.body,
    ...fontWeights.semibold,
  },
  segmentTextOn: { color: '#a8560f' },
  dates: { flexDirection: 'row', gap: spacing.s12 },
  date: {
    flex: 1,
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.card,
    paddingHorizontal: spacing.s12,
    paddingVertical: 10,
    gap: 2,
  },
  dateHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateLabel: { flex: 1, color: ORG_INK.inkSoft, ...typography.caption },
  dateValue: {
    color: ORG_INK.ink,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  dateBlank: { color: ORG_INK.inkFaint },
  dateClear: { padding: 2 },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.s12,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: ORG_PAPER.hairline,
    backgroundColor: ORG_PAPER.canvas,
    gap: spacing.sm,
  },
  saveError: { color: ERROR_RED, ...typography.caption, textAlign: 'center' },
});
