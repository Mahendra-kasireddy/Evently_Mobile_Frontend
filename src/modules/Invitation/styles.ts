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
  INV_ACCENT,
  INV_ACCENT_SOFT,
  INV_GREEN,
  INV_GREEN_SOFT,
  INV_BLUSH,
  INV_CREAM,
  INV_GOLD,
  INV_HAIRLINE,
  INV_NAVY,
  INV_NAVY_DEEP,
  INV_PAPER,
} from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  listContent: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: INV_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredTitle: {
    color: INV_NAVY,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  centeredBody: {
    color: textColor.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorText: { color: textColor.textError, textAlign: 'center' },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: INV_ACCENT, ...fontWeights.bold },
});

export const listStyles = StyleSheet.create({
  /** How many of these are actually waiting on the customer. */
  summary: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: 14,
    padding: spacing.md,
  },
  summaryAction: { backgroundColor: INV_ACCENT_SOFT },
  summaryDone: { backgroundColor: INV_GREEN_SOFT },
  summaryText: { flex: 1, color: INV_NAVY, ...fontWeights.bold },

  row: {
    ...globalStyles.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  /** A row that needs a decision is the one worth finding at a glance. */
  rowNeedsYou: { borderColor: INV_ACCENT },
  head: { ...globalStyles.row, gap: spacing.sm },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: INV_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  title: { color: INV_NAVY, ...typography.h3 },
  ref: { color: textColor.textSecondary, marginTop: 1 },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  statusChipAction: { backgroundColor: INV_ACCENT_SOFT },
  statusChipDone: { backgroundColor: INV_GREEN_SOFT },
  statusText: { ...typography.label },

  footer: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  meta: { ...globalStyles.row, gap: spacing.xs },
  metaText: { color: textColor.textSecondary },
  open: { ...globalStyles.row, gap: 2 },
  openText: { color: INV_ACCENT, ...fontWeights.bold },
});

export const heroStyles = StyleSheet.create({
  card: {
    backgroundColor: INV_NAVY_DEEP,
    borderRadius: 20,
    margin: spacing.md,
    padding: spacing.lg,
  },
  eyebrow: {
    color: colors.onPrimaryMuted,
    // 11 with less tracking: this line carries the organizer's name, and in
    // Poppins — wider than the face this was set in — 12/0.8 pushed all but
    // the shortest names past the ellipsis.
    ...typography.label,
  },
  heading: {
    color: textColor.textOnPrimary,
    ...typography.h2,
    marginTop: spacing.sm,
  },
  sub: { color: colors.onPrimaryMuted, marginTop: spacing.xs },

  statusRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: textColor.textOnPrimary, ...fontWeights.bold, flex: 1 },
});

export const actionStyles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.md, gap: spacing.sm },
  primary: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: INV_ACCENT,
  },
  primaryText: { color: textColor.textOnPrimary, ...typography.h3 },
  approvedChip: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: INV_GREEN_SOFT,
  },
  approvedChipText: { color: INV_GREEN, ...fontWeights.bold },
  secondaryRow: { flexDirection: 'row', gap: spacing.sm },
  secondary: {
    ...globalStyles.row,
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: { color: INV_NAVY, ...fontWeights.bold },
  share: { backgroundColor: INV_GREEN, borderColor: INV_GREEN },
  shareText: { color: textColor.textOnPrimary, ...fontWeights.bold },
  errorText: { color: textColor.textError, textAlign: 'center' },
  sentText: { color: INV_GREEN, ...fontWeights.bold, textAlign: 'center' },
});

export const bannerStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderRadius: 14,
    backgroundColor: INV_ACCENT_SOFT,
    padding: spacing.md,
  },
  text: { flex: 1 },
  title: { color: INV_NAVY, ...fontWeights.bold },
  body: { color: textColor.textSecondary, marginTop: 2 },
});

