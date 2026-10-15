import { Platform, StyleSheet } from 'react-native';
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
  PLAN_ACCENT,
  PLAN_ACCENT_SOFT,
  PLAN_ACCENT_WARM,
  PLAN_BG,
  PLAN_BORDER,
  PLAN_CHECKLIST_BG,
  PLAN_GREEN,
  PLAN_GREEN_SOFT,
  PLAN_NAVY,
  PLAN_NAVY_DEEP,
  PLAN_QUOTE_BG,
  PLAN_TEXT_MUTED,
} from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PLAN_BG },
  body: { flex: 1 },
  scroll: { flex: 1 },
  stepPillsGap: { marginBottom: spacing.md },
  shortlistFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  shortlistFooterText: { flex: 1 },
  shortlistFooterCount: { color: textColor.textPrimary, ...fontWeights.bold },
  shortlistFooterHint: { color: textColor.textSecondary, marginTop: 1 },
  shortlistFooterButton: { paddingHorizontal: spacing.md },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: PLAN_BG,
  },
  loadingText: { color: textColor.textSecondary, marginTop: spacing.md },
  errorText: { color: textColor.textError, textAlign: 'center' },
  retryButton: { marginTop: spacing.lg },
  /* The continue button, as the last thing on the page. */
  inlineContinue: { marginTop: spacing.lg },
  footerBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: PLAN_BG,
    borderTopWidth: 1,
    borderTopColor: PLAN_BORDER,
  },
  /*
   * No Android elevation.
   *
   * It used to carry `elevation: 4`, and Android draws an elevation shadow
   * from the view's outline — which for this button fell back to its bounding
   * rectangle, not its 999px radius. The result was a white rectangle poking
   * out at all four corners of the pill, most visible once the button turned
   * orange. The separation the shadow was for is now the footer's top rule,
   * which is honest about being a straight line.
   *
   * No `overflow: 'hidden'` either. On Android it made the label vanish the
   * moment the button turned from outline to filled (seen on a Pixel
   * emulator) — an orange pill with no words on it. Nothing inside the
   * button needs clipping, so the pill shape comes from the radius alone.
   */
  floatingButton: {
    borderRadius: 999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {},
    }),
  },
  /*
   * Disabled, and still readable.
   *
   * EventlyButton dims every disabled button to opacity 0.5, which on an
   * outline button leaves the label around 2:1 against the page — you cannot
   * act on a control whose text you cannot read, and "greyed out" is supposed
   * to mean not yet, not broken. `style` is applied last in the component's
   * array, so restoring full opacity here is a local override that leaves
   * every other button in the app alone.
   */
  continueDisabled: {
    opacity: 1,
    backgroundColor: colors.background,
    borderColor: PLAN_BORDER,
  },
  fixedHeader: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: PLAN_BG,
  },
  /*
   * A fade, where a 1px rule used to be.
   *
   * The occasion tiles scroll under this edge, and a hard line cut them
   * mid-card — the first thing on the screen was a band of half-tiles. Pulled
   * up over the scroll view so content dissolves into the header instead.
   */
  headerFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 14,
    zIndex: 2,
  },
  successCard: {
    ...globalStyles.card,
    padding: spacing.lg,
    alignItems: 'center',
  },
  successTitle: {
    color: textColor.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  successSubtitle: {
    color: textColor.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  newPlanButton: { marginTop: spacing.lg },
});

// "Step N of 4" + step name, shared by the Details hero and Categories.
export const stepPillStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepPill: {
    backgroundColor: PLAN_ACCENT_SOFT,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepPillText: { color: PLAN_ACCENT, ...typography.label },
  labelPill: {
    backgroundColor: colors.background,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PLAN_BORDER,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  labelPillText: { color: textColor.textPrimary, ...typography.label },
});

