import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand, colors, spacing } from '../../theme';
import {
  GUEST_ACCENT,
  GUEST_CANVAS,
  GUEST_HAIRLINE,
  GUEST_MUTED,
  GUEST_NAVY,
  GUEST_SURFACE,
} from './constants';

const SOFT_SHADOW = Platform.select({
  ios: {
    shadowColor: '#1a2e5a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  android: { elevation: 2 },
});

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GUEST_CANVAS },
  /* Clear of the pinned footer, so the last row is never under it. */
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },

  subtitle: {
    color: GUEST_MUTED,
    paddingHorizontal: spacing.md,
    marginTop: -spacing.sm,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  centeredText: {
    color: GUEST_MUTED,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
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
    backgroundColor: '#eef6ff',
  },
  noticeText: { color: '#28406b', flex: 1 },

  /* Search, under the numbers. */
  search: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.s12,
    paddingHorizontal: spacing.s12,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
    backgroundColor: colors.background,
  },
  searchInput: {
    flex: 1,
    color: GUEST_NAVY,
    fontSize: 15,
    paddingVertical: 0,
    borderWidth: 0,
    minHeight: 0,
    paddingHorizontal: 0,
  },
  noMatch: { color: GUEST_MUTED, textAlign: 'center', marginTop: spacing.xl },
  listScroll: { paddingBottom: spacing.lg },
  sticky: { backgroundColor: GUEST_CANVAS },
});

/* The numbers card: how many, how many have it, how many opened it. */
export const statsStyles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    padding: spacing.md,
    borderRadius: 22,
    overflow: 'hidden',
  },
  topRow: { ...globalStyles.row, alignItems: 'flex-end', gap: 8 },
  total: { color: '#ffffff', fontSize: 40, lineHeight: 46, fontWeight: '800' },
  totalLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    marginBottom: 8,
  },
  bar: {
    ...globalStyles.row,
    height: 8,
    borderRadius: 4,
    marginTop: spacing.s12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  barOpened: { height: 8, backgroundColor: '#ffffff' },
  barInvited: { height: 8, backgroundColor: 'rgba(255,255,255,0.6)' },
  legend: { ...globalStyles.row, gap: spacing.md, marginTop: spacing.s12 },
  legendItem: { ...globalStyles.row, gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  dotOpened: { backgroundColor: '#ffffff' },
  dotInvited: { backgroundColor: 'rgba(255,255,255,0.6)' },
  dotNotSent: { backgroundColor: 'rgba(255,255,255,0.25)' },
  legendText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  note: { color: 'rgba(255,255,255,0.9)', fontSize: 12.5, marginTop: 8 },
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
    ...globalStyles.row,
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.s12,
  },
  chip: {
    ...globalStyles.row,
    gap: 6,
    paddingLeft: 14,
    paddingRight: 8,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
    backgroundColor: colors.background,
  },
  chipOn: { backgroundColor: GUEST_NAVY, borderColor: GUEST_NAVY },
  chipText: { color: GUEST_NAVY, fontWeight: '600' },
  chipTextOn: { color: brand.onNavy },
  count: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1eef6',
  },
  countOn: { backgroundColor: 'rgba(255,255,255,0.2)' },
  countText: { color: GUEST_MUTED, fontSize: 11.5, fontWeight: '700' },
  countTextOn: { color: '#ffffff' },
});

export const rowStyles = StyleSheet.create({
  card: {
    ...globalStyles.row,
    gap: spacing.s12,
    paddingVertical: 12,
    paddingHorizontal: spacing.s12,
    marginBottom: spacing.sm,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: brand.onNavy, fontWeight: '700', fontSize: 16 },
  text: { flex: 1, gap: 2 },
  name: { color: GUEST_NAVY },
  meta: { color: GUEST_MUTED },
  status: {
    ...globalStyles.row,
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  statusText: { fontSize: 11.5, fontWeight: '700' },
  /* Kept for the edit affordance on wider layouts and the render dump. */
  edit: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GUEST_SURFACE,
  },
});

export const footerStyles = StyleSheet.create({
  bar: {
    ...globalStyles.row,
    gap: spacing.s12,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.s12,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: GUEST_HAIRLINE,
    backgroundColor: GUEST_CANVAS,
  },
  contacts: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 6,
    height: 54,
    paddingHorizontal: spacing.md,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: GUEST_NAVY,
    backgroundColor: colors.background,
  },
  contactsText: { color: GUEST_NAVY, fontWeight: '700', fontSize: 15 },
  cta: {
    flex: 1,
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    backgroundColor: GUEST_ACCENT,
  },
  ctaBusy: { opacity: 0.7 },
  ctaText: {
    color: brand.onAccent,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
});