export const sectionStyles = StyleSheet.create({
  header: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  title: { color: INV_NAVY, ...typography.h3 },
  count: { color: textColor.textSecondary },

  row: {
    ...globalStyles.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  rowHidden: { opacity: 0.72 },
  head: { ...globalStyles.row, gap: spacing.sm },
  iconChip: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipCustomer: { backgroundColor: INV_ACCENT_SOFT },
  headText: { flex: 1 },
  rowTitle: { color: INV_NAVY, ...fontWeights.bold },
  ownerBadge: { marginTop: 2 },
  ownerOrganizer: { color: colors.textMuted },
  ownerCustomer: { color: INV_ACCENT, ...fontWeights.bold },
  stateChip: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  stateReady: { backgroundColor: INV_GREEN_SOFT },
  stateHidden: { backgroundColor: colors.surface },
  stateText: { ...typography.label },
  // Padded out to a comfortable tap target; the icon itself is only 18px.
  eyeButton: { padding: spacing.xs, marginLeft: 2 },

  body: { color: textColor.textSecondary, marginTop: spacing.sm },
  pending: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.sm },
  pendingText: { color: colors.accent, flex: 1 },

  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  action: {
    ...globalStyles.row,
    gap: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionPrimary: { borderColor: INV_ACCENT, backgroundColor: INV_ACCENT },
  actionText: { color: INV_NAVY, ...fontWeights.bold },
  actionPrimaryText: { color: textColor.textOnPrimary, ...fontWeights.bold },
});

/** The phone-framed render of what a guest opening the link would see. */
export const previewStyles = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  phone: {
    borderRadius: 30,
    borderWidth: 9,
    borderColor: INV_NAVY_DEEP,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  notch: {
    alignSelf: 'center',
    width: 92,
    height: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: INV_NAVY_DEEP,
    zIndex: 2,
  },
  homeBar: {
    alignSelf: 'center',
    width: 110,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  block: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  blockHead: { ...globalStyles.row, gap: spacing.sm },
  blockTitle: { color: INV_NAVY, ...fontWeights.bold, flex: 1 },
  blockBody: { color: textColor.textSecondary, marginTop: 2 },

  scheduleTitle: {
    color: INV_NAVY,
    ...fontWeights.bold,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  subEvent: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  subEventBar: { width: 3, borderRadius: 2, backgroundColor: INV_ACCENT },
  subEventName: { color: INV_NAVY, ...fontWeights.bold },
  subEventMeta: { color: textColor.textSecondary, marginTop: 1 },

  hiddenNote: {
    color: textColor.textSecondary,
    padding: spacing.md,
    textAlign: 'center',
  },
});

/** The preview sheet's own chrome: a title row, a status line, and one action. */
export const previewSheetStyles = StyleSheet.create({
  head: { ...globalStyles.row, gap: spacing.sm },
  headText: { flex: 1 },
  title: { color: INV_NAVY, ...typography.h2 },
  meta: { ...globalStyles.row, gap: spacing.xs, marginTop: 2 },
  metaText: { color: textColor.textSecondary },
  ownerCustomer: { color: INV_ACCENT, ...fontWeights.bold },
  close: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  share: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: INV_GREEN,
    marginTop: spacing.lg,
  },
  shareText: { color: textColor.textOnPrimary, ...typography.h3 },
  blockedNote: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.lg },
  blockedText: { color: textColor.textSecondary, flex: 1 },
});

export const sheetStyles = StyleSheet.create({
  /* The sheet's head: title and lead on the left, a close control on the right. */
  shareHead: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: spacing.s12,
  },
  shareHeadText: { flex: 1 },
  shareClose: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#efede8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  selectCount: { color: textColor.textSecondary },
  selectAll: { color: INV_ACCENT, ...fontWeights.semibold },

  /* A squircle, matching the guest-list screen's monograms. */
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestAvatarText: { color: textColor.textOnPrimary, ...fontWeights.bold },

  primaryTextDisabled: { color: colors.textMuted },

  manageGuests: { alignItems: 'center', paddingVertical: spacing.s12 },
  manageGuestsText: { color: INV_ACCENT, ...fontWeights.semibold },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: '88%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  title: { color: INV_NAVY, ...typography.h2 },
  subtitle: { color: textColor.textSecondary, marginTop: spacing.xs },

  label: { color: INV_NAVY, ...fontWeights.bold, marginTop: spacing.lg },
  hint: { color: textColor.textSecondary, marginTop: 2 },
  input: {
    borderRadius: 14,
    // A TextInput resolves no face of its own — see Components/EventlyText.
    ...fontWeights.regular,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginTop: spacing.sm,
    color: textColor.textPrimary,
  },
  inputMultiline: { minHeight: 100, textAlignVertical: 'top' },

  toggleRow: { ...globalStyles.row, gap: spacing.sm, marginTop: spacing.lg },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: INV_ACCENT, borderColor: INV_ACCENT },
  toggleLabel: { color: textColor.textPrimary, flex: 1 },

  primary: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: INV_ACCENT,
    marginTop: spacing.lg,
  },
  primaryDisabled: { opacity: 0.45 },
  /*
   * Nothing picked yet. Neutral rather than a faded accent: a washed-out
   * orange bar still reads as the primary action and invites the tap it will
   * refuse, where a grey one reads as a step that is not ready.
   */
  primaryInert: { backgroundColor: '#e7e3da', opacity: 1 },
  primaryText: { color: textColor.textOnPrimary, ...typography.h3 },
  secondary: {
    ...globalStyles.row,
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  secondaryText: { color: INV_NAVY, ...fontWeights.bold },
  errorText: { color: textColor.textError, marginTop: spacing.sm },
  caveat: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.md },
  caveatText: { color: textColor.textSecondary, flex: 1 },

  // Guest list.
  /* A card each, not hairline-separated rows: every row here is a tap target
     with a checkbox, and a bordered card is what says so before it is read. */
  guestRow: {
    ...globalStyles.row,
    gap: spacing.s12,
    padding: spacing.s12,
    marginBottom: spacing.sm,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestText: { flex: 1 },
  guestName: { color: INV_NAVY, ...fontWeights.bold },
  guestMeta: { color: textColor.textSecondary, marginTop: 1 },
  guestSent: { color: INV_GREEN, ...fontWeights.bold },
  emptyGuests: { color: colors.textMuted, marginTop: spacing.md },
  guestsLoading: { marginTop: spacing.md },

  outcomeRow: { ...globalStyles.row, gap: spacing.sm, marginTop: spacing.sm },
  outcomeText: { flex: 1, color: textColor.textPrimary },
  outcomeLink: { color: INV_ACCENT, ...fontWeights.bold },
});

/* ---------------------------------------------------------------------------
 * The invitation screen's own chrome: one bar at the top saying what this is
 * and how much of it is waiting, a three-way switch under it, and one action
 * pinned to the bottom.
 *
 * The screen used to open with a stack of six buttons — approve, preview,
 * request changes, share, guest list — above the sections they act on. The
 * switch replaces them: the three things a customer does here are read it,
 * approve it, and see what a guest will see, and each is a view rather than a
 * button.
 * ------------------------------------------------------------------------- */
