import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: brand.bg },
  /* The search field is the header, the way it is in the maps and travel apps
     this pattern comes from — a title above it would push the one control the
     screen exists for below the thumb. */
  searchRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    backgroundColor: brand.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: brand.border,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    height: 48,
  },
  backButton: { padding: 4, marginLeft: -4 },
  input: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 15,
    lineHeight: 21,
    color: brand.navy,
  },
  list: { paddingBottom: spacing.xl },
  sectionHeading: {
    color: brand.navy,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  row: {
    ...globalStyles.row,
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: brand.border,
  },
  rowPressed: { backgroundColor: brand.accentSoft },
  rowLabel: { flex: 1, color: brand.navy, fontSize: 15, lineHeight: 21 },
  rowLabelSelected: { fontWeight: '700' },
  /* A recent is removable; a listed city is not. The X only appears where it
     does something. */
  forgetButton: { padding: 6, marginRight: -6 },
  empty: {
    color: brand.textMuted,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
});

export const guestsSheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,26,49,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: brand.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: brand.borderStrong,
    marginBottom: spacing.md,
  },
  title: { color: brand.navy },
  subtitle: { color: brand.textMuted, marginTop: 2, marginBottom: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    minWidth: 68,
    alignItems: 'center',
  },
  chipActive: { borderColor: brand.accent, backgroundColor: brand.accentSoft },
  chipText: {
    color: brand.navy,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  chipTextActive: { color: brand.accentDeep },
  customLabel: {
    color: brand.navy,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  customRow: { ...globalStyles.row, gap: spacing.sm },
  customInput: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
    fontSize: 15,
    lineHeight: 21,
    color: brand.navy,
  },
  done: {
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.accent,
  },
  doneIdle: { backgroundColor: brand.disabledBg },
  doneText: { color: brand.onAccent, fontWeight: '600' },
  doneTextIdle: { color: brand.textMuted },
});
