import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { SPLASH_ACCENT, SPLASH_BG } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SPLASH_BG, alignItems: 'center', justifyContent: 'center' },
  wordmarkRow: { flexDirection: 'row' },
  wordmarkAccent: { fontSize: 40, fontWeight: '800', color: SPLASH_ACCENT },
  wordmark: { fontSize: 40, fontWeight: '800', color: colors.onPrimary, letterSpacing: -0.5 },
  tagline: { color: 'rgba(255,255,255,0.7)', marginTop: spacing.sm, textAlign: 'center', paddingHorizontal: spacing.xl },
  loader: { marginTop: spacing.xl },
});