/**
 * The rows behind the invitation's menu.
 *
 * All that is left of the screen's own chrome: the cover carries the back
 * arrow and the menu itself, so there is no bar, no tab strip and no footer
 * for these to belong to any more.
 */
export const shellStyles = StyleSheet.create({
  /* The screen's own row: the arrow, the name, and the menu. No band behind
     it — the list under it is the screen, and a coloured bar over a list is
     chrome for its own sake. */
  bar: {
    ...globalStyles.row,
    gap: 4,
    paddingLeft: 4,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: INV_HAIRLINE,
  },
  back: { padding: 8 },
  barTitle: {
    flex: 1,
    color: INV_NAVY_DEEP,
    ...typography.h3,
  },
  barAction: { paddingHorizontal: 8, paddingVertical: 6 },
  barActionText: { color: INV_ACCENT, ...typography.label },

  menuRow: {
    ...globalStyles.row,
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    padding: 14,
    marginTop: 10,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: INV_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1 },
  menuLabel: {
    color: INV_NAVY_DEEP,
    ...typography.label,
  },
  menuNote: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 1,
  },

  /* One action, always in the same place, whichever view is on screen. */
});

/** One section, as the Approve pass reads it. */
export const approveStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    marginHorizontal: spacing.md,
    marginTop: 10,
    padding: 14,
  },
  cardTitle: {
    color: INV_NAVY,
    ...typography.body,
    ...fontWeights.semibold,
    flexShrink: 1,
  },
  head: { ...globalStyles.row, gap: 8, marginBottom: 6 },
  waiting: {
    color: INV_ACCENT,
    ...typography.label,
    marginLeft: 'auto',
  },
  approvedChip: { ...globalStyles.row, gap: 5, marginLeft: 'auto' },
  approvedText: {
    color: INV_GREEN,
    ...typography.label,
  },
  eyebrow: {
    color: INV_ACCENT,
    ...typography.label,
  },
  body: { color: INV_NAVY, ...typography.body, marginTop: 6 },
  bodyEmpty: { color: colors.textMuted, fontStyle: 'italic' },
  actions: { ...globalStyles.row, gap: 8, marginTop: 12 },
  accept: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 6,
    flex: 1,
    borderRadius: 12,
    backgroundColor: INV_NAVY_DEEP,
    paddingVertical: 11,
  },
  acceptText: {
    color: textColor.textOnPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  ask: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 6,
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    paddingVertical: 11,
  },
  askText: {
    color: INV_NAVY,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  share: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: INV_ACCENT,
    paddingVertical: 12,
    marginTop: 12,
  },
  shareText: {
    color: textColor.textOnPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  /* One tap for the lot, at the foot of the pass. */
  all: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: INV_NAVY_DEEP,
    paddingVertical: 14,
    marginTop: 16,
  },
  allBusy: { opacity: 0.6 },
  allText: {
    color: textColor.textOnPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },
});

/* ---------------------------------------------------------------------------
 * The overview: one card, one line, one path, one button, one list.
 *
 * The screen answers five questions in the order they get asked — what is my
 * invitation, what will my guests see, is it ready, what do I do next, what is
 * in it — and nothing on it exists for any other reason.
 * ------------------------------------------------------------------------- */
export const overviewStyles = StyleSheet.create({
  /* The card is the subject of the screen, not an illustration on it. */
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    marginTop: 14,
    minHeight: 300,
    justifyContent: 'flex-end',
  },
  cardArt: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  cardArtwork: {
    position: 'absolute',
    top: 14,
    right: -12,
    width: 168,
    height: 150,
    opacity: 0.9,
  },
  cardBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: 96,
    paddingBottom: 22,
    alignItems: 'center',
  },
  cardEyebrow: {
    color: INV_ACCENT,
    ...typography.label,
    textAlign: 'center',
  },
  cardTitle: {
    color: textColor.textOnPrimary,
    ...typography.h1,
    textAlign: 'center',
    marginTop: 8,
  },
  cardDiamond: {
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: INV_ACCENT,
    transform: [{ rotate: '45deg' }],
    marginTop: 14,
  },
  cardLine: {
    color: textColor.textOnPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
    textAlign: 'center',
    marginTop: 14,
  },
  cardVenue: {
    color: 'rgba(255,255,255,0.78)',
    ...typography.caption,
    textAlign: 'center',
    marginTop: 3,
  },
  /* The card's own affordance: it is a door, not a picture. */
  cardOpen: {
    ...globalStyles.row,
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 18,
  },
  cardOpenText: { color: textColor.textOnPrimary, ...typography.label },

  /* The one thing to do next. */
  cta: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: INV_ACCENT,
    paddingVertical: 13,
    marginHorizontal: spacing.md,
    marginTop: 16,
  },
  ctaApprove: { backgroundColor: INV_NAVY_DEEP },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: textColor.textOnPrimary, ...typography.buttonSmall },
  ctaNote: {
    color: textColor.textSecondary,
    ...typography.buttonSmall,
    textAlign: 'center',
    marginTop: 7,
    paddingHorizontal: spacing.lg,
  },

  /* What is in it — a contents page, not ten cards. */
  inside: { marginTop: 22, paddingHorizontal: spacing.md },
  insideHead: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  insideTitle: {
    color: INV_NAVY_DEEP,
    ...typography.h3,
  },
  insideCount: { color: textColor.textSecondary, ...typography.caption },
  /* One card holding the rows, rather than rows floating on the page: it is a
     contents page, and a contents page is a block, not a settings screen. */
  insideCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  insideRow: {
    ...globalStyles.row,
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  insideRowRuled: { borderTopWidth: 1, borderTopColor: INV_HAIRLINE },
  /* A tinted glyph reads at a glance where a row of identical words does not. */
  insideIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: INV_PAPER,
  },
  insideIconWritten: { backgroundColor: '#eef1f7' },
  insideIconApproved: { backgroundColor: INV_GREEN_SOFT },
  insideIconYours: { backgroundColor: INV_ACCENT_SOFT },
  insideName: {
    flex: 1,
    color: INV_NAVY_DEEP,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  insideState: {
    color: textColor.textSecondary,
    ...typography.caption,
    flexShrink: 0,
  },
  insideStateYours: { color: INV_ACCENT, ...fontWeights.bold },
  insideStateApproved: { color: INV_GREEN, ...fontWeights.semibold },
});

