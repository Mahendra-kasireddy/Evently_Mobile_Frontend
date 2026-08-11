import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted },
  errorText: { color: colors.danger, textAlign: 'center' },
});

export const profileHeaderStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.onPrimary },
  name: { color: colors.text, marginTop: spacing.md },
  roleBadge: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  roleBadgeText: { color: colors.primary, fontWeight: '600' },
});

export const profileInfoListStyles = StyleSheet.create({
  card: { ...globalStyles.card, paddingHorizontal: spacing.lg },
  row: { ...globalStyles.row, paddingVertical: spacing.md },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  label: { color: colors.text, flex: 1 },
  value: { color: colors.textMuted, flexShrink: 1, textAlign: 'right' },
});

export const profileMenuListStyles = StyleSheet.create({
  card: { ...globalStyles.card, paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  row: { ...globalStyles.row, paddingVertical: spacing.md },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  label: { color: colors.text, flex: 1 },
});

export const signOutRowStyles = StyleSheet.create({
  row: {
    ...globalStyles.card,
    ...globalStyles.row,
    marginTop: spacing.lg,
    padding: spacing.md,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  text: { color: colors.danger, fontWeight: '600' },
});
