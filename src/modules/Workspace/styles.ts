import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, fontFor, spacing } from '../../theme';
import {
  WORKSPACE_ACCENT,
  WORKSPACE_ACCENT_SOFT,
  WORKSPACE_GREEN,
  WORKSPACE_GREEN_SOFT,
  WORKSPACE_NAVY,
  WORKSPACE_NAVY_DEEP,
  WORKSPACE_VIOLET,
  WORKSPACE_VIOLET_SOFT,
} from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
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
  retryText: { color: WORKSPACE_ACCENT, fontWeight: '700' },
});

// The navy hero: progress ring, status and countdown.
export const heroStyles = StyleSheet.create({
  card: {
    backgroundColor: WORKSPACE_NAVY_DEEP,
    borderRadius: 20,
    margin: spacing.md,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  top: { ...globalStyles.row, gap: spacing.md },
  ringWrap: { width: 78, height: 78, alignItems: 'center', justifyContent: 'center' },
  ringText: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringPercent: { color: colors.onPrimary, fontSize: 17, fontWeight: '700' },
  ringCaption: { color: colors.onPrimaryMuted, fontSize: 10, marginTop: 1 },
  headText: { flex: 1 },
  eyebrow: {
    color: colors.onPrimaryMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: { color: colors.onPrimary, fontSize: 20, fontWeight: '700', marginTop: 2 },
  statusPill: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { color: colors.onPrimary, fontWeight: '700' },
  countdown: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  countdownCount: { color: colors.onPrimary, fontSize: 26, fontWeight: '700' },
  countdownLabel: { color: colors.onPrimaryMuted },
});

/*
 * One type scale for the whole workspace: 15.5 for a section heading, 14 for
 * anything being read, 12.5 for the line under it.
 *
 * Every size is stated rather than inherited from a text variant. Half these
 * rows carried no size at all and took whatever the variant happened to be,
 * so the screen ran at three scales at once — a 17 heading over a 16 value
 * over a 15 note — and nothing read as a level.
 */
export const sectionStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  title: {
    color: WORKSPACE_NAVY,
    fontSize: 15.5,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  card: {
    ...globalStyles.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  emptyText: { color: colors.textMuted, fontSize: 13.5, lineHeight: 19 },
});

export const milestoneStyles = StyleSheet.create({
  row: { ...globalStyles.row, gap: spacing.sm, paddingVertical: spacing.sm - 2 },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#e6e9f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.success },
  label: { color: colors.textMuted, flex: 1 },
  labelDone: { color: WORKSPACE_NAVY, fontWeight: '700' },
});

export const paymentStyles = StyleSheet.create({
  statusRow: { ...globalStyles.row, justifyContent: 'space-between' },
  statusLabel: { color: WORKSPACE_NAVY, fontWeight: '700' },
  total: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: WORKSPACE_ACCENT, borderRadius: 4 },
  amounts: { ...globalStyles.row, justifyContent: 'space-between', marginTop: spacing.sm },
  amountLabel: { color: colors.textMuted, fontSize: 12.5, lineHeight: 17 },
  amountValue: { color: WORKSPACE_NAVY, fontSize: 14, lineHeight: 19, fontWeight: '700' },
});

export const taskStyles = StyleSheet.create({
  row: { paddingVertical: spacing.sm },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  headRow: { ...globalStyles.row, justifyContent: 'space-between', gap: spacing.sm },
  title: {
    color: WORKSPACE_NAVY,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    flexShrink: 1,
  },
  statusPill: { borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  statusText: { fontWeight: '700', fontSize: 11 },
  meta: { color: colors.textMuted, fontSize: 12.5, lineHeight: 17, marginTop: 2 },
});

export const timelineStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  rail: { width: 20, alignItems: 'center' },
  dot: { width: 9, height: 9, borderRadius: 999, backgroundColor: WORKSPACE_ACCENT, marginTop: 5 },
  line: { flex: 1, width: 1, backgroundColor: colors.border, marginTop: 2 },
  body: { flex: 1, paddingBottom: spacing.md },
  label: { color: WORKSPACE_NAVY, fontSize: 14, lineHeight: 19, fontWeight: '700' },
  note: { color: colors.textMuted, fontSize: 12.5, lineHeight: 17, marginTop: 1 },
  at: { color: colors.textMuted, fontSize: 12, lineHeight: 16, marginTop: 2 },
});

/**
 * The two "open something bigger" rows in the workspace: the ideas board and
 * the guest invitation. Both summarise real state and lead to their own
 * screen, so they share one layout.
 */
