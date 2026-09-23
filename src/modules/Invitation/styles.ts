import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, fontFor, spacing } from '../../theme';
import {
  INV_ACCENT,
  INV_ACCENT_SOFT,
  INV_GREEN,
  INV_GREEN_SOFT,
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

  card: { backgroundColor: INV_NAVY_DEEP, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg, alignItems: 'center' },
  eyebrow: {
    color: INV_ACCENT,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '700',
    textAlign: 'center',
  },
  hosts: { color: colors.onPrimary, fontSize: 24, fontWeight: '700', textAlign: 'center', marginTop: spacing.sm },
  when: { color: colors.onPrimaryMuted, marginTop: spacing.sm, textAlign: 'center' },
  venue: { color: colors.onPrimaryMuted, marginTop: 2, textAlign: 'center' },

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
export const shellStyles = StyleSheet.create({
  /*
   * Stationery, not a dashboard.
   *
   * This screen is a card somebody is about to send to their family, so its
   * head is paper: a cream ground, the screen's name, and everything that is
   * not a way of working on it behind one menu. The coloured slab, the three
   * figure-tiles and the progress rule that were here belong to the boards —
   * a workspace and an ideas feed are measured in counts, and an invitation
   * is read.
   */
  paper: {
    backgroundColor: INV_PAPER,
    borderBottomWidth: 1,
    borderBottomColor: INV_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 14,
  },
  bar: { ...globalStyles.row, gap: 6 },
  /* Just the chevron — the disc behind it was a second shape to notice for a
     control that sits in the same corner of every screen. */
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -9,
  },
  barText: { flex: 1 },
  barTitle: {
    color: INV_NAVY_DEEP,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  /* Everything that is not a way of working on the invitation, behind one
     control at the end of the bar. */
  menu: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -9,
  },

  /* Two words on a rule, the one you are on underlined. The segmented box
     around them was the control drawn twice — the underline is the control. */
  tabs: {
    ...globalStyles.row,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: INV_HAIRLINE,
  },
  tab: { alignItems: 'center', paddingVertical: 11, marginRight: 22 },
  tabOn: {
    borderBottomWidth: 2.5,
    borderBottomColor: INV_ACCENT,
    marginBottom: -1,
  },
  tabText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  tabTextOn: { color: INV_ACCENT, fontWeight: '700' },

  /* The menu's own sheet: two rows, each a place to go. */
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
  foot: {
    borderTopWidth: 1,
    borderTopColor: INV_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
  },
  footButton: {
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: INV_ACCENT,
    paddingVertical: 14,
  },
  footButtonApprove: { backgroundColor: INV_NAVY_DEEP },
  footButtonDisabled: { opacity: 0.45 },
  footButtonText: { color: colors.onPrimary, fontSize: 14.5, fontWeight: '700' },
  /* Said under the button because it is the promise the button makes: nothing
     has left this phone until the customer sends it. */
  footNote: {
    color: colors.textMuted,
    fontSize: 11.5,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 7,
  },
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
});

/* ---------------------------------------------------------------------------
 * The invitation laid out as the document it is: its own header, then each
 * section's own words, ruled off from the next.
 * ------------------------------------------------------------------------- */
export const canvasStyles = StyleSheet.create({
  header: {
    backgroundColor: INV_NAVY_DEEP,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    marginTop: 6,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 22,
    alignItems: 'center',
  },
  monogram: {
    width: 54,
    height: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: { color: colors.onPrimary, fontSize: 20, fontWeight: '700' },
  headerEyebrow: {
    color: INV_ACCENT,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 16,
  },
  headerTitle: {
    color: colors.onPrimary,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginTop: 8,
  },
  /* One dot wide: the reference's mark between the name and the details. */
  diamond: {
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: INV_ACCENT,
    transform: [{ rotate: '45deg' }],
    marginTop: 14,
  },
  headerLine: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 14,
  },
  headerEdit: {
    ...globalStyles.row,
    gap: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 18,
  },
  headerEditText: { color: colors.onPrimary, fontSize: 12.5, fontWeight: '700' },

  block: { paddingHorizontal: spacing.md, paddingTop: 16 },
  /* Above the words rather than beside them: the section is what matters on
     this page, and the control that changes it is not. */
  edit: {
    ...globalStyles.row,
    alignSelf: 'flex-end',
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: INV_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editText: { color: INV_ACCENT, fontSize: 12, fontWeight: '700' },
  eyebrow: {
    color: INV_ACCENT,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 10,
  },
  body: {
    color: INV_NAVY,
    fontSize: 14.5,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
  },
  bodyEmpty: { color: colors.textMuted, fontStyle: 'italic' },

  /* A hairline with a dot in it, between one section and the next. */
  rule: { ...globalStyles.row, justifyContent: 'center', gap: 8, marginTop: 18 },
  ruleLine: { width: 56, height: 1, backgroundColor: INV_HAIRLINE },
  ruleDot: { width: 4, height: 4, borderRadius: 999, backgroundColor: INV_HAIRLINE },

  hiddenNote: {
    ...globalStyles.row,
    alignSelf: 'center',
    gap: 6,
    marginTop: 14,
  },
  hiddenNoteText: { color: colors.textMuted, fontSize: 12 },
});
