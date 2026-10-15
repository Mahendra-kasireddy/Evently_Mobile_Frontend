import { StyleSheet } from 'react-native';
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  loadingText: { color: textColor.textSecondary, marginTop: spacing.md },
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
  retryText: { color: WORKSPACE_ACCENT, ...fontWeights.bold },
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
  ringWrap: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercent: { color: textColor.textOnPrimary, ...typography.h3 },
  ringCaption: {
    color: colors.onPrimaryMuted,
    ...typography.caption,
    marginTop: 1,
  },
  headText: { flex: 1 },
  eyebrow: {
    color: colors.onPrimaryMuted,
    ...fontWeights.bold,
    textTransform: 'uppercase',
  },
  title: { color: textColor.textOnPrimary, ...typography.h2, marginTop: 2 },
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
  statusText: { color: textColor.textOnPrimary, ...fontWeights.bold },
  countdown: {
    ...globalStyles.row,
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  countdownCount: { color: textColor.textOnPrimary, ...typography.h1 },
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
    color: textColor.textPrimary,
    ...typography.h3,
  },
  card: {
    ...globalStyles.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  emptyText: { color: textColor.textSecondary, ...typography.body },
});

/**
 * The two "open something bigger" rows in the workspace: the ideas board and
 * the guest invitation. Both summarise real state and lead to their own
 * screen, so they share one layout.
 */
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
  title: {
    color: textColor.textPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },
  body: { color: textColor.textSecondary, ...typography.caption, marginTop: 2 },
  cta: {
    ...globalStyles.row,
    gap: 2,
    flexShrink: 0,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: spacing.sm,
    backgroundColor: WORKSPACE_ACCENT,
  },
  ctaGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ctaText: { color: textColor.textOnPrimary, ...typography.buttonSmall },
  ctaGhostText: { color: textColor.textPrimary, ...typography.buttonSmall },
  /** The organizer has not shared an invitation yet — a step, not an error. */
  pendingText: { color: textColor.textSecondary, ...typography.caption },
});

/* ---------------------------------------------------------------------------
 * The ideas & planning card.
 *
 * One card rather than a titled section wrapping a row: the tab above it is
 * already called Ideas & planning, and the row inside a captioned card meant
 * the same three words appeared twice within an inch of each other.
 * ------------------------------------------------------------------------- */
