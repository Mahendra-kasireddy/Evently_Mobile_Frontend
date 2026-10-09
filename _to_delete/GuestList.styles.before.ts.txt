import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand, colors, spacing } from '../../theme';
import { GUEST_ACCENT, GUEST_CANVAS, GUEST_HAIRLINE, GUEST_MUTED, GUEST_NAVY, GUEST_SURFACE } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GUEST_CANVAS },
  /* Clear of the pinned footer, so the last row is never under it. */
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },

  subtitle: { color: GUEST_MUTED, paddingHorizontal: spacing.md, marginTop: -spacing.sm },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredText: { color: GUEST_MUTED, marginTop: spacing.sm, textAlign: 'center' },
  errorTitle: { color: GUEST_NAVY, textAlign: 'center' },
  retry: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: GUEST_ACCENT, fontWeight: '700' },

  /* Said after an import — what went in, and what could not. */
  notice: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.s12,
    padding: spacing.s12,
    borderRadius: 14,
    backgroundColor: '#f1f0eb',
  },
  noticeText: { color: '#4a4740', flex: 1 },
});

export const filterStyles = StyleSheet.create({
  /*
   * A horizontal ScrollView has no height of its own, so as a flex child in a
   * column it takes every pixel left over and stretches its chips from the
   * filter row to the footer. `flexGrow: 0` stops it claiming the space and
   * `alignItems: center` stops the chips filling whatever it does claim —
   * both are needed; either alone still leaves a full-height chip.
   */
  scroll: { flexGrow: 0 },
  row: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingVertical: spacing.s12,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    backgroundColor: GUEST_SURFACE,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
  },
  chipOn: { backgroundColor: GUEST_NAVY, borderColor: GUEST_NAVY },
  chipText: { color: GUEST_MUTED },
  chipTextOn: { color: brand.onNavy },
});

export const rowStyles = StyleSheet.create({
  card: {
    ...globalStyles.row,
    gap: spacing.s12,
    padding: spacing.s12,
    marginBottom: spacing.sm,
    borderRadius: 14,
    backgroundColor: GUEST_SURFACE,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
  },
  /* A squircle, not a circle: the design's monograms are rounded squares, and
     a circle beside the square edit button reads as two different systems. */
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: brand.onNavy, fontWeight: '700' },
  text: { flex: 1, gap: 2 },
  name: { color: GUEST_NAVY },
  meta: { color: GUEST_MUTED },
  /* 40pt box around a 17pt glyph: the icon is what you see, the box is what
     you hit, and on a row this tight they are not the same measurement. */
  edit: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const footerStyles = StyleSheet.create({
  bar: {
    ...globalStyles.row,
    gap: spacing.s12,
    backgroundColor: GUEST_CANVAS,
    borderTopWidth: 1,
    borderTopColor: GUEST_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.s12,
  },
  contacts: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
    backgroundColor: GUEST_SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    ...globalStyles.row,
    flex: 1,
    height: 56,
    gap: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GUEST_ACCENT,
  },
  ctaBusy: { opacity: 0.7 },
  ctaText: { color: brand.onAccent, fontSize: 17, lineHeight: 22, fontWeight: '600' },
});

export const sheetStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(16,26,49,0.42)' },
  card: {
    backgroundColor: GUEST_CANVAS,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.s12,
    paddingBottom: spacing.lg,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#dedcd9',
    marginBottom: spacing.md,
  },
  head: { ...globalStyles.row, justifyContent: 'space-between', marginBottom: spacing.lg },
  title: { color: GUEST_NAVY, fontSize: 21, lineHeight: 27, fontWeight: '700' },
  close: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#efede8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: { color: GUEST_NAVY, marginBottom: spacing.sm },
  field: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
    backgroundColor: GUEST_SURFACE,
    paddingHorizontal: spacing.md,
    color: GUEST_NAVY,
    marginBottom: spacing.md,
  },

  groupRow: { ...globalStyles.row, gap: spacing.s12, marginBottom: spacing.lg },
  group: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
    backgroundColor: GUEST_SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupOn: { backgroundColor: GUEST_NAVY, borderColor: GUEST_NAVY },
  groupText: { color: GUEST_NAVY },
  groupTextOn: { color: brand.onNavy },

  save: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GUEST_ACCENT,
  },
  saveBusy: { opacity: 0.7 },
  saveText: { color: brand.onAccent, fontSize: 17, lineHeight: 22, fontWeight: '600' },
  error: { color: colors.danger, marginBottom: spacing.sm },
});

/** Choosing which event, when the screen opened without one. */
export const pickerStyles = StyleSheet.create({
  lead: { color: GUEST_MUTED, marginBottom: spacing.s12 },
  row: {
    ...globalStyles.row,
    gap: spacing.s12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 14,
    backgroundColor: GUEST_SURFACE,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
  },
  text: { flex: 1, gap: 2 },
  title: { color: GUEST_NAVY },
  meta: { color: GUEST_MUTED },
});

/** The phonebook picker. Taller than the add sheet: it is a list, not a form. */
export const contactsSheetStyles = StyleSheet.create({
  card: { maxHeight: '86%' },
  list: { maxHeight: 360, marginBottom: spacing.md },
  row: { ...globalStyles.row, gap: spacing.s12, paddingVertical: 10 },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: GUEST_HAIRLINE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: GUEST_NAVY, borderColor: GUEST_NAVY },
  rowText: { flex: 1, gap: 1 },
  name: { color: GUEST_NAVY },
  phone: { color: GUEST_MUTED },
  empty: { color: GUEST_MUTED, paddingVertical: spacing.md },
});
