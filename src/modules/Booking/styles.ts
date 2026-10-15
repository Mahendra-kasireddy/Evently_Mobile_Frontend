import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
  colors,
  spacing,
  fontWeights,
  textColor,
  typography,
} from '../../theme';
import {
  BOOKING_ACCENT,
  BOOKING_ACCENT_SOFT,
  BOOKING_CANVAS,
  BOOKING_NAVY,
} from './constants';

/** The hairline used for card edges and dividers — warm, to sit on the canvas. */
const HAIRLINE = '#efe9e5';
/** The unfilled half of a progress bar, and the resting pill. */
const TRACK = '#f0ecea';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BOOKING_CANVAS },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  listBleed: { marginHorizontal: -spacing.md },
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
    backgroundColor: BOOKING_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: textColor.textSecondary, marginTop: spacing.md },
  errorText: {
    color: textColor.textError,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  emptyTitle: {
    ...typography.h2,
    color: textColor.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: textColor.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyCta: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.lg,
    borderRadius: 14,
    backgroundColor: BOOKING_ACCENT,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
  },
  emptyCtaText: { color: textColor.textOnPrimary, ...fontWeights.bold },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: BOOKING_ACCENT, ...fontWeights.bold },

  /** The screen's own title, in place of a header bar — this is a tab. */
  headerRow: {
    ...globalStyles.row,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  backButton: { marginLeft: -6, paddingRight: 2, paddingVertical: 2 },
  /*
   * 27/Bold, not 28/ExtraBold. Poppins' ExtraBold is genuinely heavy — at
   * display size it reads as a shout rather than as a page title, and its
   * wider letterforms already give the line the weight the design wanted.
   */
  screenTitle: {
    color: textColor.textPrimary,
    ...typography.h1,
  },

  /** Empty-list body inside the scroller, so the tabs stay reachable above it. */
  emptyPanel: { alignItems: 'center', paddingVertical: spacing.xl },
});

export const eventTabsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  tab: {
    borderRadius: 999,
    backgroundColor: '#f1edf0',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  tabOn: {
    backgroundColor: '#1b2550',
    shadowColor: '#1b2550',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  spark: { position: 'absolute', top: 5, right: 9 },
  // SemiBold: Poppins Bold inside a small pill closes up the counters.
  tabText: {
    color: textColor.textSecondary,
    ...typography.body,
    ...fontWeights.semibold,
  },
  tabTextOn: { color: colors.onPrimary },
  sprig: { marginLeft: 'auto', transform: [{ rotate: '-20deg' }] },
});

export const eventCardStyles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f3e6ec',
    backgroundColor: colors.background,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#c25a7a',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  /**
   * The event being worked on right now wears a soft pink-to-lilac ring. One
   * at a time, and only ever the soonest — a list where every card is
   * highlighted highlights nothing.
   */
  cardFocus: { padding: 3, borderWidth: 0 },
  surface: {
    backgroundColor: colors.background,
    borderRadius: 21,
    padding: 10,
  },
  inner: { flexDirection: 'row', gap: 12 },

  photoWrap: {
    width: 112,
    height: 132,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#f6e6ee',
  },
  photo: { width: '100%', height: '100%' },
  dateBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    minWidth: 42,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
  },
  dateDay: {
    color: '#c42f6a',
    ...typography.h3,
  },
  dateMonth: {
    color: '#c42f6a',
    ...typography.label,
  },

  body: { flex: 1, justifyContent: 'center', paddingVertical: 2 },
  kindChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#f1ecff',
  },
  kindText: { color: '#6d4df2', ...typography.label },
  chipRow: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 6,
  },
  title: {
    color: textColor.textPrimary,
    ...typography.h3,
  },
  metaRow: { ...globalStyles.row, gap: 5, marginTop: 6 },
  subtitle: {
    color: textColor.textSecondary,
    ...typography.caption,
    flexShrink: 1,
  },

  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexShrink: 0,
  },
  /*
   * The longest label this can hold is "EXPIRED — NO RESPONSE". Poppins sets
   * wide, so the caps run small and a little tracked.
   */
  statusText: { ...typography.label },

  progressRow: { ...globalStyles.row, gap: 10, marginTop: 12 },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: TRACK,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3, overflow: 'hidden' },
  daysLabel: { color: textColor.textPrimary, ...typography.label },

  next: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#f6f3ff',
  },
  nextIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#e9e2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { flex: 1, color: textColor.textSecondary, ...typography.caption },
});

