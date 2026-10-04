import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand, spacing } from '../../theme';

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

/** Serif for the wordmark and headings — the platform's own, nothing bundled. */
export const AUTH_SERIF = Platform.select({ ios: 'Georgia', android: 'serif' });

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
  errorText: { color: '#b3261e', flex: 1, fontSize: 13, lineHeight: 19 },
});

/** The brand block and headings on both steps. */
export const heroStyles = StyleSheet.create({
  brand: { alignItems: 'center', marginTop: spacing.sm },
  wordmark: {
    fontFamily: AUTH_SERIF,
    fontWeight: '700',
    fontSize: 34,
    lineHeight: 42,
    color: AUTH_NAVY,
    marginTop: 2,
  },
  title: {
    fontFamily: AUTH_SERIF,
    fontWeight: '700',
    fontSize: 25,
    lineHeight: 32,
    color: AUTH_NAVY,
    textAlign: 'center',
  },
  titleGap: { marginTop: spacing.lg },
  subtitle: {
    color: AUTH_MUTED,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  subtitleStrong: { color: AUTH_NAVY, fontWeight: '700' },
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
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AUTH_BORDER,
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing.s12,
  },
  phoneRowFocused: { borderColor: AUTH_ACCENT },
  dialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: spacing.s12,
    height: '100%',
  },
  flag: { fontSize: 18, lineHeight: 22 },
  dialCode: {
    color: AUTH_NAVY,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  divider: { width: 1, height: 26, backgroundColor: AUTH_BORDER },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.s12,
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: AUTH_NAVY,
    fontSize: 16,
  },
  /* The name step's single field. */
  nameInput: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AUTH_BORDER,
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing.md,
    color: AUTH_NAVY,
    fontSize: 16,
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
    color: AUTH_NAVY,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
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
  resendLead: { color: AUTH_MUTED, fontSize: 13.5, lineHeight: 19 },
  resendLink: {
    color: AUTH_ACCENT,
    fontWeight: '700',
    fontSize: 13.5,
    lineHeight: 19,
  },
  resendWait: { color: AUTH_MUTED, fontSize: 13.5, lineHeight: 19 },
  devHint: { color: AUTH_MUTED, textAlign: 'center', marginTop: spacing.md },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  safetyText: { color: AUTH_MUTED, fontSize: 12.5, lineHeight: 18 },
});

export const ctaStyles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: AUTH_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: AUTH_ACCENT,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
      android: { elevation: 2 },
    }),
  },
  /* Not yet actionable: a pale wash of the accent, its label still legible. */
  buttonIdle: {
    backgroundColor: '#f6d9cb',
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
    }),
  },
  buttonPressed: { opacity: 0.88 },
  label: { color: '#ffffff', fontSize: 16, fontWeight: '700', lineHeight: 21 },
  labelIdle: { color: '#ffffff' },
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
  lead: { color: AUTH_MUTED, fontSize: 13, lineHeight: 18 },
  action: {
    color: AUTH_ACCENT,
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
  },
});

export const termsStyles = StyleSheet.create({
  text: {
    color: AUTH_MUTED,
    textAlign: 'center',
    fontSize: 12.5,
    lineHeight: 19,
  },
  link: {
    color: AUTH_ACCENT,
    textDecorationLine: 'underline',
    fontWeight: '600',
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
  title: { color: brand.navy, marginTop: spacing.sm },
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
  rowLabel: { flex: 1, color: brand.navy, fontWeight: '600' },
  note: { color: brand.textMuted, textAlign: 'center' },
});
