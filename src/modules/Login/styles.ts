import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
  brand,
  spacing,
  fontWeights,
  textColor,
  typography,
  inputTypography,
} from '../../theme';

/*
 * Sign-in, as designed: a warm cream page, a serif wordmark and headings,
 * white fields with soft borders and one terracotta action per step.
 */
export const AUTH_CANVAS = '#fbf6f2';
export const AUTH_NAVY = '#1a2e5a';
export const AUTH_MUTED = '#6b7280';
export const AUTH_ACCENT = '#e2683c';
export const AUTH_ACCENT_SOFT = '#fbe7dd';
export const AUTH_BORDER = '#ece6e1';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AUTH_CANVAS },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.lg },
  topBar: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  spacer: { flexGrow: 1, minHeight: spacing.lg },
  footer: { gap: spacing.md, paddingTop: spacing.md },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.s12,
    borderRadius: 12,
    backgroundColor: '#fdecea',
  },
  errorText: { color: textColor.textError, flex: 1, ...typography.caption },
});

/** The round photo tucked into the top-right corner of the number step. */
export const CORNER_SIZE = 230;
export const cornerStyles = StyleSheet.create({
  ring: {
    position: 'absolute',
    // Far enough into the corner to stay clear of the centred wordmark.
    right: -96,
    width: CORNER_SIZE + 16,
    height: CORNER_SIZE + 16,
    borderRadius: (CORNER_SIZE + 16) / 2,
    padding: 8,
    backgroundColor: '#f9d4c0',
  },
  circle: {
    flex: 1,
    borderRadius: CORNER_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: AUTH_BORDER,
  },
  image: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
});

/** The brand block and headings on both steps. */
export const heroStyles = StyleSheet.create({
  brand: { alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 46, height: 46 },
  wordmark: {
    ...typography.display,
    color: textColor.textPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.lg,
  },
  rule: { width: 28, height: 1.5, borderRadius: 1, backgroundColor: '#f2a582' },
  title: {
    ...typography.display,
    color: textColor.textPrimary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  titleGap: { marginTop: spacing.lg },
  subtitle: {
    color: textColor.textSecondary,
    ...typography.bodyLarge,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  subtitleStrong: { color: textColor.textPrimary, ...fontWeights.bold },
  /* The OTP step's picture: a phone with a message on it, on a peach disc. */
  art: { alignItems: 'center', marginTop: spacing.sm },
  artDisc: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: AUTH_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artBubble: {
    position: 'absolute',
    right: 18,
    top: 34,
    width: 44,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: AUTH_NAVY,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 3 },
    }),
  },
  artLeaf: { position: 'absolute', left: 14, bottom: 22 },
});

export const fieldStyles = StyleSheet.create({
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#f1ebe6',
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#c8907a',
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },
  phoneRowFocused: { borderColor: AUTH_ACCENT },
  dialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: spacing.s12,
    height: '100%',
  },
  flag: { ...typography.h3 },
  dialCode: {
    color: textColor.textPrimary,
    ...typography.h3,
  },
  divider: { width: 1, height: 26, backgroundColor: AUTH_BORDER },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.s12,
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: textColor.textPrimary,
    ...inputTypography.bodyLarge,
  },
  /* The name step's single field. */
  nameInput: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AUTH_BORDER,
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing.md,
    color: textColor.textPrimary,
    ...inputTypography.bodyLarge,
  },
});

export const otpStyles = StyleSheet.create({
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    height: 56,
    maxWidth: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AUTH_BORDER,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: { borderColor: AUTH_NAVY },
  boxActive: { borderColor: AUTH_ACCENT },
  boxText: {
    color: textColor.textPrimary,
    ...typography.h2,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.02,
    color: 'transparent',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  resendLead: { color: textColor.textSecondary, ...typography.bodySmall },
  resendLink: {
    color: AUTH_ACCENT,
    ...typography.buttonSmall,
  },
  resendWait: { color: textColor.textSecondary, ...typography.bodySmall },
  devHint: {
    color: textColor.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  safetyText: { color: textColor.textSecondary, ...typography.caption },
});

/** The primary action: a warm gradient, left to right. */
export const AUTH_CTA_GRADIENT: [string, string] = ['#f47b4d', '#f9a679'];

export const ctaStyles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    backgroundColor: AUTH_ACCENT,
    ...Platform.select({
      ios: {
        shadowColor: '#f47b4d',
        shadowOpacity: 0.32,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 3 },
    }),
  },
  /* Not yet actionable: the same pill at a lighter strength, label still legible. */
  buttonIdle: {
    opacity: 0.62,
    ...Platform.select({
      ios: { shadowOpacity: 0.12 },
      android: { elevation: 0 },
    }),
  },
  buttonPressed: { opacity: 0.88 },
  label: { color: textColor.textOnPrimary, ...typography.h3 },
  arrow: { position: 'absolute', right: 22 },
});

/** The way into the business side, as a quiet line rather than a card. */
export const businessEntryStyles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
  },
  lead: { color: textColor.textSecondary, ...typography.bodySmall },
  action: {
    color: AUTH_ACCENT,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
});

export const termsStyles = StyleSheet.create({
  text: {
    color: textColor.textSecondary,
    textAlign: 'center',
    ...typography.caption,
  },
  link: {
    color: AUTH_ACCENT,
    textDecorationLine: 'underline',
    ...fontWeights.semibold,
  },
});

export const dialSheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,26,49,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: brand.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: brand.borderStrong,
  },
  title: { color: textColor.textPrimary, marginTop: spacing.sm },
  row: {
    ...globalStyles.row,
    gap: spacing.sm,
    backgroundColor: brand.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: brand.border,
    padding: spacing.md,
  },
  rowSelected: { borderColor: brand.accent, backgroundColor: brand.accentSoft },
  rowLabel: { flex: 1, color: textColor.textPrimary, ...fontWeights.semibold },
  note: { color: textColor.textSecondary, textAlign: 'center' },
});
