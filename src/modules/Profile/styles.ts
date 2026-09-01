import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { PROFILE_ACCENT, PROFILE_ACCENT_SOFT, PROFILE_NAVY, PROFILE_NAVY_DEEP } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.background },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorTitle: { color: PROFILE_NAVY, marginTop: spacing.md, textAlign: 'center' },
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
  retryText: { color: PROFILE_ACCENT, fontWeight: '700' },
});

export const profileHeaderStyles = StyleSheet.create({
  card: {
    backgroundColor: PROFILE_NAVY_DEEP,
    borderRadius: 20,
    margin: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: PROFILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.onPrimary, fontSize: 26, fontWeight: '800' },
  name: { color: colors.onPrimary, fontSize: 21, fontWeight: '800', marginTop: spacing.md, textAlign: 'center' },
  /** An account with no name gets a prompt, styled as one. */
  namePrompt: { color: colors.onPrimaryMuted, fontStyle: 'italic' },
  roles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm, justifyContent: 'center' },
  roleChip: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
  },
  roleChipText: { color: colors.onPrimary, fontWeight: '700', fontSize: 11 },
});

export const profileInfoListStyles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
  },
  row: { ...globalStyles.row, gap: spacing.sm, paddingVertical: spacing.md },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: PROFILE_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  label: { color: colors.textMuted },
  value: { color: PROFILE_NAVY, fontWeight: '700', marginTop: 1 },
  /** A fact the account does not hold — a prompt, not a value. */
  valueEmpty: { color: colors.textMuted, fontWeight: '400', fontStyle: 'italic', marginTop: 1 },
  verified: { ...globalStyles.row, gap: 3 },
  verifiedText: { fontWeight: '700', fontSize: 11 },
});

export const profileMenuListStyles = StyleSheet.create({
  sectionTitle: {
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
  },
  card: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
  },
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
  text: { flex: 1 },
  label: { color: PROFILE_NAVY, fontWeight: '700' },
  hint: { color: colors.textMuted, marginTop: 1 },
});

/** The role switch, kept apart from navigation: it changes what the app is. */
export const viewSwitchStyles = StyleSheet.create({
  card: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PROFILE_ACCENT,
    backgroundColor: PROFILE_ACCENT_SOFT,
    padding: spacing.md,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: PROFILE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  label: { color: PROFILE_NAVY, fontWeight: '800' },
  hint: { color: colors.textMuted, marginTop: 1 },
});

export const signOutRowStyles = StyleSheet.create({
  button: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.danger, fontWeight: '700' },
});
