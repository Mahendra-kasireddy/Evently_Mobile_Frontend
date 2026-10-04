import { Platform, StyleSheet } from 'react-native';
import { spacing } from '../../theme';

export const CHOICE_NAVY = '#1a2e5a';
export const CHOICE_MUTED = '#6b7280';
export const CHOICE_ACCENT = '#e2683c';
const SERIF = Platform.select({ ios: 'Georgia', android: 'serif' });

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fbf6f2' },
  topBar: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  back: { width: 40, height: 40, justifyContent: 'center' },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: {
    fontFamily: SERIF,
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 35,
    color: CHOICE_NAVY,
  },
  subtitle: {
    color: CHOICE_MUTED,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  cards: { gap: spacing.md, marginTop: spacing.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#ece6e1',
    backgroundColor: '#ffffff',
    padding: spacing.md,
    minHeight: 116,
  },
  cardOn: { borderColor: CHOICE_ACCENT, backgroundColor: '#fff5f0' },
  art: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artPlan: { backgroundColor: '#fde3d6' },
  artOrganizer: { backgroundColor: '#f7ece5' },
  artBadge: {
    position: 'absolute',
    right: 2,
    bottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 4 },
  cardTitle: {
    color: CHOICE_NAVY,
    fontWeight: '700',
    fontSize: 15.5,
    lineHeight: 21,
  },
  cardBody: { color: CHOICE_MUTED, fontSize: 13, lineHeight: 19 },
  radio: {
    position: 'absolute',
    top: spacing.s12,
    right: spacing.s12,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d9d4cf',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  radioOn: { backgroundColor: CHOICE_ACCENT, borderColor: CHOICE_ACCENT },
  spacer: { flexGrow: 1, minHeight: spacing.xl },
  cta: {
    height: 54,
    borderRadius: 14,
    backgroundColor: CHOICE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: CHOICE_ACCENT,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
      android: { elevation: 2 },
    }),
  },
  ctaText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 21,
  },
});
