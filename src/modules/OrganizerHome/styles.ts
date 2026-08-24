import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import { OH_BG, OH_BORDER, OH_NAVY, OH_TEXT_MUTED } from './constants';

export const screenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: OH_BG },
  content: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg },
  title: { color: OH_NAVY },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: OH_TEXT_MUTED },
});

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: OH_BORDER,
    borderRadius: 16,
    padding: spacing.md + 2,
    gap: spacing.sm,
  },
  cardTitle: { color: OH_NAVY },
  headRow: { ...globalStyles.row, justifyContent: 'space-between' },
});

export const statStyles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '47.5%',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: OH_BORDER,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.xs,
  },
  iconBadge: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  value: { color: OH_NAVY, fontSize: 20, fontWeight: '800' },
  label: { color: OH_TEXT_MUTED },
  delta: { color: '#1d9e75', fontWeight: '700' },
  deltaDown: { color: '#dc2626' },
});

export const taskStyles = StyleSheet.create({
  list: { gap: spacing.sm },
  row: { ...globalStyles.row, gap: spacing.sm },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: OH_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: '#1a2e5a', borderColor: '#1a2e5a' },
  label: { color: OH_NAVY, flex: 1 },
  labelDone: { color: OH_TEXT_MUTED, textDecorationLine: 'line-through' },
});

export const scheduleStyles = StyleSheet.create({
  list: { gap: spacing.sm },
  row: { ...globalStyles.row, gap: spacing.sm },
  day: { color: '#e8633a', fontWeight: '700', fontSize: 11, textTransform: 'uppercase', width: 40 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: OH_NAVY },
  title: { color: OH_NAVY, flex: 1 },
});

export const badgeStyles = StyleSheet.create({
  tierRow: { ...globalStyles.row, gap: spacing.sm },
  tierChip: {
    ...globalStyles.row,
    gap: 4,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  tierText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  track: { height: 8, borderRadius: 999, backgroundColor: OH_BORDER, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: '#e8633a' },
  note: { color: OH_TEXT_MUTED },
  noteBold: { color: OH_NAVY, fontWeight: '700' },
});

export const enquiryStyles = StyleSheet.create({
  list: { gap: spacing.md },
  row: { ...globalStyles.row, gap: spacing.sm },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fdeee7', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#e8633a', fontWeight: '700' },
  who: { flex: 1, gap: 2 },
  name: { color: OH_NAVY },
  meta: { color: OH_TEXT_MUTED },
  time: { color: OH_TEXT_MUTED },
});
