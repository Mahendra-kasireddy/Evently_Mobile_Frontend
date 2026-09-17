import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand, fontFor, spacing } from '../../theme';

/** The hero's bottom curve. Big enough to read as a shape, not a rounded rectangle. */
export const HERO_RADIUS = 28;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: brand.bg },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  /* flexGrow so the spacer below can push the footer to the bottom of the
     viewport, instead of leaving a dead gap under the last card. */
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  /* Takes whatever vertical room is left over. With the keyboard up there is
     none, so it collapses and the footer simply follows the content. */
  spacer: { flex: 1, minHeight: spacing.md },
  errorBox: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: '#fdecec',
    borderRadius: 12,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  errorText: { color: '#b3261e', flex: 1 },
  footer: { gap: spacing.md },
});

export const heroStyles = StyleSheet.create({
  /* Runs to the very top edge, behind the status bar — the clock and battery
     sit on navy. The top inset is applied as padding by the screen, so the
     block is one continuous shape rather than a card with a strip above it. */
  hero: {
    backgroundColor: brand.navy,
    borderBottomLeftRadius: HERO_RADIUS,
    borderBottomRightRadius: HERO_RADIUS,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
  /* Warm, very low contrast. It is there to stop a large flat navy block from
     looking like a placeholder, and should never be noticed on its own. */
  glow: {
    position: 'absolute',
    top: -120,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: brand.navyPlum,
  },
  brandRow: { ...globalStyles.row, gap: spacing.sm },
  logoTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: brand.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Poppins' ascenders overshoot its default leading, so a wordmark set at 22
     with the body line height loses the top of the E. */
  wordmark: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    color: brand.onNavy,
    letterSpacing: -0.3,
  },
  tagline: { color: brand.onNavyMuted, marginTop: spacing.sm },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    ...globalStyles.row,
    gap: 6,
    backgroundColor: brand.navySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: brand.mint,
  },
  chipText: { color: brand.onNavy, fontSize: 11, fontWeight: '500' },
});

export const otpHeaderStyles = StyleSheet.create({
  header: {
    backgroundColor: brand.navy,
    borderBottomLeftRadius: HERO_RADIUS,
    borderBottomRightRadius: HERO_RADIUS,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: brand.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { flex: 1 },
  title: { color: brand.onNavy },
  sentTo: { color: brand.onNavyMuted, marginTop: 2 },
  editPill: {
    ...globalStyles.row,
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: brand.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editText: { color: brand.accent, fontWeight: '600', fontSize: 12 },
});

export const fieldStyles = StyleSheet.create({
  label: { color: brand.navy, fontWeight: '600', marginBottom: spacing.sm },
  phoneRow: {
    ...globalStyles.row,
    height: 56,
    borderRadius: 16,
    backgroundColor: brand.surface,
    borderWidth: 1,
    borderColor: brand.border,
    paddingHorizontal: spacing.md,
  },
  /* The ring means "this field is taking input", so it follows focus rather
     than whether anything has been typed. */
  phoneRowFocused: { borderColor: brand.accent },
  dialButton: { ...globalStyles.row, gap: 4, paddingRight: spacing.sm },
  dialCode: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: brand.navy,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 12,
    backgroundColor: brand.border,
  },
  /* The real field. Its own border and padding are cleared because the row
     around it is what draws the control. */
  input: {
    flex: 1,
    marginLeft: spacing.md,
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: fontFor('600'),
    color: brand.navy,
    letterSpacing: 0.4,
  },
});

export const otpStyles = StyleSheet.create({
  label: { color: brand.navy, fontWeight: '600', marginBottom: spacing.sm },
  /* `position: relative` so the real input can be laid over the six cells. */
  boxRow: { flexDirection: 'row', gap: spacing.sm, position: 'relative' },
  /* One transparent input covering the whole row: the cells are the picture,
     this is the field. One input rather than six means paste, SMS autofill and
     backspace-across-cells all work the way the OS already does them. */
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    borderWidth: 0,
    borderRadius: 0,
    padding: 0,
    color: 'transparent',
  },
  box: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: brand.border,
    backgroundColor: brand.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: brand.accent, borderWidth: 1.5 },
  boxFilled: { borderColor: brand.accentBorder },
  boxText: {
    fontSize: 20,
    fontWeight: '600',
    color: brand.navy,
    fontFamily: fontFor('600'),
    lineHeight: 26,
  },
  retryLead: { color: brand.textMuted, marginTop: spacing.md },
  retryRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  retryPill: {
    ...globalStyles.row,
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: brand.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: brand.surface,
  },
  retryPillWaiting: { borderColor: brand.border },
  retryText: { color: brand.accentDeep, fontWeight: '600', fontSize: 13 },
  retryTextWaiting: { color: brand.textMuted },
  safetyRow: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  safetyText: { color: brand.green },
  devHint: {
    color: brand.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export const ctaStyles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    backgroundColor: brand.accent,
    ...Platform.select({
      ios: {
        shadowColor: brand.accent,
        shadowOpacity: 0.28,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
      android: { elevation: 3 },
    }),
  },
  /* Filled and flat rather than a faded accent: a 50%-opacity orange button
     still looks pressable, and people tap it and think the app is broken. */
  buttonIdle: {
    backgroundColor: brand.disabledBg,
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
    }),
  },
  buttonPressed: { opacity: 0.9 },
  label: { fontSize: 15, fontWeight: '600', color: brand.onAccent },
  labelIdle: { color: brand.textMuted },
});

export const businessEntryStyles = StyleSheet.create({
  card: {
    ...globalStyles.row,
    gap: spacing.sm,
    backgroundColor: brand.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: brand.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  cardPressed: {
    borderColor: brand.accentBorder,
    backgroundColor: brand.accentSoft,
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: brand.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1 },
  title: { color: brand.navy, fontWeight: '600' },
  body: { color: brand.textMuted, marginTop: 2 },
});

export const termsStyles = StyleSheet.create({
  text: { color: brand.textMuted, textAlign: 'center', marginTop: spacing.md },
  link: {
    color: brand.navy,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
