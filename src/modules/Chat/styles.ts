import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.text, marginTop: spacing.md },
  subtitle: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
