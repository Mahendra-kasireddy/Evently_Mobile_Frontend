import { StyleSheet } from 'react-native';
import { spacing, textColor, typography } from '../../theme';
import { SPLASH_ACCENT, SPLASH_BG } from './constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkRow: { flexDirection: 'row' },
  wordmarkAccent: { ...typography.display, color: SPLASH_ACCENT },
  wordmark: { ...typography.display, color: textColor.textOnPrimary },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  loader: { marginTop: spacing.xl },
});
