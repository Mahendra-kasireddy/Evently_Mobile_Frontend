import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
  colors,
  spacing,
  fontWeights,
  textColor,
  typography,
  inputTypography,
} from '../../theme';
import {
  SEARCH_ACCENT,
  SEARCH_CANVAS,
  SEARCH_NAVY,
  SEARCH_NAVY_DEEP,
} from './constants';

const HAIRLINE = '#efe9e5';
const TRACK = '#f0ecea';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SEARCH_CANVAS },
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
    borderColor: HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: SEARCH_ACCENT, ...fontWeights.bold },

  bar: {
    ...globalStyles.row,
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  back: { padding: 4, marginLeft: -4 },
  field: {
    ...globalStyles.row,
    flex: 1,
    gap: 8,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: textColor.textPrimary,
    ...inputTypography.body,
    padding: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: SEARCH_NAVY_DEEP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: SEARCH_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: textColor.textOnPrimary,
    ...typography.label,
  },

  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  tab: {
    borderRadius: 999,
    backgroundColor: TRACK,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  tabOn: { backgroundColor: SEARCH_NAVY },
  tabText: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  tabTextOn: { color: colors.onPrimary },

  /* Clear air between the packages and the organizers. */
  section: { marginTop: spacing.lg },
});

export const filterSheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(14,26,51,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: SEARCH_CANVAS,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: spacing.lg,
    maxHeight: '86%',
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: TRACK,
    alignSelf: 'center',
    marginTop: 10,
  },
  head: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: { color: textColor.textPrimary, ...typography.h2 },
  clear: { color: SEARCH_ACCENT, ...typography.body, ...fontWeights.semibold },
  group: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  groupTitle: {
    color: textColor.textSecondary,
    ...typography.overline,
    marginBottom: 10,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: SEARCH_NAVY, borderColor: SEARCH_NAVY },
  chipText: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    ...fontWeights.medium,
  },
  chipTextOn: { color: colors.onPrimary },
  apply: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: SEARCH_ACCENT,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  applyText: { color: textColor.textOnPrimary, ...typography.h3 },
});
