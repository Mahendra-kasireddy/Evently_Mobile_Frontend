import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, fontFor, spacing } from '../../theme';
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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: INV_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredTitle: { color: INV_NAVY, marginTop: spacing.md, textAlign: 'center' },
  centeredBody: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
  errorText: { color: colors.danger, textAlign: 'center' },
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
  retryText: { color: INV_ACCENT, fontWeight: '700' },
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
  summaryText: { flex: 1, color: INV_NAVY, fontWeight: '700' },

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
  title: { color: INV_NAVY, fontSize: 16, fontWeight: '700' },
  ref: { color: colors.textMuted, marginTop: 1, letterSpacing: 0.4 },
  statusChip: { borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  statusChipAction: { backgroundColor: INV_ACCENT_SOFT },
  statusChipDone: { backgroundColor: INV_GREEN_SOFT },
  statusText: { fontWeight: '700', fontSize: 11 },

  footer: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  meta: { ...globalStyles.row, gap: spacing.xs },
  metaText: { color: colors.textMuted },
  open: { ...globalStyles.row, gap: 2 },
  openText: { color: INV_ACCENT, fontWeight: '700' },
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
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  heading: { color: colors.onPrimary, fontSize: 22, fontWeight: '700', marginTop: spacing.sm },
  sub: { color: colors.onPrimaryMuted, marginTop: spacing.xs, lineHeight: 20 },

  statusRow: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: colors.onPrimary, fontWeight: '700', flex: 1 },
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
  primaryText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  approvedChip: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: INV_GREEN_SOFT,
  },
  approvedChipText: { color: INV_GREEN, fontWeight: '700' },
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
  secondaryText: { color: INV_NAVY, fontWeight: '700' },
  share: { backgroundColor: INV_GREEN, borderColor: INV_GREEN },
  shareText: { color: colors.onPrimary, fontWeight: '700' },
  errorText: { color: colors.danger, textAlign: 'center' },
  sentText: { color: INV_GREEN, fontWeight: '700', textAlign: 'center' },
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
  title: { color: INV_NAVY, fontWeight: '700' },
  body: { color: colors.textMuted, marginTop: 2, lineHeight: 19 },
});

export const sectionStyles = StyleSheet.create({
  header: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  title: { color: INV_NAVY, fontSize: 17, fontWeight: '700' },
  count: { color: colors.textMuted },

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
  rowTitle: { color: INV_NAVY, fontWeight: '700' },
  ownerBadge: { marginTop: 2 },
  ownerOrganizer: { color: colors.textMuted },
  ownerCustomer: { color: INV_ACCENT, fontWeight: '700' },
  stateChip: { borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  stateReady: { backgroundColor: INV_GREEN_SOFT },
  stateHidden: { backgroundColor: colors.surface },
  stateText: { fontWeight: '700', fontSize: 11 },
  // Padded out to a comfortable tap target; the icon itself is only 18px.
  eyeButton: { padding: spacing.xs, marginLeft: 2 },

  body: { color: colors.textMuted, marginTop: spacing.sm, lineHeight: 19 },
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
  actionText: { color: INV_NAVY, fontWeight: '700' },
  actionPrimaryText: { color: colors.onPrimary, fontWeight: '700' },
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
  blockTitle: { color: INV_NAVY, fontWeight: '700', flex: 1 },
  blockBody: { color: colors.textMuted, marginTop: 2, lineHeight: 19 },

  scheduleTitle: { color: INV_NAVY, fontWeight: '700', paddingHorizontal: spacing.md, paddingTop: spacing.md },
  subEvent: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  subEventBar: { width: 3, borderRadius: 2, backgroundColor: INV_ACCENT },
  subEventName: { color: INV_NAVY, fontWeight: '700' },
  subEventMeta: { color: colors.textMuted, marginTop: 1 },

  hiddenNote: { color: colors.textMuted, padding: spacing.md, textAlign: 'center', lineHeight: 19 },
});

/** The preview sheet's own chrome: a title row, a status line, and one action. */
export const previewSheetStyles = StyleSheet.create({
  head: { ...globalStyles.row, gap: spacing.sm },
  headText: { flex: 1 },
  title: { color: INV_NAVY, fontSize: 19, fontWeight: '700' },
  meta: { ...globalStyles.row, gap: spacing.xs, marginTop: 2 },
  metaText: { color: colors.textMuted },
  ownerCustomer: { color: INV_ACCENT, fontWeight: '700' },
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
  shareText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  blockedNote: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.lg },
  blockedText: { color: colors.textMuted, flex: 1, lineHeight: 18 },
});

