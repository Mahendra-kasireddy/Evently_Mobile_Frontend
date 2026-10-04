import { Platform, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import {
  NAME_GATE_ACCENT,
  NAME_GATE_BORDER,
  NAME_GATE_NAVY,
  NAME_GATE_TEXT_MUTED,
} from './constants';

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif' });

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fbf6f2' },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + spacing.md,
  },
  heading: {
    fontFamily: SERIF,
    fontWeight: '700',
    fontSize: 27,
    lineHeight: 34,
    color: NAME_GATE_NAVY,
    textAlign: 'center',
  },
  subtitle: {
    color: NAME_GATE_TEXT_MUTED,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  avatarWrap: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  avatarCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#fde7dd',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarLayer: { position: 'absolute' },
  avatarInitial: {
    color: NAME_GATE_ACCENT,
    fontSize: 44,
    fontWeight: '700',
    fontFamily: SERIF,
  },
  input: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: NAME_GATE_BORDER,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: NAME_GATE_NAVY,
  },
  inputFocused: { borderColor: NAME_GATE_ACCENT },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  button: { borderRadius: 14, marginTop: spacing.lg, height: 54 },
});
