import { StyleSheet } from 'react-native';
import { brand, spacing, textColor } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: brand.surface },
  web: { flex: 1, backgroundColor: brand.surface },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: brand.surface,
  },
  muted: { color: textColor.textSecondary, textAlign: 'center' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: brand.surface,
  },
  errorTitle: { color: textColor.textPrimary, textAlign: 'center' },
  retry: { alignSelf: 'stretch', borderRadius: 999, marginTop: spacing.md },
});
