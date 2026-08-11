import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import {
  LOGIN_ACCENT,
  LOGIN_BG,
  LOGIN_BORDER,
  LOGIN_DECOR_CIRCLE_COLOR,
  LOGIN_NAVY,
  LOGIN_NAVY_DEEP,
  LOGIN_TEXT_MUTED,
} from './constants';

// Height reserved at the bottom of the navy header for the wave cutout —
// see promoStyles.wave. No boxed white card anymore (per feedback that a
// rounded rectangle "looked like a box") — content sits directly on the
// page background, with the wave giving the header an organic edge instead.
export const WAVE_HEIGHT = 28;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LOGIN_BG },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: spacing.xl },
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  errorBox: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  errorText: { color: colors.danger, flex: 1 },
  joinRow: { ...globalStyles.row, justifyContent: 'center', gap: spacing.xs, marginTop: spacing.xl },
  joinText: { color: LOGIN_TEXT_MUTED },
  joinCta: { color: LOGIN_ACCENT, fontWeight: '700' },
  trustRow: { ...globalStyles.row, justifyContent: 'center', gap: spacing.xs, marginTop: spacing.lg },
  trustText: { color: LOGIN_TEXT_MUTED },
});

// Trimmed to a minimal navy-deep header: just the wordmark + a one-line
// tagline, full-bleed edge to edge (no card, no shadow) with an organic
// wavy bottom edge instead of a hard rectangular cut.
export const promoStyles = StyleSheet.create({
  band: {
    backgroundColor: LOGIN_NAVY_DEEP,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl + WAVE_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 230,
    height: 230,
    borderRadius: 999,
    backgroundColor: LOGIN_DECOR_CIRCLE_COLOR,
  },
  wave: { position: 'absolute', bottom: -1, left: 0, right: 0, height: WAVE_HEIGHT + 1 },
  wordmarkRow: { ...globalStyles.row },
  wordmarkAccent: { fontSize: 30, fontWeight: '800', color: LOGIN_ACCENT },
  wordmark: { fontSize: 30, fontWeight: '800', color: colors.onPrimary, letterSpacing: -0.3 },
  tagline: { color: 'rgba(255,255,255,0.7)', marginTop: spacing.xs },
});

export const formCardStyles = StyleSheet.create({
  title: { color: LOGIN_NAVY },
  subtitle: { color: LOGIN_TEXT_MUTED, marginTop: spacing.xs, marginBottom: spacing.lg },
  terms: { color: LOGIN_TEXT_MUTED, textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  termsBold: { color: LOGIN_NAVY, fontWeight: '700' },
});

export const phoneEntryStyles = StyleSheet.create({
  container: { gap: spacing.lg },
  label: { color: LOGIN_NAVY, fontWeight: '600' },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1.5,
    borderColor: LOGIN_BORDER,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  controlRowFocused: { borderColor: LOGIN_ACCENT, backgroundColor: colors.background },
  dialCode: { color: LOGIN_NAVY, fontWeight: '700', paddingRight: spacing.sm, borderRightWidth: 1, borderRightColor: LOGIN_BORDER },
  input: {
    flex: 1,
    color: LOGIN_NAVY,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  sentText: { color: colors.success, marginTop: -spacing.xs },
  button: {
    borderRadius: 999,
    marginTop: spacing.xs,
    ...Platform.select({
      ios: { shadowColor: LOGIN_ACCENT, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
      android: { elevation: 3 },
    }),
  },
});

export const otpEntryStyles = StyleSheet.create({
  container: { gap: spacing.md },
  backRow: { ...globalStyles.row, gap: spacing.xs, marginBottom: spacing.xs },
  backText: { color: LOGIN_TEXT_MUTED },
  sentToText: { color: LOGIN_NAVY, fontWeight: '700' },
  boxRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  box: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderColor: LOGIN_BORDER,
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: LOGIN_NAVY,
    backgroundColor: colors.surface,
  },
  boxFilled: { borderColor: LOGIN_ACCENT, backgroundColor: colors.background },
  devHint: { color: LOGIN_TEXT_MUTED, textAlign: 'center' },
  button: {
    borderRadius: 999,
    marginTop: spacing.xs,
    ...Platform.select({
      ios: { shadowColor: LOGIN_ACCENT, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
      android: { elevation: 3 },
    }),
  },
  resendRow: { alignItems: 'center', marginTop: spacing.sm },
  resendText: { color: LOGIN_TEXT_MUTED },
  resendActive: { color: LOGIN_ACCENT, fontWeight: '700' },
});