/**
 * The cover, as a guest receives it.
 *
 * One stack of layers — theme, pattern, media, scrim, words — so the same
 * component draws the card on the overview and the full-bleed cover in the
 * guest view, at two heights rather than in two implementations.
 */
export const coverStyles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    marginTop: 14,
    minHeight: 340,
    justifyContent: 'flex-end',
  },
  /** The guest's own view: edge to edge, no corners, taller. */
  full: {
    borderRadius: 0,
    marginHorizontal: 0,
    marginTop: 0,
    minHeight: 460,
  },
  layer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  /*
   * The theme's own pattern, shown when there is no photograph. A stock image
   * of somebody else's wedding would be a lie about this event, so the empty
   * state is the occasion's own artwork over the chosen palette.
   */
  pattern: {
    position: 'absolute',
    top: 8,
    right: -18,
    width: 176,
    height: 158,
    opacity: 0.6,
  },
  patternEcho: {
    position: 'absolute',
    bottom: -18,
    left: -30,
    width: 140,
    height: 126,
    opacity: 0.22,
    transform: [{ scaleX: -1 }],
  },
  media: { width: '100%', height: '100%' },

  /* Photographs are unpredictable; the words on top are not optional. */
  scrim: { backgroundColor: 'rgba(8,12,24,0.42)' },
  scrimStrong: { backgroundColor: 'rgba(8,12,24,0.58)' },

  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: 78,
    paddingBottom: 22,
    alignItems: 'center',
  },
  eyebrow: {
    ...typography.label,
    textAlign: 'center',
  },
  names: {
    color: textColor.textOnPrimary,
    ...typography.h1,
    textAlign: 'center',
    marginTop: 10,
  },
  diamond: {
    width: 7,
    height: 7,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    marginTop: 16,
  },
  when: {
    color: textColor.textOnPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
    textAlign: 'center',
    marginTop: 14,
  },
  venue: {
    color: 'rgba(255,255,255,0.8)',
    ...typography.caption,
    textAlign: 'center',
    marginTop: 4,
  },
  message: {
    color: 'rgba(255,255,255,0.92)',
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: spacing.sm,
  },
  /* In the guest view there is nothing to tap, only more to read. */
  scroll: { alignItems: 'center', gap: 2, marginTop: 20 },
  scrollText: {
    color: 'rgba(255,255,255,0.72)',
    ...typography.label,
  },
  /* Said only in the editor, never over a guest's cover. */
  note: {
    color: 'rgba(255,255,255,0.78)',
    ...typography.caption,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: spacing.sm,
  },
});

/** The cover editor: a live cover on top, the fields that change it below. */
export const coverEditorStyles = StyleSheet.create({
  head: { ...globalStyles.row, alignItems: 'flex-start', gap: spacing.s12 },
  headText: { flex: 1 },
  title: {
    color: INV_NAVY_DEEP,
    ...typography.h3,
  },
  sub: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 2,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#efede8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  preview: { marginTop: spacing.md, marginBottom: spacing.sm },

  group: { marginTop: spacing.md },
  groupTitle: {
    color: INV_NAVY_DEEP,
    ...typography.bodySmall,
    ...fontWeights.semibold,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  label: {
    color: textColor.textSecondary,
    ...typography.label,
    marginBottom: 4,
  },
  field: {
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: textColor.textPrimary,
    ...typography.body,
  },
  fieldMulti: { minHeight: 76, textAlignVertical: 'top' },
  row: { ...globalStyles.row, gap: spacing.sm },
  half: { flex: 1 },
  /** One field under another, rather than beside it. */
  gap: { marginTop: 8 },
  /* The counter the server's own cap drives — never a second number. */
  counter: {
    color: textColor.textSecondary,
    ...typography.caption,
    textAlign: 'right',
    marginTop: 4,
  },
  counterFull: { color: INV_ACCENT, ...fontWeights.bold },

  /* Media */
  mediaRow: { ...globalStyles.row, gap: spacing.sm, marginTop: 4 },
  mediaButton: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 6,
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    backgroundColor: INV_PAPER,
    paddingVertical: 11,
  },
  mediaButtonText: { color: INV_NAVY_DEEP, ...typography.buttonSmall },
  mediaState: { ...globalStyles.row, gap: 6, marginTop: 8 },
  mediaStateText: {
    flex: 1,
    color: textColor.textSecondary,
    ...typography.caption,
  },
  mediaRemove: { color: INV_ACCENT, ...typography.label },

  /* Theme and lettering: swatches and words, not a dropdown of ids. */
  swatches: { ...globalStyles.row, flexWrap: 'wrap', gap: spacing.sm },
  swatch: {
    width: 64,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchOn: { borderColor: INV_ACCENT },
  swatchArt: { height: 44, borderRadius: 9, overflow: 'hidden' },
  swatchLabel: {
    color: textColor.textSecondary,
    ...typography.label,
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 2,
  },
  swatchLabelOn: { color: INV_ACCENT, ...fontWeights.bold },

  fontChip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  fontChipOn: { borderColor: INV_ACCENT, backgroundColor: INV_ACCENT_SOFT },
  fontChipText: { color: INV_NAVY_DEEP, ...typography.body },
  fontChipNote: {
    color: textColor.textSecondary,
    ...typography.label,
    marginTop: 1,
  },

  errorText: {
    color: textColor.textError,
    ...typography.caption,
    marginTop: spacing.sm,
  },
  savedText: {
    color: INV_GREEN,
    ...typography.label,
    marginTop: spacing.sm,
  },
  save: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: INV_ACCENT,
    paddingVertical: 15,
    marginTop: spacing.md,
  },
  saveDisabled: { opacity: 0.45 },
  saveText: { color: textColor.textOnPrimary, ...typography.h3 },
});

