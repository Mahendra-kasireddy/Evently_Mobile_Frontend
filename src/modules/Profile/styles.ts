import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { PROFILE_ACCENT, PROFILE_CANVAS, PROFILE_NAVY } from './constants';

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
  /* A gradient card, inset from the edges. */
  card: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    borderRadius: 22,
    overflow: 'hidden',
    padding: spacing.md,
  },
  blob: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
  blobOne: { width: 140, height: 140, top: -60, right: -30 },
  blobTwo: { width: 90, height: 90, bottom: -40, left: 90 },
  row: { ...globalStyles.row, gap: spacing.s12 },
  /* A white ring around the initials, so the avatar lifts off the gradient. */
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: PROFILE_NAVY, fontSize: 17, fontWeight: '800', letterSpacing: 0.3 },
  text: { flex: 1, gap: 3 },
  name: { color: '#ffffff', fontSize: 17, fontWeight: '700', lineHeight: 22 },
  /** The prompt an account with no name gets, set apart from a real one. */
  namePrompt: { color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', fontWeight: '600' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  phone: { color: 'rgba(255,255,255,0.9)', fontSize: 12.5, lineHeight: 17, letterSpacing: 0.3 },
  edit: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editText: { color: '#ffffff', fontSize: 12, lineHeight: 16, fontWeight: '700' },
});

export const groupStyles = StyleSheet.create({
  group: { marginBottom: spacing.lg },
  /*
   * A section label, not a title — small, muted, letterspaced caps, so no
   * group heading can be mistaken for one of the rows inside it.
   */
  title: {
    color: '#8a93a3',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    lineHeight: 15,
    marginHorizontal: spacing.md,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: HAIRLINE,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
});

export const rowStyles = StyleSheet.create({
  row: { ...globalStyles.row, gap: spacing.s12, paddingHorizontal: spacing.s12, minHeight: 52 },
  /** Inset past the icon tile, so the list reads as one column. */
  divider: { height: 1, backgroundColor: HAIRLINE, marginLeft: 58 },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: '#141c2b', fontSize: 14, lineHeight: 19, fontWeight: '500', flex: 1 },
  labelDanger: { color: '#d93b3b', fontWeight: '600' },
  badge: {
    flexShrink: 0,
    borderRadius: 999,
    backgroundColor: '#fdeee7',
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  badgeText: { color: PROFILE_ACCENT, fontSize: 11, lineHeight: 15, fontWeight: '700' },
});
