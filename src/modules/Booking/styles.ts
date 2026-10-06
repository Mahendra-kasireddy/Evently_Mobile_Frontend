import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
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
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  emptyTitle: {
    color: BOOKING_NAVY,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
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
  emptyCtaText: { color: colors.onPrimary, fontWeight: '700' },
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
  retryText: { color: BOOKING_ACCENT, fontWeight: '700' },

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
    color: BOOKING_NAVY,
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
  },

  /** Empty-list body inside the scroller, so the tabs stay reachable above it. */
  emptyPanel: { alignItems: 'center', paddingVertical: spacing.xl },
});

export const eventTabsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  tab: {
    borderRadius: 999,
    backgroundColor: TRACK,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  tabOn: { backgroundColor: BOOKING_NAVY },
  // SemiBold: Poppins Bold inside a small pill closes up the counters.
  tabText: { color: '#6f6a66', fontSize: 14, fontWeight: '600' },
  tabTextOn: { color: colors.onPrimary },
});

export const eventCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: spacing.md,
    marginBottom: 14,
  },
  /**
   * The event being worked on right now wears the accent as its edge. One at a
   * time, and only ever the soonest — a list where every card is highlighted
   * highlights nothing.
   */
  cardFocus: { borderColor: BOOKING_ACCENT, borderWidth: 1.5 },

  head: { flexDirection: 'row', gap: 12 },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: BOOKING_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1 },
  titleRow: { ...globalStyles.row, gap: spacing.sm },
  title: {
    color: BOOKING_NAVY,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    flex: 1,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12.5,
    marginTop: 2,
    lineHeight: 18,
  },

  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
  },
  /*
   * The longest label this can hold is "EXPIRED — NO RESPONSE". Poppins sets
   * wide, and at 10/ExtraBold with half a point of tracking that pill crowds
   * the title off its own line, so the caps run a shade smaller and lighter.
   */
  statusText: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.4 },

  progressRow: { ...globalStyles.row, gap: 12, marginTop: 14 },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: TRACK,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: BOOKING_ACCENT,
  },
  daysLabel: { color: '#5b6470', fontSize: 13, fontWeight: '600' },

  /** Edge to edge, so the footer reads as its own band rather than a stray rule. */
  divider: {
    height: 1,
    backgroundColor: HAIRLINE,
    marginTop: 14,
    marginHorizontal: -spacing.md,
  },
  nextText: { color: '#414b5c', fontSize: 13, marginTop: 12, lineHeight: 19 },
});

export const jumpToStyles = StyleSheet.create({
  /*
   * A section label, not a title.
   *
   * At 17/Bold navy this line was set exactly like the event card titles above
   * it, so "Jump to" and "Naming ceremony" read as the same rank and the group
   * heading stopped doing its one job — saying that what follows belongs
   * together and sits below what came before.
   *
   * It now wears the label treatment Profile and Settings already use for the
   * same purpose: small, muted, letterspaced caps. Three signals move at once
   * — size, weight against a lighter colour, and case — so the two levels
   * cannot be confused at a glance or by someone who reads the screen through
   * a magnifier. A shade darker and a point larger than those screens' labels,
   * because this one has to hold its own against much bigger cards.
   */
  heading: {
    color: '#7b8595',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    lineHeight: 17,
    marginTop: 14,
    marginBottom: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    // Two per row: half the space, minus half the 12pt gap between them.
    // No flexGrow — see the occasion grid: a lone or trailing tile would
    // otherwise stretch to the full row and read as a different component.
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: 14,
  },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: {
    color: BOOKING_NAVY,
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 12,
  },
  tileSubtitle: {
    color: colors.textMuted,
    fontSize: 12.5,
    marginTop: 3,
    lineHeight: 17,
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
  title: { color: BOOKING_NAVY, fontWeight: '800', fontSize: 16, lineHeight: 21, flexShrink: 1 },
  count: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: '#f3f1fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontWeight: '800', fontSize: 11.5, lineHeight: 15 },
  seeAll: { fontWeight: '700', fontSize: 13, lineHeight: 18 },
});

/* The event tickets: each a little ticket, with a perforation and a stub. */
export const ticketSectionStyles = StyleSheet.create({
  section: { paddingHorizontal: spacing.md, marginBottom: spacing.lg },
  list: { gap: spacing.s12 },
  ticket: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 10,
    paddingRight: 0,
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
  thumbWrap: { width: 76, height: 84, borderRadius: 14, overflow: 'hidden', backgroundColor: '#e9edf5' },
  thumb: { width: '100%', height: '100%' },
  thumbDate: {
    position: 'absolute',
    left: 5,
    bottom: 5,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  thumbDay: { color: BOOKING_NAVY, fontWeight: '800', fontSize: 13, lineHeight: 15 },
  thumbMonth: { color: BOOKING_ACCENT, fontWeight: '800', fontSize: 8.5, lineHeight: 10, letterSpacing: 0.5 },
  body: { flex: 1, gap: 4, paddingLeft: spacing.s12, paddingRight: 6 },
  rowTitle: { color: BOOKING_NAVY, fontWeight: '800', fontSize: 14, lineHeight: 19 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lineText: { color: '#6b7385', fontSize: 11.5, lineHeight: 16, flexShrink: 1 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  pill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  pillText: { fontWeight: '700', fontSize: 10.5, lineHeight: 15 },
  typePill: { backgroundColor: BOOKING_ACCENT_SOFT },
  typePillText: { color: BOOKING_ACCENT },
  /* The perforation: notches cut from the top and bottom edges in the page's
     colour, and a dashed line between them. */
  perf: { width: 16, alignSelf: 'stretch', alignItems: 'center', marginVertical: -10 },
  perfNotch: { width: 16, height: 16, borderRadius: 8, backgroundColor: BOOKING_CANVAS },
  perfNotchTop: { marginTop: -8 },
  perfNotchBottom: { marginBottom: -8 },
  perfLine: { flex: 1, justifyContent: 'space-evenly', paddingVertical: 4 },
  perfDash: { width: 1.5, height: 5, borderRadius: 1, backgroundColor: '#dfe3ea' },
  stub: { width: 64, alignItems: 'center', justifyContent: 'center', gap: 4 },
  qr: {
    width: 42,
    height: 42,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stubText: { color: '#6b7385', fontWeight: '700', fontSize: 10.5, lineHeight: 13 },
});

export const bookingStateStyles = StyleSheet.create({
  sectionTitle: {
    color: BOOKING_NAVY,
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 22,
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
  inlineTitle: { color: BOOKING_NAVY, fontWeight: '800', fontSize: 14, lineHeight: 19 },
  inlineBody: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
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
  inlineCtaText: { color: '#ffffff', fontWeight: '800', fontSize: 12.5, lineHeight: 16 },
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
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
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
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
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
  segText: { color: colors.textMuted, fontWeight: '700', fontSize: 12.5, lineHeight: 16, flexShrink: 1 },
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
  segCountText: { color: colors.textMuted, fontWeight: '800', fontSize: 10.5, lineHeight: 13 },
  segCountTextOn: { color: '#ffffff' },
});