/**
 * The invitation the organizer uploaded.
 *
 * The screen is the artwork and two decisions about it, so the styles here are
 * a frame, a way to open it, and the words under it — there is no builder to
 * dress.
 */
export const artworkStyles = StyleSheet.create({
  block: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  /*
   * Small on the page, full size on a tap.
   *
   * The invitation is portrait and tall; at full width it pushed the approval
   * — the one thing this screen is for — below the fold. A thumbnail says
   * which invitation this is, and opening it is one tap away.
   *
   * Dark, because an invitation with a white border has to read as a card
   * rather than bleed into the page behind it.
   */
  /* Sized in code to the artwork's own shape — see InvitationArtwork. */
  frame: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: INV_NAVY_DEEP,
    ...Platform.select({
      ios: {
        shadowColor: '#1a1f3d',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 6 },
    }),
  },
  kindChip: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(10,8,30,0.55)',
  },
  kindChipText: { color: textColor.textOnPrimary, ...typography.label },
  expandChip: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 999,
    backgroundColor: 'rgba(10,8,30,0.55)',
  },
  expandChipText: { color: textColor.textOnPrimary, ...typography.label },
  media: { width: '100%', height: '100%' },
  unplayable: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
  },
  unplayableText: {
    color: colors.onPrimaryMuted,
    ...typography.caption,
    textAlign: 'center',
  },

  view: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 10,
  },
  viewText: {
    color: INV_ACCENT,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },

  /* Full screen: the invitation, and a way out. */
  viewer: { flex: 1, backgroundColor: '#05070d', justifyContent: 'center' },
  viewerMedia: { width: '100%', height: '100%' },
  viewerClose: {
    position: 'absolute',
    top: 44,
    right: 12,
    padding: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  /* Where it stands, said once — tinted by stage in code. */
  statusCard: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 12,
    marginHorizontal: spacing.md,
    marginTop: 22,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: spacing.md,
    marginTop: 22,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: INV_ACCENT,
    marginTop: 5,
  },
  statusDotDone: { backgroundColor: INV_GREEN },
  statusText: { flex: 1 },
  statusTitle: {
    color: INV_NAVY_DEEP,
    ...typography.h3,
  },
  statusTitleDone: { color: INV_GREEN },
  statusNote: {
    color: textColor.textSecondary,
    ...typography.label,
    marginTop: 1,
  },

  actions: { paddingHorizontal: spacing.md, marginTop: spacing.md },
  approve: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: INV_ACCENT,
    minHeight: 54,
    paddingVertical: 14,
  },
  approveDisabled: { opacity: 0.45 },
  approveText: { color: textColor.textOnPrimary, ...typography.h3 },
  share: { backgroundColor: INV_GREEN },
  ask: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    paddingVertical: 13,
    marginTop: spacing.sm,
  },
  askText: {
    color: INV_NAVY_DEEP,
    ...typography.body,
    ...fontWeights.semibold,
  },
  askNote: {
    color: textColor.textSecondary,
    ...typography.caption,
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    color: textColor.textError,
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  sentText: {
    color: INV_GREEN,
    ...typography.label,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  /* Nothing uploaded yet. */
  pending: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
  },
  pendingIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: INV_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingTitle: {
    color: INV_NAVY_DEEP,
    ...typography.h2,
    marginTop: spacing.md,
  },
  pendingBody: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: 6,
  },
});

/**
 * The story, told in photographs.
 *
 * Quiet on purpose: the section's whole subject is somebody's photographs, and
 * it should not compete with them.
 */
export const storyStyles = StyleSheet.create({
  block: { marginTop: 28 },
  title: {
    color: INV_NAVY_DEEP,
    ...typography.overline,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: spacing.md,
  },
  track: { paddingHorizontal: spacing.md },
  /* Width comes from the component, which measures the window; stating it
     twice is how a snap interval and a card stop agreeing. */
  cardGap: { marginRight: 14 },
  frame: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e9e5df',
  },
  photo: { width: '100%', height: '100%' },
  caption: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 2,
  },

  /* Where they are in the story. */
  progress: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  dots: { ...globalStyles.row, gap: 6 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(26,46,90,0.22)',
  },
  dotOn: { width: 20, backgroundColor: INV_ACCENT },
  count: {
    color: textColor.textSecondary,
    ...typography.label,
  },
});

