import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

export const appHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  left: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: { color: colors.text, flexShrink: 1 },
  rightElement: { marginLeft: spacing.md },
});

export const eventlyButtonStyles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
  primary: { backgroundColor: colors.primary },
  primaryText: { color: colors.onPrimary },
  outline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.background },
  outlineText: { color: colors.primary },
  danger: { borderWidth: 1, borderColor: colors.danger, backgroundColor: colors.background },
  dangerText: { color: colors.danger },
});

export const eventlyTextInputStyles = StyleSheet.create({
  base: {
    ...typography.subtitle,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});

export const eventlyImageStyles = StyleSheet.create({
  wrapper: { position: 'relative' },
  image: { width: '100%', height: '100%' },
  fallback: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});