// The Details step hero: step pills, a two-line heading and a floral corner.
export const heroStyles = StyleSheet.create({
  section: {
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.s20,
    minHeight: 190,
  },
  art: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 230,
    height: 190,
    overflow: 'hidden',
  },
  /* The bouquet sits on the right of a 3:2 image; anchoring the image's right
     edge to the box keeps only the flowers in frame. */
  artImage: {
    position: 'absolute',
    top: -10,
    right: -20,
    width: 330,
    height: 220,
  },
  artFade: { position: 'absolute', top: 0, left: 0 },
  heading: {
    color: textColor.textPrimary,
    ...typography.h1,
    marginTop: spacing.md,
    maxWidth: 260,
  },
  headingAccent: {
    color: PLAN_ACCENT,
    ...typography.h1,
  },
  subtitle: {
    color: textColor.textSecondary,
    marginTop: spacing.sm,
    maxWidth: 250,
  },
  plainSection: { marginBottom: spacing.lg },
  plainHeading: { color: textColor.textPrimary },
  plainSubtitle: { color: textColor.textSecondary, marginTop: spacing.xs },
});

/*
 * A progress bar and one line of text, rather than four numbered dots.
 *
 * Four labels never fit across a phone: "Event details", "Categories", "Find
 * organizers" and "Review" truncated to "Event…", "Categ…", "Find or…", which
 * names nothing. Only the current step actually needs spelling out — the rest
 * is position, and a segmented bar carries position better than four
 * abbreviations while costing less height.
 */
export const stepperStyles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  track: { flexDirection: 'row', gap: 5 },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: PLAN_BORDER,
  },
  segmentDone: { backgroundColor: PLAN_ACCENT },
  caption: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  captionCount: { color: PLAN_ACCENT, ...fontWeights.bold },
  captionDivider: { color: PLAN_BORDER },
  captionLabel: {
    color: textColor.textPrimary,
    ...fontWeights.semibold,
    flexShrink: 1,
  },
  captionSpacer: { flex: 1 },
  captionNext: { color: PLAN_TEXT_MUTED },
});

export const occasionPickerStyles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h2, color: textColor.textPrimary },
  sectionSubtitle: { color: textColor.textSecondary, marginTop: 2 },
  /* Three to a row, sized to the screen, so all six fit without scrolling. */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
    marginTop: spacing.s12,
  },
  card: {
    width: '31.8%',
    height: 92,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: PLAN_BORDER,
  },
  cardSelected: { borderColor: PLAN_ACCENT, backgroundColor: PLAN_ACCENT_SOFT },
  radio: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: PLAN_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: PLAN_ACCENT, borderColor: PLAN_ACCENT },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: textColor.textPrimary, ...typography.label },
  labelSelected: { ...fontWeights.bold },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(14,26,51,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: PLAN_BORDER,
    marginBottom: spacing.md,
  },
  sheetTitle: {
    color: textColor.textPrimary,
    ...fontWeights.bold,
    textAlign: 'center',
  },
  sheetSubtitle: {
    color: textColor.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  sheetCancel: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: PLAN_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  sheetCancelText: { color: textColor.textPrimary, ...fontWeights.bold },
});

// Web's EventDetailsForm.module.css `.control`: a single bordered pill with an
// icon + borderless input inside — NOT an input with its own border nested in
// another border. controlInput cancels EventlyTextInput's own base border/
// padding so controlRow supplies the one visible outline.
export const eventDetailsStyles = StyleSheet.create({
  section: { marginBottom: spacing.lg, gap: spacing.sm },
  sectionTitle: { ...typography.h2, color: textColor.textPrimary },
  field: { marginBottom: 0 },
  /* Two half-width fields side by side. Date and guest count are both short
     answers, and pairing them buys back a whole field's height. */
  pair: { flexDirection: 'row', gap: spacing.sm },
  pairItem: { flex: 1 },
  label: {
    color: textColor.textPrimary,
    marginBottom: spacing.xs,
    ...fontWeights.semibold,
  },
  /*
   * The field's name, inside the field.
   *
   * A label above the control cost 74px per field — 18 of label, 4 of gap, 52
   * of control — so three fields filled the screen. Moving it inside brings
   * that to 58 and pairs the short ones, which is the difference between
   * seeing the whole step and scrolling through it.
   */
  caption: {
    color: textColor.textSecondary,
    ...typography.overline,
  },
  captionOptional: {
    ...fontWeights.medium,
    textTransform: 'none',
  },
  control: {
    height: 58,
    justifyContent: 'center',
    gap: 3,
    borderWidth: 1.5,
    borderColor: PLAN_BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.background,
  },
  /* An optional field should look optional before it is read. */
  controlOptional: { backgroundColor: 'transparent', borderStyle: 'dashed' },
  controlValueRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderWidth: 1.5,
    borderColor: PLAN_BORDER,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  controlRowFocused: { borderColor: PLAN_ACCENT },
  controlInput: {
    flex: 1,
    color: textColor.textPrimary,
    ...inputTypography.bodyLarge,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dateValue: { flex: 1, color: textColor.textPrimary, ...fontWeights.semibold },
  dateValuePlaceholder: {
    flex: 1,
    color: textColor.textSecondary,
    ...fontWeights.regular,
  },
  /* The grouped details card from the design: one white card, a row per
     answer, hairline dividers between them. */
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PLAN_BORDER,
    paddingHorizontal: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: PLAN_NAVY,
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    paddingVertical: 14,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PLAN_BORDER,
  },
  rowPressed: { opacity: 0.7 },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, gap: 2 },
  rowCaption: { color: textColor.textSecondary, ...typography.caption },
  rowValue: { color: textColor.textPrimary, ...typography.h3 },
  rowPlaceholder: { color: textColor.textSecondary, ...typography.bodyLarge },
  rowInput: {
    color: textColor.textPrimary,
    ...inputTypography.bodyLarge,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 0,
    height: 22,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    backgroundColor: PLAN_GREEN_SOFT,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(29,158,117,0.18)',
    padding: spacing.md,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PLAN_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: { color: textColor.textSecondary, flex: 1 },
  bannerBold: { ...fontWeights.bold, color: textColor.textPrimary },
});

