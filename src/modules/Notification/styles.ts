import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  markAllRead: { color: colors.primary },
  markAllReadDisabled: { color: colors.textMuted },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted },
  errorText: { color: colors.danger, textAlign: 'center' },
  emptyTitle: { color: colors.text, marginTop: spacing.md, textAlign: 'center' },
  emptySubtitle: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
});

export const notificationRowStyles = StyleSheet.create({
  row: { ...globalStyles.card, ...globalStyles.row, padding: spacing.md, marginBottom: spacing.sm },
  unreadRow: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, marginLeft: spacing.md },
  titleRow: { ...globalStyles.row, justifyContent: 'space-between' },
  title: { color: colors.text, flexShrink: 1 },
  time: { color: colors.textMuted },
  body: { color: colors.textMuted, marginTop: spacing.xs },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: spacing.sm },
});