export const jumpToStyles = StyleSheet.create({
  /* A centred section label between two fading rules. */
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 14,
  },
  headLine: {
    flex: 1,
    maxWidth: 70,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: '#f6c9d6',
  },
  heading: {
    color: '#c2476d',
    ...typography.overline,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    // Two per row: half the space, minus half the 12pt gap between them.
    width: '48%',
    minHeight: 132,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    padding: 14,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  sprig: {
    position: 'absolute',
    top: 8,
    right: 8,
    transform: [{ rotate: '25deg' }],
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  tileTitle: {
    color: textColor.textPrimary,
    ...typography.h3,
    marginTop: 14,
  },
  tileFoot: { ...globalStyles.row, gap: 8, marginTop: 2 },
  tileSubtitle: {
    flex: 1,
    color: textColor.textSecondary,
    ...typography.caption,
  },
  tileGo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* Bookings: the event tickets section and the planned-events states. */
/* A Bookings section heading: gradient badge, title, count, "See all". */
export const sectionHeadStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s12,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: textColor.textPrimary,
    ...typography.h3,
    flexShrink: 1,
  },
  count: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: '#f3f1fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { ...typography.label },
  seeAll: { ...typography.bodySmall, ...fontWeights.semibold },
});

/* The event tickets: each a little ticket, with a perforation and a stub. */
export const ticketSectionStyles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: 6,
    marginBottom: spacing.lg,
  },
  list: { gap: spacing.md },
  ticket: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 22,
    padding: 12,
    paddingRight: 0,
    borderWidth: 1,
    borderColor: '#f6e3ea',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: BOOKING_NAVY,
        shadowOpacity: 0.07,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
    }),
  },
  thumbWrap: {
    width: 108,
    height: 128,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#e9edf5',
  },
  thumb: { width: '100%', height: '100%' },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbDate: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  thumbDay: {
    color: textColor.textPrimary,
    ...typography.h3,
  },
  thumbMonth: {
    color: BOOKING_ACCENT,
    ...typography.label,
  },
  body: { flex: 1, gap: 7, paddingLeft: spacing.md, paddingRight: 8 },
  rowTitle: {
    color: textColor.textPrimary,
    ...typography.h3,
  },
  line: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lineText: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    flexShrink: 1,
  },
  pillsScroll: { flexGrow: 0, marginTop: 4 },
  pills: { flexDirection: 'row', gap: 6 },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { ...typography.label },
  typePill: { backgroundColor: BOOKING_ACCENT_SOFT },
  typePillText: { color: BOOKING_ACCENT },
  /* The perforation: notches cut from the top and bottom edges in the page's
     colour, and a dashed line between them. */
  perf: {
    width: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginVertical: -12,
  },
  perfNotch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: BOOKING_CANVAS,
  },
  perfNotchTop: { marginTop: -8 },
  perfNotchBottom: { marginBottom: -8 },
  perfLine: { flex: 1, justifyContent: 'space-evenly', paddingVertical: 4 },
  perfDash: {
    width: 1.5,
    height: 5,
    borderRadius: 1,
    backgroundColor: '#dfe3ea',
  },
  stub: {
    width: 78,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  glow: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,214,228,0.55)',
  },
  kindChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#fde8ef',
  },
  kindChipText: { color: '#c2335f', ...typography.label },
  more: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 3,
  },
  moreHit: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    position: 'absolute',
    top: 38,
    right: 12,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#1b1438',
        shadowOpacity: 0.16,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 8 },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuText: {
    color: textColor.textPrimary,
    ...typography.bodySmall,
    ...fontWeights.semibold,
  },
  qr: {
    width: 52,
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stubText: {
    color: textColor.textSecondary,
    ...typography.label,
  },
});