export const dateModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  headRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthLabel: { color: textColor.textPrimary },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PLAN_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: { opacity: 0.3 },
  weekdayRow: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', color: PLAN_TEXT_MUTED },
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
  daySelected: { backgroundColor: PLAN_ACCENT },
  dayText: { color: textColor.textPrimary },
  dayTextDisabled: { color: PLAN_BORDER },
  dayTextSelected: { color: textColor.textOnPrimary, ...fontWeights.bold },
  doneButton: { marginTop: spacing.lg },
});

// A single reusable bottom-sheet list — City (with free-text search), Guests
// and Budget all pick from this instead of inline chip rows/dropdowns, which
// read as a ported web control rather than a native mobile picker.
export const selectModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '75%',
  },
  headRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: { color: textColor.textPrimary },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PLAN_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1.5,
    borderColor: PLAN_BORDER,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: textColor.textPrimary,
    ...inputTypography.bodyLarge,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  optionRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: PLAN_BORDER,
  },
  optionRowFirst: { borderTopWidth: 0 },
  optionText: { color: textColor.textPrimary },
  optionTextSelected: { color: PLAN_ACCENT, ...fontWeights.bold },
  clearRow: {
    ...globalStyles.row,
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: PLAN_BORDER,
    marginBottom: spacing.xs,
  },
  clearText: { color: textColor.textSecondary, fontStyle: 'italic' },
  emptyText: {
    ...typography.body,
    color: textColor.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});

