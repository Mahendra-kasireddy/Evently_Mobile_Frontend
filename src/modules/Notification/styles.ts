import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { spacing, fontWeights, textColor, typography } from '../../theme';
import {
  NOTIF_ACCENT,
  NOTIF_CANVAS,
  NOTIF_DIVIDER,
  NOTIF_HAIRLINE,
} from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NOTIF_CANVAS },
  list: { paddingBottom: spacing.xl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#fdeee7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: textColor.textSecondary, marginTop: spacing.md },
  emptyTitle: {
    ...typography.h2,
    color: textColor.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.body,
    color: textColor.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    color: textColor.textError,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
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
  retryText: { color: NOTIF_ACCENT, ...fontWeights.bold },

  markAllRead: {
    color: NOTIF_ACCENT,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  markAllReadDisabled: { opacity: 0.5 },
});

/*
 * A flat list row rather than a card: full width, a hairline between rows.
 * Unread rows carry a faint warm wash, read rows sit on the page.
 */
export const notificationRowStyles = StyleSheet.create({
  row: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fdf4ef',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: NOTIF_DIVIDER,
  },
  rowRead: { backgroundColor: 'transparent' },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1 },
  title: {
    color: textColor.textPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },
  titleRead: { ...fontWeights.medium },
  body: { color: textColor.textSecondary, ...typography.caption, marginTop: 2 },
  time: { color: textColor.textSecondary, ...typography.caption, marginTop: 4 },
  /** Top-aligned with the title, so it reads as a state and not a bullet. */
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: NOTIF_ACCENT,
    marginTop: 6,
    flexShrink: 0,
  },
});