export const bookingStateStyles = StyleSheet.create({
  sectionTitle: {
    color: textColor.textPrimary,
    ...typography.h2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.s12,
  },
  /* No planned events, but tickets above: a small card, not a whole screen. */
  inline: {
    marginHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
    borderRadius: 18,
    overflow: 'hidden',
    padding: spacing.md,
  },
  inlineIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineText: { flex: 1, gap: 2 },
  inlineTitle: {
    color: textColor.textPrimary,
    ...typography.body,
    ...fontWeights.semibold,
  },
  inlineBody: { color: textColor.textSecondary, ...typography.caption },
  inlineCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 999,
    overflow: 'hidden',
    paddingLeft: 13,
    paddingRight: 9,
    paddingVertical: 8,
  },
  inlineCtaText: {
    color: textColor.textOnPrimary,
    ...typography.buttonSmall,
  },
  /* Nothing booked at all. */
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyActions: {
    alignSelf: 'stretch',
    gap: spacing.s12,
    marginTop: spacing.lg,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 50,
    borderRadius: 14,
    backgroundColor: BOOKING_ACCENT,
    overflow: 'hidden',
  },
  primaryText: {
    color: textColor.textOnPrimary,
    ...typography.h3,
  },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BOOKING_ACCENT,
    backgroundColor: colors.background,
  },
  secondaryText: {
    color: BOOKING_ACCENT,
    ...typography.h3,
  },
  scroll: { paddingTop: spacing.sm, paddingBottom: spacing.xl },
  headPad: { paddingHorizontal: spacing.md },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* The two kinds of booking, as a segmented switch. */
  segTabs: {
    flexDirection: 'row',
    gap: 4,
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    padding: 4,
    borderRadius: 16,
    backgroundColor: colors.background,
    ...Platform.select({
      ios: {
        shadowColor: BOOKING_NAVY,
        shadowOpacity: 0.07,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
    }),
  },
  segTab: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 6,
  },
  segText: {
    color: textColor.textSecondary,
    ...typography.label,
    flexShrink: 1,
  },
  segTextOn: { color: '#ffffff' },
  segCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: '#eef0f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segCountOn: { backgroundColor: 'rgba(255,255,255,0.28)' },
  segCountText: {
    color: textColor.textSecondary,
    ...typography.label,
  },
  segCountTextOn: { color: '#ffffff' },
});

/* "What next" — illustrated cards below a short list of bookings. */
export const nextStyles = StyleSheet.create({
  wrap: { marginTop: 26, paddingHorizontal: spacing.md, gap: 14 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { color: textColor.textPrimary, ...typography.h2 },
  squiggle: { marginTop: -2 },
  sub: {
    color: textColor.textSecondary,
    ...typography.bodySmall,
    marginTop: -8,
    marginLeft: 30,
  },
  card: {
    minHeight: 150,
    padding: 16,
    paddingRight: 140,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(26,46,90,0.05)',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Runs past the card's art padding so the title fits on one line. */
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: -120,
  },
  cardTitle: {
    flexShrink: 1,
    color: textColor.textPrimary,
    ...typography.h3,
  },
  cardBody: {
    color: textColor.textSecondary,
    ...typography.caption,
    marginTop: 6,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    overflow: 'hidden',
  },
  buttonText: { color: textColor.textOnPrimary, ...typography.buttonSmall },
  /* The illustration, pinned to the card's right side. */
  art: { position: 'absolute', right: 0, bottom: 0, width: 160, height: 150 },
  blob: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    width: 170,
    height: 170,
    borderRadius: 85,
  },
  blobPink: { backgroundColor: 'rgba(255,170,190,0.35)' },
  blobViolet: { backgroundColor: 'rgba(190,170,255,0.35)' },
  artSpot: {
    position: 'absolute',
    left: 6,
    top: 22,
    transform: [{ rotate: '-20deg' }],
  },
  artTicket: {
    position: 'absolute',
    right: 30,
    top: 34,
    transform: [{ rotate: '-24deg' }],
  },
  artMic: {
    position: 'absolute',
    right: 70,
    bottom: 14,
    transform: [{ rotate: '-14deg' }],
  },
  artStar1: { position: 'absolute', right: 26, top: 22 },
  artStar2: { position: 'absolute', right: 118, top: 46 },
  artTable: { position: 'absolute', right: 26, bottom: 6 },
  artFlower: { position: 'absolute', right: 60, bottom: 52 },
  artGlass: { position: 'absolute', right: 30, bottom: 58 },
});
