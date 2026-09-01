import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { LEGAL_ACCENT, LEGAL_ACCENT_SOFT, LEGAL_GREEN, LEGAL_NAVY } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  sectionTitle: {
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
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
  note: { color: colors.textMuted, marginTop: spacing.md, lineHeight: 18 },
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
  label: { color: LEGAL_NAVY, fontWeight: '700' },
  hint: { color: colors.textMuted, marginTop: 1 },
  /** A document that is not published yet says so on the row itself. */
  pending: { color: colors.textMuted, fontStyle: 'italic' },
});

export const contactStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  intro: { color: colors.textMuted, lineHeight: 20, marginBottom: spacing.lg },

  label: { color: LEGAL_NAVY, fontWeight: '700', marginTop: spacing.lg },
  labelFirst: { marginTop: 0 },
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
  inputMultiline: { minHeight: 120, textAlignVertical: 'top' },
  inputInvalid: { borderColor: colors.danger },
  fieldError: { color: colors.danger, marginTop: spacing.xs },

  subjects: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  subject: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  subjectOn: { backgroundColor: LEGAL_ACCENT, borderColor: LEGAL_ACCENT },
  subjectText: { color: colors.textMuted, fontWeight: '700' },
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
  sendText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  sendError: { color: colors.danger, marginTop: spacing.sm, textAlign: 'center' },

  sent: { alignItems: 'center', paddingVertical: spacing.xl },
  sentIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: LEGAL_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentTitle: { color: LEGAL_NAVY, marginTop: spacing.md },
  sentBody: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
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
  sentAgainText: { color: LEGAL_GREEN, fontWeight: '700' },
});
