import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { COMING_SOON_BG } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COMING_SOON_BG },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  roleLabel: { color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: spacing.xs },
  heading: { color: colors.onPrimary, textAlign: 'center' },
  description: { color: 'rgba(255,255,255,0.74)', textAlign: 'center', marginTop: spacing.sm, maxWidth: 320 },
  button: { borderRadius: 999, marginTop: spacing.xl, minWidth: 200 },
});
