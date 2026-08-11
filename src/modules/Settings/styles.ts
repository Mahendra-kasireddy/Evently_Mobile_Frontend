import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  groupLabel: { color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.lg },
  card: { ...globalStyles.card, paddingHorizontal: spacing.lg },
});

export const settingsRowStyles = StyleSheet.create({
  row: { ...globalStyles.row, justifyContent: 'space-between', paddingVertical: spacing.md },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  text: { flex: 1, marginRight: spacing.md },
  title: { color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs / 2 },
});
