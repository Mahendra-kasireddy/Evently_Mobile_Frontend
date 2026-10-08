import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import {
  PAY_ACCENT,
  PAY_CANVAS,
  PAY_GREEN,
  PAY_GREEN_SOFT,
  PAY_HAIRLINE,
  PAY_NAVY,
  PAY_NAVY_DEEP,
} from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAY_CANVAS },

  header: { ...globalStyles.row, alignItems: 'center', gap: 12, paddingHorizontal: spacing.md, paddingVertical: 10 },
  /* Just the chevron. The disc behind it was a second shape to notice for a
     control every screen has in the same corner, and the touch target is the
     box, not the paint. */
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  title: { color: PAY_NAVY_DEEP, fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },

  content: { padding: spacing.md, paddingBottom: spacing.lg },

  /* The amount, on its own, in the darkest thing on the screen. Nothing else
     here matters until the customer has read this. */
  amountCard: { backgroundColor: PAY_NAVY_DEEP, borderRadius: 18, padding: spacing.md + 2 },
  eyebrow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  amount: { color: colors.onPrimary, fontSize: 38, fontWeight: '700', marginTop: 8, letterSpacing: -1 },
  totalLine: { color: 'rgba(255,255,255,0.62)', fontSize: 14, marginTop: 6, lineHeight: 20 },
  couponLine: { color: '#7fd6b3', fontSize: 13.5, fontWeight: '600', marginTop: 8 },

  sectionTitle: { color: PAY_NAVY_DEEP, fontSize: 17, fontWeight: '700', marginTop: 22 },

  option: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: PAY_HAIRLINE,
    backgroundColor: colors.background,
    padding: 14,
  },
  optionOn: { borderColor: PAY_ACCENT },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: PAY_CANVAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: { flex: 1 },
  optionLabel: { color: PAY_NAVY_DEEP, fontSize: 16, fontWeight: '700' },
  optionHint: { color: colors.textMuted, fontSize: 13.5, marginTop: 1 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#d9d4d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: PAY_ACCENT },
  radioDot: { width: 11, height: 11, borderRadius: 999, backgroundColor: PAY_ACCENT },

  /* What actually happens to the money, in the calmest colour on the screen —
     it is reassurance, not a warning. */
  assurance: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: PAY_GREEN_SOFT,
    padding: 14,
  },
  /* Cash carries no Evently guarantee, so it does not get the green panel
     that on every other screen means "we have got this". */
  assuranceCash: { backgroundColor: '#f4f1ec' },

  /* A method that exists but cannot be used right now — dimmed, not hidden. */
  optionOff: { opacity: 0.45 },
  gatewayOff: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: '#f4f1ec',
    padding: 12,
  },
  gatewayOffText: { color: '#4a4740', flex: 1, fontSize: 13, lineHeight: 18 },
  assuranceText: { color: '#2f6b57', flex: 1, fontSize: 13.5, lineHeight: 19 },
  assuranceTextCash: { color: '#4a4740' },

  /* The way out for somebody not ready to commit. Quiet, but present. */
  talk: { ...globalStyles.row, alignItems: 'center', gap: 8, marginTop: 18, paddingVertical: 4 },
  talkText: { color: PAY_ACCENT, fontSize: 15, fontWeight: '600' },
  talkHint: { color: colors.textMuted, fontSize: 13, marginTop: 4, lineHeight: 18 },

  foot: {
    borderTopWidth: 1,
    borderTopColor: PAY_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: spacing.md,
  },
  pay: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: PAY_ACCENT,
  },
  payDisabled: { opacity: 0.55 },
  payText: { color: colors.onPrimary, fontSize: 17, fontWeight: '700' },
  payError: { color: colors.danger, fontSize: 13, textAlign: 'center', marginBottom: 10, lineHeight: 18 },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredText: { color: colors.textMuted, marginTop: spacing.md, textAlign: 'center', lineHeight: 20 },
  errorTitle: { color: PAY_NAVY, marginTop: spacing.md, textAlign: 'center' },
  retry: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PAY_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: PAY_ACCENT, fontWeight: '700' },
});

/** The receipt's celebration: green for a paid advance, warm amber for cash still owed. */
export const SUCCESS_PAID_GRADIENT: [string, string] = ['#3cc9a1', '#0e8a68'];
export const SUCCESS_CASH_GRADIENT: [string, string] = ['#ffb547', '#f0791a'];
export const SUCCESS_CTA_GRADIENT: [string, string] = ['#f47b4d', '#e2477a'];

const SUCCESS_INK = '#1a2e5a';
const SUCCESS_MUTED = '#5d6683';
const SUCCESS_LINE = '#efe9f6';

export const successStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAY_CANVAS },
  wash: { position: 'absolute', top: 0, left: 0, right: 0, height: 360 },
  confetti: { position: 'absolute', top: 40, left: 0, right: 0, height: 220, opacity: 0.9 },
  body: { alignItems: 'stretch', paddingHorizontal: spacing.lg, paddingTop: 36, paddingBottom: spacing.lg },

  badgeRing: {
    alignSelf: 'center',
    width: 116,
    height: 116,
    borderRadius: 58,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.75)',
    ...Platform.select({
      ios: {
        shadowColor: '#0e8a68',
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 4 },
    }),
  },
  tick: {
    flex: 1,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: PAY_NAVY_DEEP,
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: -0.4,
  },
  text: {
    color: SUCCESS_MUTED,
    fontSize: 14.5,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
    paddingHorizontal: spacing.sm,
  },
  refChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#f1ecff',
  },
  refText: { color: '#5a35e0', fontSize: 12.5, fontWeight: '700', letterSpacing: 0.4 },

  receipt: {
    marginTop: 22,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: SUCCESS_LINE,
  },
  receiptTitle: { color: SUCCESS_INK, fontSize: 16.5, fontWeight: '700', marginBottom: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: SUCCESS_LINE,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#f4f0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { color: SUCCESS_MUTED, fontSize: 13.5 },
  rowRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  rowValue: { color: SUCCESS_INK, fontSize: 14.5, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
  badge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
  badgePaid: { backgroundColor: '#e3f7ef' },
  badgeCash: { backgroundColor: '#fff1dc' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  badgeTextPaid: { color: '#0e8a68' },
  badgeTextCash: { color: '#c2620f' },

  next: { marginTop: 24 },
  nextTitle: { color: SUCCESS_INK, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  step: { flexDirection: 'row', gap: 12 },
  stepRail: { alignItems: 'center', width: 30 },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: { flex: 1, width: 2, borderRadius: 1, backgroundColor: '#f3d5d0', marginVertical: 4 },
  stepText: { flex: 1, paddingBottom: 16 },
  stepTitle: { color: SUCCESS_INK, fontSize: 14.5, fontWeight: '600', marginTop: 4 },
  stepBody: { color: SUCCESS_MUTED, fontSize: 13, lineHeight: 18, marginTop: 2 },

  foot: {
    borderTopWidth: 1,
    borderTopColor: PAY_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: spacing.sm,
  },
  cta: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    borderRadius: 27,
    overflow: 'hidden',
    backgroundColor: PAY_ACCENT,
  },
  ctaText: { color: colors.onPrimary, fontSize: 16.5, fontWeight: '700' },
  ctaArrow: { position: 'absolute', right: 20 },
  secondary: { alignItems: 'center', paddingVertical: 12 },
  secondaryText: { color: SUCCESS_MUTED, fontSize: 14.5, fontWeight: '600' },
  tickColor: { color: PAY_GREEN },
});

