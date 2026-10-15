import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
  colors,
  spacing,
  fontWeights,
  textColor,
  typography,
} from '../../theme';
import { SAVED_ACCENT, SAVED_ACCENT_SOFT, SAVED_CANVAS } from './constants';

const HAIRLINE = '#efe9e5';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SAVED_CANVAS },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
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
    backgroundColor: SAVED_ACCENT_SOFT,
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
  actionError: {
    color: textColor.textError,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
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
  retryText: { color: SAVED_ACCENT, ...fontWeights.bold },
  emptyCta: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.lg,
    borderRadius: 14,
    backgroundColor: SAVED_ACCENT,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
  },
  emptyCtaText: { color: textColor.textOnPrimary, ...fontWeights.bold },
});

export const savedCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: spacing.md,
    marginBottom: 12,
  },
  head: { ...globalStyles.row, gap: spacing.sm },
  art: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: SAVED_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headText: { flex: 1 },
  title: { color: textColor.textPrimary, ...typography.h3 },
  meta: { color: textColor.textSecondary, ...typography.caption, marginTop: 2 },
  /** The heart is its own control, so removing never opens the package. */
  heart: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: {
    borderRadius: 999,
    backgroundColor: '#f4f1ef',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: textColor.textSecondary, ...typography.label },
});