/**
 * The countdown, as a card from the invitation rather than a widget.
 *
 * The same shape the guest gets on the web — a ruled flourish, the event in
 * serif, four blush figures and the details under an ornament — drawn from
 * this app's own tokens so it belongs to the screen around it.
 */
export const countdownStyles = StyleSheet.create({
  block: {
    marginTop: 28,
    marginHorizontal: spacing.md,
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 22,
    borderRadius: 20,
    backgroundColor: INV_CREAM,
    alignItems: 'center',
  },

  flourish: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  rule: { width: 46, height: 1, backgroundColor: INV_GOLD, opacity: 0.45 },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: INV_GOLD,
    transform: [{ rotate: '45deg' }],
  },

  eyebrow: {
    color: textColor.textSecondary,
    ...typography.label,
    textAlign: 'center',
  },
  title: {
    color: INV_NAVY_DEEP,
    ...typography.h1,
    textAlign: 'center',
    marginTop: 5,
  },

  /* ---- the timer ---- */
  row: {
    ...globalStyles.row,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  unit: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(176,133,43,0.14)',
    backgroundColor: INV_BLUSH,
  },
  value: {
    color: INV_NAVY_DEEP,
    ...typography.h1,
    /* Tabular figures, so the seconds do not shuffle the row every tick. */
    fontVariant: ['tabular-nums'],
  },
  unitLabel: {
    color: textColor.textSecondary,
    ...typography.overline,
    marginTop: 3,
  },
  /* The gold bead between the figures; it carries the row's spacing too. */
  dot: {
    width: 3,
    height: 3,
    borderRadius: 999,
    marginHorizontal: 4,
    backgroundColor: INV_GOLD,
    opacity: 0.55,
  },

  /* ---- after the day ---- */
  afterWrap: { alignItems: 'center', marginTop: 22 },
  afterHead: {
    color: INV_NAVY_DEEP,
    ...typography.h2,
    textAlign: 'center',
    marginTop: 8,
  },
  afterBody: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: 4,
  },

  /* ---- the details ---- */
  divider: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 12,
    marginTop: 22,
    marginBottom: 14,
  },
  rings: { flexDirection: 'row' },
  ring: {
    width: 13,
    height: 13,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: INV_GOLD,
  },
  ringOverlap: { marginLeft: -5 },
  fact: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 4,
  },
  factText: {
    flexShrink: 1,
    color: textColor.textPrimary,
    ...typography.bodySmall,
    textAlign: 'center',
  },
});

/**
 * Save the Date — one card per celebration.
 *
 * Each card carries its own colour as a mark down the edge and an accent on
 * the name, rather than a fill: four celebrations read as one invitation
 * rather than four coloured tiles.
 */
export const saveTheDateStyles = StyleSheet.create({
  block: { marginTop: 30, alignItems: 'center' },

  flourish: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  rule: { width: 46, height: 1, backgroundColor: INV_GOLD, opacity: 0.45 },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: INV_GOLD,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    color: textColor.textSecondary,
    ...typography.label,
    textAlign: 'center',
  },
  lead: {
    color: INV_NAVY_DEEP,
    ...typography.h2,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: spacing.lg,
  },

  card: {
    alignSelf: 'stretch',
    marginHorizontal: spacing.md,
    marginTop: 16,
    paddingVertical: 18,
    paddingLeft: 20,
    paddingRight: 18,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  /* The celebration's colour, as a mark down the edge. */
  edge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
    opacity: 0.55,
  },

  name: { ...typography.h2, marginBottom: 10 },

  fact: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 7,
  },
  factText: { flex: 1 },
  factLabel: {
    color: textColor.textSecondary,
    ...typography.overline,
  },
  factValue: { color: textColor.textPrimary, ...typography.bodySmall },
  factStrong: { color: INV_NAVY_DEEP, ...fontWeights.semibold },
  factSub: { color: textColor.textSecondary, ...typography.caption },

  hair: { width: 44, height: 1, opacity: 0.25, marginVertical: 11 },

  note: {
    ...typography.bodySmall,
    fontStyle: 'italic',
    marginTop: 11,
    opacity: 0.9,
  },

  /* The one action, at a comfortable one-handed size. */
  add: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    minHeight: 46,
    borderRadius: 13,
    paddingVertical: 12,
    marginTop: 16,
  },
  addOff: { opacity: 0.45 },
  addText: {
    color: textColor.textOnPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },
  noDate: {
    color: textColor.textSecondary,
    ...typography.caption,
    textAlign: 'center',
    marginTop: 7,
  },
});

/* ---------- F5: the live stream ---------- */

/*
 * The same paper as the countdown and the Save-the-Date cards: the app's
 * cream, its gold rule, its blush. The one thing that is not the invitation's
 * own voice is the LIVE badge, which is the brand's coral — a live indicator
 * that is not red is not read as one.
 */