/* An empty list: two ways in, side by side. */
export const emptyStyles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: spacing.xl },
  art: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdeee7',
  },
  title: {
    color: GUEST_NAVY,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  body: {
    color: GUEST_MUTED,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  actions: {
    ...globalStyles.row,
    gap: spacing.s12,
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
  action: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
    backgroundColor: colors.background,
    ...SOFT_SHADOW,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    color: GUEST_NAVY,
    fontSize: 15.5,
    fontWeight: '700',
    marginTop: spacing.s12,
  },
  actionBody: { color: GUEST_MUTED, fontSize: 12.5, marginTop: 2 },
});

export const sheetStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(16,26,49,0.42)',
  },
  card: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: GUEST_HAIRLINE,
    marginBottom: spacing.md,
  },
  head: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: { color: GUEST_NAVY, fontSize: 21, lineHeight: 27, fontWeight: '700' },
  sub: { color: GUEST_MUTED, marginTop: 2 },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GUEST_SURFACE,
  },

  /* The guest, as their row will look — filled in as the host types. */
  preview: {
    ...globalStyles.row,
    gap: spacing.s12,
    padding: spacing.s12,
    marginBottom: spacing.md,
    borderRadius: 18,
    backgroundColor: '#faf7f3',
  },
  previewAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarEmpty: { backgroundColor: '#d9d4e0' },
  previewText: { flex: 1 },
  previewInitials: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  previewName: { color: GUEST_NAVY, fontSize: 16, fontWeight: '700' },
  previewMeta: { color: GUEST_MUTED, fontSize: 13, marginTop: 2 },

  label: { color: GUEST_NAVY, marginBottom: spacing.xs, fontWeight: '600' },
  inputBox: {
    ...globalStyles.row,
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.s12,
    marginBottom: spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: GUEST_HAIRLINE,
    backgroundColor: colors.background,
  },
  inputBoxFocus: { borderColor: GUEST_ACCENT },
  dial: {
    ...globalStyles.row,
    gap: 4,
    paddingRight: spacing.sm,
    marginRight: 2,
    borderRightWidth: 1,
    borderRightColor: GUEST_HAIRLINE,
  },
  dialText: { color: GUEST_NAVY, fontWeight: '700', fontSize: 15 },
  /* Inside the box, so it carries no frame of its own. */
  field: {
    flex: 1,
    color: GUEST_NAVY,
    fontSize: 16,
    borderWidth: 0,
    minHeight: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  groupRow: { ...globalStyles.row, gap: spacing.sm, marginBottom: spacing.md },
  group: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.s12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: GUEST_HAIRLINE,
    backgroundColor: colors.background,
  },
  groupOn: { borderColor: GUEST_ACCENT, backgroundColor: '#fff4ef' },
  groupText: { color: GUEST_NAVY, fontWeight: '600' },
  groupTextOn: { color: GUEST_ACCENT, fontWeight: '700' },

  added: {
    ...globalStyles.row,
    gap: 6,
    padding: spacing.s12,
    marginBottom: spacing.s12,
    borderRadius: 12,
    backgroundColor: '#e9f7ef',
  },
  addedText: { color: '#13744f', flex: 1, fontWeight: '600' },

  save: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    backgroundColor: GUEST_ACCENT,
  },
  saveBusy: { opacity: 0.7 },
  saveText: {
    color: brand.onAccent,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  another: { alignItems: 'center', paddingVertical: spacing.s12 },
  anotherText: { color: GUEST_NAVY, fontWeight: '700' },
  error: { color: colors.danger, marginBottom: spacing.sm },
});

/* Choosing an event, when the screen was opened without one. */
export const pickerStyles = StyleSheet.create({
  lead: { color: GUEST_MUTED, marginBottom: spacing.md },
  row: {
    ...globalStyles.row,
    gap: spacing.s12,
    padding: spacing.s12,
    marginBottom: spacing.s12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GUEST_HAIRLINE,
    backgroundColor: colors.background,
    ...SOFT_SHADOW,
  },
  tile: {
    width: 58,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileDay: {
    color: '#ffffff',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
  },
  tileMonth: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  text: { flex: 1, gap: 3 },
  title: { color: GUEST_NAVY },
  meta: { color: GUEST_MUTED },
  status: { ...globalStyles.row, gap: 5, marginTop: 2 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  go: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GUEST_SURFACE,
  },
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
  search: {
    height: 48,
    marginBottom: spacing.s12,
    paddingHorizontal: spacing.s12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: GUEST_HAIRLINE,
    color: GUEST_NAVY,
    fontSize: 15,
  },
});