export const ideasCardStyles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#f7ddd0',
    padding: 16,
    overflow: 'hidden',
  },
  wash: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  /* Tucked into the right edge, part of it past the corner — a flourish the
     eye reads as paper rather than as a picture to look at. */
  bloom: { position: 'absolute', top: -14, right: -16, opacity: 0.55 },

  row: { ...globalStyles.row, gap: 13 },
  badge: {
    width: 50,
    height: 50,
    borderRadius: 999,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0 },
  title: {
    color: textColor.textPrimary,
    ...typography.h3,
  },
  body: { color: textColor.textSecondary, ...typography.caption, marginTop: 3 },

  /* The organizer's newest post, set on paper inside the card so it reads as
     something they wrote rather than as more of the card's own copy. */
  latest: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f7e3d8',
    padding: 12,
    marginTop: 14,
  },
  latestHead: { ...globalStyles.row, gap: 8 },
  typeChip: {
    ...globalStyles.row,
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeChipText: { ...typography.label },
  latestWhen: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginLeft: 'auto',
  },
  latestText: {
    color: textColor.textPrimary,
    ...typography.bodySmall,
    marginTop: 8,
  },
  latestFoot: { ...globalStyles.row, gap: 5, marginTop: 8 },
  latestFootText: {
    color: textColor.textSecondary,
    ...typography.caption,
    flexShrink: 1,
  },
  latestFootDone: { color: WORKSPACE_GREEN, ...fontWeights.bold },

  cta: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: 999,
    backgroundColor: WORKSPACE_ACCENT,
    paddingLeft: 16,
    paddingRight: 11,
    paddingVertical: 10,
    marginTop: 14,
  },
  /* Beside the words rather than under them, for the card that has nothing
     else on it. */
  ctaInline: {
    alignSelf: 'center',
    marginTop: 0,
    paddingLeft: 13,
    paddingRight: 9,
  },
  ctaText: { color: textColor.textOnPrimary, ...typography.buttonSmall },
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
    color: textColor.textOnPrimary,
    ...typography.label,
  },
  heroTitle: {
    flex: 1,
    color: textColor.textOnPrimary,
    ...typography.h2,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.82)',
    ...typography.bodySmall,
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
  stat: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statShared: { backgroundColor: WORKSPACE_VIOLET_SOFT },
  statPlanned: { backgroundColor: WORKSPACE_GREEN_SOFT },
  statAwaiting: { backgroundColor: WORKSPACE_ACCENT_SOFT },
  statValue: { ...typography.h2 },
  statValueShared: { color: WORKSPACE_VIOLET },
  statValuePlanned: { color: WORKSPACE_GREEN },
  statValueAwaiting: { color: WORKSPACE_ACCENT },
  statLabel: {
    color: textColor.textSecondary,
    ...typography.label,
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
  avatarText: {
    color: textColor.textOnPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  input: {
    flex: 1,
    // A TextInput resolves no face of its own — see Components/EventlyText.
    ...inputTypography.body,
    minHeight: 58,
    maxHeight: 150,
    color: textColor.textPrimary,
    padding: 0,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  thumbs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
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
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  typeChip: {
    ...globalStyles.row,
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  typeChipText: { color: textColor.textSecondary, ...typography.label },
  composerFoot: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  photoButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  photoText: { color: textColor.textSecondary, ...fontWeights.bold },
  postButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    borderRadius: 12,
    backgroundColor: WORKSPACE_ACCENT,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  postButtonDisabled: { opacity: 0.45 },
  postButtonText: { color: textColor.textOnPrimary, ...fontWeights.bold },
  secretNote: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.sm },
  secretNoteText: { color: textColor.textSecondary, flex: 1 },
  composerError: { color: textColor.textError, marginTop: spacing.sm },
  counter: {
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },

  // Filters.
  filters: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  filter: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    marginRight: spacing.xs,
  },
  filterOn: {
    backgroundColor: WORKSPACE_VIOLET,
    borderColor: WORKSPACE_VIOLET,
  },
  filterText: { color: textColor.textSecondary, ...typography.label },
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
    color: textColor.textPrimary,
    ...typography.body,
    ...fontWeights.semibold,
    flexShrink: 1,
  },
  youTag: {
    color: textColor.textSecondary,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
    ...typography.label,
    overflow: 'hidden',
  },
  time: { color: textColor.textSecondary, ...typography.caption, marginTop: 1 },
  cardText: {
    color: textColor.textPrimary,
    ...typography.body,
    marginTop: spacing.sm,
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  secretChip: { ...globalStyles.row, gap: 4, marginTop: spacing.sm },
  secretChipText: { color: textColor.textSecondary },

  reply: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  replyHead: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  replyTitle: {
    color: textColor.textPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  statusChip: {
    ...globalStyles.row,
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { ...typography.label },
  replyText: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },

  approveRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  approvalLabel: { color: colors.accent, ...fontWeights.bold, flexShrink: 1 },
  approvedRow: { ...globalStyles.row, gap: spacing.xs, marginTop: spacing.md },
  approvedText: { color: colors.success, ...fontWeights.bold },
  approveButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  approveText: { color: textColor.textOnPrimary, ...fontWeights.bold },

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
    color: textColor.textPrimary,
    ...typography.h3,
  },
  visionSubtitle: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 2,
  },
  visionEmpty: { color: textColor.textSecondary, marginTop: spacing.sm },
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
  visionLabel: {
    color: textColor.textSecondary,
    ...fontWeights.bold,
    textTransform: 'uppercase',
  },
  visionValue: {
    color: textColor.textPrimary,
    ...typography.bodySmall,
    marginTop: 1,
  },
  visionValueEmpty: {
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 1,
  },

  // Empty feed.
  empty: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: WORKSPACE_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: textColor.textPrimary,
    ...typography.h2,
    marginTop: spacing.sm,
  },
  emptyBody: {
    ...typography.body,
    color: textColor.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

/* ---------------------------------------------------------------------------
 * The overview: the event's identity written over a photograph, the three
 * figures on a card over the foot of it, and one row of tabs deciding what is
 * under them.
 *
 * The screen used to be a single scroll of eight stacked cards — every
 * section of the booking at once, in the same weight, so the thing the
 * customer opened it for was somewhere in the middle of it. This block
 * answers "which event is this, when, where and how far along", and the tabs
 * put the rest where it can be looked for rather than scrolled past.
 * ------------------------------------------------------------------------- */
