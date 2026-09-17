import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand, spacing } from '../../theme';

/** Same curve as the login hero — the two screens are one flow. */
export const HEADER_RADIUS = 28;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: brand.bg },
  /* Same as the sign-in hero: full-bleed to the top edge, with the status bar
     inset applied as padding by the screen. */
  header: {
    backgroundColor: brand.navy,
    borderBottomLeftRadius: HEADER_RADIUS,
    borderBottomRightRadius: HEADER_RADIUS,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -120,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: brand.navyPlum,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: brand.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: brand.onNavy, marginTop: spacing.md },
  subtitle: { color: brand.onNavyMuted, marginTop: spacing.sm },
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
});

export const roleCardStyles = StyleSheet.create({
  /* Outlined in accent rather than shadowed: both cards are choices, and a
     shadow would rank one above the other by depth alone. */
  card: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: brand.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: brand.accentBorder,
    padding: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: brand.navy,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 1 },
    }),
  },
  cardPressed: { backgroundColor: brand.accentSoft },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: { color: brand.navy, flexShrink: 1 },
  description: { color: brand.textMuted, marginTop: 2 },
  requirement: {
    color: brand.accentDeep,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
});

export const footnoteStyles = StyleSheet.create({
  card: {
    ...globalStyles.row,
    gap: spacing.sm,
    backgroundColor: brand.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: brand.border,
    padding: spacing.md,
  },
  text: { flex: 1, color: brand.textMuted },
});
