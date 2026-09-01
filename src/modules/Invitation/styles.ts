import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { INV_ACCENT, INV_ACCENT_SOFT, INV_GREEN, INV_GREEN_SOFT, INV_NAVY, INV_NAVY_DEEP } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  listContent: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: INV_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredTitle: { color: INV_NAVY, marginTop: spacing.md, textAlign: 'center' },
  centeredBody: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
  errorText: { color: colors.danger, textAlign: 'center' },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: INV_ACCENT, fontWeight: '700' },
});

export const listStyles = StyleSheet.create({
  /** How many of these are actually waiting on the customer. */
  summary: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: 14,
    padding: spacing.md,
  },
  summaryAction: { backgroundColor: INV_ACCENT_SOFT },
  summaryDone: { backgroundColor: INV_GREEN_SOFT },
  summaryText: { flex: 1, color: INV_NAVY, fontWeight: '700' },

  row: {
    ...globalStyles.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  /** A row that needs a decision is the one worth finding at a glance. */
  rowNeedsYou: { borderColor: INV_ACCENT },
  head: { ...globalStyles.row, gap: spacing.sm },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: INV_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  title: { color: INV_NAVY, fontSize: 16, fontWeight: '800' },
  ref: { color: colors.textMuted, marginTop: 1, letterSpacing: 0.4 },
  statusChip: { borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  statusChipAction: { backgroundColor: INV_ACCENT_SOFT },
  statusChipDone: { backgroundColor: INV_GREEN_SOFT },
  statusText: { fontWeight: '700', fontSize: 11 },

  footer: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  meta: { ...globalStyles.row, gap: spacing.xs },
  metaText: { color: colors.textMuted },
  open: { ...globalStyles.row, gap: 2 },
  openText: { color: INV_ACCENT, fontWeight: '700' },
});

export const heroStyles = StyleSheet.create({
  card: {
    backgroundColor: INV_NAVY_DEEP,
    borderRadius: 20,
    margin: spacing.md,
    padding: spacing.lg,
  },
  eyebrow: {
    color: colors.onPrimaryMuted,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  heading: { color: colors.onPrimary, fontSize: 22, fontWeight: '800', marginTop: spacing.sm },
  sub: { color: colors.onPrimaryMuted, marginTop: spacing.xs, lineHeight: 20 },

  statusRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: colors.onPrimary, fontWeight: '700', flex: 1 },
});

export const actionStyles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.md, gap: spacing.sm },
  primary: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: INV_ACCENT,
  },
  primaryText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  approvedChip: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: INV_GREEN_SOFT,
  },
  approvedChipText: { color: INV_GREEN, fontWeight: '700' },
  secondaryRow: { flexDirection: 'row', gap: spacing.sm },
  secondary: {
    ...globalStyles.row,
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: { color: INV_NAVY, fontWeight: '700' },
  share: { backgroundColor: INV_GREEN, borderColor: INV_GREEN },
  shareText: { color: colors.onPrimary, fontWeight: '700' },
  errorText: { color: colors.danger, textAlign: 'center' },
  sentText: { color: INV_GREEN, fontWeight: '700', textAlign: 'center' },
});

export const bannerStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: 14,
    backgroundColor: INV_ACCENT_SOFT,
    padding: spacing.md,
  },
  text: { flex: 1 },
  title: { color: INV_NAVY, fontWeight: '700' },
  body: { color: colors.textMuted, marginTop: 2, lineHeight: 19 },
});

