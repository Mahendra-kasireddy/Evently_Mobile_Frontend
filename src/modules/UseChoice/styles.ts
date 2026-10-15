import { Platform, StyleSheet } from 'react-native';
import { spacing } from '../../theme';

export const CHOICE_NAVY = '#1b1f4b';
export const CHOICE_MUTED = '#6b6f86';
export const CHOICE_ACCENT = '#f0603a';

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff8f4', overflow: 'hidden' },

  /* Page decoration. */
  wash: { position: 'absolute', borderRadius: 999 },
  washTop: {
    top: -120,
    right: -110,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(255,214,196,0.45)',
  },
  washBottom: {
    bottom: -140,
    left: -120,
    width: 320,
    height: 320,
    backgroundColor: 'rgba(226,218,255,0.5)',
  },
  confetti: {
    position: 'absolute',
    top: 120,
    right: 22,
    width: 60,
    height: 80,
  },
  bit: { position: 'absolute', width: 7, height: 20, borderRadius: 4 },
  bit1: { top: 0, left: 6, backgroundColor: '#c9b6ff' },
  bit2: {
    top: 18,
    left: 34,
    backgroundColor: '#ff9db8',
    transform: [{ rotate: '40deg' }],
  },
  bit3: {
    top: 48,
    left: 26,
    backgroundColor: '#ffd27a',
    transform: [{ rotate: '70deg' }],
  },

  topBar: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  back: { width: 40, height: 40, justifyContent: 'center' },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },

  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandLogo: { width: 36, height: 36, borderRadius: 10 },
  brandName: {
    color: CHOICE_NAVY,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  brandSpark: { marginTop: -16, marginLeft: -4 },

  title: {
    color: CHOICE_NAVY,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 18,
  },
  subtitle: {
    color: CHOICE_MUTED,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
  },

  cards: { gap: 16, marginTop: 26 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#ece7f6',
    backgroundColor: '#fbfaff',
    paddingVertical: 10,
    paddingLeft: 8,
    paddingRight: 40,
    minHeight: 132,
    ...Platform.select({
      ios: {
        shadowColor: '#7a6aa8',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },
  cardOn: {
    borderColor: '#ff9a6a',
    backgroundColor: '#fff3ec',
    ...Platform.select({
      ios: { shadowColor: '#f0603a', shadowOpacity: 0.16 },
      android: { elevation: 4 },
    }),
  },

  /* The character on a soft round blob, with small floating icons. */
  art: {
    width: 122,
    height: 112,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  blob: {
    position: 'absolute',
    bottom: 2,
    left: 8,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photo: { width: 100, height: 112 },
  floater: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },

  cardText: { flex: 1, gap: 6 },
  cardTitle: {
    color: CHOICE_NAVY,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  cardBody: { color: CHOICE_MUTED, fontSize: 13, lineHeight: 19 },

  radio: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#d9d4e3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  radioOn: { borderWidth: 0 },

  spacer: { flexGrow: 1, minHeight: 28 },
  cta: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: CHOICE_ACCENT,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
    }),
  },
  ctaText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
});
