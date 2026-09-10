import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { NOTIF_ACCENT, NOTIF_CANVAS, NOTIF_HAIRLINE, NOTIF_NAVY } from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NOTIF_CANVAS },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#fdeee7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  emptyTitle: { color: NOTIF_NAVY, marginTop: spacing.md, textAlign: 'center' },
  emptyBody: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: NOTIF_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: NOTIF_ACCENT, fontWeight: '700' },

  /** Back, title and the one action — the screen's own bar. */
  header: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerLeft: { ...globalStyles.row, gap: 12, flexShrink: 1 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#f0ecea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: NOTIF_NAVY, fontSize: 25, fontWeight: '700', letterSpacing: -0.4 },
  markAllRead: { color: NOTIF_ACCENT, fontSize: 14.5, fontWeight: '600', flexShrink: 0 },
  markAllReadDisabled: { opacity: 0.5 },

  /*
   * A section label, not a title — small, muted, letterspaced caps, the same
   * treatment every other grouped list in the app uses, so a day heading can
   * never be mistaken for one of the notifications under it.
   */
  groupLabel: {
    color: '#7b8595',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: 10,
  },
});

export const notificationRowStyles = StyleSheet.create({
  row: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NOTIF_HAIRLINE,
    padding: 14,
    marginBottom: 12,
  },
  /** Unread sits on white; read fades back into the page. */
  rowRead: { backgroundColor: 'transparent', borderColor: '#f4efec' },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1 },
  title: { color: NOTIF_NAVY, fontSize: 16, fontWeight: '700', lineHeight: 22 },
  titleRead: { fontWeight: '600' },
  body: { color: '#414b5c', fontSize: 14, marginTop: 3, lineHeight: 20 },
  time: { color: colors.textMuted, fontSize: 13, marginTop: 8 },
  /** Top-aligned with the title, so it reads as a state and not a bullet. */
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: NOTIF_ACCENT,
    marginTop: 7,
    flexShrink: 0,
  },
});
