import { StyleSheet } from 'react-native';
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
  back: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#f2efed',
    alignItems: 'center',
    justifyContent: 'center',
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
  amount: { color: colors.onPrimary, fontSize: 38, fontWeight: '800', marginTop: 8, letterSpacing: -1 },
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
  assuranceText: { color: '#2f6b57', flex: 1, fontSize: 13.5, lineHeight: 19 },

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

export const successStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAY_CANVAS },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 60 },
  tick: {
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: PAY_GREEN_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: PAY_NAVY_DEEP,
    fontSize: 30,
    fontWeight: '700',
    marginTop: 22,
    letterSpacing: -0.6,
  },
  text: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  ref: { color: PAY_NAVY_DEEP, fontSize: 14, fontWeight: '700', letterSpacing: 0.4, marginTop: 18 },
  foot: {
    borderTopWidth: 1,
    borderTopColor: PAY_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: spacing.md,
  },
  cta: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
    borderRadius: 14,
    backgroundColor: PAY_NAVY_DEEP,
  },
  ctaText: { color: colors.onPrimary, fontSize: 17, fontWeight: '700' },
  tickColor: { color: PAY_GREEN },
});
