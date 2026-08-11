import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { NAME_GATE_ACCENT, NAME_GATE_BORDER, NAME_GATE_NAVY, NAME_GATE_TEXT_MUTED } from './constants';

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(14,26,51,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: NAME_GATE_BORDER,
    marginBottom: spacing.lg,
  },
  avatarWrap: { alignItems: 'center', marginBottom: spacing.lg },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: NAME_GATE_NAVY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: colors.onPrimary, fontSize: 34, fontWeight: '800' },
  avatarLayer: { position: 'absolute' },
  heading: { color: NAME_GATE_NAVY, textAlign: 'center' },
  subtitle: { color: NAME_GATE_TEXT_MUTED, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  input: { textAlign: 'center', fontSize: 18, fontWeight: '700' },
  inputFocused: { borderColor: NAME_GATE_ACCENT },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
  button: { borderRadius: 999, marginTop: spacing.lg },
  reassurance: { color: NAME_GATE_TEXT_MUTED, textAlign: 'center', marginTop: spacing.md },
});