export const ideasStyles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.s12 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PLAN_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1 },
  title: { color: textColor.textPrimary, ...fontWeights.bold },
  subtitle: { color: textColor.textSecondary, marginTop: 2 },
  chipRow: { marginTop: spacing.s12, marginHorizontal: -spacing.md },
  chipRowContent: { gap: spacing.sm, paddingHorizontal: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: PLAN_BORDER,
    borderRadius: 999,
    paddingHorizontal: spacing.s12,
    height: 34,
    backgroundColor: colors.background,
  },
  chipText: { color: textColor.textPrimary, ...fontWeights.medium },
  textareaBox: {
    marginTop: spacing.s12,
    borderWidth: 1,
    borderColor: PLAN_BORDER,
    borderRadius: 16,
    backgroundColor: colors.background,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  textarea: {
    color: PLAN_NAVY,
    minHeight: 72,
    textAlignVertical: 'top',
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    lineHeight: 20,
  },
  textareaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  counter: { color: PLAN_TEXT_MUTED },
  pencil: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PLAN_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const categoriesStepStyles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    backgroundColor: PLAN_CHECKLIST_BG,
    borderRadius: 16,
    padding: spacing.md,
    paddingRight: spacing.sm,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  bannerArt: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 90,
    height: 44,
    overflow: 'hidden',
  },
  bannerArtImage: {
    position: 'absolute',
    top: -6,
    right: -10,
    width: 150,
    height: 100,
  },
  bannerArtFade: { position: 'absolute', top: 0, left: 0 },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(232,99,58,0.25)',
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: { color: textColor.textPrimary, ...fontWeights.bold },
  bannerSubtitle: { color: textColor.textSecondary, marginTop: 2 },
  bannerScript: {
    color: PLAN_ACCENT_WARM,
    fontSize: 15,
    lineHeight: 17,
    textAlign: 'center',
    transform: [{ rotate: '-10deg' }],
    marginTop: spacing.md,
    fontFamily: Platform.select({ ios: 'Snell Roundhand', android: 'cursive' }),
  },
  // Two small tiles per row, so the full list fits on screen with the
  // "type your own" field still in view below it.
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  tile: {
    width: '48.5%',
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PLAN_BORDER,
    padding: spacing.s12,
  },
  tileSelected: { borderColor: PLAN_ACCENT, backgroundColor: PLAN_ACCENT_SOFT },
  tileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: PLAN_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: PLAN_ACCENT, borderColor: PLAN_ACCENT },
  tileTitle: {
    color: textColor.textPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  tileSubtitle: { color: textColor.textSecondary, marginTop: 1 },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1.5,
    borderColor: PLAN_BORDER,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.s12,
    backgroundColor: colors.background,
  },
  addInput: {
    flex: 1,
    color: textColor.textPrimary,
    ...inputTypography.body,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PLAN_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const organizersStyles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 50,
    borderRadius: 16,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: PLAN_BORDER,
  },
  searchInput: {
    flex: 1,
    color: textColor.textPrimary,
    ...inputTypography.body,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  filterIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: PLAN_ACCENT,
  },
  sortRow: { marginTop: spacing.s12, marginHorizontal: -spacing.md },
  sortRowContent: { gap: spacing.sm, paddingHorizontal: spacing.md },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: PLAN_BORDER,
  },
  sortChipActive: { backgroundColor: PLAN_ACCENT, borderColor: PLAN_ACCENT },
  sortChipText: { color: textColor.textPrimary, ...fontWeights.medium },
  sortChipTextActive: { color: textColor.textOnPrimary, ...fontWeights.bold },
  multiHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.s12,
    marginBottom: spacing.s12,
    paddingHorizontal: spacing.s12,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: PLAN_ACCENT_SOFT,
  },
  multiHintText: {
    flex: 1,
    color: textColor.textPrimary,
    ...fontWeights.medium,
  },
  loading: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  list: { gap: spacing.s12 },
  /* Photo left, details middle, heart / price / request right — as in the
     design. */
  card: {
    flexDirection: 'row',
    gap: spacing.s12,
    padding: spacing.s12,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: PLAN_NAVY,
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 2 },
    }),
  },
  cardSelected: { borderColor: PLAN_ACCENT },
  cardMuted: { opacity: 0.6 },
  photo: { width: 84, height: 96, borderRadius: 12 },
  photoFallback: { alignItems: 'center', justifyContent: 'center' },
  photoInitials: { color: colors.onPrimary },
  body: { flex: 1, gap: 3 },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
    backgroundColor: PLAN_GREEN_SOFT,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  verifiedText: { color: PLAN_GREEN, ...typography.label },
  conciergePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
    backgroundColor: PLAN_NAVY_DEEP,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  conciergeText: { color: textColor.textOnPrimary, ...typography.label },
  name: { color: textColor.textPrimary, ...fontWeights.bold },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { color: textColor.textPrimary, ...fontWeights.bold },
  reviewsText: { color: textColor.textSecondary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { color: textColor.textSecondary, flexShrink: 1 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  tag: {
    backgroundColor: PLAN_BG,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: { color: textColor.textSecondary, ...typography.label },
  side: { alignItems: 'flex-end', justifyContent: 'space-between' },
  price: {
    color: textColor.textPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  unavailText: { color: colors.danger, textAlign: 'right' },
  quoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: PLAN_ACCENT_SOFT,
  },
  quoteButtonOn: { backgroundColor: PLAN_ACCENT },
  quoteButtonBlocked: { opacity: 0.45 },
  quoteButtonText: { color: PLAN_ACCENT, ...typography.buttonSmall },
  quoteButtonTextOn: {
    color: textColor.textOnPrimary,
    ...typography.buttonSmall,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.h2,
    color: textColor.textPrimary,
    textAlign: 'center',
  },
  emptyMessage: {
    ...typography.body,
    color: textColor.textSecondary,
    textAlign: 'center',
  },
  emptyButton: { marginTop: spacing.sm },
});

export const filterModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  headRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: { color: textColor.textPrimary },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PLAN_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupLabel: {
    color: textColor.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  checkRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: PLAN_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: PLAN_ACCENT, borderColor: PLAN_ACCENT },
  checkLabel: { color: textColor.textPrimary },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: {
    borderWidth: 1.5,
    borderColor: PLAN_BORDER,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pillOn: { borderColor: PLAN_ACCENT, backgroundColor: PLAN_ACCENT },
  pillText: { color: textColor.textPrimary },
  pillTextOn: { color: colors.onPrimary },
  footerRow: { ...globalStyles.row, gap: spacing.md, marginTop: spacing.lg },
  clearButton: { flex: 1 },
  applyButton: { flex: 1 },
});