export const summaryRowStyles = StyleSheet.create({
  /*
   * Tight gaps and a button that never grows. Poppins sets wider than the
   * platform faces this row was first measured in, and the description here is
   * the longest text on the screen — every point taken from the gutters and
   * from the button's padding is a point the sentence gets back.
   */
  row: { ...globalStyles.row, gap: 12, alignItems: 'flex-start' },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: WORKSPACE_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* The two cards are different errands — one is a conversation about the
     event, the other is a document to approve — so they are told apart by
     colour before they are read. */
  iconChipIdeas: { backgroundColor: WORKSPACE_VIOLET_SOFT },
  iconChipInvite: { backgroundColor: WORKSPACE_GREEN_SOFT },
  text: { flex: 1 },
  title: { color: WORKSPACE_NAVY, fontSize: 14, lineHeight: 19, fontWeight: '700' },
  body: { color: colors.textMuted, fontSize: 12.5, lineHeight: 17, marginTop: 2 },
  cta: {
    ...globalStyles.row,
    gap: 2,
    flexShrink: 0,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: spacing.sm,
    backgroundColor: WORKSPACE_ACCENT,
  },
  ctaGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  ctaText: { color: colors.onPrimary, fontSize: 12.5, fontWeight: '700' },
  ctaGhostText: { color: WORKSPACE_NAVY, fontSize: 12.5, fontWeight: '700' },
  /** The organizer has not shared an invitation yet — a step, not an error. */
  pendingText: { color: colors.textMuted, fontSize: 12.5, lineHeight: 17 },
});

