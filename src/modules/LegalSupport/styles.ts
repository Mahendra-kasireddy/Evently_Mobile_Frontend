import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
  colors,
  spacing,
  fontWeights,
  textColor,
  typography,
} from '../../theme';
import { LEGAL_ACCENT, LEGAL_ACCENT_SOFT, LEGAL_GREEN } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  sectionTitle: {
    ...typography.overline,
    color: textColor.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitleFirst: { marginTop: 0 },
  card: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  note: { color: textColor.textSecondary, marginTop: spacing.md },
});

export const legalSupportRowStyles = StyleSheet.create({
  row: { ...globalStyles.row, gap: spacing.sm, paddingVertical: spacing.md },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeAction: { backgroundColor: LEGAL_ACCENT_SOFT },
  text: { flex: 1 },
  label: { color: textColor.textPrimary, ...fontWeights.bold },
  hint: { color: textColor.textSecondary, marginTop: 1 },
  /** A document that is not published yet says so on the row itself. */
  pending: { color: colors.textMuted, fontStyle: 'italic' },
});

export const contactStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  intro: { color: textColor.textSecondary, marginBottom: spacing.lg },

  label: {
    color: textColor.textPrimary,
    ...fontWeights.bold,
    marginTop: spacing.lg,
  },
  labelFirst: { marginTop: 0 },
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
  inputMultiline: { minHeight: 120, textAlignVertical: 'top' },
  inputInvalid: { borderColor: colors.danger },
  fieldError: { color: textColor.textError, marginTop: spacing.xs },

  subjects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  subject: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  subjectOn: { backgroundColor: LEGAL_ACCENT, borderColor: LEGAL_ACCENT },
  subjectText: { color: textColor.textSecondary, ...fontWeights.bold },
  subjectTextOn: { color: colors.onPrimary },

  send: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: LEGAL_ACCENT,
    marginTop: spacing.xl,
  },
  sendDisabled: { opacity: 0.5 },
  sendText: { color: textColor.textOnPrimary, ...typography.h3 },
  sendError: {
    color: textColor.textError,
    marginTop: spacing.sm,
    textAlign: 'center',
  },

  sent: { alignItems: 'center', paddingVertical: spacing.xl },
  sentIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: LEGAL_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentTitle: { color: textColor.textPrimary, marginTop: spacing.md },
  sentBody: {
    color: textColor.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  sentAgain: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.lg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sentAgainText: { color: LEGAL_GREEN, ...fontWeights.bold },
});