export const liveStyles = StyleSheet.create({
  block: {
    position: 'relative',
    overflow: 'hidden',
    marginTop: 28,
    marginHorizontal: spacing.md,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    borderRadius: 20,
    backgroundColor: INV_CREAM,
  },
  /* The blossom at two corners, behind the words. `pointerEvents` none so it
     never takes a tap meant for Watch Live. */
  bloomTop: { position: 'absolute', top: -14, right: -12 },
  bloomBottom: { position: 'absolute', bottom: -10, left: -14 },

  head: {
    ...globalStyles.row,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  /* The platform serif, the same way the invitation's own font styles reach
     for one — Poppins is the only family bundled, and a wedding card is not
     set in a UI sans. */
  heading: {
    color: INV_NAVY_DEEP,
    ...typography.h2,
  },

  state: { ...globalStyles.row, alignItems: 'center', gap: 10, marginTop: 12 },
  badge: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    /* The invitation's own accent, not the app's indigo primary: this card
       sits under a coral Approve button on the same screen. */
    backgroundColor: INV_ACCENT,
  },
  pulse: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.onPrimary,
  },
  badgeText: {
    color: textColor.textOnPrimary,
    ...typography.label,
  },

  name: {
    color: INV_NAVY_DEEP,
    ...typography.h1,
    marginTop: 10,
  },
  lead: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 3,
  },

  /* Standard / 360° / VR. */
  modes: { ...globalStyles.row, gap: 8, marginTop: 14, flexWrap: 'wrap' },
  mode: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(176,133,43,0.22)',
    backgroundColor: '#fff',
  },
  modeOn: { borderColor: 'transparent', backgroundColor: INV_ACCENT },
  modeText: {
    color: textColor.textPrimary,
    ...typography.label,
  },
  modeTextOn: { color: colors.onPrimary },

  /* The player: 16:9, clipped to the card's idiom, on near-black so a frame
     that has not loaded yet reads as a player rather than a hole. */
  player: {
    marginTop: 14,
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    backgroundColor: '#0f1116',
  },
  playerFrame: { flex: 1, backgroundColor: 'transparent' },

  watch: {
    ...globalStyles.row,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: INV_ACCENT,
  },
  watchText: {
    color: textColor.textOnPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },
  opens: {
    color: textColor.textSecondary,
    ...typography.caption,
    textAlign: 'center',
    marginTop: 7,
  },

  details: {
    position: 'relative',
    overflow: 'hidden',
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(176,133,43,0.16)',
    /* Paper, not the app's grey surface — it is a card inside a card. */
    backgroundColor: INV_PAPER,
  },
  detailsBloom: { position: 'absolute', top: -12, right: -10 },
  detailsHead: {
    color: INV_NAVY_DEEP,
    ...typography.h3,
    marginBottom: 12,
  },
  fact: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  /* A tile rather than a bare glyph, so the rows read as a column of marks. */
  factTile: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: INV_BLUSH,
  },
  factBody: { flex: 1 },
  factLabel: {
    color: textColor.textSecondary,
    ...typography.overline,
  },
  factText: { color: textColor.textPrimary, ...typography.bodySmall },
});

/* ---------- F6: Shared Memories ---------- */

/*
 * The same cream card, gold hairlines and coral accent as the rest of the
 * invitation. A gallery is the section most likely to drift into looking like
 * a social app, so it is deliberately held to the invitation's own voice.
 */
export const memoriesStyles = StyleSheet.create({
  block: {
    position: 'relative',
    overflow: 'hidden',
    marginTop: 28,
    marginHorizontal: spacing.md,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    borderRadius: 20,
    backgroundColor: INV_CREAM,
  },
  bloom: { position: 'absolute', top: -14, right: -12 },

  head: {
    ...globalStyles.row,
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  heading: {
    color: INV_NAVY_DEEP,
    ...typography.h2,
  },
  tally: { color: textColor.textSecondary, ...typography.caption },
  lead: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 4,
  },

  /* Both filter rows scroll rather than wrap: a wedding has four or five
     celebrations and a phone is 360px wide. */
  tabs: { marginTop: 14 },
  tabsRow: { ...globalStyles.row, gap: 8, paddingRight: 16 },
  tab: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(176,133,43,0.22)',
    backgroundColor: '#fff',
  },
  tabOn: { borderColor: 'transparent', backgroundColor: INV_ACCENT },
  tabText: {
    color: textColor.textPrimary,
    ...typography.label,
  },
  tabTextOn: { color: colors.onPrimary },
  filters: { marginTop: 8 },
  filter: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#fff',
  },
  filterOn: { borderColor: 'rgba(176,133,43,0.35)' },
  filterText: { color: textColor.textSecondary, ...typography.label },
  filterTextOn: { color: INV_NAVY_DEEP },

  /* Two columns, square cells — the grid is a grid before a single image has
     loaded, so nothing reflows under the reader as they arrive. */
  grid: { ...globalStyles.row, flexWrap: 'wrap', gap: 8, marginTop: 14 },
  cell: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: INV_BLUSH,
  },
  cellImage: { width: '100%', height: '100%' },
  play: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reelMark: {
    position: 'absolute',
    left: 7,
    top: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(15,17,22,0.6)',
  },
  reelText: { color: textColor.textOnPrimary, ...typography.label },
  length: {
    position: 'absolute',
    right: 7,
    bottom: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(15,17,22,0.66)',
  },
  lengthText: { color: textColor.textOnPrimary, ...typography.caption },
  cellNote: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 6,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,253,250,0.94)',
  },
  cellNoteText: { color: textColor.textPrimary, ...typography.caption },

  empty: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: 18,
  },
  more: {
    marginTop: 12,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(176,133,43,0.25)',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  moreText: { color: INV_NAVY_DEEP, ...typography.label },

  /* The floating action, inside the card rather than over the whole screen —
     the invitation is one long scroll and a screen-level button would sit on
     top of the countdown and the story too. */
  add: {
    ...globalStyles.row,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: INV_ACCENT,
  },
  addText: {
    color: textColor.textOnPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },
  say: {
    marginTop: 10,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  sayWarn: { backgroundColor: '#fff7f3' },
  sayText: { color: textColor.textPrimary, ...typography.caption },
  sayTextWarn: { color: INV_ACCENT },

  /* ---- the sheets ---- */
  sheetTitle: {
    color: INV_NAVY_DEEP,
    ...typography.h3,
    marginBottom: 4,
  },
  sheetLead: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginBottom: 14,
  },
  option: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    marginBottom: 8,
  },
  optionMark: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: INV_BLUSH,
  },
  optionText: { flex: 1 },
  optionName: {
    color: INV_NAVY_DEEP,
    ...typography.body,
    ...fontWeights.semibold,
  },
  optionNote: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 1,
  },

  preview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#0f1116',
    marginBottom: 12,
  },
  fieldLabel: {
    color: textColor.textSecondary,
    ...typography.overline,
    marginBottom: 6,
  },
  eventRow: { ...globalStyles.row, gap: 8, flexWrap: 'wrap', marginBottom: 14 },
  captionInput: {
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 64,
    color: textColor.textPrimary,
    ...inputTypography.body,
    textAlignVertical: 'top',
  },
  counter: {
    color: textColor.textSecondary,
    ...typography.caption,
    textAlign: 'right',
    marginTop: 4,
  },
  counterOver: { color: INV_ACCENT },

  /* A bar rather than a spinner: an upload has a length, and saying so is the
     difference between waiting and wondering. */
  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: INV_HAIRLINE,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: { height: 5, borderRadius: 999, backgroundColor: INV_ACCENT },

  sheetActions: { ...globalStyles.row, gap: 8, marginTop: 14 },
  sheetGhost: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    alignItems: 'center',
  },
  sheetGhostText: {
    color: INV_NAVY_DEEP,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  sheetPrimary: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: INV_ACCENT,
    alignItems: 'center',
  },
  sheetPrimaryText: {
    color: textColor.textOnPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },

  /* ---- the viewer ---- */
  viewerBar: {
    ...globalStyles.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  viewerCaption: {
    flex: 1,
    color: textColor.textOnPrimary,
    ...typography.bodySmall,
    textAlign: 'center',
  },
  viewerPill: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  viewerPillText: { color: textColor.textOnPrimary, ...typography.label },
});