export const sheetStyles = StyleSheet.create({
  /* The sheet's head: title and lead on the left, a close control on the right. */
  shareHead: { ...globalStyles.row, alignItems: 'flex-start', gap: spacing.s12 },
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
  selectCount: { color: colors.textMuted },
  selectAll: { color: INV_ACCENT, fontWeight: '600' },

  /* A squircle, matching the guest-list screen's monograms. */
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestAvatarText: { color: colors.onPrimary, fontWeight: '700' },

  primaryTextDisabled: { color: colors.textMuted },

  manageGuests: { alignItems: 'center', paddingVertical: spacing.s12 },
  manageGuestsText: { color: INV_ACCENT, fontWeight: '600' },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
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
  title: { color: INV_NAVY, fontSize: 19, fontWeight: '700' },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs, lineHeight: 19 },

  label: { color: INV_NAVY, fontWeight: '700', marginTop: spacing.lg },
  hint: { color: colors.textMuted, marginTop: 2 },
  input: {
    borderRadius: 14,
    // A TextInput resolves no face of its own — see Components/EventlyText.
    fontFamily: fontFor('400'),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginTop: spacing.sm,
    color: colors.text,
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
  toggleLabel: { color: colors.text, flex: 1 },

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
  primaryText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
  secondary: {
    ...globalStyles.row,
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  secondaryText: { color: INV_NAVY, fontWeight: '700' },
  errorText: { color: colors.danger, marginTop: spacing.sm },
  caveat: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.md },
  caveatText: { color: colors.textMuted, flex: 1, lineHeight: 18 },

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
  guestName: { color: INV_NAVY, fontWeight: '700' },
  guestMeta: { color: colors.textMuted, marginTop: 1 },
  guestSent: { color: INV_GREEN, fontWeight: '700' },
  emptyGuests: { color: colors.textMuted, marginTop: spacing.md },
  guestsLoading: { marginTop: spacing.md },

  outcomeRow: { ...globalStyles.row, gap: spacing.sm, marginTop: spacing.sm },
  outcomeText: { flex: 1, color: colors.text },
  outcomeLink: { color: INV_ACCENT, fontWeight: '700' },
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
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  barAction: { paddingHorizontal: 8, paddingVertical: 6 },
  barActionText: { color: INV_ACCENT, fontSize: 12.5, fontWeight: '700' },

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
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
  },
  menuNote: { color: colors.textMuted, fontSize: 12, lineHeight: 16, marginTop: 1 },

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
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    flexShrink: 1,
  },
  head: { ...globalStyles.row, gap: 8, marginBottom: 6 },
  waiting: {
    color: INV_ACCENT,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginLeft: 'auto',
  },
  approvedChip: { ...globalStyles.row, gap: 5, marginLeft: 'auto' },
  approvedText: { color: INV_GREEN, fontSize: 10.5, fontWeight: '700', letterSpacing: 0.8 },
  eyebrow: {
    color: INV_ACCENT,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  body: { color: INV_NAVY, fontSize: 14, lineHeight: 20, marginTop: 6 },
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
  acceptText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
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
  askText: { color: INV_NAVY, fontSize: 13, fontWeight: '700' },
  share: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: INV_ACCENT,
    paddingVertical: 12,
    marginTop: 12,
  },
  shareText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
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
  allText: { color: colors.onPrimary, fontSize: 14.5, fontWeight: '700' },
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
  cardBody: { paddingHorizontal: spacing.lg, paddingTop: 96, paddingBottom: 22, alignItems: 'center' },
  cardEyebrow: {
    color: INV_ACCENT,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  cardTitle: {
    color: colors.onPrimary,
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '700',
    letterSpacing: -0.6,
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
    color: colors.onPrimary,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
  },
  cardVenue: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12.5,
    lineHeight: 17,
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
  cardOpenText: { color: colors.onPrimary, fontSize: 12.5, fontWeight: '700' },

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
  ctaText: { color: colors.onPrimary, fontSize: 14.5, fontWeight: '700' },
  ctaNote: {
    color: colors.textMuted,
    fontSize: 11.5,
    lineHeight: 16,
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
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  insideCount: { color: colors.textMuted, fontSize: 11.5 },
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
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '600',
  },
  insideState: { color: colors.textMuted, fontSize: 11.5, flexShrink: 0 },
  insideStateYours: { color: INV_ACCENT, fontWeight: '700' },
  insideStateApproved: { color: INV_GREEN, fontWeight: '600' },
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
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  names: {
    color: colors.onPrimary,
    fontSize: 28,
    lineHeight: 37,
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
    color: colors.onPrimary,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '600',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginTop: 14,
  },
  venue: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 4,
  },
  message: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: spacing.sm,
  },
  /* In the guest view there is nothing to tap, only more to read. */
  scroll: { alignItems: 'center', gap: 2, marginTop: 20 },
  scrollText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  /* Said only in the editor, never over a guest's cover. */
  note: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: spacing.sm,
  },
});

