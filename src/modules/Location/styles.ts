import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
});

export const locationDetailsStyles = StyleSheet.create({
  card: { ...globalStyles.card, margin: spacing.lg, padding: spacing.lg, alignItems: 'center' },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: colors.text, marginTop: spacing.md },
  coordinates: { color: colors.textMuted, marginTop: spacing.xs },
  refreshButton: { marginTop: spacing.lg },
});

export const locationErrorStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.text, marginTop: spacing.md, textAlign: 'center' },
  message: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  actionButton: { marginTop: spacing.lg },
});
