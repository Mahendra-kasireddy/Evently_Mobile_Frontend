import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { SETTINGS_ACCENT, SETTINGS_ACCENT_SOFT, SETTINGS_GREEN, SETTINGS_NAVY } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorTitle: { color: SETTINGS_NAVY, marginTop: spacing.md, textAlign: 'center' },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
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
  retryText: { color: SETTINGS_ACCENT, fontWeight: '700' },

  sectionTitle: {
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  card: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },

  field: { marginTop: spacing.md },
  fieldFirst: { marginTop: 0 },
  label: { color: SETTINGS_NAVY, fontWeight: '700' },
  hint: { color: colors.textMuted, marginTop: 1 },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    marginTop: spacing.sm,
    color: colors.text,
  },
  inputInvalid: { borderColor: colors.danger },

  /** The phone: shown, explained, and not editable here. */
  phoneRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  phoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: SETTINGS_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneText: { flex: 1 },
  phoneValue: { color: SETTINGS_NAVY, fontWeight: '700', marginTop: 1 },
  verified: { ...globalStyles.row, gap: 3 },
  verifiedText: { fontWeight: '700', fontSize: 11 },
  phoneNote: { color: colors.textMuted, marginTop: spacing.sm, lineHeight: 18 },

  save: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: SETTINGS_ACCENT,
    marginTop: spacing.lg,
  },
  saveDisabled: { opacity: 0.45 },
  saveText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  savedRow: { ...globalStyles.row, justifyContent: 'center', gap: spacing.xs, marginTop: spacing.md },
  savedText: { color: SETTINGS_GREEN, fontWeight: '700' },
  saveError: { color: colors.danger, marginTop: spacing.sm, textAlign: 'center' },
});