/** The cover editor: a live cover on top, the fields that change it below. */
export const coverEditorStyles = StyleSheet.create({
  head: { ...globalStyles.row, alignItems: 'flex-start', gap: spacing.s12 },
  headText: { flex: 1 },
  title: { color: INV_NAVY_DEEP, fontSize: 17, lineHeight: 23, fontWeight: '700' },
  sub: { color: colors.textMuted, fontSize: 12.5, lineHeight: 18, marginTop: 2 },
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
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  label: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  field: {
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 14,
    fontFamily: fontFor('400'),
  },
  fieldMulti: { minHeight: 76, textAlignVertical: 'top' },
  row: { ...globalStyles.row, gap: spacing.sm },
  half: { flex: 1 },
  /** One field under another, rather than beside it. */
  gap: { marginTop: 8 },
  /* The counter the server's own cap drives — never a second number. */
  counter: { color: colors.textMuted, fontSize: 11, textAlign: 'right', marginTop: 4 },
  counterFull: { color: INV_ACCENT, fontWeight: '700' },

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
  mediaButtonText: { color: INV_NAVY_DEEP, fontSize: 12.5, fontWeight: '700' },
  mediaState: { ...globalStyles.row, gap: 6, marginTop: 8 },
  mediaStateText: { flex: 1, color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  mediaRemove: { color: INV_ACCENT, fontSize: 12, fontWeight: '700' },

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
    color: colors.textMuted,
    fontSize: 10.5,
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 2,
  },
  swatchLabelOn: { color: INV_ACCENT, fontWeight: '700' },

  fontChip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  fontChipOn: { borderColor: INV_ACCENT, backgroundColor: INV_ACCENT_SOFT },
  fontChipText: { color: INV_NAVY_DEEP, fontSize: 14 },
  fontChipNote: { color: colors.textMuted, fontSize: 10.5, marginTop: 1 },

  errorText: { color: colors.danger, fontSize: 12, marginTop: spacing.sm },
  savedText: { color: INV_GREEN, fontSize: 12, fontWeight: '700', marginTop: spacing.sm },
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
  saveText: { color: colors.onPrimary, fontSize: 15, fontWeight: '700' },
});

/**
 * The invitation the organizer uploaded.
 *
 * The screen is the artwork and two decisions about it, so the styles here are
 * a frame, a way to open it, and the words under it — there is no builder to
 * dress.
 */