export const boardStyles = StyleSheet.create({
  content: { paddingBottom: spacing.xl },

  /*
   * The banner, built like the workspace's: a full-bleed head with the back
   * arrow on it, and the counts as tinted tiles on the sheet below rather
   * than as three white numbers on a navy slab.
   *
   * Violet, because that is the colour this board already wears on the
   * workspace that leads here — the card you tap and the screen it opens
   * should be the same colour.
   *
   * Every figure is the server's own count, so the banner cannot claim more
   * activity than the feed beneath it contains.
   */
  hero: { paddingBottom: 30 },
  heroLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  /* Held back so the specks read as texture behind the type rather than as
     confetti thrown over it. */
  heroSpecks: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.45,
  },
  /* One row: the way back, then what this is. */
  heroBody: { ...globalStyles.row, gap: 12, paddingHorizontal: spacing.md },
  heroBack: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -9,
  },
  heroPill: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 14,
  },
  heroPillText: {
    color: colors.onPrimary,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    flex: 1,
    color: colors.onPrimary,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },

  /* The same three-tile strip the workspace uses, in the same three colours:
     what has been shared, what is planned, what is waiting on you. */
  statsSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -18,
    paddingHorizontal: spacing.md,
    paddingTop: 16,
    /* The sheet ends here; what follows brings its own margin. Without this
       the composer's card sat flush against the tiles, and the three of them
       read as one block. */
    paddingBottom: 4,
  },
  stats: { ...globalStyles.row, gap: 8 },
  stat: { flex: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 12 },
  statShared: { backgroundColor: WORKSPACE_VIOLET_SOFT },
  statPlanned: { backgroundColor: WORKSPACE_GREEN_SOFT },
  statAwaiting: { backgroundColor: WORKSPACE_ACCENT_SOFT },
  statValue: { fontSize: 19, lineHeight: 24, fontWeight: '700', letterSpacing: -0.4 },
  statValueShared: { color: WORKSPACE_VIOLET },
  statValuePlanned: { color: WORKSPACE_GREEN },
  statValueAwaiting: { color: WORKSPACE_ACCENT },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
    marginTop: 2,
  },

  // Composer.
  composer: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  composerTop: { flexDirection: 'row', gap: spacing.sm },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: WORKSPACE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSquare: { borderRadius: 12, backgroundColor: WORKSPACE_NAVY },
  avatarText: { color: colors.onPrimary, fontWeight: '700', fontSize: 13 },
  input: {
    flex: 1,
    // A TextInput resolves no face of its own — see Components/EventlyText.
    fontFamily: fontFor('400'),
    minHeight: 58,
    maxHeight: 150,
    color: colors.text,
    fontSize: 14,
    padding: 0,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  thumbs: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  thumb: { width: 72, height: 72, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surface },
  thumbImage: { width: '100%', height: '100%' },
  thumbRemove: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  typeChip: {
    ...globalStyles.row,
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  typeChipText: { color: colors.textMuted, fontWeight: '700', fontSize: 12 },
  composerFoot: { ...globalStyles.row, justifyContent: 'space-between', marginTop: spacing.md },
  photoButton: { ...globalStyles.row, gap: spacing.xs, paddingVertical: spacing.xs },
  photoText: { color: colors.textMuted, fontWeight: '700' },
  postButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    borderRadius: 12,
    backgroundColor: WORKSPACE_ACCENT,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  postButtonDisabled: { opacity: 0.45 },
  postButtonText: { color: colors.onPrimary, fontWeight: '700' },
  secretNote: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.sm },
  secretNoteText: { color: colors.textMuted, flex: 1 },
  composerError: { color: colors.danger, marginTop: spacing.sm },
  counter: { color: colors.textMuted, textAlign: 'right', marginTop: spacing.xs },

  // Filters.
  filters: { paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.xs },
  filter: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    marginRight: spacing.xs,
  },
  filterOn: { backgroundColor: WORKSPACE_VIOLET, borderColor: WORKSPACE_VIOLET },
  filterText: { color: colors.textMuted, fontSize: 12.5, fontWeight: '700' },
  filterTextOn: { color: colors.onPrimary },

  // Feed.
  feed: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  card: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHead: { ...globalStyles.row, gap: spacing.sm },
  who: { flex: 1 },
  whoRow: { ...globalStyles.row, gap: spacing.xs },
  name: {
    color: WORKSPACE_NAVY,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    flexShrink: 1,
  },
  youTag: {
    color: colors.textMuted,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
    fontSize: 11,
    overflow: 'hidden',
  },
  time: { color: colors.textMuted, fontSize: 12, lineHeight: 16, marginTop: 1 },
  cardText: { color: colors.text, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  images: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  image: { width: 96, height: 96, borderRadius: 12, backgroundColor: colors.surface },
  secretChip: { ...globalStyles.row, gap: 4, marginTop: spacing.sm },
  secretChipText: { color: colors.textMuted },

  reply: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  replyHead: { ...globalStyles.row, justifyContent: 'space-between', gap: spacing.sm },
  replyTitle: { color: WORKSPACE_NAVY, fontSize: 13.5, lineHeight: 18, fontWeight: '700' },
  statusChip: { ...globalStyles.row, gap: 5, borderRadius: 999, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontWeight: '700', fontSize: 11 },
  replyText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
  },

  approveRow: { ...globalStyles.row, justifyContent: 'space-between', gap: spacing.sm, marginTop: spacing.md },
  approvalLabel: { color: colors.accent, fontWeight: '700', flexShrink: 1 },
  approvedRow: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.md },
  approvedText: { color: colors.success, fontWeight: '700' },
  approveButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  approveText: { color: colors.onPrimary, fontWeight: '700' },

  // Vision.
  vision: {
    ...globalStyles.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  visionTitle: {
    color: WORKSPACE_NAVY,
    fontSize: 15.5,
    lineHeight: 20,
    fontWeight: '700',
  },
  visionSubtitle: { color: colors.textMuted, fontSize: 12.5, lineHeight: 17, marginTop: 2 },
  visionEmpty: { color: colors.textMuted, marginTop: spacing.sm, lineHeight: 20 },
  visionRow: { ...globalStyles.row, gap: spacing.sm, marginTop: spacing.md },
  visionChip: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: WORKSPACE_VIOLET_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visionText: { flex: 1 },
  visionLabel: { color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '700' },
  visionValue: { color: WORKSPACE_NAVY, fontSize: 13.5, lineHeight: 18, marginTop: 1 },
  visionValueEmpty: { color: colors.textMuted, fontStyle: 'italic', marginTop: 1 },

  // Empty feed.
  empty: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: WORKSPACE_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { color: WORKSPACE_NAVY, fontSize: 17, fontWeight: '700', marginTop: spacing.sm },
  emptyBody: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs, lineHeight: 20 },
});

/* ---------------------------------------------------------------------------
 * The overview: a banner, the event's identity on a sheet lifted over it, and
 * one row of tabs deciding what is under them.
 *
 * The screen used to be a single scroll of eight stacked cards — every
 * section of the booking at once, in the same weight, so the thing the
 * customer opened it for was somewhere in the middle of it. The banner and
 * the identity block answer "which event is this and when", and the tabs put
 * the rest where it can be looked for rather than scrolled past.
 * ------------------------------------------------------------------------- */

const BANNER_HEIGHT = 210;
/** How far the sheet is lifted over the banner's foot. */
const SHEET_LIFT = 22;

