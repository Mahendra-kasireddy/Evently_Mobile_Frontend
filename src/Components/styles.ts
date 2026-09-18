import { StyleSheet } from 'react-native';
import { brand, colors, fontFor, layout, spacing, typography } from '../theme';

export const appHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: layout.headerHeight,
    paddingHorizontal: layout.headerPadding,
  },
  left: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  /*
   * A 44pt target around a 20pt glyph, pulled left by the difference so the
   * chevron still lines up with the 16pt gutter rather than sitting inset by
   * its own padding.
   */
  backButton: {
    width: layout.backTouch,
    height: layout.backTouch,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -(layout.backTouch - layout.backIcon) / 2,
    marginRight: layout.headerGap - (layout.backTouch - layout.backIcon) / 2,
  },
  backButtonPressed: { opacity: 0.6 },
  title: { color: colors.text, flexShrink: 1 },
  rightElement: { marginLeft: spacing.md },
});

export const eventlyButtonStyles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    borderRadius: layout.buttonRadius,
    paddingVertical: spacing.s12,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
  primary: { backgroundColor: colors.primary },
  primaryText: { color: colors.onPrimary },
  outline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  outlineText: { color: colors.primary },
  danger: {
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.background,
  },
  dangerText: { color: colors.danger },
});

export const eventlyTextInputStyles = StyleSheet.create({
  base: {
    ...typography.input,
    // A TextInput is not an EventlyText, so nothing resolves its weight into a
    // Poppins face for it — without this the field falls back to the system font
    // and the form looks like it belongs to a different app.
    fontFamily: fontFor(typography.input.fontWeight),
    color: colors.text,
    minHeight: layout.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.buttonRadius,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.s12,
  },
});

export const eventlyImageStyles = StyleSheet.create({
  wrapper: { position: 'relative' },
  image: { width: '100%', height: '100%' },
  fallback: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});

/** The one calendar, lifted out of the Plan wizard so Home can use it too. */
export const calendarSheetStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16,26,49,0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: brand.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: brand.borderStrong,
    marginBottom: spacing.md,
  },
  title: { color: brand.navy, marginBottom: spacing.md },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthLabel: { color: brand.navy },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: brand.surface,
    borderWidth: 1,
    borderColor: brand.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: { opacity: 0.3 },
  weekdayRow: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', color: brand.textMuted },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: { backgroundColor: brand.accent },
  dayText: { color: brand.navy, fontSize: 14, lineHeight: 20 },
  dayTextDisabled: { color: brand.borderStrong },
  dayTextSelected: { color: brand.onAccent, fontWeight: '700' },
});