export const reviewStyles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  // One consolidated "receipt" card (Event details / Categories / Organizer as
  // internal sections) instead of three separate floating panels — reads as a
  // single mobile order-review summary rather than a stack of dashboard cards.
  summaryCard: { ...globalStyles.card, padding: spacing.md },
  sectionBlock: { paddingVertical: spacing.md },
  sectionBlockFirst: { paddingTop: 0 },
  sectionDivider: { height: 1, backgroundColor: PLAN_BORDER },
  panelHead: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  panelTitle: { color: textColor.textPrimary },
  editButton: { ...globalStyles.row, gap: 4 },
  editText: { color: PLAN_ACCENT },
  // A 2-column key/value grid reads like a checkout summary — lighter than a
  // vertical list of icon-badged rows repeated six times.
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  detailItem: {
    width: '50%',
    marginBottom: spacing.sm,
    paddingRight: spacing.sm,
  },
  detailItemFull: { width: '100%', marginBottom: spacing.sm },
  rowLabel: { color: textColor.textSecondary },
  rowValue: { color: textColor.textPrimary, marginTop: 1 },
  rowValueMuted: { color: textColor.textSecondary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    ...globalStyles.row,
    gap: 4,
    backgroundColor: PLAN_BG,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chipText: { color: textColor.textPrimary },
  emptyText: { ...typography.body, color: textColor.textSecondary },
  orgRow: { ...globalStyles.row, gap: spacing.sm, marginTop: spacing.sm },
  orgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgAvatarText: { color: textColor.textOnPrimary },
  orgMeta: { flex: 1 },
  orgName: { color: textColor.textPrimary },
  orgSub: { ...globalStyles.row, gap: 4, color: textColor.textSecondary },
  orgSubText: { color: textColor.textSecondary },
  orgTag: {
    backgroundColor: PLAN_ACCENT_SOFT,
    color: PLAN_ACCENT,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    ...fontWeights.bold,
  },
  nextPanel: {
    ...globalStyles.card,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  nextPanelTitle: { color: textColor.textPrimary, marginBottom: spacing.sm },
  nextRow: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  nextTextCol: { flex: 1 },
  nextIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PLAN_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextTitle: { color: textColor.textPrimary },
  nextDesc: { color: textColor.textSecondary, marginTop: 1 },
  quoteBox: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: PLAN_QUOTE_BG,
    borderRadius: 12,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  quoteTextCol: { flex: 1 },
  quoteTitle: { color: textColor.textPrimary },
  quoteText: { color: textColor.textSecondary, marginTop: 1 },
  submitCard: { ...globalStyles.card, padding: spacing.md },
  submitTitle: { color: textColor.textPrimary },
  submitText: {
    color: textColor.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  savedRow: { ...globalStyles.row, gap: spacing.xs, marginBottom: spacing.sm },
  savedText: { color: PLAN_GREEN },
  errorBox: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: { color: textColor.textError, flex: 1 },
  submitButton: {
    borderRadius: 999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
    }),
  },
  footnoteRow: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.md },
  footnoteText: { color: textColor.textSecondary, flex: 1 },
});