export const overviewStyles = StyleSheet.create({
  banner: { height: BANNER_HEIGHT, overflow: 'hidden' },
  bannerLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  bannerArt: {
    position: 'absolute',
    right: -10,
    bottom: 10,
    width: 190,
    height: 160,
    opacity: 0.9,
  },
  /*
   * The way back and the screen's name, on one row over the picture.
   *
   * No bar above the banner — that would be a second header for one arrow —
   * and no disc behind the chevron: it was a shape to notice for a control
   * that sits in the same corner of every screen. The touch target is the
   * box, which is unchanged.
   */
  topRow: {
    ...globalStyles.row,
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    gap: 6,
  },
  back: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -9,
  },
  topTitle: {
    color: colors.onPrimary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  /* The countdown, centred on the banner. The reference counts hours and
     seconds; a booking months away is counted in days, and a live clock on a
     date six months out is a spinning number nobody reads. */
  countdown: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  countdownValue: {
    color: colors.onPrimary,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: -1,
  },
  countdownLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 2,
  },
  statusPill: {
    ...globalStyles.row,
    alignSelf: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
  },
  statusDot: { width: 7, height: 7, borderRadius: 999 },
  statusText: {
    color: colors.onPrimary,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -SHEET_LIFT,
    paddingHorizontal: spacing.md,
    paddingTop: 18,
  },
  titleRow: { ...globalStyles.row, alignItems: 'flex-start', gap: 10 },
  title: {
    flex: 1,
    color: WORKSPACE_NAVY_DEEP,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  /* The two chips the reference puts beside its title: what it costs, and
     when it is. Each is dropped rather than drawn empty. */
  amountChip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: WORKSPACE_ACCENT_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexShrink: 0,
  },
  amountChipText: { color: WORKSPACE_ACCENT, fontSize: 13, fontWeight: '700' },
  dateChip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: WORKSPACE_NAVY,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  dateChipMonth: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 12,
  },
  dateChipDay: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
  },

  byRow: { ...globalStyles.row, gap: 8, marginTop: 12 },
  byAvatar: {
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  byAvatarText: { color: colors.onPrimary, fontSize: 10, fontWeight: '700' },
  byText: { color: colors.textMuted, fontSize: 13, lineHeight: 18, flexShrink: 1 },

  factRow: { ...globalStyles.row, alignItems: 'flex-start', gap: 10, marginTop: 14 },
  factText: { flex: 1 },
  factValue: {
    color: WORKSPACE_NAVY_DEEP,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  factNote: { color: colors.textMuted, fontSize: 12.5, lineHeight: 17, marginTop: 1 },

  /* One row, three destinations. A segmented control rather than a scroll of
     everything, so the sections below are chosen instead of passed. */
  /*
   * Three figures, three colours, one row: how long is left, how much is
   * ready, how much is paid. Each is real — the countdown, the milestone
   * share, the share of the agreed amount settled — and each tile disappears
   * when its figure does not exist yet.
   */
  stats: { ...globalStyles.row, gap: 8, marginTop: 16 },
  stat: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statTime: { backgroundColor: WORKSPACE_ACCENT_SOFT },
  statReady: { backgroundColor: WORKSPACE_GREEN_SOFT },
  statPaid: { backgroundColor: WORKSPACE_VIOLET_SOFT },
  statValue: { fontSize: 19, lineHeight: 24, fontWeight: '700', letterSpacing: -0.4 },
  statValueTime: { color: WORKSPACE_ACCENT },
  statValueReady: { color: WORKSPACE_GREEN },
  statValuePaid: { color: WORKSPACE_VIOLET },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
    marginTop: 2,
  },

  tabs: {
    ...globalStyles.row,
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#efe9e5',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  /* A wash behind the one you are on, so the row reads as a choice rather
     than as three labels with a line under one of them. */
  tabActive: { backgroundColor: WORKSPACE_ACCENT_SOFT },
  tabLabel: { color: colors.textMuted, fontSize: 13.5, lineHeight: 18, fontWeight: '600' },
  tabLabelActive: { color: WORKSPACE_ACCENT, fontWeight: '700' },
  tabUnderline: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: -1,
    height: 2.5,
    borderRadius: 999,
    backgroundColor: WORKSPACE_ACCENT,
  },
});

/* The bar that never scrolls away: the two things worth doing from here, and
   the one worth doing most. */
export const actionBarStyles = StyleSheet.create({
  bar: {
    ...globalStyles.row,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#efe9e5',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
  },
  ghost: {
    ...globalStyles.row,
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e6dfda',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  ghostText: { color: WORKSPACE_NAVY_DEEP, fontSize: 13.5, fontWeight: '700' },
  primary: {
    flex: 1,
    ...globalStyles.row,
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: WORKSPACE_ACCENT,
    paddingVertical: 13,
  },
  primaryText: { color: colors.onPrimary, fontSize: 14.5, fontWeight: '700' },
});
