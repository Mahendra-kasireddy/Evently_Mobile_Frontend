import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { PROFILE_ACCENT, PROFILE_CANVAS, PROFILE_NAVY, PROFILE_NAVY_DEEP } from './constants';

/** The hairline used for card edges and row dividers — warm, to sit on the canvas. */
const HAIRLINE = '#efe9e5';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PROFILE_CANVAS },
  content: { paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorTitle: { color: PROFILE_NAVY, marginTop: spacing.md, textAlign: 'center' },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: PROFILE_ACCENT, fontWeight: '700' },
});

export const identityStyles = StyleSheet.create({
  row: {
    ...globalStyles.row,
    gap: 14,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  /** A rounded square, not a circle — the shape the rest of the app uses for art. */
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: PROFILE_NAVY_DEEP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.onPrimary, fontSize: 19, fontWeight: '700', letterSpacing: 0.3 },
  text: { flex: 1 },
  name: { color: PROFILE_NAVY, fontSize: 22, fontWeight: '700', lineHeight: 28, letterSpacing: -0.3 },
  /** The prompt an account with no name gets, set apart from a real one. */
  namePrompt: { color: colors.textMuted, fontStyle: 'italic', fontWeight: '600' },
  phone: { color: colors.textMuted, fontSize: 14.5, marginTop: 1, letterSpacing: 0.3 },
  edit: {
    flexShrink: 0,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  editText: { color: PROFILE_NAVY, fontSize: 14, fontWeight: '600' },
});

export const groupStyles = StyleSheet.create({
  group: { marginBottom: spacing.lg },
  /*
   * A section label, not a title — small, muted, letterspaced caps, the same
   * treatment Your events and Settings use, so no group heading can be
   * mistaken for one of the rows inside it.
   */
  title: {
    color: '#7b8595',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    lineHeight: 17,
    marginHorizontal: spacing.md,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAIRLINE,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
});

export const rowStyles = StyleSheet.create({
  row: { ...globalStyles.row, gap: 14, paddingHorizontal: spacing.md, minHeight: 58 },
  /** Inset from the icon, so the list reads as one column rather than slices. */
  divider: { height: 1, backgroundColor: HAIRLINE, marginLeft: spacing.md },
  label: { color: '#141c2b', fontSize: 15.5, fontWeight: '500', flex: 1 },
  badge: {
    flexShrink: 0,
    borderRadius: 999,
    backgroundColor: '#fdeee7',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: PROFILE_ACCENT, fontSize: 12, fontWeight: '600' },
});
