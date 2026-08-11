import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted },
  errorText: { color: colors.danger, textAlign: 'center' },
  emptyTitle: { color: colors.text, marginTop: spacing.md, textAlign: 'center' },
  emptySubtitle: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
});

export const bookingRowStyles = StyleSheet.create({
  card: { ...globalStyles.card, padding: spacing.md, marginBottom: spacing.md },
  headerRow: { ...globalStyles.row, justifyContent: 'space-between' },
  title: { color: colors.text, flexShrink: 1 },
  ref: { color: colors.textMuted, marginTop: spacing.xs / 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  statusPrimary: { backgroundColor: colors.primary },
  statusSuccess: { backgroundColor: colors.success },
  statusMuted: { backgroundColor: colors.surface },
  statusDanger: { backgroundColor: colors.danger },
  statusTextOnColor: { color: colors.onPrimary },
  statusTextMuted: { color: colors.textMuted },
  metaRow: { ...globalStyles.row, justifyContent: 'space-between', marginTop: spacing.sm },
  metaText: { color: colors.textMuted },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.surface, marginTop: spacing.sm, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
});