/* Invitation · Live stream · Memories, and the note that ties them to one link. */
export const switchStyles = StyleSheet.create({
  row: {
    ...globalStyles.row,
    gap: 6,
    marginHorizontal: spacing.md,
    marginTop: 4,
    marginBottom: 6,
    padding: 4,
    borderRadius: 999,
    backgroundColor: '#f4f1fa',
  },
  tab: {
    flex: 1,
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 5,
    minHeight: 38,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 6,
  },
  tabActive: {
    ...Platform.select({
      ios: {
        shadowColor: '#e2477a',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 3 },
    }),
  },
  label: { color: textColor.textSecondary, ...typography.label },
  labelActive: { color: '#ffffff' },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#e8433a' },
  liveDotActive: { backgroundColor: '#ffffff' },

  note: {
    ...globalStyles.row,
    alignItems: 'flex-start',
    gap: 12,
    marginHorizontal: spacing.md,
    marginTop: 18,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e3dafb',
    backgroundColor: '#f8f5ff',
  },
  noteIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ece5ff',
  },
  noteText: { flex: 1 },
  noteTitle: { color: INV_NAVY_DEEP, ...typography.body },
  noteBody: { color: textColor.textSecondary, marginTop: 3 },
  noteButton: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bfe8d0',
    backgroundColor: '#ffffff',
  },
  noteButtonText: { color: '#128c4a', ...fontWeights.semibold },

  empty: {
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: 18,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    backgroundColor: colors.background,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0f3',
    marginBottom: 12,
  },
  emptyTitle: { ...typography.h2, color: INV_NAVY_DEEP, textAlign: 'center' },
  emptyBody: {
    ...typography.body,
    color: textColor.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
});

/* The next-step card and the moment strip above the invitation. */
export const nextStepStyles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginTop: 20,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: colors.background,
    ...Platform.select({
      ios: {
        shadowColor: '#1b1438',
        shadowOpacity: 0.07,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
    }),
  },
  head: { ...globalStyles.row, alignItems: 'center', gap: 12, padding: 14 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1 },
  title: { ...typography.bodyLarge },
  note: { color: textColor.textSecondary, marginTop: 2 },
  body: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 6 },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: '#f0b35a',
    backgroundColor: '#fffaf1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  quoteLabel: { color: '#a8540a', ...fontWeights.semibold },
  quoteText: { color: INV_NAVY_DEEP, marginTop: 3 },
  progress: { marginBottom: 14 },
  progressRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  progressText: { color: INV_NAVY_DEEP, ...fontWeights.semibold },
  progressSub: { color: textColor.textSecondary },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e8f4ee',
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: 3, backgroundColor: '#1fae63' },
  primary: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
    borderRadius: 999,
    overflow: 'hidden',
  },
  primaryBusy: { opacity: 0.75 },
  primaryText: { color: textColor.textOnPrimary, ...typography.bodyLarge },
  link: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  linkText: { color: textColor.textSecondary, ...typography.buttonSmall },
  error: { color: textColor.textError, textAlign: 'center', marginBottom: 8 },
  sent: { color: '#0e8a68', textAlign: 'center', marginBottom: 8 },

  strip: {
    ...globalStyles.row,
    gap: 8,
    marginHorizontal: spacing.md,
    marginTop: 8,
    marginBottom: 4,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },
  stripDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  stripText: {
    flex: 1,
    color: textColor.textOnPrimary,
    ...typography.bodySmall,
  },
});
