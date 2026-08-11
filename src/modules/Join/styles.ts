import { Platform, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { JOIN_BG, JOIN_NAVY, JOIN_TEXT_MUTED } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: JOIN_BG },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  subtitle: { color: JOIN_TEXT_MUTED, marginBottom: spacing.xl },
});

export const roleCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: { shadowColor: JOIN_NAVY, shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 3 },
    }),
  },
  decorBlob: { position: 'absolute', top: -36, right: -36, width: 110, height: 110, borderRadius: 999 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconCircle: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  badgeText: { color: JOIN_NAVY, fontWeight: '700', fontSize: 11 },
  title: { color: JOIN_NAVY, marginTop: spacing.md },
  description: { color: JOIN_TEXT_MUTED, marginTop: spacing.xs, marginBottom: spacing.lg },
  ctaPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ctaText: { color: colors.onPrimary, fontWeight: '700' },
});