export const sectionStyles = StyleSheet.create({
  header: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  title: { color: INV_NAVY, fontSize: 17, fontWeight: '800' },
  count: { color: colors.textMuted },

  row: {
    ...globalStyles.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  rowHidden: { opacity: 0.72 },
  head: { ...globalStyles.row, gap: spacing.sm },
  iconChip: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipCustomer: { backgroundColor: INV_ACCENT_SOFT },
  headText: { flex: 1 },
  rowTitle: { color: INV_NAVY, fontWeight: '700' },
  ownerBadge: { marginTop: 2 },
  ownerOrganizer: { color: colors.textMuted },
  ownerCustomer: { color: INV_ACCENT, fontWeight: '700' },
  stateChip: { borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  stateReady: { backgroundColor: INV_GREEN_SOFT },
  stateHidden: { backgroundColor: colors.surface },
  stateText: { fontWeight: '700', fontSize: 11 },
  // Padded out to a comfortable tap target; the icon itself is only 18px.
  eyeButton: { padding: spacing.xs, marginLeft: 2 },

  body: { color: colors.textMuted, marginTop: spacing.sm, lineHeight: 19 },
  pending: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.sm },
  pendingText: { color: colors.accent, flex: 1 },

  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  action: {
    ...globalStyles.row,
    gap: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionPrimary: { borderColor: INV_ACCENT, backgroundColor: INV_ACCENT },
  actionText: { color: INV_NAVY, fontWeight: '700' },
  actionPrimaryText: { color: colors.onPrimary, fontWeight: '700' },
});

/** The phone-framed render of what a guest opening the link would see. */
export const previewStyles = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  phone: {
    borderRadius: 30,
    borderWidth: 9,
    borderColor: INV_NAVY_DEEP,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  notch: {
    alignSelf: 'center',
    width: 92,
    height: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: INV_NAVY_DEEP,
    zIndex: 2,
  },
  homeBar: {
    alignSelf: 'center',
    width: 110,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  card: { backgroundColor: INV_NAVY_DEEP, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg, alignItems: 'center' },
  eyebrow: {
    color: INV_ACCENT,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '700',
    textAlign: 'center',
  },
  hosts: { color: colors.onPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: spacing.sm },
  when: { color: colors.onPrimaryMuted, marginTop: spacing.sm, textAlign: 'center' },
  venue: { color: colors.onPrimaryMuted, marginTop: 2, textAlign: 'center' },

  block: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  blockHead: { ...globalStyles.row, gap: spacing.sm },
  blockTitle: { color: INV_NAVY, fontWeight: '700', flex: 1 },
  blockBody: { color: colors.textMuted, marginTop: 2, lineHeight: 19 },

  scheduleTitle: { color: INV_NAVY, fontWeight: '800', paddingHorizontal: spacing.md, paddingTop: spacing.md },
  subEvent: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  subEventBar: { width: 3, borderRadius: 2, backgroundColor: INV_ACCENT },
  subEventName: { color: INV_NAVY, fontWeight: '700' },
  subEventMeta: { color: colors.textMuted, marginTop: 1 },

  hiddenNote: { color: colors.textMuted, padding: spacing.md, textAlign: 'center', lineHeight: 19 },
});

/** The preview sheet's own chrome: a title row, a status line, and one action. */
export const previewSheetStyles = StyleSheet.create({
  head: { ...globalStyles.row, gap: spacing.sm },
  headText: { flex: 1 },
  title: { color: INV_NAVY, fontSize: 19, fontWeight: '800' },
  meta: { ...globalStyles.row, gap: spacing.xs, marginTop: 2 },
  metaText: { color: colors.textMuted },
  ownerCustomer: { color: INV_ACCENT, fontWeight: '700' },
  close: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  share: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: INV_GREEN,
    marginTop: spacing.lg,
  },
  shareText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  blockedNote: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.lg },
  blockedText: { color: colors.textMuted, flex: 1, lineHeight: 18 },
});

export const sheetStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: '88%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  title: { color: INV_NAVY, fontSize: 19, fontWeight: '800' },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs, lineHeight: 19 },

  label: { color: INV_NAVY, fontWeight: '700', marginTop: spacing.lg },
  hint: { color: colors.textMuted, marginTop: 2 },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginTop: spacing.sm,
    color: colors.text,
  },
  inputMultiline: { minHeight: 100, textAlignVertical: 'top' },

  toggleRow: { ...globalStyles.row, gap: spacing.sm, marginTop: spacing.lg },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: INV_ACCENT, borderColor: INV_ACCENT },
  toggleLabel: { color: colors.text, flex: 1 },

  primary: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: INV_ACCENT,
    marginTop: spacing.lg,
  },
  primaryDisabled: { opacity: 0.45 },
  primaryText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  secondary: {
    ...globalStyles.row,
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  secondaryText: { color: INV_NAVY, fontWeight: '700' },
  errorText: { color: colors.danger, marginTop: spacing.sm },
  caveat: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.md },
  caveatText: { color: colors.textMuted, flex: 1, lineHeight: 18 },

  // Guest list.
  guestRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  guestText: { flex: 1 },
  guestName: { color: INV_NAVY, fontWeight: '700' },
  guestMeta: { color: colors.textMuted, marginTop: 1 },
  guestSent: { color: INV_GREEN, fontWeight: '700' },
  emptyGuests: { color: colors.textMuted, marginTop: spacing.md },
  guestsLoading: { marginTop: spacing.md },

  outcomeRow: { ...globalStyles.row, gap: spacing.sm, marginTop: spacing.sm },
  outcomeText: { flex: 1, color: colors.text },
  outcomeLink: { color: INV_ACCENT, fontWeight: '700' },
});
