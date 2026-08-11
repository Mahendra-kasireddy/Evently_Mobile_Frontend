import { Dimensions, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { ONBOARDING_BG } from './constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ONBOARDING_BG },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  skipText: { color: 'rgba(255,255,255,0.7)' },
  slide: { width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  heading: { color: colors.onPrimary, textAlign: 'center' },
  subtitle: {
    color: 'rgba(255,255,255,0.74)',
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 320,
  },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { backgroundColor: colors.onPrimary, width: 22 },
  button: { borderRadius: 999 },
});