export const artworkStyles = StyleSheet.create({
  block: { alignItems: 'center', paddingHorizontal: spacing.md, marginTop: spacing.md },
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
  frame: {
    /* 3:4, stated as two numbers rather than as a ratio: the frame has to hold
       its shape while the image is still loading, and an aspect ratio with no
       intrinsic content to measure collapses to nothing. */
    width: 168,
    height: 224,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: INV_NAVY_DEEP,
  },
  media: { width: '100%', height: '100%' },
  unplayable: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
  },
  unplayableText: {
    color: colors.onPrimaryMuted,
    fontSize: 12.5,
    lineHeight: 18,
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
  viewText: { color: INV_ACCENT, fontSize: 13, fontWeight: '700' },

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

  /* Where it stands, said once. */
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
    fontSize: 15.5,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statusTitleDone: { color: INV_GREEN },
  statusNote: { color: colors.textMuted, fontSize: 12.5, lineHeight: 17, marginTop: 1 },

  actions: { paddingHorizontal: spacing.md, marginTop: spacing.md },
  approve: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: INV_ACCENT,
    paddingVertical: 14,
  },
  approveDisabled: { opacity: 0.45 },
  approveText: { color: colors.onPrimary, fontSize: 15, fontWeight: '700' },
  share: { backgroundColor: INV_GREEN },
  ask: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    paddingVertical: 13,
    marginTop: spacing.sm,
  },
  askText: { color: INV_NAVY_DEEP, fontSize: 14, fontWeight: '600' },
  askNote: {
    color: colors.textMuted,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: { color: colors.danger, fontSize: 12.5, textAlign: 'center', marginTop: spacing.sm },
  sentText: {
    color: INV_GREEN,
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  /* Nothing uploaded yet. */
  pending: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 56 },
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
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  pendingBody: {
    color: colors.textMuted,
    fontSize: 13.5,
    lineHeight: 20,
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
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
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
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
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
    color: colors.textMuted,
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.4,
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

  flourish: { ...globalStyles.row, alignItems: 'center', gap: 10, marginBottom: 12 },
  rule: { width: 46, height: 1, backgroundColor: INV_GOLD, opacity: 0.45 },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: INV_GOLD,
    transform: [{ rotate: '45deg' }],
  },

  eyebrow: {
    color: colors.textMuted,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 2.4,
    textAlign: 'center',
  },
  title: {
    color: INV_NAVY_DEEP,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '600',
    letterSpacing: -0.2,
    textAlign: 'center',
    marginTop: 5,
  },

  /* ---- the timer ---- */
  row: { ...globalStyles.row, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
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
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '700',
    /* Tabular figures, so the seconds do not shuffle the row every tick. */
    fontVariant: ['tabular-nums'],
  },
  unitLabel: {
    color: colors.textMuted,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
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
    fontSize: 23,
    lineHeight: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  afterBody: {
    color: colors.textMuted,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 4,
  },

  /* ---- the details ---- */
  divider: { ...globalStyles.row, alignItems: 'center', gap: 12, marginTop: 22, marginBottom: 14 },
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
    color: colors.text,
    fontSize: 13.5,
    lineHeight: 19,
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

  flourish: { ...globalStyles.row, alignItems: 'center', gap: 10, marginBottom: 12 },
  rule: { width: 46, height: 1, backgroundColor: INV_GOLD, opacity: 0.45 },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: INV_GOLD,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    color: colors.textMuted,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 2.6,
    textAlign: 'center',
  },
  lead: {
    color: INV_NAVY_DEEP,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '600',
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
  edge: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 3, opacity: 0.55 },

  name: { fontSize: 21, lineHeight: 28, fontWeight: '600', marginBottom: 10 },

  fact: { ...globalStyles.row, alignItems: 'flex-start', gap: 9, marginBottom: 7 },
  factText: { flex: 1 },
  factLabel: {
    color: colors.textMuted,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  factValue: { color: colors.text, fontSize: 13.5, lineHeight: 19 },
  factStrong: { color: INV_NAVY_DEEP, fontWeight: '600' },
  factSub: { color: colors.textMuted, fontSize: 12.5, lineHeight: 17 },

  hair: { width: 44, height: 1, opacity: 0.25, marginVertical: 11 },

  note: { fontSize: 13.5, lineHeight: 20, fontStyle: 'italic', marginTop: 11, opacity: 0.9 },

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
  addText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  noDate: {
    color: colors.textMuted,
    fontSize: 11.5,
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

  head: { ...globalStyles.row, alignItems: 'center', justifyContent: 'space-between' },
  /* The platform serif, the same way the invitation's own font styles reach
     for one — Poppins is the only family bundled, and a wedding card is not
     set in a UI sans. */
  heading: { color: INV_NAVY_DEEP, fontFamily: 'serif', fontSize: 19, fontWeight: '600' },

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
  pulse: { width: 6, height: 6, borderRadius: 999, backgroundColor: colors.onPrimary },
  badgeText: {
    color: colors.onPrimary,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  name: {
    color: INV_NAVY_DEEP,
    fontFamily: 'serif',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    marginTop: 10,
  },
  lead: { color: colors.textMuted, fontSize: 12.5, lineHeight: 18, marginTop: 3 },

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
  modeText: { color: colors.text, fontSize: 12.5, lineHeight: 17, fontWeight: '700' },
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
  watchText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  opens: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
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
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  fact: { ...globalStyles.row, alignItems: 'flex-start', gap: 10, marginBottom: 12 },
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
    color: colors.textMuted,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  factText: { color: colors.text, fontSize: 13, lineHeight: 19 },
});
