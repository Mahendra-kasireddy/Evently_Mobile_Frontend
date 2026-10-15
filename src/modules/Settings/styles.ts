import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
  colors,
  spacing,
  fontWeights,
  textColor,
  typography,
} from '../../theme';
import {
  SETTINGS_ACCENT,
  SETTINGS_ACCENT_SOFT,
  SETTINGS_GREEN,
} from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  loadingText: { color: textColor.textSecondary, marginTop: spacing.md },
  errorTitle: {
    color: textColor.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  errorText: {
    color: textColor.textError,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
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
  retryText: { color: SETTINGS_ACCENT, ...fontWeights.bold },

  sectionTitle: {
    ...typography.overline,
    color: textColor.textSecondary,
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
  label: { color: textColor.textPrimary, ...fontWeights.bold },
  hint: { color: textColor.textSecondary, marginTop: 1 },
  input: {
    borderRadius: 14,
    // A TextInput resolves no face of its own — see Components/EventlyText.
    ...fontWeights.regular,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    marginTop: spacing.sm,
    color: textColor.textPrimary,
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
  phoneValue: {
    color: textColor.textPrimary,
    ...fontWeights.bold,
    marginTop: 1,
  },
  verified: { ...globalStyles.row, gap: 3 },
  verifiedText: { ...typography.label },
  phoneNote: { color: textColor.textSecondary, marginTop: spacing.sm },

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
  saveText: { color: textColor.textOnPrimary, ...typography.h3 },
  savedRow: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  savedText: { color: SETTINGS_GREEN, ...fontWeights.bold },
  saveError: {
    color: textColor.textError,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
